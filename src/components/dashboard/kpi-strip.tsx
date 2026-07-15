import { Link } from "@tanstack/react-router"
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Building2,
  HandCoins,
  IndianRupee,
  Scale,
  Users,
  Wallet,
  FileStack,
} from "lucide-react"
import type { KpiItem } from "@/data/dashboard-data"
import { kpiData } from "@/data/dashboard-data"
import { useCountUp } from "@/hooks/use-count-up"
import { formatKpiValue } from "@/lib/format"
import { cn } from "@/lib/utils"

const icons = {
  fes: Building2,
  depositors: Users,
  investments: Wallet,
  claims: FileStack,
  liability: Scale,
  recovered: IndianRupee,
  settled: HandCoins,
} as const

const kpiRoutes = {
  fes: "/companies",
  depositors: "/victims",
  claims: "/claims",
  recovered: "/assets",
} as const

type DrillableKpiId = keyof typeof kpiRoutes

function isDrillableKpi(id: string): id is DrillableKpiId {
  return id in kpiRoutes
}

/** Soft pastel card surfaces — easy to scan, friendly UX */
const accentTheme: Record<
  KpiItem["accent"],
  { color: string; soft: string; softDark: string; iconBg: string }
> = {
  cyan: {
    color: "#3b82f6",
    soft: "linear-gradient(160deg, #eff6ff 0%, #ffffff 70%)",
    softDark: "linear-gradient(160deg, rgba(59,130,246,0.18) 0%, rgba(20,28,44,1) 75%)",
    iconBg: "#dbeafe",
  },
  success: {
    color: "#22c55e",
    soft: "linear-gradient(160deg, #ecfdf5 0%, #ffffff 70%)",
    softDark: "linear-gradient(160deg, rgba(34,197,94,0.16) 0%, rgba(20,28,44,1) 75%)",
    iconBg: "#dcfce7",
  },
  gold: {
    color: "#f59e0b",
    soft: "linear-gradient(160deg, #fffbeb 0%, #ffffff 70%)",
    softDark: "linear-gradient(160deg, rgba(245,158,11,0.16) 0%, rgba(20,28,44,1) 75%)",
    iconBg: "#fef3c7",
  },
  violet: {
    color: "#0ea5e9",
    soft: "linear-gradient(160deg, #f0f9ff 0%, #ffffff 70%)",
    softDark: "linear-gradient(160deg, rgba(14,165,233,0.16) 0%, rgba(20,28,44,1) 75%)",
    iconBg: "#e0f2fe",
  },
  rose: {
    color: "#f43f5e",
    soft: "linear-gradient(160deg, #fff1f2 0%, #ffffff 70%)",
    softDark: "linear-gradient(160deg, rgba(244,63,94,0.16) 0%, rgba(20,28,44,1) 75%)",
    iconBg: "#ffe4e6",
  },
}

function KpiCard({ item, index }: { item: KpiItem; index: number }) {
  const Icon = icons[item.id as keyof typeof icons] ?? IndianRupee
  const theme = accentTheme[item.accent]
  const animated = useCountUp(item.value, 1000 + index * 80)
  const display =
    item.format === "percent"
      ? formatKpiValue(Number(animated.toFixed(1)), item.format)
      : formatKpiValue(Math.round(animated), item.format)
  const href = isDrillableKpi(item.id) ? kpiRoutes[item.id] : undefined

  const TrendIcon =
    item.trendDirection === "up"
      ? ArrowUpRight
      : item.trendDirection === "down"
        ? ArrowDownRight
        : ArrowRight

  const trendClass =
    item.trendDirection === "up"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
      : item.trendDirection === "down"
        ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400"
        : "bg-slate-100 text-slate-500 dark:bg-slate-500/15 dark:text-slate-400"

  const content = (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 dark:hidden"
        style={{ background: theme.soft }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden dark:block"
        style={{ background: theme.softDark }}
      />
      <div className="relative flex items-start justify-between gap-1.5 sm:gap-2">
        <div className="flex min-w-0 items-start gap-1.5 sm:gap-2.5">
          <div
            className="flex size-7 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105 sm:size-9 sm:rounded-xl dark:brightness-110"
            style={{ background: theme.iconBg, color: theme.color }}
          >
            <Icon className="size-3.5 sm:size-4" strokeWidth={2} />
          </div>
          <p className="line-clamp-2 text-[10px] font-semibold leading-snug tracking-wide text-slate-500 uppercase sm:text-[11px] dark:text-slate-400">
            {item.label}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums sm:px-2 sm:text-[11px]",
            trendClass,
          )}
        >
          <TrendIcon className="size-3 sm:size-3.5" />
          {item.trendDirection === "flat" ? "—" : `${item.trend}%`}
        </span>
      </div>

      <div className="relative mt-1.5 min-w-0 sm:mt-2.5">
        <p
          className="font-display text-[1.2rem] leading-none font-semibold tracking-tight tabular-nums sm:text-[1.45rem]"
          style={{ color: theme.color }}
        >
          {display}
        </p>
        <p className="mt-1 line-clamp-1 text-[10px] leading-snug text-slate-500 sm:mt-1.5 sm:line-clamp-2 sm:text-[11px] dark:text-slate-400">
          {item.hint}
        </p>
      </div>
    </>
  )

  const shellClass =
    "group relative block overflow-hidden rounded-xl border border-black/[0.04] bg-white p-2.5 text-left shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(15,23,42,0.1)] sm:rounded-2xl sm:p-3.5 dark:border-white/[0.06] dark:bg-[#141c2c] dark:shadow-[0_8px_28px_rgba(0,0,0,0.35)]"

  if (href) {
    return (
      <Link
        to={href}
        className={cn(
          shellClass,
          "w-full cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        )}
        aria-label={`Open ${item.label} page`}
      >
        {content}
      </Link>
    )
  }

  return <article className={shellClass}>{content}</article>
}

export function KpiStrip() {
  return (
    <section aria-labelledby="kpi-heading" className="space-y-2 sm:space-y-3">
      <div>
        <h2
          id="kpi-heading"
          className="font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl"
        >
          At a glance
        </h2>
        <p className="mt-0.5 hidden text-sm text-muted-foreground sm:block">
          Main numbers for the whole claim settlement programme — open companies,
          victims, claims, or recovered assets for full pages
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-12">
        {kpiData.map((item, index) => {
          const isSecondRow = index >= 4
          return (
            <div
              key={item.id}
              className={cn(
                "stagger-in min-w-0",
                isSecondRow ? "lg:col-span-4" : "lg:col-span-3",
                index === kpiData.length - 1 && "col-span-2 lg:col-span-4",
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <KpiCard item={item} index={index} />
            </div>
          )
        })}
      </div>
    </section>
  )
}
