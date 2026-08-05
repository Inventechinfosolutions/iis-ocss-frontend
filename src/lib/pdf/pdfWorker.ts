import { GlobalWorkerOptions } from "pdfjs-dist"
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url"

let configured = false

/** Configure the PDF.js worker once (Vite-friendly worker URL). */
export function ensurePdfWorker(): void {
  if (configured) return
  GlobalWorkerOptions.workerSrc = pdfWorkerUrl
  configured = true
}
