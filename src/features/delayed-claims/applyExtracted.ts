import type { ExtractedField } from "./types"
import { containsKannada, isBilingualFieldId } from "./bilingualFields"

const DATE_FIELD_IDS = new Set([
  "dateOfClaim",
  "dob",
  "declarationDate",
  "investmentDeclarationDate",
])

const SELECT_OPTIONS: Record<string, string[]> = {
  competentAuthority: [
    "Competent Authority, Bengaluru",
    "Competent Authority, Mysuru",
    "Competent Authority, Belagavi",
    "Competent Authority, Kalaburagi",
  ],
  financialEstablishment: [
    "IMA Jewels",
    "IMA Healthcare",
    "Redington India",
    "Lancer Finance",
    "Other fraudulent entity",
  ],
  paymentParticulars: ["Cash", "NEFT", "RTGS", "IMPS", "Cheque"],
}

function isDateFieldId(id: string): boolean {
  if (DATE_FIELD_IDS.has(id)) return true
  return /^(depositorTransaction|entityTransaction)Date\d+$/.test(id)
}

function isAmountFieldId(id: string): boolean {
  if (id === "amountFigures") return true
  return /^(depositorTransaction|entityTransaction)(Deposit|Total)\d+$/.test(id)
}

/** IDs / numbers that should be stored without spaces (e.g. Aadhaar groups). */
const COMPACT_NO_SPACE_FIELD_IDS = new Set([
  "claimApplicationNumber",
  "customerId",
  "investmentCustomerId",
  "idNumber",
  "nomineeId",
])

function isCompactNoSpaceFieldId(id: string): boolean {
  return COMPACT_NO_SPACE_FIELD_IDS.has(id)
}

/** Remove all whitespace: "1423 3454 6565" → "142334546565". */
export function stripAllSpaces(raw: string): string {
  return raw.replace(/\s+/gu, "")
}

/**
 * Format "order no & date" as: <orderNo> <DD/MM/YYYY>
 * Compact spaces inside the order number; keep one space before the date.
 */
export function normalizeCondonationOrder(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ""

  // Date at end: 12/07/2026, 12-07-2026, 2026-07-12, or spaced digits
  const dateMatch = trimmed.match(
    /(?:^|[\s,;|])((?:\d{1,2}\s*[/-]\s*\d{1,2}\s*[/-]\s*\d{4})|(?:\d{4}\s*[/-]\s*\d{1,2}\s*[/-]\s*\d{1,2}))\s*$/u,
  )

  if (!dateMatch || dateMatch.index == null) {
    return stripAllSpaces(trimmed)
  }

  const dateRaw = dateMatch[1]
  const orderRaw = trimmed.slice(0, dateMatch.index).trim()
  const orderNo = stripAllSpaces(orderRaw)
  if (!orderNo) return stripAllSpaces(trimmed)

  const compactDate = stripAllSpaces(dateRaw)
  let displayDate = compactDate

  const dmy = compactDate.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  if (dmy) {
    displayDate = `${dmy[1].padStart(2, "0")}/${dmy[2].padStart(2, "0")}/${dmy[3]}`
  } else {
    const ymd = compactDate.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/)
    if (ymd) {
      displayDate = `${ymd[3].padStart(2, "0")}/${ymd[2].padStart(2, "0")}/${ymd[1]}`
    }
  }

  return `${orderNo} ${displayDate}`
}

/**
 * Normalize amount OCR values to a positive number string.
 * Ignores /, ,, - and common currency suffixes (e.g. 5,000/- → 5000).
 */
export function normalizeAmountValue(raw: string): string {
  const cleaned = raw
    .replace(/rs\.?|inr/giu, "")
    .replace(/[/,\-\s]/gu, "")
    .trim()

  if (!cleaned) return ""

  const match = cleaned.match(/^\d+(\.\d+)?$/)
  if (!match) return ""

  const num = Number(cleaned)
  if (!Number.isFinite(num) || num <= 0) return ""

  return cleaned
}

/** Normalize common OCR date formats to YYYY-MM-DD for <input type="date">. */
export function normalizeDateValue(raw: string): string {
  const trimmed = raw.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed

  const slash = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  if (slash) {
    const day = slash[1].padStart(2, "0")
    const month = slash[2].padStart(2, "0")
    const year = slash[3]
    return `${year}-${month}-${day}`
  }

  return trimmed
}

function normalizeSelectValue(id: string, raw: string): string {
  const options = SELECT_OPTIONS[id]
  if (!options) return raw

  const exact = options.find((opt) => opt === raw)
  if (exact) return exact

  const lower = raw.toLowerCase()
  const caseMatch = options.find((opt) => opt.toLowerCase() === lower)
  if (caseMatch) return caseMatch

  const includesMatch = options.find(
    (opt) =>
      opt.toLowerCase().includes(lower) || lower.includes(opt.toLowerCase()),
  )
  return includesMatch ?? raw
}

export function normalizeExtractedValue(id: string, raw: string): string {
  let value = raw.trim()
  if (!value) return ""

  if (id === "pan") value = value.toUpperCase()
  if (isDateFieldId(id)) value = normalizeDateValue(value)
  if (id in SELECT_OPTIONS) value = normalizeSelectValue(id, value)
  if (isAmountFieldId(id)) value = normalizeAmountValue(value)
  if (isCompactNoSpaceFieldId(id)) value = stripAllSpaces(value)
  if (id === "condonationOrder") value = normalizeCondonationOrder(value)

  return value
}

export type BilingualValuesPatch = {
  en: Record<string, string>
  kn: Record<string, string>
  hasKannada: boolean
}

/**
 * Build EN + KN value patches from OCR results.
 * Non-bilingual fields are stored in both maps (same English/numeric value).
 */
export function buildBilingualValuesPatch(
  extracted: ExtractedField[],
): BilingualValuesPatch {
  const en: Record<string, string> = {}
  const kn: Record<string, string> = {}
  let hasKannada = false

  for (const field of extracted) {
    const rawEn =
      field.valueEn ??
      (field.valueKn == null ? field.value : null) ??
      null
    const rawKn = field.valueKn ?? null

    const normalizedEn =
      rawEn != null ? normalizeExtractedValue(field.id, String(rawEn)) : ""
    // Keep Kannada text mostly as-is (trim only); don't run ID/date strippers on it.
    const normalizedKn =
      rawKn != null ? String(rawKn).trim() : ""

    if (normalizedEn) en[field.id] = normalizedEn

    if (isBilingualFieldId(field.id)) {
      if (normalizedKn) {
        kn[field.id] = normalizedKn
        if (containsKannada(normalizedKn)) hasKannada = true
      } else if (normalizedEn) {
        // No KN variant — fall back so KN toggle isn't blank for this field
        kn[field.id] = normalizedEn
      }
    } else if (normalizedEn) {
      kn[field.id] = normalizedEn
    }
  }

  return { en, kn, hasKannada }
}

/** @deprecated Prefer buildBilingualValuesPatch. */
export function buildExtractedValuesPatch(
  extracted: ExtractedField[],
): Record<string, string> {
  return buildBilingualValuesPatch(extracted).en
}

export function applyExtractedFields(
  extracted: ExtractedField[],
  setValue: (id: string, value: string) => void,
): void {
  const patch = buildExtractedValuesPatch(extracted)
  for (const [id, value] of Object.entries(patch)) {
    setValue(id, value)
  }
}

