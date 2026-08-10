import { getDocument, type PDFDocumentProxy } from "pdfjs-dist"
import { DOCUMENT_PREP } from "./constants"
import { ensurePdfWorker } from "./pdfWorker"

export type PdfToImagesOptions = {
  /** Render scale (1 ≈ 72 DPI). Default matches PDF_DPI/72 (200/72). */
  scale?: number
  /** Max pages to convert. Default 10. */
  maxPages?: number
  /** Output MIME type. Default image/jpeg. */
  format?: "image/png" | "image/jpeg"
  /** JPEG quality 0–1. Default 0.85. */
  quality?: number
  /** Called after each page is rendered. */
  onProgress?: (done: number, total: number) => void
  signal?: AbortSignal
}

export type PdfPageImage = {
  pageNumber: number
  blob: Blob
  width: number
  height: number
}

const DEFAULT_SCALE = DOCUMENT_PREP.pdfScale
const DEFAULT_MAX_PAGES = DOCUMENT_PREP.maxPages
const DEFAULT_FORMAT = DOCUMENT_PREP.format
const DEFAULT_QUALITY = DOCUMENT_PREP.jpegQuality

export function isPdfFile(file: File): boolean {
  const type = file.type.toLowerCase()
  if (type === "application/pdf") return true
  return file.name.toLowerCase().endsWith(".pdf")
}

function assertNotAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new DOMException("PDF conversion aborted", "AbortError")
  }
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: "image/png" | "image/jpeg",
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to encode canvas as image"))
          return
        }
        resolve(blob)
      },
      format,
      format === "image/jpeg" ? quality : undefined,
    )
  })
}

/**
 * Convert a PDF File into one image Blob per page (browser / React).
 */
export async function pdfFileToImages(
  file: File,
  options: PdfToImagesOptions = {},
): Promise<PdfPageImage[]> {
  if (!isPdfFile(file)) {
    throw new Error("Expected a PDF file")
  }

  const scale = options.scale ?? DEFAULT_SCALE
  const maxPages = options.maxPages ?? DEFAULT_MAX_PAGES
  const format = options.format ?? DEFAULT_FORMAT
  const quality = options.quality ?? DEFAULT_QUALITY

  ensurePdfWorker()
  assertNotAborted(options.signal)

  const data = new Uint8Array(await file.arrayBuffer())
  assertNotAborted(options.signal)

  let pdf: PDFDocumentProxy | null = null
  const loadingTask = getDocument({ data })
  try {
    if (options.signal) {
      options.signal.addEventListener(
        "abort",
        () => {
          void loadingTask.destroy()
        },
        { once: true },
      )
    }

    pdf = await loadingTask.promise
    assertNotAborted(options.signal)

    const pageCount = Math.min(pdf.numPages, maxPages)
    const pages: PdfPageImage[] = []
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    if (!context) {
      throw new Error("Canvas 2D context is not available")
    }

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
      assertNotAborted(options.signal)
      const page = await pdf.getPage(pageNumber)
      const viewport = page.getViewport({ scale })

      canvas.width = Math.floor(viewport.width)
      canvas.height = Math.floor(viewport.height)
      context.clearRect(0, 0, canvas.width, canvas.height)

      await page.render({
        canvas,
        canvasContext: context,
        viewport,
      }).promise

      const blob = await canvasToBlob(canvas, format, quality)
      pages.push({
        pageNumber,
        blob,
        width: canvas.width,
        height: canvas.height,
      })
      options.onProgress?.(pageNumber, pageCount)
      page.cleanup()
    }

    return pages
  } finally {
    await pdf?.cleanup()
    await loadingTask.destroy()
  }
}

/** Convenience: PDF → File[] named like `name-page-1.jpg`. */
export async function pdfFileToImageFiles(
  file: File,
  options: PdfToImagesOptions = {},
): Promise<File[]> {
  const format = options.format ?? DEFAULT_FORMAT
  const ext = format === "image/jpeg" ? "jpg" : "png"
  const base = file.name.replace(/\.pdf$/i, "") || "page"
  const pages = await pdfFileToImages(file, options)

  return pages.map(
    (page) =>
      new File([page.blob], `${base}-page-${page.pageNumber}.${ext}`, {
        type: format,
        lastModified: Date.now(),
      }),
  )
}
