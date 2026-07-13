import { Bell, Menu } from "lucide-react"
import { dashboardMeta, userMeta } from "@/data/dashboard-data"
import { GlobalSearch } from "@/components/dashboard/global-search"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"

function WaveHand({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="origin-[70%_70%] animate-[wave-hand_1.6s_ease-in-out_infinite]">
        <path
          fill="#F5D0A9"
          d="M7.5 17.2c-.4-1.8.7-3.5 2.5-3.9l1.1-.3.4-4.2c.2-1.8 1.8-3.1 3.6-2.9 1 .1 1.8.7 2.3 1.5.5-1.2 1.8-2 3.2-1.8 1.5.2 2.6 1.5 2.6 3v.5c.6-.7 1.6-1.1 2.6-.9 1.6.3 2.6 1.8 2.4 3.4l-.8 7.1c-.4 3.4-2.6 6.3-5.8 7.5l-1.4.5c-3.5 1.3-7.4.3-9.6-2.5L7.5 17.2z"
        />
        <path
          fill="#E8B98A"
          d="M14.2 8.9c.1-.9.9-1.6 1.8-1.5.7.1 1.2.6 1.4 1.2l.5 4.8-2.1-.4-.6-4.1zm4.7-.2c.1-.8.8-1.4 1.6-1.3.8.1 1.3.8 1.2 1.6l-.2 1.9-2.1-.3-.5-1.9zm4.1 1.1c.2-.8.9-1.3 1.7-1.1.7.2 1.2.9 1 1.6l-.5 2.4-2.1-.4.1-2.5z"
          opacity="0.55"
        />
        <circle cx="11.2" cy="14.6" r="1.1" fill="#E8B98A" />
      </g>
    </svg>
  )
}

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const greeting = greetingForHour(new Date().getHours())

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-white/80 backdrop-blur-xl dark:bg-[color-mix(in_srgb,var(--background)_80%,transparent)]">
      <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 sm:gap-2.5 sm:px-5 lg:flex-nowrap lg:px-6">
        <button
          type="button"
          onClick={onMenu}
          className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 lg:hidden dark:bg-muted dark:text-muted-foreground"
          aria-label="Open navigation"
        >
          <Menu className="size-4.5" />
        </button>

        <div className="min-w-0 flex-1 lg:max-w-xs xl:max-w-sm">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <WaveHand className="size-7 shrink-0 sm:size-9" />
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold tracking-tight text-foreground sm:text-lg">
                {greeting}, <span className="text-primary">{userMeta.name}</span>
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                Welcome back · {userMeta.role}
              </p>
            </div>
          </div>
        </div>

        <div className="order-last w-full min-w-0 basis-full lg:order-none lg:mx-2 lg:w-auto lg:flex-1 lg:basis-auto">
          <GlobalSearch />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            className="relative flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-blue-50 hover:text-primary dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted"
            aria-label="Notifications"
          >
            <Bell className="size-4.5" />
            <span className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
              5
            </span>
          </button>

          <ThemeToggle />

          <div className="flex items-center gap-2 rounded-xl bg-slate-50 py-1 pl-1 pr-1 sm:pr-2.5 dark:bg-muted/50">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
              {userMeta.initials}
            </div>
            <div className="hidden leading-tight md:block">
              <p className="text-xs font-semibold text-foreground">{userMeta.name}</p>
              <p className="text-[10px] text-muted-foreground">{userMeta.role}</p>
            </div>
          </div>
        </div>
      </div>
      <p className="sr-only">{dashboardMeta.title}</p>
    </header>
  )
}
