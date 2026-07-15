import {
  ArrowRight,
  BarChart3,
  Building2,
  Calendar,
  ChevronDown,
  Gavel,
  Gem,
  Home,
  Landmark,
  Lock,
  Sun,
  Tag,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import { formatINR, formatNumber, formatPercent } from "@/lib/format"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import {
  assetRecovery,
  claimsByEntity,
  fundComparison,
} from "@/data/dashboard-data"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const fundConfig = {
  liability: { label: "Still owed to victims", color: "#0ea5e9" },
  recovered: { label: "Money recovered", color: "#16a34a" },
  paid: { label: "Already paid", color: "#f59e0b" },
} satisfies ChartConfig

const companyIcons: Record<(typeof claimsByEntity)[number]["icon"], LucideIcon> = {
  gem: Gem,
  landmark: Landmark,
  building: Building2,
  sun: Sun,
  users: Users,
}

const CLAIMS_SCALE_MAX = 100_000
const CLAIMS_SCALE_TICKS = [0, 25_000, 50_000, 75_000, 100_000]

function ChartCard({
  title,
  subtitle,
  children,
  className,
  delay = 0,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <article
      className={cn("dashboard-panel stagger-in flex flex-col p-4 sm:p-6", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <BarChart3 className="size-4" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
              {title}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground ring-1 ring-border/70 transition-colors hover:bg-muted"
        >
          <Calendar className="size-3.5 text-primary" />
          This Year
          <ChevronDown className="size-3.5" />
        </button>
      </div>
      {children}
    </article>
  )
}

export function ChartsSection() {
  return (
    <section aria-labelledby="charts-heading" className="space-y-3">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-info/15 text-primary ring-1 ring-primary/20">
          <BarChart3 className="size-5" />
        </span>
        <div>
          <h2
            id="charts-heading"
            className="font-display text-lg font-semibold tracking-tight text-foreground"
          >
            Charts & trends
          </h2>
          <p className="text-sm text-muted-foreground">
            Money by company, claim counts, and property sales
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
        <ChartCard
          title="Money by scam fraudulent entity (₹ Crore)"
          subtitle="For each company: still owed, money recovered, and already paid"
          delay={140}
          className="h-full min-w-0"
        >
          <div className="chart-scroll flex-1">
            <div className="chart-scroll-inner">
              <ChartContainer config={fundConfig} className="aspect-[16/10] w-full">
                <BarChart
                  data={fundComparison}
                  margin={{ left: 4, right: 8, top: 12, bottom: 4 }}
                  barCategoryGap="28%"
                  barGap={4}
                >
                  <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="0" />
                  <XAxis
                    dataKey="entity"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={36}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="liability"
                    fill="var(--color-liability)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    dataKey="recovered"
                    fill="var(--color-recovered)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    dataKey="paid"
                    fill="var(--color-paid)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="How many claims per scam fraudulent entity"
          subtitle="Number of victim claims filed against each company"
          delay={200}
          className="h-full min-w-0"
        >
          <ClaimsByCompanyChart />
        </ChartCard>
      </div>

      <AssetRecoveryFlow />
    </section>
  )
}

function ClaimsByCompanyChart() {
  return (
    <div className="mt-1 space-y-3.5">
      {/* Mobile: stacked rows */}
      <ul className="space-y-3 sm:hidden">
        {claimsByEntity.map((item) => {
          const Icon = companyIcons[item.icon]
          const widthPct = Math.min(100, (item.claims / CLAIMS_SCALE_MAX) * 100)
          return (
            <li key={item.name} className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${item.color}1a` }}
                >
                  <Icon className="size-3.5" style={{ color: item.color }} strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-foreground">{item.name}</p>
                </div>
                <p className="shrink-0 text-[12px] font-semibold tabular-nums text-muted-foreground">
                  {item.claims.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${widthPct}%`, backgroundColor: item.color }}
                />
              </div>
            </li>
          )
        })}
      </ul>

      {/* Desktop: side-by-side bars */}
      <div className="hidden sm:block">
        <div className="flex gap-0">
          <ul className="w-40 shrink-0 space-y-3.5 md:w-48">
            {claimsByEntity.map((item) => {
              const Icon = companyIcons[item.icon]
              return (
                <li key={item.name} className="flex h-9 items-center gap-2.5 pr-3">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${item.color}1a` }}
                  >
                    <Icon className="size-4" style={{ color: item.color }} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold leading-tight text-foreground">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                      {item.claims.toLocaleString("en-IN")} claims
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="relative min-w-0 flex-1">
            <div className="relative mr-12 md:mr-14">
              <div aria-hidden className="pointer-events-none absolute inset-0">
                <div className="absolute inset-y-0 left-0 w-px bg-border" />
                {CLAIMS_SCALE_TICKS.slice(1).map((tick) => (
                  <div
                    key={tick}
                    className="absolute inset-y-0 border-l border-dashed border-border/80"
                    style={{ left: `${(tick / CLAIMS_SCALE_MAX) * 100}%` }}
                  />
                ))}
              </div>

              <ul className="relative space-y-3.5">
                {claimsByEntity.map((item) => {
                  const widthPct = Math.min(100, (item.claims / CLAIMS_SCALE_MAX) * 100)
                  return (
                    <li key={item.name} className="relative h-9">
                      <div
                        className="absolute top-1/2 left-0 h-3.5 -translate-y-1/2 rounded-full"
                        style={{
                          width: `${widthPct}%`,
                          backgroundColor: item.color,
                        }}
                      />
                      <span
                        className="absolute top-1/2 -translate-y-1/2 text-[12px] font-semibold tabular-nums text-muted-foreground"
                        style={{ left: `calc(${widthPct}% + 10px)` }}
                      >
                        {item.claims.toLocaleString("en-IN")}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-2.5 flex">
          <div className="w-40 shrink-0 md:w-48" />
          <div className="relative min-w-0 flex-1">
            <div className="relative mr-12 h-4 border-t border-border md:mr-14">
              {CLAIMS_SCALE_TICKS.map((tick) => {
                const left = `${(tick / CLAIMS_SCALE_MAX) * 100}%`
                const align =
                  tick === 0
                    ? "translate-x-0"
                    : tick === CLAIMS_SCALE_MAX
                      ? "-translate-x-full"
                      : "-translate-x-1/2"
                return (
                  <span
                    key={tick}
                    className={cn(
                      "absolute top-1.5 text-[10px] tabular-nums text-muted-foreground",
                      align,
                    )}
                    style={{ left }}
                  >
                    {tick.toLocaleString("en-IN")}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AssetRecoveryFlow() {
  const steps = [
    { ...assetRecovery[0], accent: "#0ea5e9", Icon: Lock },
    { ...assetRecovery[1], accent: "#3b82f6", Icon: Tag },
    { ...assetRecovery[2], accent: "#60a5fa", Icon: Gavel },
    { ...assetRecovery[3], accent: "#22c55e", Icon: Wallet },
  ]
  const seizedAmount = steps[0]?.amount ?? 1
  const cashReceived = steps[steps.length - 1]
  const conversion = (cashReceived.amount / seizedAmount) * 100
  const pendingAmount = seizedAmount - cashReceived.amount

  return (
    <article
      className="dashboard-panel stagger-in p-3 sm:p-6"
      style={{ animationDelay: "260ms" }}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2 sm:mb-5 sm:gap-3">
        <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#0ea5e9]/15 text-[#0284c7] ring-1 ring-[#0ea5e9]/20 sm:size-10 sm:rounded-xl">
            <Home className="size-4 sm:size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-sm font-semibold tracking-tight text-foreground sm:text-base">
              From seized property to cash
            </h3>
            <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block sm:text-sm">
              Rupee value of attached assets at each recovery step
            </p>
          </div>
        </div>
        <p className="rounded-full bg-success/10 px-2 py-1 text-[11px] text-muted-foreground ring-1 ring-success/20 sm:px-3 sm:py-1.5 sm:text-sm">
          Cash received:{" "}
          <span className="font-semibold text-success tabular-nums">
            {formatINR(cashReceived.amount)}
          </span>{" "}
          ({formatPercent(conversion)} of seized)
        </p>
      </div>

      <ol className="space-y-2 sm:space-y-3">
        {steps.map((step, index) => {
          const Icon = step.Icon
          const prev = steps[index - 1]
          const droppedAmount = prev ? prev.amount - step.amount : 0
          const stepThrough = prev ? (step.amount / prev.amount) * 100 : 100
          const labelInside = step.percent >= 28

          return (
            <li key={step.stage} className="space-y-1 sm:space-y-2">
              <div className="flex items-start gap-2 sm:gap-3">
                <span
                  className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg sm:size-8 sm:rounded-xl"
                  style={{ background: `${step.accent}18`, color: step.accent }}
                >
                  <Icon className="size-3.5 sm:size-4" strokeWidth={2} />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-foreground sm:text-sm">
                        <span className="mr-1 text-muted-foreground tabular-nums sm:mr-1.5">
                          {index + 1}.
                        </span>
                        {step.stage}
                      </p>
                      <p className="mt-0.5 hidden text-[11px] text-muted-foreground sm:block">
                        {step.detail}
                        <span className="text-muted-foreground/80">
                          {" "}
                          · {formatNumber(step.count)} properties
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="text-[13px] font-semibold tabular-nums text-foreground sm:text-sm">
                        {formatINR(step.amount)}
                      </span>
                      <span
                        className="text-[11px] font-semibold tabular-nums sm:text-xs"
                        style={{ color: step.accent }}
                      >
                        {formatPercent(step.percent)} of seized
                      </span>
                      {droppedAmount > 0 ? (
                        <span className="hidden items-center gap-0.5 text-[11px] font-medium text-muted-foreground tabular-nums sm:inline-flex">
                          <ArrowRight className="size-3" />
                          {formatINR(droppedAmount)} not moved yet
                          <span className="text-muted-foreground/80">
                            ({formatPercent(stepThrough)} moved)
                          </span>
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative h-7 overflow-hidden rounded-lg bg-muted/60 ring-1 ring-border/50 sm:h-11 sm:rounded-xl">
                <div
                  className="funnel-bar absolute inset-y-0 left-0 flex items-center justify-end rounded-lg px-2 sm:rounded-xl sm:px-3"
                  style={{
                    width: `${Math.max(step.percent, 4)}%`,
                    background: `linear-gradient(90deg, color-mix(in srgb, ${step.accent} 18%, transparent), color-mix(in srgb, ${step.accent} 45%, transparent))`,
                    borderRight: `2px solid color-mix(in srgb, ${step.accent} 70%, transparent)`,
                    animationDelay: `${index * 70}ms`,
                  }}
                >
                  {labelInside ? (
                    <span className="hidden text-sm font-semibold text-foreground tabular-nums sm:inline">
                      {formatINR(step.amount)}
                    </span>
                  ) : null}
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-3 overflow-hidden rounded-lg bg-[#ecfdf5] ring-1 ring-[#22c55e]/20 sm:mt-4 sm:rounded-xl dark:bg-[#22c55e]/10">
        <p className="animate-marquee whitespace-nowrap py-2 text-[11px] leading-relaxed text-[#166534] sm:py-2.5 sm:text-xs dark:text-[#86efac]">
          <span className="inline-block px-3">
            Of {formatINR(seizedAmount)} in seized assets,{" "}
            <span className="font-semibold tabular-nums">
              {formatINR(cashReceived.amount)}
            </span>{" "}
            sale money has been received. {formatINR(pendingAmount)} is still waiting at
            valuation, auction, or payment collection.
          </span>
          <span className="inline-block px-3" aria-hidden>
            Of {formatINR(seizedAmount)} in seized assets,{" "}
            <span className="font-semibold tabular-nums">
              {formatINR(cashReceived.amount)}
            </span>{" "}
            sale money has been received. {formatINR(pendingAmount)} is still waiting at
            valuation, auction, or payment collection.
          </span>
        </p>
      </div>
    </article>
  )
}
