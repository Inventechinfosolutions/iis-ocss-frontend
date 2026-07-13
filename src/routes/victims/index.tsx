import { useEffect, useMemo, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Search, Users, Wallet } from "lucide-react"
import { matchesPersonSearch, victimRecords } from "@/data/kpi-drilldown-data"
import { formatINR, formatNumber } from "@/lib/format"
import { EntityCard } from "@/components/drilldown/entity-card"
import { EntityTable } from "@/components/drilldown/entity-table"
import { FilterToolbar } from "@/components/drilldown/filter-toolbar"
import {
  getPageItems,
  getTotalPages,
  ListPagination,
} from "@/components/drilldown/list-pagination"
import {
  type EntityView,
  PageHero,
  PageShell,
  SectionCard,
  SparkStatCard,
  ViewToggle,
} from "@/components/drilldown/page-shell"

export const Route = createFileRoute("/victims/")({
  component: VictimsPage,
})

const PAGE_SIZE = 4
const accents = ["#6366f1", "#3b82f6", "#8b5cf6", "#0ea5e9", "#f59e0b", "#22c55e", "#f97316", "#f43f5e"]

const districtFilters = [
  { value: "all", label: "All" },
  ...[...new Set(victimRecords.map((v) => v.district))]
    .sort()
    .map((d) => ({
      value: d,
      label: d.replace("Bengaluru Urban", "Bengaluru"),
    })),
]

function VictimsPage() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [view, setView] = useState<EntityView>("table")
  const [page, setPage] = useState(1)

  const filtered = useMemo(
    () =>
      victimRecords.filter((v) => {
        if (filter !== "all" && v.district !== filter) return false
        return matchesPersonSearch(query, v)
      }),
    [filter, query],
  )

  useEffect(() => {
    setPage(1)
  }, [filter, query])

  useEffect(() => {
    const max = getTotalPages(filtered.length, PAGE_SIZE)
    if (page > max) setPage(max)
  }, [filtered.length, page])

  const paged = useMemo(
    () => getPageItems(filtered, page, PAGE_SIZE),
    [filtered, page],
  )

  return (
    <PageShell>
      <PageHero
        eyebrow="Depositors"
        title="Victims registered"
        description="People who lost money to scam companies. Search by name, PAN, Aadhaar, or customer ID, then open a person to see their investments and returns."
        icon={Users}
        backTo="/"
        accent="#6366f1"
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <SparkStatCard
          id="v-total"
          label="Sample records"
          value={formatNumber(victimRecords.length)}
          tone="violet"
          icon={Users}
          spark={[4, 5, 5, 6, 7, 7, 8]}
        />
        <SparkStatCard
          id="v-match"
          label="Matching now"
          value={formatNumber(filtered.length)}
          tone="blue"
          icon={Search}
          spark={[8, 7, 6, 5, 6, 7, filtered.length || 1]}
        />
        <SparkStatCard
          id="v-money"
          label="Invested (sample)"
          value={formatINR(
            victimRecords.reduce(
              (s, v) => s + v.investments.reduce((a, i) => a + i.invested, 0),
              0,
            ),
          )}
          tone="gold"
          icon={Wallet}
          spark={[40, 48, 55, 62, 70, 78, 85]}
        />
      </div>

      <SectionCard
        title="Victim list"
        description="Tap a person for full investment detail"
        toolbar={
          <FilterToolbar
            search={query}
            onSearchChange={setQuery}
            searchPlaceholder="Search users…"
            searchLabel="Search victims"
            filters={districtFilters}
            filterValue={filter}
            onFilterChange={setFilter}
            filterLabel="Filter by district"
            trailing={<ViewToggle view={view} onChange={setView} />}
          />
        }
      >
        {view === "card" ? (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paged.map((v, idx) => {
              const invested = v.investments.reduce((s, i) => s + i.invested, 0)
              const returns = v.investments.reduce((s, i) => s + i.returnsTaken, 0)
              const accent = accents[((page - 1) * PAGE_SIZE + idx) % accents.length]
              return (
                <li key={v.id}>
                  <EntityCard
                    layout="card"
                    to="/victims/$victimId"
                    params={{ victimId: v.id }}
                    accent={accent}
                    icon={Users}
                    title={v.name}
                    badge={v.district}
                    metrics={[
                      {
                        value: formatINR(returns, false),
                        label: "returns",
                        emphasize: true,
                      },
                      { value: formatINR(invested, false), label: "invested" },
                      { value: v.pan, label: "PAN" },
                      { value: v.customerId, label: "customer ID" },
                    ]}
                  />
                </li>
              )
            })}
            {filtered.length === 0 && (
              <li className="rounded-md border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground sm:col-span-2 xl:col-span-3">
                No victims match this search
              </li>
            )}
          </ul>
        ) : (
          <EntityTable
            emptyLabel="No victims match this search"
            columns={[
              { key: "district", header: "District" },
              { key: "invested", header: "Invested", align: "right" },
              { key: "returns", header: "Returns", align: "right" },
              { key: "pan", header: "PAN" },
            ]}
            rows={paged.map((v, idx) => {
              const invested = v.investments.reduce((s, i) => s + i.invested, 0)
              const returns = v.investments.reduce((s, i) => s + i.returnsTaken, 0)
              return {
                id: v.id,
                to: "/victims/$victimId" as const,
                params: { victimId: v.id },
                accent: accents[((page - 1) * PAGE_SIZE + idx) % accents.length],
                icon: Users,
                title: v.name,
                subtitle: v.customerId,
                cells: {
                  district: { value: v.district },
                  invested: { value: formatINR(invested, false) },
                  returns: {
                    value: formatINR(returns, false),
                    emphasize: true,
                  },
                  pan: { value: v.pan },
                },
              }
            })}
          />
        )}

        <ListPagination
          page={page}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onPageChange={setPage}
        />
      </SectionCard>
    </PageShell>
  )
}
