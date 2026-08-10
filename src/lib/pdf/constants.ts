/**
 * Document prep settings aligned with the previous generic-form-backend defaults
 * (PDF_DPI=200, max 10 pages, JPEG quality 85, max side 2048).
 */
export const DOCUMENT_PREP = {
  pdfDpi: 200,
  pdfScale: 200 / 72,
  maxPages: 10,
  maxUploadBytes: 20 * 1024 * 1024,
  jpegQuality: 0.85,
  maxImageSide: 2048,
  format: "image/jpeg" as const,
}
