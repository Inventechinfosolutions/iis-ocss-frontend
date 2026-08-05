import { DOCUMENT_PREP } from "./constants"

/**
 * Downscale a blob image so the longest side ≤ maxImageSide (Gemini prep).
 */
export async function prepareImageBlob(
  blob: Blob,
  options: {
    maxSide?: number
    format?: "image/jpeg" | "image/png"
    quality?: number
  } = {},
): Promise<Blob> {
  const maxSide = options.maxSide ?? DOCUMENT_PREP.maxImageSide
  const format = options.format ?? DOCUMENT_PREP.format
  const quality = options.quality ?? DOCUMENT_PREP.jpegQuality

  const bitmap = await createImageBitmap(blob)
  try {
    const longest = Math.max(bitmap.width, bitmap.height)
    const scale = longest > maxSide ? maxSide / longest : 1
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Canvas 2D context is not available")
    ctx.drawImage(bitmap, 0, 0, width, height)

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (out) => {
          if (!out) {
            reject(new Error("Failed to encode prepared image"))
            return
          }
          resolve(out)
        },
        format,
        format === "image/jpeg" ? quality : undefined,
      )
    })
  } finally {
    bitmap.close()
  }
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  let binary = ""
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}
