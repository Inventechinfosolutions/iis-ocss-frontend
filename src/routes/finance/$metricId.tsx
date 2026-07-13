import { useMemo, useState } from "react"
import { createFileRoute, Link, notFound } from "@tanstack/react-router"
import {
  BadgeCheck,
  Building2,
  Clock3,
  HandCoins,
  Percent,
  Wallet,
} from "lucide-react"
import { ExecutiveMetricTile } from "@/components/drilldown/companies-executive-panel"
import { FilterToolbar } from "@/components/drilldown/filter-toolbar"
import {
  PageHero,
  PageShell,
  SectionCard,
} from "@/components/drilldown/page-shell"
import {
  ReportDisclaimer,
  ReportMeta,
  ReportSectionIntro,
} from "@/components/drilldown/report-shell"
import {
  financeMetricIds,
  getFinanceMetricDetail,
  type FinanceMetricId,
} from "@/data/finance-drilldown-data"
import { formatINR } from "@/lib/format"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/finance/$metricId")({
  component: FinanceMetricDetailPage,
})

const metricIcons = {
  "available-fund": Wallet,
  "approved-liability": BadgeCheck,
  "previous-returns": HandCoins,
  "net-payable": Clock3,
  "equitable-ratio": Percent,
} as const

function FinanceMetricDetailPage() {
  const { metricId } = Route.useParams()
  const detail = getFinanceMetricDetail(metricId)
  if (!detail) throw notFound()

  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")

  const Icon = metricIcons[metricId as FinanceMetricId] ?? Wallet

  const filters = useMemo(
    () => [
      { value: "all", label: "All companies" },
      ...detail.rows.map((r) => ({
        value: r.id,
        label: r.title.split(" ")[0] ?? r.title,
      })),
    ],
    [detail.rows],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return detail.rows.filter((r) => {
      if (filter !== "all" && r.id !== filter) return false
      if (!q) return true
      return (
        r.title.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q)
      )
    })
  }, [detail.rows, filter, query])

  const displayValue =
    detail.metric.format === "percent"
      ? `${detail.metric.value}%`
      : formatINR(detail.metric.value)

  return (
    <PageShell className="space-y-5 sm:space-y-6">
      <PageHero
        eyebrow={detail.eyebrow}
        title={detail.metric.label}
        description={detail.description}
        icon={Icon}
        backTo="/"
        backLabel="Back to overview"
        accent={detail.accent}
      />

      <ReportMeta label="Money available detail" accent={detail.accent} />

      <div
        className="stagger-in relative overflow-hidden rounded-md border border-black/[0.05] p-4 sm:p-5 dark:border-white/[0.08]"
        style={{
          background: `linear-gradient(135deg, ${detail.soft} 0%, transparent 62%)`,
        }}
      >
        <p className="text-[10px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
          Headline figure
        </p>
        <p
          className="mt-1.5 font-display text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl"
          style={{ color: detail.accent }}
        >
          {displayValue}
        </p>
        <div className="mt-3 h-2 max-w-md overflow-hidden rounded-full bg-white/70 dark:bg-white/10">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.max(detail.metric.barPercent, 8)}%`,
              background: detail.accent,
            }}
          />
        </div>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {detail.highlights.map((h, i) => (
          <ExecutiveMetricTile
            key={h.label}
            label={h.label}
            value={h.value}
            hint={h.hint}
            icon={Icon}
            color={h.color}
            soft={h.soft}
            style={{ animationDelay: `${i * 55}ms` }}
          />
        ))}
      </ul>

      <SectionCard className="stagger-in">
        <div className="mb-5 flex flex-col gap-4 border-b border-border/50 pb-4 lg:flex-row lg:items-end lg:justify-between">
          <ReportSectionIntro
            title={detail.sectionTitle}
            countLabel={`${filtered.length} rows`}
            description={detail.sectionHint}
            accent={detail.accent}
            soft={detail.soft}
          />
          <FilterToolbar
            search={query}
            onSearchChange={setQuery}
            searchPlaceholder="Search companies…"
            searchLabel="Search companies"
            filters={filters}
            filterValue={filter}
            onFilterChange={setFilter}
            filterLabel="Filter companies"
          />
        </div>

        <ul className="space-y-3">
          {filtered.map((r, i) => {
            const body = (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-md text-white"
                      style={{
                        background: `linear-gradient(145deg, ${r.accent}, ${r.accent}cc)`,
                      }}
                    >
                      <Building2 className="size-5" strokeWidth={1.9} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm font-semibold text-foreground">
                        {r.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {r.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
                      {r.primaryLabel}
                    </p>
                    <p
                      className="mt-0.5 font-display text-lg font-semibold tabular-nums"
                      style={{ color: r.accent }}
                    >
                      {r.primary}
                    </p>
                  </div>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted/70 dark:bg-white/[0.06]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(Math.min(r.barPercent, 100), 4)}%`,
                      background: r.accent,
                    }}
                  />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <div className="rounded-md bg-muted/40 px-2.5 py-2 dark:bg-white/[0.04]">
                    <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                      {r.secondaryLabel}
                    </p>
                    <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">
                      {r.secondary}
                    </p>
                  </div>
                  {r.tertiary != null && (
                    <div className="rounded-md bg-muted/40 px-2.5 py-2 dark:bg-white/[0.04]">
                      <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                        {r.tertiaryLabel}
                      </p>
                      <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">
                        {r.tertiary}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )

            return (
              <li
                key={r.id}
                className="stagger-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {r.companyId ? (
                  <Link
                    to="/companies/$companyId"
                    params={{ companyId: r.companyId }}
                    className={cn(
                      "block rounded-md border border-black/[0.05] bg-white p-3.5 transition-all",
                      "hover:border-sky-300/50 hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
                      "dark:border-white/[0.08] dark:bg-[#141c2c]",
                    )}
                  >
                    {body}
                  </Link>
                ) : (
                  <div className="rounded-md border border-black/[0.05] bg-white p-3.5 dark:border-white/[0.08] dark:bg-[#141c2c]">
                    {body}
                  </div>
                )}
              </li>
            )
          })}
          {filtered.length === 0 && (
            <li className="rounded-md border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
              No rows match this search
            </li>
          )}
        </ul>
      </SectionCard>

      <div className="flex flex-wrap gap-2">
        {financeMetricIds.map((id) => {
          const m = getFinanceMetricDetail(id)?.metric
          if (!m) return null
          const active = id === metricId
          return (
            <Link
              key={id}
              to="/finance/$metricId"
              params={{ metricId: id }}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                active
                  ? "text-white"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              style={active ? { background: detail.accent } : undefined}
            >
              {m.label.split(" ").slice(0, 3).join(" ")}
              {m.label.split(" ").length > 3 ? "…" : ""}
            </Link>
          )
        })}
      </div>

      <ReportDisclaimer />
    </PageShell>
  )
}
