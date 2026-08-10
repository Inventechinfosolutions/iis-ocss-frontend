/**
 * Fields that may carry Kannada (or EN+KN) filled values from OCR.
 * Everything else is English/numeric-only (dates, amounts, IDs, selects, etc.).
 */

const BILINGUAL_FIELD_IDS = new Set([
  "applicantName",
  "fatherOrHusbandName",
  "address",
  "nomineeName",
  "nomineeGenderAge",
  "nomineeRelationship",
  "schemeType",
  "schemeName",
  "depositorBank",
  "depositorBranch",
  "refundBank",
  "refundBranch",
  "amountWords",
  "place",
  "investmentFinancialEstablishment",
  "investmentRemarks",
  "investmentSchemeName",
  "stepTwoDepositorBank",
  "stepTwoDepositorBranch",
  "entityBankName",
  "entityBankBranch",
  "investmentDeclarationPlace",
])

/** Transaction table remark columns (depositor + FE). */
const BILINGUAL_REMARKS_RE =
  /^(depositorTransaction|entityTransaction)Remarks\d+$/

const KANNADA_RE = /[\u0C80-\u0CFF]/u

export function isBilingualFieldId(id: string): boolean {
  return BILINGUAL_FIELD_IDS.has(id) || BILINGUAL_REMARKS_RE.test(id)
}

export function containsKannada(value: string): boolean {
  return KANNADA_RE.test(value)
}
