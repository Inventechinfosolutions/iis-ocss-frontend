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
          valueEn: { type: "STRING", nullable: true },
          valueKn: { type: "STRING", nullable: true },
          confidence: { type: "NUMBER", nullable: true },
        },
        required: ["id", "label"],
      },
    },
  },
  required: ["fields"],
} as const

function getGeminiConfig(): { apiKey: string; model: string } {
  return {
    apiKey: "AQ.Ab8RN6KjDVIK7hl71XhGU7AacR6OPCpjfQuNPYr4aF_n2uIdbA",
    model: "gemini-3.6-flash",
  }
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

function cleanNullable(raw: string | null | undefined): string | null {
  if (raw == null) return null
  const trimmed = String(raw).trim()
  return trimmed ? trimmed : null
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

    let valueEn = cleanNullable(item.valueEn)
    let valueKn = cleanNullable(item.valueKn)
    // Backward compat: older single `value` → valueEn
    if (valueEn == null && valueKn == null) {
      valueEn = cleanNullable(item.value)
    }

    let conf = item.confidence ?? null
    if (conf != null) conf = Math.max(0, Math.min(1, Number(conf)))
    const hasValue = valueEn != null || valueKn != null

    byId.set(item.id, {
      id: item.id,
      label: labelById.get(item.id) ?? item.label,
      valueEn,
      valueKn,
      value: valueEn ?? valueKn,
      confidence: hasValue ? conf : null,
      selector: selectorById.get(item.id) ?? null,
    })
  }

  return specs.map((spec) => {
    const existing = byId.get(spec.id)
    if (existing) return existing
    return {
      id: spec.id,
      label: spec.label,
      valueEn: null,
      valueKn: null,
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
      body.error?.message || `Gemini extract failed (${response.status})`
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
