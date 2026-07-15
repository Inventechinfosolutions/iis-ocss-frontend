import {
  BadgeCheck,
  Banknote,
  Building2,
  ClipboardCheck,
  Database,
  FileText,
  Gavel,
  LayoutDashboard,
  LineChart,
  LogOut,
  PieChart,
  Scale,
  ShieldAlert,
  Users,
  Wallet,
  X,
} from "lucide-react"
import { Link, useRouterState } from "@tanstack/react-router"
import type { NavIcon } from "@/data/dashboard-data"
import { dashboardMeta, navGroups, userMeta } from "@/data/dashboard-data"
import { cn } from "@/lib/utils"

const navIcons: Record<NavIcon, typeof LayoutDashboard> = {
  overview: LayoutDashboard,
  analytics: LineChart,
  entities: Building2,
  depositors: Users,
  claims: FileText,
  verification: BadgeCheck,
  assessment: ClipboardCheck,
  settlement: Wallet,
  payments: Banknote,
  recovery: PieChart,
  alerts: ShieldAlert,
  reports: FileText,
  audit: Gavel,
  master: Database,
}

const navRoutes: Partial<
  Record<
    string,
    "/" | "/companies" | "/victims" | "/claims" | "/assets" | "/reports"
  >
> = {
  overview: "/",
  entities: "/companies",
  depositors: "/victims",
  claims: "/claims",
  recovery: "/assets",
  reports: "/reports",
}

function pathMatches(pathname: string, to: string) {
  if (to === "/") return pathname === "/"
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col",
          "bg-[var(--navy)] text-[var(--sidebar-foreground)]",
          "border-r border-[var(--sidebar-border)]",
          "transition-transform duration-300 ease-out lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand */}
        <div className="relative overflow-hidden px-4 pt-4 pb-4">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-8 size-28 rounded-full bg-[#2563eb]/25 blur-2xl"
          />
          <div className="relative flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
              <Scale className="size-[18px] text-white" strokeWidth={2.25} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[15px] font-semibold tracking-tight text-white">
                {dashboardMeta.shortTitle}
                <span className="mx-1 text-[#93c5fd]">·</span>
                KPID
              </p>
              <p className="truncate text-[11px] text-slate-300">
                Claim Settlement System
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Close navigation"
            >
              <X className="size-5" />
            </button>
          </div>
          <p className="relative mt-3 text-[10px] font-medium tracking-wide text-slate-400">
            Karnataka · Competent Authority
          </p>
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 flex h-[3px]"
          >
            <span className="flex-1 bg-[#FF9933]" />
            <span className="flex-1 bg-white" />
            <span className="flex-1 bg-[#138808]" />
          </div>
        </div>

        {/* Nav — same navy as brand */}
        <nav className="thin-scroll flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {navGroups.map((group, gi) => (
            <div key={group.heading ?? `group-${gi}`} className="space-y-0.5">
              {group.heading ? (
                <p className="px-2.5 pb-1.5 text-[10px] font-semibold tracking-[0.14em] text-slate-500 uppercase">
                  {group.heading}
                </p>
              ) : null}
              {group.items.map((item) => {
                const Icon = navIcons[item.icon]
                const route = navRoutes[item.id]
                const isActive = route ? pathMatches(pathname, route) : false

                const content = (
                  <>
                    <Icon className="size-4 shrink-0" />
                    <span className="flex-1 truncate text-left">{item.label}</span>
                    {item.badge ? (
                      <span
                        className={cn(
                          "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                          isActive
                            ? "bg-white/15 text-white"
                            : "bg-white/[0.06] text-slate-400",
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </>
                )

                if (route) {
                  return (
                    <Link
                      key={item.id}
                      to={route}
                      data-active={isActive}
                      onClick={onClose}
                      className="nav-link w-full"
                    >
                      {content}
                    </Link>
                  )
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    data-active={isActive}
                    onClick={onClose}
                    className="nav-link w-full"
                  >
                    {content}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-white/[0.08] p-3">
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.06] px-2.5 py-2.5 ring-1 ring-white/10">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-[11px] font-bold tracking-wide text-white">
              {userMeta.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {userMeta.name}
              </p>
              <p className="truncate text-[11px] text-slate-400">
                {userMeta.role}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="nav-link mt-1.5 w-full text-slate-400 hover:text-rose-300"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
