export type FieldSpec = {
  id: string
  label: string
  selector?: string
}

export type FormLanguage = "en" | "kn"

export type ExtractedField = {
  id: string
  label: string
  /** @deprecated Prefer valueEn / valueKn. Kept for older single-value responses. */
  value?: string | null
  /** English value or translation. */
  valueEn?: string | null
  /** Kannada value as written on the document (null if English-only). */
  valueKn?: string | null
  confidence?: number | null
  selector?: string | null
}

export type TokenUsage = {
  prompt_tokens?: number | null
  candidates_tokens?: number | null
  thoughts_tokens?: number | null
  cached_tokens?: number | null
  total_tokens?: number | null
}

export type GenericExtractResponse = {
  status: string
  source_file: string
  engine: string
  fields: ExtractedField[]
  timings_ms?: Record<string, number>
  usage?: TokenUsage | null
}
