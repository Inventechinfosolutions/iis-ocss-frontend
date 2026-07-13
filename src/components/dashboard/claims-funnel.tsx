import { ChevronRight } from "lucide-react"
import { funnelStages } from "@/data/dashboard-data"
import { formatNumber, formatPercent } from "@/lib/format"
import { cn } from "@/lib/utils"

const submittedTotal = funnelStages[0]?.count ?? 1
const overallConversion =
  (funnelStages[funnelStages.length - 1].count / submittedTotal) * 100

export function ClaimsFunnel() {
  return (
    <section aria-labelledby="funnel-heading" className="dashboard-panel stagger-in p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2
            id="funnel-heading"
            className="font-display text-lg font-semibold tracking-tight text-foreground"
          >
            Claim journey — step by step
          </h2>
          <p className="text-sm text-muted-foreground">
            Where each claim is today, from filing to finished
          </p>
        </div>
        <p className="rounded-full bg-success/10 px-3 py-1.5 text-sm text-muted-foreground ring-1 ring-success/20">
          Finished end-to-end:{" "}
          <span className="font-semibold text-success tabular-nums">
            {formatPercent(overallConversion)}
          </span>
        </p>
      </div>

      <ol className="space-y-3">
        {funnelStages.map((stage, index) => {
          const prev = funnelStages[index - 1]
          const stepConversion = prev ? (stage.count / prev.count) * 100 : 100
          const labelInside = stage.percent >= 28

          return (
            <li key={stage.id} className="space-y-2">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums text-primary ring-1 ring-primary/25"
                  style={{
                    background: `color-mix(in srgb, ${stage.color} 14%, transparent)`,
                  }}
                >
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <p className="truncate text-sm font-semibold text-foreground">{stage.label}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold tabular-nums text-foreground">
                        {formatNumber(stage.count)}
                      </span>
                      <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                        {formatPercent(stage.percent)}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 text-[11px] font-medium tabular-nums",
                          stepConversion >= 100 ? "text-muted-foreground" : "text-primary",
                        )}
                      >
                        <ChevronRight className="size-3" />
                        {formatPercent(stepConversion)}
                      </span>
                    </div>
                  </div>
                  {stage.detail ? (
                    <p className="truncate text-[11px] text-muted-foreground">{stage.detail}</p>
                  ) : null}
                </div>
              </div>

              <div className="relative h-10 overflow-hidden rounded-xl bg-muted/60 ring-1 ring-border/50 sm:h-11">
                <div
                  className="funnel-bar absolute inset-y-0 left-0 flex items-center justify-end rounded-xl px-3"
                  style={{
                    width: `${Math.max(stage.percent, 3)}%`,
                    background: `linear-gradient(90deg, color-mix(in srgb, ${stage.color} 18%, transparent), color-mix(in srgb, ${stage.color} 42%, transparent))`,
                    borderRight: `2px solid color-mix(in srgb, ${stage.color} 65%, transparent)`,
                    animationDelay: `${index * 70}ms`,
                  }}
                >
                  {labelInside ? (
                    <span className="hidden text-sm font-semibold text-foreground tabular-nums sm:inline">
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
