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
import { useState } from "react"
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

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [active, setActive] = useState("overview")

  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col bg-[var(--sidebar)] text-[var(--sidebar-foreground)]",
          "border-r border-[var(--sidebar-border)] transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 border-b border-[var(--sidebar-border)] px-3.5 py-3.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#3b82f6] shadow-lg shadow-blue-500/30">
            <Scale className="size-4.5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-semibold text-white">
              {dashboardMeta.shortTitle}{" "}
              <span className="text-[#60a5fa]">·</span> KPID
            </p>
            <p className="truncate text-[10px] text-[var(--sidebar-foreground)]/60">
              Tracking &amp; Settlement System
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[var(--sidebar-foreground)]/70 hover:bg-white/10 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="thin-scroll flex-1 space-y-4 overflow-y-auto px-2.5 py-3.5">
          {navGroups.map((group, gi) => (
            <div key={group.heading ?? `group-${gi}`} className="space-y-0.5">
              {group.heading ? (
                <p className="px-2.5 pb-1 text-[9px] font-semibold tracking-widest text-[var(--sidebar-foreground)]/40 uppercase">
                  {group.heading}
                </p>
              ) : null}
              {group.items.map((item) => {
                const Icon = navIcons[item.icon]
                const isActive = active === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-active={isActive}
                    onClick={() => {
                      setActive(item.id)
                      onClose()
                    }}
                    className="nav-link w-full"
                  >
                    <Icon className="size-4.5 shrink-0" />
                    <span className="flex-1 truncate text-left">{item.label}</span>
                    {item.badge ? (
                      <span
                        className={cn(
                          "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-white/8 text-[var(--sidebar-foreground)]/60",
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-[var(--sidebar-border)] p-3">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#3b82f6] text-xs font-bold text-white">
              {userMeta.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{userMeta.name}</p>
              <p className="truncate text-[11px] text-[var(--sidebar-foreground)]/55">
                {userMeta.role}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="nav-link mt-1 w-full text-[var(--sidebar-foreground)]/70 hover:text-[#f0616e]"
          >
            <LogOut className="size-4.5" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
