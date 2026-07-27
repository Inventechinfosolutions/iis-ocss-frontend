import {
  DOCUMENT_PREP,
  blobToBase64,
  isPdfFile,
  pdfFileToImages,
  prepareImageBlob,
} from "@/lib/pdf"
import { extractFieldsWithGemini } from "./geminiExtract"
import type { ExtractedField, FieldSpec, GenericExtractResponse } from "./types"

/**
 * Convert upload → page images (client-side) → Gemini Vision extract.
 * Does not call generic-form-backend.
 */
export async function extractFormFields(
  file: File,
  formModel: FieldSpec[],
  options: {
    signal?: AbortSignal
    onStage?: (stage: string) => void
  } = {},
): Promise<GenericExtractResponse> {
  if (!formModel.length) {
    throw new Error(
      "No fields in form config. Provide {id, label}[] with the document.",
    )
  }

  if (file.size > DOCUMENT_PREP.maxUploadBytes) {
    throw new Error(
      `File too large (max ${Math.round(DOCUMENT_PREP.maxUploadBytes / (1024 * 1024))} MB)`,
    )
  }

  options.onStage?.("Preparing document pages")

  let pageBlobs: Blob[] = []

  if (isPdfFile(file)) {
    options.onStage?.("Converting PDF to images")
    const pages = await pdfFileToImages(file, {
      scale: DOCUMENT_PREP.pdfScale,
      maxPages: DOCUMENT_PREP.maxPages,
      format: DOCUMENT_PREP.format,
      quality: DOCUMENT_PREP.jpegQuality,
      signal: options.signal,
      onProgress: (done, total) => {
        options.onStage?.(`Converting PDF page ${done}/${total}`)
      },
    })
    pageBlobs = pages.map((p) => p.blob)
  } else {
    pageBlobs = [file]
  }

  if (!pageBlobs.length) {
    throw new Error("No document pages to extract from")
  }

  options.onStage?.("Preparing images for Gemini")
  const imageBase64Pages: Array<{ mimeType: string; data: string }> = []
  for (let i = 0; i < pageBlobs.length; i++) {
    if (options.signal?.aborted) {
      throw new DOMException("Extract aborted", "AbortError")
    }
    const prepared = await prepareImageBlob(pageBlobs[i], {
      maxSide: DOCUMENT_PREP.maxImageSide,
      format: DOCUMENT_PREP.format,
      quality: DOCUMENT_PREP.jpegQuality,
    })
    imageBase64Pages.push({
      mimeType: DOCUMENT_PREP.format,
      data: await blobToBase64(prepared),
    })
    options.onStage?.(
      `Prepared page ${i + 1}/${pageBlobs.length}`,
    )
  }

  options.onStage?.("OCR extracting with Gemini")
  return extractFieldsWithGemini({
    imageBase64Pages,
    formModel,
    sourceFile: file.name,
    signal: options.signal,
  })
}

export function countFilled(
  fields: ExtractedField[] | null | undefined,
): number {
  if (!fields) return 0
  return fields.filter(
    (f) => f.value != null && String(f.value).trim() !== "",
  ).length
}
