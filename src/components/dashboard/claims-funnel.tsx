import { ChevronRight } from "lucide-react"
import { funnelStages } from "@/data/dashboard-data"
import { formatNumber, formatPercent } from "@/lib/format"
import { cn } from "@/lib/utils"

const submittedTotal = funnelStages[0]?.count ?? 1
const overallConversion =
  (funnelStages[funnelStages.length - 1].count / submittedTotal) * 100

export function ClaimsFunnel({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="funnel-heading"
      className={cn(
        "dashboard-panel stagger-in flex h-full flex-col p-3 sm:p-4",
        className,
      )}
    >
      <div className="mb-2 min-w-0 sm:mb-3">
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <h2
            id="funnel-heading"
            className="font-display text-sm font-semibold tracking-tight text-foreground sm:text-base"
          >
            Claim journey — step by step
          </h2>
          <p className="shrink-0 rounded-full bg-success/10 px-2 py-0.5 text-[10px] text-muted-foreground ring-1 ring-success/20 sm:px-2.5 sm:py-1 sm:text-xs">
            Finished end-to-end:{" "}
            <span className="font-semibold text-success tabular-nums">
              {formatPercent(overallConversion)}
            </span>
          </p>
        </div>
        <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
          Where each claim is today, from filing to finished
        </p>
      </div>

      <ol className="space-y-1.5 sm:space-y-2">
        {funnelStages.map((stage, index) => {
          const prev = funnelStages[index - 1]
          const stepConversion = prev ? (stage.count / prev.count) * 100 : 100
          const labelInside = stage.percent >= 28

          return (
            <li key={stage.id} className="space-y-0.5 sm:space-y-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className="flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold tabular-nums text-primary ring-1 ring-primary/25 sm:size-6 sm:text-[11px]"
                  style={{
                    background: `color-mix(in srgb, ${stage.color} 14%, transparent)`,
                  }}
                >
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                    <p className="truncate text-xs font-semibold text-foreground sm:text-[13px]">
                      {stage.label}
                    </p>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <span className="text-xs font-semibold tabular-nums text-foreground sm:text-[13px]">
                        {formatNumber(stage.count)}
                      </span>
                      <span className="text-[10px] font-semibold tabular-nums text-muted-foreground sm:text-[11px]">
                        {formatPercent(stage.percent)}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 text-[9px] font-medium tabular-nums sm:text-[10px]",
                          stepConversion >= 100 ? "text-muted-foreground" : "text-primary",
                        )}
                      >
                        <ChevronRight className="size-2.5" />
                        {formatPercent(stepConversion)}
                      </span>
                    </div>
                  </div>
                  {stage.detail ? (
                    <p className="hidden truncate text-[10px] text-muted-foreground sm:block">
                      {stage.detail}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="relative h-5 overflow-hidden rounded-md bg-muted/60 ring-1 ring-border/50 sm:h-7 sm:rounded-lg">
                <div
                  className="funnel-bar absolute inset-y-0 left-0 flex items-center justify-end rounded-md px-1.5 sm:rounded-lg sm:px-2"
                  style={{
                    width: `${Math.max(stage.percent, 3)}%`,
                    background: `linear-gradient(90deg, color-mix(in srgb, ${stage.color} 18%, transparent), color-mix(in srgb, ${stage.color} 42%, transparent))`,
                    borderRight: `2px solid color-mix(in srgb, ${stage.color} 65%, transparent)`,
                    animationDelay: `${index * 70}ms`,
                  }}
                >
                  {labelInside ? (
                    <span className="hidden text-xs font-semibold text-foreground tabular-nums sm:inline">
                      {formatNumber(stage.count)}
                    </span>
                  ) : null}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
