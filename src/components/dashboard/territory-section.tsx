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
        "dashboard-panel stagger-in relative overflow-hidden p-4 sm:p-6",
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

      <div className="relative mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#3b82f6]/12 text-[#1d4ed8] ring-1 ring-[#3b82f6]/20">
            <MapPin className="size-5" />
          </span>
          <div className="min-w-0">
            <h2
              id="territory-heading"
              className="font-display text-lg font-semibold tracking-tight text-foreground"
            >
              Where claims come from
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Hover or tap a district to see claim volume across Karnataka
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3b82f6]/10 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-[#1d4ed8] uppercase ring-1 ring-[#3b82f6]/20">
            <Sparkles className="size-3.5" />
            30 districts
          </span>
          <span className="inline-flex items-center rounded-full bg-muted px-3 py-1.5 text-[11px] font-semibold tabular-nums text-muted-foreground ring-1 ring-border/60">
            {formatNumber(totalClaims)} claims mapped
          </span>
        </div>
      </div>

      {/* Spotlight metrics */}
      <div className="relative mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
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

      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.95fr)] lg:items-stretch">
        {/* Map stage */}
        <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#eff6ff] via-[#f8fafc] to-[#f0f9ff] p-2 ring-1 ring-[#3b82f6]/15 sm:min-h-[360px] sm:p-4 md:min-h-[420px]">
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
            className="relative z-[1] mx-auto w-full max-w-[460px]"
            selected={selected}
            onSelect={setSelected}
          />

          {/* Floating intensity legend on map */}
          <div className="absolute bottom-3 left-3 right-3 z-[2] flex items-center gap-3 rounded-xl bg-white/85 px-3 py-2 shadow-sm ring-1 ring-border/60 backdrop-blur-sm sm:left-auto sm:right-3 sm:w-52">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                Claim intensity
              </p>
              <div
                className="mt-1.5 h-2 overflow-hidden rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #e2e8f0 0%, #bfdbfe 35%, #3b82f6 70%, #1d4ed8 100%)",
                }}
              />
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ranked districts */}
        <div className="flex min-h-0 flex-col">
          <div className="mb-3 flex items-end justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Top districts</h3>
              <p className="text-xs text-muted-foreground">
                Highest claim volumes statewide
              </p>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">
              Tap to focus map
            </span>
          </div>

          <ul className="flex flex-1 flex-col gap-2.5">
            {topDistricts.map((d, index) => {
              const isActive = selected === d.geoName
              const accent = rankColors[index % rankColors.length]
              return (
                <li key={d.geoName}>
                  <button
                    type="button"
                    onClick={() => setSelected(d.geoName)}
                    className={cn(
                      "group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl bg-card px-3 py-3 text-left transition-all",
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
                      className="absolute inset-y-0 left-0 w-1 rounded-l-2xl transition-opacity"
                      style={{
                        background: accent,
                        opacity: isActive ? 1 : 0.55,
                      }}
                    />

                    <span
                      className="ml-1.5 flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold tabular-nums text-white"
                      style={{
                        background: `linear-gradient(145deg, ${accent}, ${accent}cc)`,
                        boxShadow: `0 4px 12px ${accent}40`,
                      }}
                    >
                      {index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {d.displayName}
                        </p>
                        <p
                          className="shrink-0 font-display text-sm font-semibold tabular-nums"
                          style={{ color: isActive ? accent : undefined }}
                        >
                          {formatNumber(d.claims)}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full transition-[width] duration-500"
                            style={{
                              width: `${Math.max(d.percent, 4)}%`,
                              background: `linear-gradient(90deg, ${accent}99, ${accent})`,
                            }}
                          />
                        </div>
                        <span className="w-11 text-right text-[11px] font-semibold tabular-nums text-muted-foreground">
                          {formatPercent(d.percent)}
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
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
    <div className="rounded-2xl bg-card/80 px-3.5 py-3 ring-1 ring-border/60 backdrop-blur-sm">
      <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 truncate font-display font-semibold tracking-tight text-foreground",
          emphasize ? "text-base sm:text-lg" : "text-lg tabular-nums",
        )}
        style={{ color: emphasize ? accent : undefined }}
      >
        {value}
      </p>
      <div
        className="mt-2 h-0.5 w-8 rounded-full"
        style={{ background: accent }}
      />
    </div>
  )
}
