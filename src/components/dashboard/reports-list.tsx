import {
  BarChart3,
  Building2,
  ChevronRight,
  ClipboardCheck,
  Landmark,
  Scale,
  UserRound,
  Wallet,
} from "lucide-react"
import { reports } from "@/data/dashboard-data"
import { cn } from "@/lib/utils"

const reportThemes = {
  building: {
    accent: "#0ea5e9",
    iconBg: "bg-[#0ea5e9]",
    Icon: Building2,
    Art: BuildingArt,
  },
  user: {
    accent: "#3b82f6",
    iconBg: "bg-[#3b82f6]",
    Icon: UserRound,
    Art: IdCardArt,
  },
  clipboard: {
    accent: "#22c55e",
    iconBg: "bg-[#22c55e]",
    Icon: ClipboardCheck,
    Art: ClipboardArt,
  },
  wallet: {
    accent: "#f59e0b",
    iconBg: "bg-[#f59e0b]",
    Icon: Wallet,
    Art: CoinsArt,
  },
  bank: {
    accent: "#0ea5e9",
    iconBg: "bg-[#0ea5e9]",
    Icon: Landmark,
    Art: BankArt,
  },
  scale: {
    accent: "#f43f5e",
    iconBg: "bg-[#f43f5e]",
    Icon: Scale,
    Art: ScaleArt,
  },
} as const

function Glow({ color }: { color: string }) {
  return (
    <ellipse
      cx="70"
      cy="78"
      rx="34"
      ry="10"
      fill={color}
      opacity="0.18"
    />
  )
}

function BuildingArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden>
      <Glow color="#0ea5e9" />
      <rect x="58" y="28" width="28" height="50" rx="4" fill="#38bdf8" />
      <rect x="36" y="40" width="24" height="38" rx="3" fill="#0ea5e9" />
      <rect x="78" y="46" width="20" height="32" rx="3" fill="#0284c7" />
      <rect x="42" y="48" width="4" height="5" rx="1" fill="#ede9fe" opacity="0.9" />
      <rect x="50" y="48" width="4" height="5" rx="1" fill="#ede9fe" opacity="0.9" />
      <rect x="42" y="58" width="4" height="5" rx="1" fill="#ede9fe" opacity="0.7" />
      <rect x="50" y="58" width="4" height="5" rx="1" fill="#ede9fe" opacity="0.7" />
      <rect x="64" y="36" width="5" height="6" rx="1" fill="#ede9fe" opacity="0.95" />
      <rect x="74" y="36" width="5" height="6" rx="1" fill="#ede9fe" opacity="0.95" />
      <rect x="64" y="48" width="5" height="6" rx="1" fill="#ede9fe" opacity="0.8" />
      <rect x="74" y="48" width="5" height="6" rx="1" fill="#ede9fe" opacity="0.8" />
      <rect x="64" y="60" width="5" height="6" rx="1" fill="#ede9fe" opacity="0.65" />
      <rect x="74" y="60" width="5" height="6" rx="1" fill="#ede9fe" opacity="0.65" />
      <rect x="84" y="54" width="4" height="5" rx="1" fill="#ede9fe" opacity="0.8" />
      <rect x="90" y="54" width="4" height="5" rx="1" fill="#ede9fe" opacity="0.8" />
      <rect x="44" y="70" width="8" height="8" rx="1.5" fill="#ede9fe" />
    </svg>
  )
}

function IdCardArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden>
      <Glow color="#3b82f6" />
      <rect
        x="38"
        y="30"
        width="58"
        height="40"
        rx="8"
        fill="#93c5fd"
        transform="rotate(-8 67 50)"
      />
      <rect
        x="40"
        y="32"
        width="54"
        height="36"
        rx="7"
        fill="#3b82f6"
        transform="rotate(-8 67 50)"
      />
      <circle cx="54" cy="48" r="6" fill="#dbeafe" transform="rotate(-8 67 50)" />
      <rect x="64" y="43" width="20" height="3" rx="1.5" fill="#dbeafe" opacity="0.9" transform="rotate(-8 67 50)" />
      <rect x="64" y="50" width="14" height="3" rx="1.5" fill="#dbeafe" opacity="0.65" transform="rotate(-8 67 50)" />
    </svg>
  )
}

function ClipboardArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden>
      <Glow color="#22c55e" />
      <rect x="48" y="26" width="36" height="48" rx="6" fill="#34d399" />
      <rect x="52" y="34" width="28" height="36" rx="3" fill="#ecfdf5" />
      <rect x="56" y="22" width="20" height="8" rx="3" fill="#16a34a" />
      <path d="M58 44h4.5l1.5 1.5 4-4" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M58 54h4.5l1.5 1.5 4-4" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M58 64h4.5l1.5 1.5 4-4" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function CoinsArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden>
      <Glow color="#f59e0b" />
      <ellipse cx="72" cy="68" rx="22" ry="7" fill="#f59e0b" opacity="0.35" />
      <ellipse cx="72" cy="58" rx="20" ry="8" fill="#f59e0b" />
      <ellipse cx="72" cy="54" rx="20" ry="8" fill="#fbbf24" />
      <ellipse cx="72" cy="50" rx="20" ry="8" fill="#f59e0b" />
      <ellipse cx="72" cy="46" rx="20" ry="8" fill="#fcd34d" />
      <text
        x="72"
        y="49"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#d97706"
        fontFamily="system-ui,sans-serif"
      >
        ₹
      </text>
      <ellipse cx="52" cy="62" rx="12" ry="5" fill="#f59e0b" opacity="0.85" />
      <ellipse cx="52" cy="59" rx="12" ry="5" fill="#fbbf24" opacity="0.9" />
    </svg>
  )
}

function BankArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden>
      <Glow color="#0ea5e9" />
      <polygon points="66,24 90,38 42,38" fill="#38bdf8" />
      <rect x="46" y="38" width="40" height="8" rx="1" fill="#0ea5e9" />
      <rect x="50" y="48" width="5" height="22" rx="1" fill="#7dd3fc" />
      <rect x="60" y="48" width="5" height="22" rx="1" fill="#7dd3fc" />
      <rect x="70" y="48" width="5" height="22" rx="1" fill="#7dd3fc" />
      <rect x="80" y="48" width="5" height="22" rx="1" fill="#7dd3fc" />
      <rect x="44" y="70" width="44" height="6" rx="2" fill="#0ea5e9" />
    </svg>
  )
}

function ScaleArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden>
      <Glow color="#f43f5e" />
      <rect x="64" y="28" width="4" height="42" rx="2" fill="#fb7185" />
      <rect x="56" y="26" width="20" height="5" rx="2.5" fill="#f43f5e" />
      <line x1="46" y1="36" x2="86" y2="36" stroke="#fb7185" strokeWidth="3" strokeLinecap="round" />
      <path d="M46 36 L38 52 Q46 58 54 52 Z" fill="#fda4af" stroke="#f43f5e" strokeWidth="1.5" />
      <path d="M86 36 L78 52 Q86 58 94 52 Z" fill="#fda4af" stroke="#f43f5e" strokeWidth="1.5" />
      <rect x="58" y="68" width="16" height="4" rx="2" fill="#f43f5e" />
    </svg>
  )
}

export function ReportsList() {
  return (
    <section aria-labelledby="reports-heading" className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#1d4ed8] text-white shadow-md shadow-primary/25">
          <BarChart3 className="size-5" />
        </span>
        <div>
          <h2
            id="reports-heading"
            className="font-display text-lg font-semibold tracking-tight text-foreground"
          >
            Detailed reports
          </h2>
          <p className="text-sm text-muted-foreground">
            Open full reports for government, courts, and audit teams
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reports.map((report, index) => {
          const theme = reportThemes[report.icon]
          const Icon = theme.Icon
          const Art = theme.Art

          return (
            <a
              key={report.id}
              href={report.href}
              className={cn(
                "group relative flex min-h-[150px] flex-col overflow-hidden rounded-2xl bg-card p-4",
                "shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_12px_32px_rgba(12,25,41,0.06)] border border-border/70",
                "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(12,25,41,0.1)] hover:border-primary/25",
              )}
              style={{ animationDelay: `${240 + index * 40}ms` }}
            >
              <Art className="pointer-events-none absolute -right-1 top-2 h-[96px] w-[120px] transition-transform duration-500 group-hover:scale-105" />

              <div className="relative flex items-start gap-3 pr-16">
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full text-white shadow-sm",
                    theme.iconBg,
                  )}
                >
                  <Icon className="size-4" strokeWidth={2.25} />
                </span>
                <div className="min-w-0 pt-0.5">
                  <h3 className="text-sm font-semibold leading-snug text-foreground">
                    {report.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {report.description}
                  </p>
                </div>
              </div>

              <div className="relative mt-auto flex items-center justify-between gap-2 pt-5">
                <span
                  className="text-[11px] font-semibold tracking-wide uppercase"
                  style={{ color: theme.accent }}
                >
                  Open report →
                </span>
                <span
                  className="flex size-8 items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5"
                  style={{ background: `${theme.accent}14`, color: theme.accent }}
                >
                  <ChevronRight className="size-4" />
                </span>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
