import type { FieldSpec } from "./types"

/** Port of generic-form-backend extract prompt (client-side Gemini). */
export function buildExtractPrompt(
  fieldSpecs: Array<{ id: string; label: string }>,
): string {
  const fieldsJson = JSON.stringify(fieldSpecs, null, 2)
  return `You are a document understanding expert.

You will receive:
1. One or more scanned document page images (a multi-page filled form / annexure).
2. A list of expected UI fields (id + label) from a web form.

Expected fields JSON:
${fieldsJson}

Search ALL provided pages. Values for different fields may appear on different pages
(for example page 1 = application, page 2 = bank/nominee continuation, page 3 = Statement of Investment).

Extract ONLY values corresponding to those labels from the document image(s).

STRICT RULES:
- Do NOT invent, guess, or hallucinate values.
- If a value cannot be found or is blank/unreadable, set valueEn and valueKn to null.
- Do not copy printed labels into values — only the filled-in answers / handwritten text.
- Language / bilingual output (IMPORTANT):
  - For each field return valueEn and valueKn (both may be null).
  - If the filled value is in Kannada: set valueKn to the exact Kannada text, and set valueEn to an accurate English translation.
  - If the filled value is in English (Latin script) only: set valueEn to that text, set valueKn to null. Do NOT invent Kannada.
  - If both Kannada and English appear for the same field: set valueKn to the Kannada as written, valueEn to the English as written (do not invent either).
  - Never invent Kannada when the document only has English.
- Dates: always return date values in valueEn as DD/MM/YYYY (zero-padded day and month, e.g. 05/07/2026). Set valueKn to null for dates.
  Convert any other date form found on the document into DD/MM/YYYY, including:
  - DD-MM-YYYY, DD.MM.YYYY, YYYY-MM-DD
  - Day + month name + year (e.g. "12 July 2026", "12th Jul 2026", "July 12, 2026") → 12/07/2026
  - Month name abbreviations (Jan, Feb, …) and full names (January, February, …)
  If the day or month is ambiguous or incomplete, set valueEn and valueKn to null — do not guess.
- Amounts (Deposit Rs, Total Deposit Rs, Total Amount Due, and any other money / figure fields):
  - Put the positive number in valueEn only (digits, optional decimal point). Example: 5000 or 5000.50. Set valueKn to null.
  - Ignore and strip currency noise: "/-", "/", ",", "-", "Rs", "Rs.", "INR", spaces.
    Examples: "5,000/-" → "5000", "Rs. 1,250 / -" → "1250", "10,000-" → "10000"
  - Do not return negative amounts. If the value is zero, blank, unreadable, or not a positive number, set both to null.
- ID / reference numbers (Claim Application Number, Customer / Client ID, Aadhaar / Passport / DL No., Nominee ID):
  - Put digits/letters only with NO spaces in valueEn. Example: "1423 3454 6565" → "142334546565". Set valueKn to null.
- Delay Condonation Order No. & date:
  - Put in valueEn as "<OrderNo> <DD/MM/YYYY>" with exactly one space between order number and date. Set valueKn to null.
  - Strip spaces inside the order number. Example: "ORD 12 345 05/07/2026" → "ORD12345 05/07/2026".
- Phone, email, PAN, IFSC, account numbers, select/option fields: valueEn only; valueKn null.
- For table rows (Deposit 1, Deposit 2, …), map row order top-to-bottom as written on the page.
- For each field, set "id" to the EXACT id from the expected fields list.
- For each field, set "label" to the label from the expected fields list.
- Do not invent CSS selectors; omit selector or leave it null.
- confidence: 0.0–1.0 estimate, or null if both valueEn and valueKn are null.
- Return JSON only matching the schema with a "fields" array covering EVERY expected id.
Return one entry per expected field id.

FINAL VALIDATION (mandatory before you respond):
1. Re-check every field against the rules above.
2. For each value: if it fails any rule (wrong date format, non-positive amount, invented text, label copied as value, empty/unreadable, wrong id/label), set the invalid side to null.
3. Do not include invalid values in the response — only valid values or null.
4. Confirm every expected id appears exactly once, with the correct label.
5. Only after this validation passes, return the JSON response. Do not return unvalidated or partial/invalid data.
`
}

export function fieldSpecsForPrompt(formModel: FieldSpec[]): Array<{
  id: string
  label: string
}> {
  return formModel.map(({ id, label }) => ({ id, label }))
}
