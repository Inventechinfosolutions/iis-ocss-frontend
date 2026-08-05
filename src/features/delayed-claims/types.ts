export type FieldSpec = {
  id: string
  label: string
  selector?: string
}

export type ExtractedField = {
  id: string
  label: string
  value: string | null
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
