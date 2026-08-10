import { DOCUMENT_PREP, isPdfFile, pdfFileToImages } from "@/lib/pdf"
import type { ScanPreviewPage } from "./DocumentScanPreview"

function revokePages(pages: ScanPreviewPage[]) {
  for (const page of pages) {
    URL.revokeObjectURL(page.url)
  }
}

/**
 * Build object-URL preview pages from an uploaded scan (image or PDF).
 * Caller must revoke URLs via `revokeScanPreviewPages` when done.
 */
export async function buildScanPreviewPages(
  file: File,
  options: { signal?: AbortSignal } = {},
): Promise<ScanPreviewPage[]> {
  if (isPdfFile(file)) {
    const pages = await pdfFileToImages(file, {
      // Lighter than OCR render — enough for on-screen verification.
      scale: Math.min(1.5, DOCUMENT_PREP.pdfScale),
      maxPages: DOCUMENT_PREP.maxPages,
      format: "image/jpeg",
      quality: 0.82,
      signal: options.signal,
    })
    return pages.map((page) => ({
      pageNumber: page.pageNumber,
      url: URL.createObjectURL(page.blob),
    }))
  }

  return [
    {
      pageNumber: 1,
      url: URL.createObjectURL(file),
    },
  ]
}

export function revokeScanPreviewPages(pages: ScanPreviewPage[]) {
  revokePages(pages)
}
