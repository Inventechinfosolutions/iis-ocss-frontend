/**
 * OCR formModel for Delayed Claims — all step 1 + step 2 fillable fields.
 * `id` must match the form `name` attribute. Labels follow paper-form wording
 * so Gemini can match the scan. File-only fields are excluded.
 */

export type DelayedClaimExtractField = {
  id: string
  label: string
}

function depositRows(
  prefix: string,
  sectionLabel: string,
  rowCount = 5,
): DelayedClaimExtractField[] {
  const fields: DelayedClaimExtractField[] = []
  for (let i = 1; i <= rowCount; i++) {
    fields.push(
      {
        id: `${prefix}Date${i}`,
        label: `${sectionLabel} row ${i} — Date`,
      },
      {
        id: `${prefix}Deposit${i}`,
        label: `${sectionLabel} row ${i} — Deposit (Rs)`,
      },
      {
        id: `${prefix}Reference${i}`,
        label: `${sectionLabel} row ${i} — CASH / NEFT / RTGS / IMPS / Cheque No.`,
      },
      {
        id: `${prefix}Total${i}`,
        label: `${sectionLabel} row ${i} — Total Deposit (Rs)`,
      },
      {
        id: `${prefix}Remarks${i}`,
        label: `${sectionLabel} row ${i} — Remarks`,
      },
    )
  }
  return fields
}

export const DELAYED_CLAIM_EXTRACT_FIELDS: DelayedClaimExtractField[] = [
  // Step 1 — header
  { id: "serialNumber", label: "Serial Number / Sl. No." },
  { id: "defCaClno", label: "Def. C.A. CLNO / CLNO" },
  { id: "competentAuthority", label: "Competent Authority" },
  { id: "financialEstablishment", label: "Financial Establishment" },
  { id: "claimApplicationNumber", label: "Claim Application Number" },
  { id: "dateOfClaim", label: "Date of Claim" },

  // Step 1 — applicant
  {
    id: "applicantName",
    label: "1. Name of Claimant / Depositor / Name of the applicant",
  },
  { id: "fatherOrHusbandName", label: "2. Father / Husband Name" },
  { id: "customerId", label: "3. Customer / Client ID" },
  {
    id: "address",
    label: "4. Correspondence Address (Latest) with PIN code",
  },
  { id: "dob", label: "5. Date of Birth" },
  { id: "age", label: "Age" },
  { id: "mobile", label: "6. Mobile (Latest)" },
  { id: "altMobile", label: "Alternate Contact / Alternate mobile" },
  { id: "email", label: "7. Email Address" },
  {
    id: "idNumber",
    label:
      "8. Aadhaar / Indian Passport / Driving License Number",
  },
  { id: "pan", label: "9. PAN" },
  {
    id: "condonationOrder",
    label: "10. Delay Condonation Order No. & date",
  },

  // Step 1 — nominee
  {
    id: "nomineeName",
    label: "11. Nominee Name",
  },
  {
    id: "nomineeGenderAge",
    label: "Nominee Gender & Age",
  },
  {
    id: "nomineeRelationship",
    label: "Relationship to Depositor",
  },
  {
    id: "nomineeId",
    label:
      "ID proof of Nominee (Aadhaar / Indian Passport / Driving License)",
  },

  // Step 1 — schemes
  { id: "schemeType", label: "13. Type of the scheme" },
  { id: "schemeName", label: "13. Name of the scheme" },

  // Step 1 — depositor bank
  {
    id: "depositorAccount",
    label: "12a. Bank Account No. (Deposit)",
  },
  { id: "depositorIfsc", label: "12c. IFSC Code (Deposit)" },
  { id: "depositorBank", label: "12b. Bank Name (Deposit)" },
  { id: "depositorBranch", label: "12d. Branch Name (Deposit)" },

  // Step 1 — refund bank
  {
    id: "refundAccount",
    label: "14a. Bank Account No. (Refund)",
  },
  { id: "refundIfsc", label: "14c. IFSC Code (Refund)" },
  { id: "refundBank", label: "14b. Bank Name (Refund)" },
  { id: "refundBranch", label: "14d. Branch Name (Refund)" },

  // Step 1 — amount + declaration
  {
    id: "amountFigures",
    label:
      "Total Amount Due [TOTAL DEPOSITED − TOTAL RECEIVED] Rs.",
  },
  { id: "amountWords", label: "Rupees in words / Amount in words" },
  { id: "place", label: "Place (declaration)" },
  { id: "declarationDate", label: "Date (declaration)" },

  // Step 2 — statement of investment
  {
    id: "investmentFinancialEstablishment",
    label: "Financial Establishment (Statement of Investment)",
  },
  { id: "delCaClno", label: "Del_CA_CLNO" },
  {
    id: "investmentCustomerId",
    label: "Customer / Client ID (Statement of Investment)",
  },
  { id: "investmentRemarks", label: "Remarks (Statement of Investment)" },
  {
    id: "paymentParticulars",
    label: "Particulars [Cash / NEFT / RTGS / IMPS or Cheque]",
  },
  {
    id: "investmentSchemeName",
    label: "Name of the Scheme (Statement of Investment)",
  },

  // Step 2 — depositor bank (annexure)
  {
    id: "stepTwoDepositorAccount",
    label:
      "Depositor Bank Details — Bank Account No. (Statement of Investment)",
  },
  {
    id: "stepTwoDepositorIfsc",
    label: "Depositor Bank Details — IFSC Code (Statement of Investment)",
  },
  {
    id: "stepTwoDepositorBank",
    label: "Depositor Bank Details — Bank Name (Statement of Investment)",
  },
  {
    id: "stepTwoDepositorBranch",
    label: "Depositor Bank Details — Branch Name (Statement of Investment)",
  },

  ...depositRows("depositorTransaction", "Depositor transaction"),

  // Step 2 — FE bank
  {
    id: "entityBankAccount",
    label: "FE Bank Details — Bank Account No.",
  },
  { id: "entityBankIfsc", label: "FE Bank Details — IFSC Code" },
  { id: "entityBankName", label: "FE Bank Details — Bank Name" },
  { id: "entityBankBranch", label: "FE Bank Details — Branch Name" },

  ...depositRows("entityTransaction", "FE transaction"),

  {
    id: "investmentDeclarationPlace",
    label: "Place (Statement of Investment)",
  },
  {
    id: "investmentDeclarationDate",
    label: "Date (Statement of Investment)",
  },
]

/** Empty string map keyed by every extractable field id. */
export function createEmptyDelayedClaimValues(): Record<string, string> {
  const values: Record<string, string> = {}
  for (const field of DELAYED_CLAIM_EXTRACT_FIELDS) {
    values[field.id] = ""
  }
  return values
}

/** Build OCR formModel payload from config (config-driven, not DOM capture). */
export function buildFormModelFromConfig(
  fields: DelayedClaimExtractField[] = DELAYED_CLAIM_EXTRACT_FIELDS,
): Array<{ id: string; label: string; selector: string }> {
  const seen = new Set<string>()
  const model: Array<{ id: string; label: string; selector: string }> = []

  for (const field of fields) {
    const id = field.id.trim()
    if (!id || seen.has(id)) continue
    seen.add(id)
    const label = field.label.trim() || id
    model.push({ id, label, selector: `#${CSS.escape(id)}` })
  }

  return model
}
