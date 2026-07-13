import { dashboardMeta } from "@/data/dashboard-data"
import { cn } from "@/lib/utils"

export function ReportMeta({
  label = "Programme report",
  accent = "#3b82f6",
}: {
  label?: string
  accent?: string
}) {
  return (
    <div className="stagger-in flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span
        className="inline-flex items-center rounded-md px-2 py-1 font-semibold"
        style={{ background: `${accent}18`, color: accent }}
      >
        {label}
      </span>
      <span>Generated {dashboardMeta.lastUpdated}</span>
      <span className="text-border">·</span>
      <span>{dashboardMeta.authority}</span>
      <span className="text-border">·</span>
      <span>Sample operational data</span>
    </div>
  )
}

export function ReportDisclaimer({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "rounded-md border border-dashed border-border/70 bg-muted/20 px-4 py-3 text-xs leading-relaxed text-muted-foreground",
        className,
      )}
    >
      This OCSS report is sample operational data for demonstration. Figures are
      not for judicial filing.
    </p>
  )
}

export function ReportSectionIntro({
  title,
  countLabel,
  description,
  accent = "#1d4ed8",
  soft = "#eff6ff",
}: {
  title: string
  countLabel: string
  description: string
  accent?: string
  soft?: string
}) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <span
          className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase dark:bg-white/10"
          style={{ background: soft, color: accent }}
        >
          {countLabel}
        </span>
      </div>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
