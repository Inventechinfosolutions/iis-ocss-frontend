import { createFileRoute } from '@tanstack/react-router'
import { KpiStrip } from '@/components/dashboard/kpi-strip'
import { SystemKpiSnapshot } from '@/components/dashboard/system-kpi-snapshot'
import { ClaimsFunnel } from '@/components/dashboard/claims-funnel'
import { FinancialSummary } from '@/components/dashboard/financial-summary'
import { TerritorySection } from '@/components/dashboard/territory-section'
import { ChartsSection } from '@/components/dashboard/charts-section'
import { RequirementInsights } from '@/components/dashboard/requirement-insights'
import { ReportsList } from '@/components/dashboard/reports-list'
import { AlertsWidget } from '@/components/dashboard/alerts-widget'

export const Route = createFileRoute('/')({
  component: ExecutiveDashboard,
})

function ExecutiveDashboard() {
  return (
    <main className="mx-auto w-full max-w-[1600px] min-w-0 space-y-4 overflow-x-clip px-3 pt-3 pb-24 sm:px-5 sm:pt-4 lg:px-6 lg:pb-8">
      <div id="section-overview" className="scroll-mt-20 space-y-4">
        <KpiStrip />
        <SystemKpiSnapshot />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
        <div id="section-payments" className="scroll-mt-20 h-full">
          <FinancialSummary className="h-full" />
        </div>
        <div id="section-alerts" className="scroll-mt-20 h-full">
          <AlertsWidget className="h-full" />
        </div>
      </div>

      <div id="section-map" className="scroll-mt-20">
        <TerritorySection />
      </div>

      <div id="section-claims" className="scroll-mt-20">
        <ClaimsFunnel />
      </div>

      <RequirementInsights />

      <ChartsSection />

      <ReportsList />

      <footer className="flex flex-col gap-2 border-t border-border/60 pt-6 pb-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © 2026 Online Claim Settlement System (OCSS) · Competent Authority,
          Karnataka
        </p>
        <p>Sample operational data for demonstration · Not for judicial filing</p>
      </footer>
    </main>
  )
}
