import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ScanPreviewPage = {
  url: string
  pageNumber: number
}

type DocumentScanPreviewProps = {
  pages: ScanPreviewPage[]
  fileName?: string | null
  loading?: boolean
  onClear?: () => void
  className?: string
}

/**
 * Shows the uploaded scan next to the form so claimants can verify autofill.
 */
export function DocumentScanPreview({
  pages,
  fileName,
  loading,
  onClear,
  className,
}: DocumentScanPreviewProps) {
  const [pageIndex, setPageIndex] = useState(0)

  useEffect(() => {
    setPageIndex(0)
  }, [pages])

  if (!loading && pages.length === 0) return null

  const current = pages[pageIndex]
  const total = pages.length

  return (
    <aside
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-lg border border-border/70 bg-muted/20",
        className,
      )}
      aria-label="Uploaded document preview"
    >
      <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2.5">
        <FileText className="size-3.5 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-foreground">
            Scanned document
          </p>
          <p className="truncate text-[10px] text-muted-foreground">
            {fileName
              ? `Compare fields with ${fileName}`
              : "Compare autofilled fields with this scan"}
          </p>
        </div>
        {onClear && !loading ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 shrink-0 px-2 text-xs"
            onClick={onClear}
            aria-label="Clear document preview"
          >
            <X className="size-3.5" />
          </Button>
        ) : null}
      </div>

      <div className="relative flex min-h-[220px] flex-1 items-center justify-center bg-[radial-gradient(circle_at_1px_1px,color-mix(in_oklch,var(--border)_55%,transparent)_1px,transparent_0)] [background-size:12px_12px] p-3">
        {loading && pages.length === 0 ? (
          <p className="text-xs text-muted-foreground" role="status">
            Preparing preview…
          </p>
        ) : current ? (
          <img
            src={current.url}
            alt={`Document page ${current.pageNumber}`}
            className="max-h-[min(70vh,720px)] w-full object-contain"
          />
        ) : null}
      </div>

      {total > 1 ? (
        <div className="flex items-center justify-between gap-2 border-t border-border/60 px-2 py-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 px-2"
            disabled={pageIndex <= 0}
            onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <p className="text-xs tabular-nums text-muted-foreground">
            Page {pageIndex + 1} of {total}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 px-2"
            disabled={pageIndex >= total - 1}
            onClick={() => setPageIndex((i) => Math.min(total - 1, i + 1))}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      ) : total === 1 ? (
        <p className="border-t border-border/60 px-3 py-2 text-center text-[10px] text-muted-foreground">
          Page 1
        </p>
      ) : null}
    </aside>
  )
}
