import type {
  ExtractedField,
  FieldSpec,
  GenericExtractResponse,
  TokenUsage,
} from "./types"
import { buildExtractPrompt, fieldSpecsForPrompt } from "./extractPrompt"

const GEMINI_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    fields: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING" },
          label: { type: "STRING" },
          value: { type: "STRING", nullable: true },
          confidence: { type: "NUMBER", nullable: true },
        },
        required: ["id", "label"],
      },
    },
  },
  required: ["fields"],
} as const

function getGeminiConfig(): { apiKey: string; model: string } {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim()
  const model =
    (import.meta.env.VITE_GEMINI_MODEL as string | undefined)?.trim() ||
    "gemini-3.6-flash"

  if (!apiKey) {
    throw new Error(
      "Missing VITE_GEMINI_API_KEY. Add it to iis-ocss-frontend/.env and restart the dev server.",
    )
  }

  return { apiKey, model }
}

type GeminiInlinePart = {
  inline_data: { mime_type: string; data: string }
}

type GeminiTextPart = { text: string }

type GeminiGenerateResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> }
  }>
  usageMetadata?: {
    promptTokenCount?: number
    candidatesTokenCount?: number
    thoughtsTokenCount?: number
    cachedContentTokenCount?: number
    totalTokenCount?: number
  }
  error?: { message?: string; status?: string }
}

function alignToSpecs(
  extracted: ExtractedField[],
  specs: FieldSpec[],
): ExtractedField[] {
  const byId = new Map<string, ExtractedField>()
  const allowed = new Set(specs.map((s) => s.id))
  const labelById = new Map(specs.map((s) => [s.id, s.label]))
  const selectorById = new Map(specs.map((s) => [s.id, s.selector]))

  for (const item of extracted) {
    if (!allowed.has(item.id)) continue
    let value = typeof item.value === "string" ? item.value.trim() : item.value
    if (typeof value === "string" && !value) value = null
    let conf = item.confidence ?? null
    if (conf != null) conf = Math.max(0, Math.min(1, Number(conf)))
    byId.set(item.id, {
      id: item.id,
      label: labelById.get(item.id) ?? item.label,
      value,
      confidence: value == null ? null : conf,
      selector: selectorById.get(item.id) ?? null,
    })
  }

  return specs.map((spec) => {
    const existing = byId.get(spec.id)
    if (existing) return existing
    return {
      id: spec.id,
      label: spec.label,
      value: null,
      confidence: null,
      selector: spec.selector ?? null,
    }
  })
}

function parseUsage(meta: GeminiGenerateResponse["usageMetadata"]): TokenUsage {
  return {
    prompt_tokens: meta?.promptTokenCount ?? null,
    candidates_tokens: meta?.candidatesTokenCount ?? null,
    thoughts_tokens: meta?.thoughtsTokenCount ?? null,
    cached_tokens: meta?.cachedContentTokenCount ?? null,
    total_tokens: meta?.totalTokenCount ?? null,
  }
}

/**
 * Call Gemini Vision from the browser with page images (base64 JPEG) + formModel.
 */
export async function extractFieldsWithGemini(options: {
  imageBase64Pages: Array<{ mimeType: string; data: string }>
  formModel: FieldSpec[]
  sourceFile: string
  signal?: AbortSignal
}): Promise<GenericExtractResponse> {
  const { apiKey, model } = getGeminiConfig()
  const started = performance.now()

  if (!options.imageBase64Pages.length) {
    throw new Error("No document pages to extract from")
  }
  if (!options.formModel.length) {
    throw new Error("No fields in form config")
  }

  const prompt = buildExtractPrompt(fieldSpecsForPrompt(options.formModel))
  const imageParts: GeminiInlinePart[] = options.imageBase64Pages.map(
    (page) => ({
      inline_data: {
        mime_type: page.mimeType,
        data: page.data,
      },
    }),
  )
  const textPart: GeminiTextPart = { text: prompt }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: options.signal,
    body: JSON.stringify({
      contents: [{ role: "user", parts: [...imageParts, textPart] }],
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
        responseSchema: GEMINI_RESPONSE_SCHEMA,
      },
    }),
  })

  const body = (await response.json()) as GeminiGenerateResponse
  if (!response.ok || body.error) {
    const message =
      body.error?.message ||
      `Gemini extract failed (${response.status})`
    throw new Error(message)
  }

  const text =
    body.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("")
      .trim() ?? ""

  if (!text) {
    throw new Error("Gemini returned an empty response")
  }

  let parsed: { fields?: ExtractedField[] }
  try {
    parsed = JSON.parse(text) as { fields?: ExtractedField[] }
  } catch {
    throw new Error("Gemini returned invalid JSON")
  }

  const fields = alignToSpecs(parsed.fields ?? [], options.formModel)
  const elapsed = Math.round(performance.now() - started)

  return {
    status: "success",
    source_file: options.sourceFile,
    engine: model,
    fields,
    timings_ms: { total: elapsed },
    usage: parseUsage(body.usageMetadata),
  }
}
