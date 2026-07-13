import { Link } from "@tanstack/react-router"
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CircleDollarSign,
  HandCoins,
  Percent,
  Scale,
  Users,
  Wallet,
  FileStack,
} from "lucide-react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"
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
  recovered: CircleDollarSign,
  settled: HandCoins,
  "recovery-rate": Percent,
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

function Sparkline({ data, color, id }: { data: number[]; color: string; id: string }) {
  const chartData = data.map((v, i) => ({ i, v }))
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          fill={`url(#spark-${id})`}
          isAnimationActive={false}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function KpiCard({ item, index }: { item: KpiItem; index: number }) {
  const Icon = icons[item.id as keyof typeof icons] ?? CircleDollarSign
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
      <div className="relative flex items-start justify-between gap-3">
        <div
          className="flex size-11 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 dark:brightness-110"
          style={{ background: theme.iconBg, color: theme.color }}
        >
          <Icon className="size-5" strokeWidth={2} />
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
            trendClass,
          )}
        >
          <TrendIcon className="size-3.5" />
          {item.trendDirection === "flat" ? "—" : `${item.trend}%`}
        </span>
      </div>

      <p className="relative mt-4 text-[11px] font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
        {item.label}
      </p>
      <p
        className="relative mt-1 font-display text-[1.65rem] leading-none font-semibold tracking-tight tabular-nums"
        style={{ color: theme.color }}
      >
        {display}
      </p>

      <div className="relative mt-3 flex items-end justify-between gap-2">
        <p className="max-w-[9.5rem] text-[11px] leading-snug text-slate-500 dark:text-slate-400">
          {href ? `${item.hint} · Open page` : item.hint}
        </p>
        <div className="h-9 w-20 shrink-0 opacity-90">
          <Sparkline data={item.spark} color={theme.color} id={item.id} />
        </div>
      </div>
    </>
  )

  const shellClass =
    "group relative block overflow-hidden rounded-2xl border border-black/[0.04] bg-white p-4 text-left shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(15,23,42,0.1)] dark:border-white/[0.06] dark:bg-[#141c2c] dark:shadow-[0_8px_28px_rgba(0,0,0,0.35)]"

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
    <section aria-labelledby="kpi-heading" className="space-y-3">
      <div>
        <h2
          id="kpi-heading"
          className="font-display text-xl font-semibold tracking-tight text-foreground"
        >
          At a glance
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Main numbers for the whole claim settlement programme — open companies,
          victims, claims, or recovered assets for full pages
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {kpiData.map((item, index) => (
          <div key={item.id} className="stagger-in" style={{ animationDelay: `${index * 50}ms` }}>
            <KpiCard item={item} index={index} />
          </div>
        ))}
      </div>
    </section>
  )
}
