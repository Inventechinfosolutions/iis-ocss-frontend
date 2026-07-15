import {
  BadgeCheck,
  ChevronRight,
  Clock3,
  HandCoins,
  IndianRupee,
  Percent,
  PieChart,
  Shield,
  Users,
  Wallet,
} from "lucide-react"
import { Link } from "@tanstack/react-router"
import { financialFooterStats, financialMetrics } from "@/data/dashboard-data"
import { formatINR, formatPercent } from "@/lib/format"
import { cn } from "@/lib/utils"

const rowTheme = {
  navy: {
    accent: "#0ea5e9",
    iconBg: "bg-[#0ea5e9]/10 text-[#0284c7] dark:text-[#7dd3fc]",
  },
  info: {
    accent: "#3b82f6",
    iconBg: "bg-[#3b82f6]/10 text-[#1d4ed8] dark:text-[#93c5fd]",
  },
  success: {
    accent: "#16a34a",
    iconBg: "bg-[#16a34a]/10 text-[#15803d] dark:text-[#6ee7b7]",
  },
  gold: {
    accent: "#f59e0b",
    iconBg: "bg-[#f59e0b]/10 text-[#d97706] dark:text-[#fcd34d]",
  },
  warning: {
    accent: "#f43f5e",
    iconBg: "bg-[#f43f5e]/10 text-[#e11d48] dark:text-[#fda4af]",
  },
} as const

const metricIcons = {
  "available-fund": Wallet,
  "approved-liability": BadgeCheck,
  "previous-returns": HandCoins,
  "net-payable": Clock3,
  "equitable-ratio": Percent,
} as const

const footerIcons = {
  pie: PieChart,
  users: Users,
  shield: Shield,
} as const

function MoneyHeroArt() {
  return (
    <div className="relative hidden h-[52px] w-[64px] shrink-0 sm:block" aria-hidden>
      <div className="absolute bottom-1 left-0.5 h-5 w-5 rounded-full bg-gradient-to-br from-[#93c5fd] to-[#3b82f6] shadow-md ring-2 ring-white/80" />
      <div className="absolute bottom-0 left-3.5 h-6 w-6 rounded-full bg-gradient-to-br from-[#bfdbfe] to-[#60a5fa] shadow-md ring-2 ring-white/80" />
      <div className="absolute right-0 top-0 flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#dbeafe] to-[#93c5fd] shadow-lg ring-1 ring-[#3b82f6]/25">
        <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] text-white shadow-inner">
          <IndianRupee className="size-3.5" strokeWidth={2.5} />
        </div>
      </div>
      <Shield className="absolute -right-0.5 top-6 size-3.5 text-[#3b82f6]/70" />
    </div>
  )
}

export function FinancialSummary({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="financial-heading"
      className={cn("dashboard-panel stagger-in flex h-full flex-col p-3 sm:p-4", className)}
      style={{ animationDelay: "120ms" }}
    >
      <div className="mb-2 flex items-start justify-between gap-2 sm:mb-3">
        <div className="min-w-0">
          <h2
            id="financial-heading"
            className="font-display text-sm font-semibold tracking-tight text-foreground sm:text-base"
          >
            Funds Available for Settlement
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Overview of available funds, approved claims, and settlement distribution.
          </p>
        </div>
        <MoneyHeroArt />
      </div>

      <ul className="min-h-0 flex-1 space-y-0.5">
        {financialMetrics.map((metric, index) => {
          const Icon = metricIcons[metric.id as keyof typeof metricIcons] ?? Wallet
          const theme = rowTheme[metric.tone]
          const display =
            metric.format === "percent"
              ? formatPercent(metric.value)
              : formatINR(metric.value)

          return (
            <li key={metric.id}>
              <Link
                to="/finance/$metricId"
                params={{ metricId: metric.id }}
                className="group flex w-full items-center gap-2 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-muted/60 sm:gap-2.5 sm:px-2 sm:py-2"
                style={{ animationDelay: `${140 + index * 40}ms` }}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-9",
                    theme.iconBg,
                  )}
                >
                  <Icon className="size-3.5 sm:size-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground sm:text-[13px]">
                    {metric.label}
                  </p>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="funnel-bar h-full rounded-full"
                      style={{
                        width: `${Math.max(metric.barPercent, 8)}%`,
                        background: theme.accent,
                        animationDelay: `${180 + index * 45}ms`,
                      }}
                    />
                  </div>
                </div>

                <p className="shrink-0 font-display text-xs font-semibold tabular-nums text-foreground sm:text-sm">
                  {display}
                </p>
                <ChevronRight className="hidden size-3.5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 sm:block" />
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="mt-auto grid grid-cols-1 gap-1.5 rounded-xl bg-slate-50 p-2 sm:grid-cols-3 sm:gap-2 sm:p-2.5 dark:bg-muted/50">
        {financialFooterStats.map((stat) => {
          const Icon = footerIcons[stat.icon]
          return (
            <div key={stat.id} className="min-w-0 text-left">
              <div className="flex items-center gap-1.5 sm:items-start sm:gap-2">
                <span
                  className="flex size-6 shrink-0 items-center justify-center rounded-full sm:size-7"
                  style={{ background: `${stat.accent}18`, color: stat.accent }}
                >
                  <Icon className="size-3" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[9px] leading-tight text-muted-foreground sm:text-[10px]">
                    {stat.label}
                  </p>
                  <p className="font-display text-xs font-semibold tabular-nums text-foreground sm:text-sm">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
