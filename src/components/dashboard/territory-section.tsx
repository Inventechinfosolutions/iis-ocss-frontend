import { MapPin, Sparkles } from "lucide-react"
import { useMemo, useState } from "react"
import { districtStats } from "@/data/dashboard-data"
import { KarnatakaDistrictMap } from "@/components/dashboard/karnataka-map"
import { formatNumber, formatPercent } from "@/lib/format"
import { cn } from "@/lib/utils"

const topDistricts = districtStats.slice(0, 6)
const totalClaims = districtStats.reduce((sum, d) => sum + d.claims, 0)
const rankColors = [
  "#3b82f6",
  "#0ea5e9",
  "#16a34a",
  "#f59e0b",
  "#0891b2",
  "#f43f5e",
] as const

export function TerritorySection({ className }: { className?: string }) {
  const [selected, setSelected] = useState<string | null>("Bangalore")

  const active = useMemo(
    () => districtStats.find((d) => d.geoName === selected) ?? districtStats[0],
    [selected],
  )

  return (
    <section
      aria-labelledby="territory-heading"
      className={cn(
        "dashboard-panel stagger-in relative flex h-full flex-col overflow-hidden p-3 sm:p-4",
        className,
      )}
      style={{ animationDelay: "160ms" }}
    >
      {/* Soft atmospheric wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 85% 20%, rgba(59,130,246,0.12), transparent 60%), radial-gradient(50% 40% at 10% 90%, rgba(2,132,199,0.08), transparent 55%)",
        }}
      />

      <div className="relative mb-2 flex items-start gap-2 sm:mb-3 sm:gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#3b82f6]/12 text-[#1d4ed8] ring-1 ring-[#3b82f6]/20 sm:size-9 sm:rounded-xl">
          <MapPin className="size-3.5 sm:size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <h2
              id="territory-heading"
              className="font-display text-sm font-semibold tracking-tight text-foreground sm:text-base"
            >
              Where claims come from
            </h2>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-1 sm:gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#3b82f6]/10 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-[#1d4ed8] uppercase ring-1 ring-[#3b82f6]/20 sm:px-2.5 sm:py-1 sm:text-[10px]">
                <Sparkles className="size-2.5 sm:size-3" />
                30 districts
              </span>
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold tabular-nums text-muted-foreground ring-1 ring-border/60 sm:px-2.5 sm:py-1 sm:text-[10px]">
                {formatNumber(totalClaims)} claims mapped
              </span>
            </div>
          </div>
          <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
            Hover or tap a district to see claim volume across Karnataka
          </p>
        </div>
      </div>

      {/* Spotlight metrics */}
      <div className="relative mb-2 grid grid-cols-2 gap-1.5 sm:mb-3 sm:gap-2">
        <MetricChip
          label="Selected district"
          value={active.displayName}
          accent="#3b82f6"
          emphasize
        />
        <MetricChip
          label="Claims here"
          value={formatNumber(active.claims)}
          accent="#0ea5e9"
        />
        <MetricChip
          label="Share of total"
          value={formatPercent(active.percent)}
          accent="#16a34a"
        />
        <MetricChip
          label="Statewide total"
          value={formatNumber(totalClaims)}
          accent="#f59e0b"
        />
      </div>

      <div className="relative grid flex-1 grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-stretch gap-1.5 sm:gap-2.5 lg:gap-3">
        {/* Map stage — left */}
        <div className="relative flex min-h-[140px] items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#eff6ff] via-[#f8fafc] to-[#f0f9ff] p-1 ring-1 ring-[#3b82f6]/15 sm:min-h-[200px] sm:rounded-xl sm:p-2">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(59,130,246,0.14) 1px, transparent 0)",
              backgroundSize: "18px 18px",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 right-8 size-48 rounded-full bg-[#3b82f6]/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 left-6 size-52 rounded-full bg-[#0ea5e9]/10 blur-3xl"
          />

          <KarnatakaDistrictMap
            className="relative z-[1] mx-auto w-full max-w-[300px]"
            selected={selected}
            onSelect={setSelected}
          />
        </div>

        {/* Ranked districts — right */}
        <div className="flex min-w-0 flex-col">
          <div className="mb-1 flex flex-col gap-0.5 sm:mb-1.5">
            <div className="flex items-end justify-between gap-1">
              <h3 className="text-[11px] font-semibold text-foreground sm:text-xs">
                Top districts
              </h3>
              <span className="hidden text-[9px] font-medium text-muted-foreground sm:inline">
                Tap to focus
              </span>
            </div>
            <p className="hidden text-[10px] text-muted-foreground sm:block">
              Highest claim volumes statewide
            </p>
          </div>

          <ul className="grid flex-1 grid-cols-1 gap-1 sm:gap-1.5">
            {topDistricts.map((d, index) => {
              const isActive = selected === d.geoName
              const accent = rankColors[index % rankColors.length]
              return (
                <li key={d.geoName} className="min-w-0">
                  <button
                    type="button"
                    onClick={() => setSelected(d.geoName)}
                    className={cn(
                      "group relative flex h-full w-full items-center gap-1 overflow-hidden rounded-md bg-card px-1.5 py-1 text-left transition-all sm:gap-1.5 sm:rounded-lg sm:px-2 sm:py-1.5",
                      "ring-1 ring-border/60 hover:-translate-y-0.5 hover:shadow-md",
                      isActive && "shadow-md ring-2 ring-[#3b82f6]/35",
                    )}
                    style={
                      isActive
                        ? {
                            boxShadow: `0 10px 28px ${accent}22`,
                            backgroundColor: `${accent}0a`,
                          }
                        : undefined
                    }
                  >
                    <span
                      className="absolute inset-y-0 left-0 w-0.5 rounded-l-lg transition-opacity sm:w-0.5"
                      style={{
                        background: accent,
                        opacity: isActive ? 1 : 0.55,
                      }}
                    />

                    <span
                      className="ml-0.5 flex size-4 shrink-0 items-center justify-center rounded text-[8px] font-bold tabular-nums text-white sm:ml-0.5 sm:size-5 sm:text-[10px]"
                      style={{
                        background: `linear-gradient(145deg, ${accent}, ${accent}cc)`,
                        boxShadow: `0 4px 12px ${accent}40`,
                      }}
                    >
                      {index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-1">
                        <p className="truncate text-[10px] font-semibold text-foreground sm:text-xs">
                          {d.displayName}
                        </p>
                        <p
                          className="shrink-0 font-display text-[10px] font-semibold tabular-nums sm:text-xs"
                          style={{ color: isActive ? accent : undefined }}
                        >
                          {formatNumber(d.claims)}
                        </p>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 sm:mt-1 sm:gap-1.5">
                        <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full transition-[width] duration-500"
                            style={{
                              width: `${Math.max(d.percent, 4)}%`,
                              background: `linear-gradient(90deg, ${accent}99, ${accent})`,
                            }}
                          />
                        </div>
                        <span className="w-7 shrink-0 text-right text-[8px] font-semibold tabular-nums text-muted-foreground sm:w-8 sm:text-[10px]">
                          {formatPercent(d.percent)}
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="mt-1 rounded-md bg-muted/40 px-2 py-1 ring-1 ring-border/60 sm:mt-2 sm:rounded-lg sm:px-2.5 sm:py-1.5">
            <p className="text-[8px] font-semibold tracking-wide text-muted-foreground uppercase sm:text-[9px]">
              Claim intensity
            </p>
            <div
              className="mt-0.5 h-1 overflow-hidden rounded-full sm:mt-1 sm:h-1.5"
              style={{
                background:
                  "linear-gradient(90deg, #e2e8f0 0%, #bfdbfe 35%, #3b82f6 70%, #1d4ed8 100%)",
              }}
            />
            <div className="mt-0.5 flex justify-between text-[8px] text-muted-foreground sm:text-[9px]">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MetricChip({
  label,
  value,
  accent,
  emphasize = false,
}: {
  label: string
  value: string
  accent: string
  emphasize?: boolean
}) {
  return (
    <div className="rounded-lg bg-card/80 px-2 py-1.5 ring-1 ring-border/60 backdrop-blur-sm sm:rounded-xl sm:px-2.5 sm:py-2">
      <p className="text-[8px] font-semibold tracking-wide text-muted-foreground uppercase sm:text-[9px]">
        {label}
      </p>
      <p
        className={cn(
          "mt-0.5 truncate font-display font-semibold tracking-tight text-foreground",
          emphasize ? "text-xs sm:text-sm" : "text-sm tabular-nums sm:text-base",
        )}
        style={{ color: emphasize ? accent : undefined }}
      >
        {value}
      </p>
      <div
        className="mt-1 h-0.5 w-5 rounded-full sm:w-6"
        style={{ background: accent }}
      />
    </div>
  )
}
