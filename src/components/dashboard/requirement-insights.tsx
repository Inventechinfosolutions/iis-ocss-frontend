import {
  BarChart3,
  Building2,
  Calendar,
  CalendarClock,
  ChevronRight,
  Clock3,
  Gem,
  List,
  ShieldCheck,
  ShieldX,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import {
  claimWindows,
  eligibilityOutcomes,
  safetyChecks,
} from "@/data/dashboard-data"
import { formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

const windowStatusLabel = {
  open: "Open now",
  "closing-soon": "Closing soon",
  closed: "Closed",
} as const

const windowStatusStyle = {
  open: "bg-[#22c55e]/12 text-[#16a34a] ring-[#22c55e]/20",
  "closing-soon": "bg-[#f59e0b]/12 text-[#f59e0b] ring-[#f59e0b]/25",
  closed: "bg-muted text-muted-foreground ring-border",
} as const

const windowStatusDot = {
  open: "bg-[#22c55e]",
  "closing-soon": "bg-[#f59e0b]",
  closed: "bg-muted-foreground",
} as const

const companyTheme = [
  {
    accent: "#0ea5e9",
    iconBg: "bg-[#0ea5e9]/12 text-[#0284c7]",
    Icon: Gem,
  },
  {
    accent: "#3b82f6",
    iconBg: "bg-[#3b82f6]/12 text-[#1d4ed8]",
    Icon: Building2,
  },
  {
    accent: "#f59e0b",
    iconBg: "bg-[#f59e0b]/12 text-[#f59e0b]",
    Icon: Building2,
  },
] as const

const eligibilityTheme = {
  success: {
    accent: "#22c55e",
    bar: "bg-[#22c55e]",
    card: "ring-[#22c55e]/20",
    iconBg: "bg-[#22c55e]/12 text-[#16a34a]",
    value: "text-[#16a34a]",
    Icon: ShieldCheck,
    Trend: TrendingUp,
  },
  rose: {
    accent: "#ef4444",
    bar: "bg-[#ef4444]",
    card: "ring-[#ef4444]/20",
    iconBg: "bg-[#ef4444]/12 text-[#dc2626]",
    value: "text-[#dc2626]",
    Icon: ShieldX,
    Trend: TrendingDown,
  },
  gold: {
    accent: "#f59e0b",
    bar: "bg-[#f59e0b]",
    card: "ring-[#f59e0b]/20",
    iconBg: "bg-[#f59e0b]/12 text-[#f59e0b]",
    value: "text-[#f59e0b]",
    Icon: Clock3,
    Trend: Clock3,
  },
} as const

const eligibilityBarWidth = {
  eligible: 86,
  "not-eligible": 18,
  waiting: 48,
} as const

/** Project chart palette — teal, sky, green, amber, rose */
const safetyColors = ["#0ea5e9", "#3b82f6", "#22c55e", "#f59e0b", "#f43f5e"] as const

export function RequirementInsights() {
  return (
    <section aria-labelledby="req-insights-heading" className="space-y-3">
      <div>
        <h2
          id="req-insights-heading"
          className="font-display text-lg font-semibold tracking-tight text-foreground"
        >
          Extra facts from the official process
        </h2>
        <p className="text-sm text-muted-foreground">
          Claim invitations, eligibility results, and safety checks
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
        {/* Claim windows */}
        <article className="dashboard-panel stagger-in flex h-full flex-col p-4 sm:p-5">
          <div className="mb-4 flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#0ea5e9]/12 text-[#0284c7]">
              <CalendarClock className="size-5" />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold text-foreground">
                Open claim invitation windows
              </h3>
              <p className="text-xs text-muted-foreground sm:text-sm">
                When victims are allowed to file claims for each company
              </p>
            </div>
          </div>

          <ul className="flex-1 space-y-2.5">
            {claimWindows.map((w, index) => {
              const theme = companyTheme[index] ?? companyTheme[0]
              const CompanyIcon = theme.Icon
              return (
                <li key={w.id}>
                  <button
                    type="button"
                    className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl bg-card p-3 text-left ring-1 ring-border/60 transition-all hover:bg-muted/40 hover:shadow-sm"
                  >
                    <span
                      className="absolute inset-y-0 left-0 w-1 rounded-l-2xl"
                      style={{ background: theme.accent }}
                    />

                    <span
                      className={cn(
                        "ml-1.5 flex size-10 shrink-0 items-center justify-center rounded-xl",
                        theme.iconBg,
                      )}
                    >
                      <CompanyIcon className="size-4.5" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {w.company}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Calendar className="size-3 shrink-0" />
                        <span className="truncate">
                          {w.from} → {w.to}
                        </span>
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-foreground/80">
                        <Users className="size-3 shrink-0" />
                        <span className="truncate">
                          {formatNumber(w.claimsReceived)} claims received in this window
                        </span>
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1.5 sm:gap-2">
                      <span
                        className={cn(
                          "inline-flex max-w-[6.5rem] items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ring-1 sm:max-w-none",
                          windowStatusStyle[w.status],
                        )}
                      >
                        <span
                          className={cn("size-1.5 shrink-0 rounded-full", windowStatusDot[w.status])}
                        />
                        <span className="truncate">{windowStatusLabel[w.status]}</span>
                      </span>
                      <span className="hidden size-7 items-center justify-center rounded-full bg-muted text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:flex">
                        <ChevronRight className="size-3.5" />
                      </span>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>

          <button
            type="button"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0ea5e9]/10 px-3 py-2.5 text-sm font-semibold text-[#0369a1] transition-colors hover:bg-[#0ea5e9]/15 dark:text-[#7dd3fc]"
          >
            <List className="size-4" />
            View all invitation windows
            <ChevronRight className="ml-auto size-4 opacity-60" />
          </button>
        </article>

        {/* Eligibility */}
        <article
          className="dashboard-panel stagger-in flex h-full flex-col p-4 sm:p-5"
          style={{ animationDelay: "60ms" }}
        >
          <div className="mb-4 flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#22c55e]/12 text-[#16a34a]">
              <UserCheck className="size-5" />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold text-foreground">
                Eligibility results
              </h3>
              <p className="text-xs text-muted-foreground sm:text-sm">
                After officers check papers — who can get settlement money
              </p>
            </div>
          </div>

          <ul className="flex-1 space-y-2.5">
            {eligibilityOutcomes.map((row) => {
              const theme = eligibilityTheme[row.tone]
              const Icon = theme.Icon
              const Trend = theme.Trend
              const barWidth =
                eligibilityBarWidth[row.id as keyof typeof eligibilityBarWidth] ?? 40

              return (
                <li key={row.id}>
                  <button
                    type="button"
                    className={cn(
                      "group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl bg-card p-3 text-left ring-1 transition-all hover:bg-muted/40 hover:shadow-sm",
                      theme.card,
                    )}
                  >
                    <span
                      className={cn("absolute inset-y-0 left-0 w-1 rounded-l-2xl", theme.bar)}
                    />

                    <span
                      className={cn(
                        "ml-1.5 flex size-10 shrink-0 items-center justify-center rounded-xl",
                        theme.iconBg,
                      )}
                    >
                      <Icon className="size-4.5" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {row.label}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{row.hint}</p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn("h-full rounded-full", theme.bar)}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <p
                        className={cn(
                          "font-display text-xl font-semibold tabular-nums",
                          theme.value,
                        )}
                      >
                        {formatNumber(row.count)}
                      </p>
                      <Trend className={cn("size-3.5", theme.value)} />
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>

          <button
            type="button"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#22c55e]/10 px-3 py-2.5 text-sm font-semibold text-[#15803d] transition-colors hover:bg-[#22c55e]/15 dark:text-[#6ee7b7]"
          >
            <BarChart3 className="size-4" />
            View detailed eligibility report
            <ChevronRight className="ml-auto size-4 opacity-60" />
          </button>
        </article>

        {/* Safety checks — donut + legend */}
        <SafetyChecksChart />
      </div>
    </section>
  )
}

function SafetyChecksChart() {
  const total = safetyChecks.reduce((sum, item) => sum + item.count, 0)
  const data = safetyChecks.map((item, index) => ({
    ...item,
    color: safetyColors[index % safetyColors.length],
    percent: total > 0 ? Math.round((item.count / total) * 100) : 0,
  }))

  return (
    <article
      className="dashboard-panel stagger-in p-5 sm:p-6 lg:col-span-2"
      style={{ animationDelay: "120ms" }}
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0ea5e9]/12 text-[#0284c7]">
          <ShieldCheck className="size-5" />
        </span>
        <div>
          <h3 className="font-display text-base font-semibold text-foreground">
            Safety checks this month
          </h3>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Duplicate blocks and data problems the system caught
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8 lg:gap-12">
        <div className="relative size-[200px] shrink-0 sm:size-[220px]">
          {/* Soft depth glow behind the ring */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[18%] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(59,130,246,0.14) 0%, rgba(139,92,246,0.08) 45%, transparent 72%)",
              boxShadow: "inset 0 0 28px rgba(59,130,246,0.12)",
            }}
          />
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {data.map((item) => (
                  <linearGradient
                    key={`grad-${item.id}`}
                    id={`safety-${item.id}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={item.color} stopOpacity={1} />
                    <stop offset="100%" stopColor={item.color} stopOpacity={0.72} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={data}
                dataKey="count"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="86%"
                paddingAngle={3}
                cornerRadius={6}
                stroke="none"
                isAnimationActive
              >
                {data.map((item) => (
                  <Cell
                    key={item.id}
                    fill={`url(#safety-${item.id})`}
                    style={{
                      filter: `drop-shadow(0 2px 6px ${item.color}55)`,
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[11px] font-medium text-muted-foreground">Total</span>
            <span className="font-display text-3xl font-semibold tracking-tight text-foreground tabular-nums">
              {formatNumber(total)}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">Issues</span>
          </div>
        </div>

        <ul className="w-full min-w-0 flex-1 space-y-3">
          {data.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-2 rounded-xl bg-muted/30 px-2.5 py-2 sm:flex-row sm:items-center sm:gap-3 sm:bg-transparent sm:px-1 sm:py-0.5"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className="size-2.5 shrink-0 rounded-full ring-2 ring-white"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 0 3px ${item.color}22`,
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {item.label}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">{item.hint}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold tabular-nums text-foreground sm:hidden">
                  {formatNumber(item.count)}
                  <span className="ml-1 font-medium text-muted-foreground">
                    ({item.percent}%)
                  </span>
                </p>
              </div>
              <div className="mx-0 h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted sm:mx-1">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{
                    width: `${Math.max(item.percent, item.count > 0 ? 2 : 0)}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <p className="hidden w-28 shrink-0 text-right text-sm font-semibold tabular-nums text-foreground sm:block">
                {formatNumber(item.count)}
                <span className="ml-1 font-medium text-muted-foreground">
                  ({item.percent}%)
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
