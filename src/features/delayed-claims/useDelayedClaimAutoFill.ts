import { useRef, useState } from "react"
import { buildExtractedValuesPatch } from "./applyExtracted"
import {
  DELAYED_CLAIM_EXTRACT_FIELDS,
  buildFormModelFromConfig,
} from "./extractFields"
import { countFilled, extractFormFields } from "./formExtract"
import type { ExtractedField, FieldSpec, TokenUsage } from "./types"

export function useDelayedClaimAutoFill(options: {
  applyPatch: (patch: Record<string, string>) => void
  fields?: Array<{ id: string; label: string; selector?: string }>
}) {
  const fields = options.fields ?? DELAYED_CLAIM_EXTRACT_FIELDS
  const [isRunning, setIsRunning] = useState(false)
  const [stage, setStage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastExtracted, setLastExtracted] = useState<ExtractedField[] | null>(
    null,
  )
  const [lastFormModel, setLastFormModel] = useState<FieldSpec[] | null>(null)
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const run = async (file: File) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsRunning(true)
    setError(null)
    setTokenUsage(null)
    setStage("Building form model from config")

    try {
      const formModel = buildFormModelFromConfig(fields)
      if (!formModel.length) {
        throw new Error(
          "No fields in form config. Add field {id, label} entries.",
        )
      }

      setLastFormModel(formModel)
      setStage(`Sending ${formModel.length} fields`)

      const result = await extractFormFields(file, formModel, {
        signal: controller.signal,
        onStage: setStage,
      })
      setLastExtracted(result.fields)
      setTokenUsage(result.usage ?? null)

      const patch = buildExtractedValuesPatch(result.fields)
      options.applyPatch(patch)
      setStage("Complete")

      if (countFilled(result.fields) === 0) {
        setError(
          "No values were found for the current form fields. Try a clearer scan.",
        )
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return
      const message = err instanceof Error ? err.message : "Auto-fill failed"
      setError(
        message.includes("Failed to fetch")
          ? "Cannot reach Gemini. Check network or VITE_GEMINI_API_KEY."
          : message,
      )
    } finally {
      setIsRunning(false)
    }
  }

  const cancel = () => {
    abortRef.current?.abort()
    setIsRunning(false)
  }

  return {
    isRunning,
    stage,
    error,
    lastExtracted,
    lastFormModel,
    tokenUsage,
    filledCount: countFilled(lastExtracted),
    run,
    cancel,
  }
}
