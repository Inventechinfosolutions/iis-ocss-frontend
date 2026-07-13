import {
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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  assetRecovery,
  claimsByEntity,
  claimsOverTime,
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

const lineConfig = {
  processed: { label: "Claims finished", color: "#3b82f6" },
  submitted: { label: "New claims filed", color: "#f59e0b" },
} satisfies ChartConfig

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
            Month-wise filing, money by company, claim counts, and property sales
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
        <ChartCard
          title="New claims vs finished claims (by month)"
          subtitle="How many claims were filed and how many were completed each month"
          delay={80}
          className="h-full"
        >
          <div className="chart-scroll flex-1">
            <div className="chart-scroll-inner">
              <ChartContainer config={lineConfig} className="aspect-[16/10] w-full">
                <LineChart data={claimsOverTime} margin={{ left: 4, right: 12, top: 12, bottom: 4 }}>
                  <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="0" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={40}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="processed"
                    stroke="var(--color-processed)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#fff", stroke: "#3b82f6", strokeWidth: 2.5 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="submitted"
                    stroke="var(--color-submitted)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#fff", stroke: "#f59e0b", strokeWidth: 2.5 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Money by scam company (₹ Crore)"
          subtitle="For each company: still owed, money recovered, and already paid"
          delay={140}
          className="h-full"
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
          title="How many claims per scam company"
          subtitle="Number of victim claims filed against each company"
          delay={200}
          className="lg:col-span-2"
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

  return (
    <article
      className="dashboard-panel stagger-in p-4 sm:p-6"
      style={{ animationDelay: "260ms" }}
    >
      <div className="mb-6 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0ea5e9]/15 text-[#0284c7]">
          <Home className="size-5" />
        </span>
        <div>
          <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
            Property → money for victims
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            Seized property steps: seize → price → sell → receive cash
          </p>
        </div>
      </div>

      {/* Mobile: vertical steps */}
      <ol className="space-y-3 sm:hidden">
        {steps.map((step, index) => {
          const Icon = step.Icon
          return (
            <li
              key={step.stage}
              className="flex items-center gap-3 rounded-2xl bg-muted/40 px-3 py-3 ring-1 ring-border/50"
            >
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
                style={{ background: step.accent }}
              >
                {index + 1}
              </div>
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-xl"
                style={{ background: `${step.accent}18`, color: step.accent }}
              >
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{step.stage}</p>
                <p className="text-xs text-muted-foreground">
                  {step.count.toLocaleString("en-IN")} properties
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="funnel-bar h-full rounded-full"
                    style={{
                      width: `${step.percent}%`,
                      background: step.accent,
                      animationDelay: `${400 + index * 80}ms`,
                    }}
                  />
                </div>
              </div>
              <p
                className="shrink-0 text-xs font-semibold tabular-nums"
                style={{ color: step.accent }}
              >
                {step.percent}%
              </p>
            </li>
          )
        })}
      </ol>

      {/* Tablet+: horizontal flow */}
      <div className="hidden sm:block">
        <ol className="relative flex items-start">
          {steps.map((step, index) => {
            const Icon = step.Icon
            return (
              <li key={step.stage} className="relative flex flex-1 flex-col items-center px-2 md:px-3">
                {index < steps.length - 1 ? (
                  <div
                    className="absolute top-5 left-[calc(50%+22px)] h-0.5 w-[calc(100%-44px)]"
                    style={{
                      background: `linear-gradient(90deg, ${step.accent}, ${steps[index + 1].accent})`,
                      opacity: 0.45,
                    }}
                  />
                ) : null}

                <div
                  className="relative z-10 flex size-11 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
                  style={{ background: step.accent }}
                >
                  {index + 1}
                </div>

                <span
                  className="mt-3 flex size-9 items-center justify-center rounded-xl"
                  style={{ background: `${step.accent}18`, color: step.accent }}
                >
                  <Icon className="size-4" />
                </span>

                <p className="mt-2.5 text-center text-sm font-semibold text-foreground">
                  {step.stage}
                </p>
                <p className="mt-0.5 text-center text-xs text-muted-foreground">
                  {step.count.toLocaleString("en-IN")} properties
                </p>

                <div className="mt-3 h-1.5 w-full max-w-[120px] overflow-hidden rounded-full bg-muted">
                  <div
                    className="funnel-bar h-full rounded-full"
                    style={{
                      width: `${step.percent}%`,
                      background: step.accent,
                      animationDelay: `${400 + index * 80}ms`,
                    }}
                  />
                </div>
                <p
                  className="mt-1.5 text-xs font-semibold tabular-nums"
                  style={{ color: step.accent }}
                >
                  {step.percent}%
                </p>
              </li>
            )
          })}
        </ol>
      </div>
    </article>
  )
}
