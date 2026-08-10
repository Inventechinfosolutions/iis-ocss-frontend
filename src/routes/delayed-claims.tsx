import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  FileText,
  Loader2,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  PageHero,
  PageShell,
  SectionCard,
} from "@/components/drilldown/page-shell"
import {
  buildScanPreviewPages,
  revokeScanPreviewPages,
} from "@/features/delayed-claims/buildScanPreview"
import {
  DocumentScanPreview,
  type ScanPreviewPage,
} from "@/features/delayed-claims/DocumentScanPreview"
import { createEmptyDelayedClaimValues } from "@/features/delayed-claims/extractFields"
import { isBilingualFieldId } from "@/features/delayed-claims/bilingualFields"
import { useDelayedClaimAutoFill } from "@/features/delayed-claims/useDelayedClaimAutoFill"
import type { FormLanguage } from "@/features/delayed-claims/types"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/delayed-claims")({
  component: DelayedClaimsPage,
})

const competentAuthorities = [
  "Competent Authority, Bengaluru",
  "Competent Authority, Mysuru",
  "Competent Authority, Belagavi",
  "Competent Authority, Kalaburagi",
]

const financialEstablishments = [
  "IMA Jewels",
  "IMA Healthcare",
  "Redington India",
  "Lancer Finance",
  "Other fraudulent entity",
]

type FieldProps = {
  label: string
  name: string
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  className?: string
}

function FormField({
  label,
  name,
  value,
  onValueChange,
  placeholder,
  type = "text",
  required,
  className,
}: FieldProps) {
  return (
    <label className={cn("grid min-w-0 gap-1.5", className)}>
      <span className="text-xs font-medium text-foreground">
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </span>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className="h-9 rounded-md bg-background"
      />
    </label>
  )
}

function SelectField({
  label,
  name,
  value,
  onValueChange,
  placeholder,
  options,
  required,
  className,
}: {
  label: string
  name: string
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  options: string[]
  required?: boolean
  className?: string
}) {
  return (
    <label className={cn("grid min-w-0 gap-1.5", className)}>
      <span className="text-xs font-medium text-foreground">
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </span>
      <select
        id={name}
        name={name}
        required={required}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/20 dark:bg-input/30"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function FileField({
  label,
  name,
  accept = "image/*,.pdf",
}: {
  label: string
  name: string
  accept?: string
}) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="text-xs font-medium text-foreground">{label}</span>
      <span className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted/40 dark:bg-input/30">
        <Upload className="size-3.5" />
        <span>Choose file</span>
        <input name={name} type="file" accept={accept} className="sr-only" />
      </span>
    </label>
  )
}

function FormSection({
  number,
  title,
  children,
}: {
  number?: number
  title: string
  children: ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-md border border-black/[0.05] bg-muted/20 dark:border-white/[0.08] dark:bg-white/[0.025]">
      <div className="flex items-center gap-3 border-b border-border/60 bg-background/70 px-4 py-3 dark:bg-white/[0.025] sm:px-5">
        {number != null ? (
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            {number}
          </span>
        ) : null}
        <h2 className="font-display text-sm font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">{children}</div>
    </section>
  )
}

function DepositTransactionTable({
  prefix,
  getValue,
  setValue,
}: {
  prefix: string
  getValue: (id: string) => string
  setValue: (id: string, value: string) => void
}) {
  return (
    <div className="sm:col-span-2">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-y-1 text-left">
          <thead>
            <tr className="text-[10px] font-semibold text-muted-foreground uppercase">
              <th className="w-10 px-1.5 py-1">Sl. No.</th>
              <th className="w-32 px-1.5 py-1">Date</th>
              <th className="px-1.5 py-1">Deposit (Rs)</th>
              <th className="px-1.5 py-1">
                CASH / NEFT / RTGS / IMPS / Cheque No.
              </th>
              <th className="px-1.5 py-1">Total Deposit (Rs)</th>
              <th className="px-1.5 py-1">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }, (_, index) => {
              const n = index + 1
              const dateId = `${prefix}Date${n}`
              const depositId = `${prefix}Deposit${n}`
              const referenceId = `${prefix}Reference${n}`
              const totalId = `${prefix}Total${n}`
              const remarksId = `${prefix}Remarks${n}`

              return (
                <tr key={n}>
                  <td className="px-1.5 text-center text-xs text-muted-foreground">
                    {n}
                  </td>
                  <td className="px-1">
                    <Input
                      id={dateId}
                      name={dateId}
                      type="date"
                      value={getValue(dateId)}
                      onChange={(event) => setValue(dateId, event.target.value)}
                      aria-label={`Transaction ${n} date`}
                      className="h-8 rounded-md bg-background text-xs"
                    />
                  </td>
                  <td className="px-1">
                    <Input
                      id={depositId}
                      name={depositId}
                      type="number"
                      min="0"
                      placeholder="Amount"
                      value={getValue(depositId)}
                      onChange={(event) =>
                        setValue(depositId, event.target.value)
                      }
                      aria-label={`Transaction ${n} deposit`}
                      className="h-8 rounded-md bg-background text-xs"
                    />
                  </td>
                  <td className="px-1">
                    <Input
                      id={referenceId}
                      name={referenceId}
                      placeholder="Reference / cheque no."
                      value={getValue(referenceId)}
                      onChange={(event) =>
                        setValue(referenceId, event.target.value)
                      }
                      aria-label={`Transaction ${n} reference`}
                      className="h-8 rounded-md bg-background text-xs"
                    />
                  </td>
                  <td className="px-1">
                    <Input
                      id={totalId}
                      name={totalId}
                      type="number"
                      min="0"
                      placeholder="Total"
                      value={getValue(totalId)}
                      onChange={(event) =>
                        setValue(totalId, event.target.value)
                      }
                      aria-label={`Transaction ${n} total`}
                      className="h-8 rounded-md bg-background text-xs"
                    />
                  </td>
                  <td className="px-1">
                    <Input
                      id={remarksId}
                      name={remarksId}
                      placeholder="Remarks"
                      value={getValue(remarksId)}
                      onChange={(event) =>
                        setValue(remarksId, event.target.value)
                      }
                      aria-label={`Transaction ${n} remarks`}
                      className="h-8 rounded-md bg-background text-xs"
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ApplicantInstructions({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="!fixed !top-1/2 !left-1/2 flex max-h-[90svh] !w-[calc(100vw-2rem)] !max-w-[960px] -translate-x-1/2 -translate-y-1/2 flex-col gap-0 overflow-hidden rounded-2xl border border-border/70 bg-background p-0 text-foreground shadow-2xl sm:!max-w-[960px] lg:!left-[calc((100vw+var(--app-sidebar-width))/2)] lg:!w-[calc(100vw-var(--app-sidebar-width)-2rem)]"
      >
        <DialogHeader className="shrink-0 border-b border-border/70 px-5 py-4 sm:px-7">
          <DialogTitle className="pr-8 text-base font-bold tracking-wide text-foreground uppercase sm:text-lg">
            Instructions to applicants
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 text-[13px] leading-relaxed text-foreground sm:px-7 sm:py-6 sm:text-sm">
          <div className="space-y-4">
            <p>
              <strong>FORM:</strong> For manual submission, the applicant must
              produce depositor identity proof (Aadhaar, PAN, or Driving Licence),
              the bond or agreement with the fraudulent entity, and a Power of
              Attorney where an authorised agent is filing the claim. The mobile
              number and full postal address with PIN code of the depositor,
              nominee, or Power of Attorney holder must be entered in the Form
              Issue Register along with the serial number and unique form number.
            </p>
            <p>
              <strong>TOKEN:</strong> When submitting the claim, obtain a token
              showing the counter number, serial number, and reporting time, and
              sign the Token Register. The unique form number on the token will
              be used for digitisation, tracking, queries, and communication.
            </p>
            <p>
              <strong>SUBMISSION:</strong> Present the token counterfoil when
              called by the concerned counter and submit it with all claim
              documents. A token cannot be carried forward to another date unless
              it is signed and returned by the counter clerk. After examination,
              an acknowledgement stating whether the claim is accepted, rejected,
              or requires additional documents will be issued. The claimant must
              sign the acknowledgement and retain their copy.
            </p>
            <p>
              <strong>SIGNATURE:</strong> Documents must be signed by the
              depositor. For a minor or deceased depositor, the parent, guardian,
              nominee, legal heir, or duly authorised Power of Attorney holder
              may sign, as applicable.
            </p>
            <p>
              <strong>PRODUCING DOCUMENTS:</strong> Bonds, agreements, notarised
              affidavits, and statutory documents must be produced in original.
              Where copies are permitted, submit clear, signed, and attested
              photocopies of every page, or produce the original with a photocopy
              for attestation by the concerned officer. Scanned or WhatsApp
              copies are not accepted.
            </p>
            <p>
              <strong>NUMBER OF CLAIMS:</strong> A separate claim must be
              submitted for each Customer or Client ID shown in the bond or
              agreement. Multiple, bundled, family, or group claims cannot be
              submitted under one token.
            </p>

            <div>
              <p className="font-semibold">NOTE 1: Special procedure</p>
              <p className="mt-2">
                Claim applications will ordinarily be received on a first-come,
                first-served basis. Priority may be given in the following order:
              </p>
              <ol className="mt-1 list-decimal space-y-0.5 pl-5">
                <li>Senior citizens aged 60 years and above.</li>
                <li>Women carrying an infant.</li>
                <li>Persons with disabilities or infirmity.</li>
                <li>Women applicants.</li>
                <li>
                  Medically unfit applicants with a recent medical certificate.
                </li>
              </ol>
              <p className="mt-3">
                Claims should be submitted by the depositor. The following
                persons may submit a claim where the depositor cannot do so:
              </p>
              <ol className="mt-1 list-[lower-roman] space-y-0.5 pl-5">
                <li>
                  A nominee, legal heir, spouse, parent, or child due to the
                  depositor’s illness, disability, or death.
                </li>
                <li>
                  An extended family member where the immediate family is
                  unavailable, subject to an authorisation or death certificate,
                  as applicable.
                </li>
                <li>A parent or legal guardian on behalf of a minor.</li>
                <li>
                  A Power of Attorney holder duly authorised for this purpose.
                </li>
              </ol>
            </div>

            <div>
              <p className="font-semibold">
                NOTE 2: Filing by nominee, legal heir, or Power of Attorney
                holder
              </p>
              <p className="mt-2">
                A depositor or nominee who is outside the State or country,
                hospitalised, medically infirm, or otherwise unable to file may
                submit the claim through a legal heir or Power of Attorney holder.
                The representative must provide valid identity and authority
                documents. In the case of a deceased depositor, a death
                certificate, family tree issued by the competent authority, and
                consent from other legal heirs must be produced wherever
                applicable.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="mx-0 mb-0 shrink-0 rounded-none border-t border-border/70 bg-background px-5 py-4 sm:justify-end sm:px-7">
          <DialogClose render={<Button className="min-w-28 shadow-sm" />}>
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DelayedClaimForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [step, setStep] = useState<1 | 2>(1)
  const [valuesEn, setValuesEn] = useState(createEmptyDelayedClaimValues)
  const [valuesKn, setValuesKn] = useState(createEmptyDelayedClaimValues)
  const [language, setLanguage] = useState<FormLanguage>("en")
  const [hasKannada, setHasKannada] = useState(false)
  const [previewPages, setPreviewPages] = useState<ScanPreviewPage[]>([])
  const [previewFileName, setPreviewFileName] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewAbortRef = useRef<AbortController | null>(null)
  const previewPagesRef = useRef<ScanPreviewPage[]>([])

  useEffect(() => {
    previewPagesRef.current = previewPages
  }, [previewPages])

  useEffect(() => {
    return () => {
      previewAbortRef.current?.abort()
      revokeScanPreviewPages(previewPagesRef.current)
    }
  }, [])

  function clearPreview() {
    previewAbortRef.current?.abort()
    previewAbortRef.current = null
    revokeScanPreviewPages(previewPagesRef.current)
    previewPagesRef.current = []
    setPreviewPages([])
    setPreviewFileName(null)
    setPreviewLoading(false)
  }

  function setValue(id: string, value: string) {
    if (isBilingualFieldId(id) && language === "kn") {
      setValuesKn((prev) => ({ ...prev, [id]: value }))
      return
    }
    setValuesEn((prev) => ({ ...prev, [id]: value }))
    if (!isBilingualFieldId(id)) {
      setValuesKn((prev) => ({ ...prev, [id]: value }))
    }
  }

  function applyBilingualPatch(patch: {
    en: Record<string, string>
    kn: Record<string, string>
    hasKannada: boolean
  }) {
    setValuesEn((prev) => ({ ...prev, ...patch.en }))
    setValuesKn((prev) => ({ ...prev, ...patch.kn }))
    setHasKannada(patch.hasKannada)
    setLanguage("en")
  }

  const autoFill = useDelayedClaimAutoFill({ applyBilingualPatch })

  function displayValue(name: string): string {
    if (isBilingualFieldId(name) && language === "kn") {
      return valuesKn[name] || valuesEn[name] || ""
    }
    return valuesEn[name] ?? ""
  }

  function fieldProps(name: string) {
    return {
      name,
      value: displayValue(name),
      onValueChange: (value: string) => setValue(name, value),
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmitted()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function loadPreview(file: File) {
    previewAbortRef.current?.abort()
    const controller = new AbortController()
    previewAbortRef.current = controller

    revokeScanPreviewPages(previewPagesRef.current)
    previewPagesRef.current = []
    setPreviewPages([])
    setPreviewFileName(file.name)
    setPreviewLoading(true)

    try {
      const pages = await buildScanPreviewPages(file, {
        signal: controller.signal,
      })
      if (controller.signal.aborted) {
        revokeScanPreviewPages(pages)
        return
      }
      previewPagesRef.current = pages
      setPreviewPages(pages)
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return
      setPreviewPages([])
      previewPagesRef.current = []
    } finally {
      if (!controller.signal.aborted) setPreviewLoading(false)
    }
  }

  function handleAutoFillFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    void loadPreview(file)
    void autoFill.run(file)
  }

  const showLanguageToggle = hasKannada || autoFill.hasKannada
  const showPreview = previewLoading || previewPages.length > 0

  return (
    <SectionCard className="stagger-in">
      <div
        className={cn(
          "gap-5",
          showPreview
            ? "grid lg:grid-cols-[minmax(280px,38%)_minmax(0,1fr)] lg:items-start"
            : "block",
        )}
      >
        {showPreview ? (
          <DocumentScanPreview
            pages={previewPages}
            fileName={previewFileName}
            loading={previewLoading}
            onClear={clearPreview}
            className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-6rem)]"
          />
        ) : null}

        <div className="min-w-0">
      <div className="mb-5 flex flex-col gap-3 border-b border-border/60 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">
            Upload &amp; Auto-Fill
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Please review the auto-filled information against the scanned
            document before proceeding.
            {showLanguageToggle
              ? " Kannada values found — switch language to review."
              : ""}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {showLanguageToggle ? (
            <div
              className="inline-flex rounded-md border border-border/70 p-0.5"
              role="group"
              aria-label="Form language"
            >
              <button
                type="button"
                onClick={() => setLanguage("kn")}
                className={cn(
                  "rounded px-2.5 py-1 text-xs font-medium transition-colors",
                  language === "kn"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                ಕನ್ನಡ
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={cn(
                  "rounded px-2.5 py-1 text-xs font-medium transition-colors",
                  language === "en"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                English
              </button>
            </div>
          ) : null}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,application/pdf"
            className="sr-only"
            disabled={autoFill.isRunning}
            onChange={handleAutoFillFile}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={autoFill.isRunning}
            onClick={() => fileInputRef.current?.click()}
          >
            {autoFill.isRunning ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            {autoFill.isRunning ? "Extracting…" : "Upload and Autofill"}
          </Button>
          {autoFill.isRunning ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={autoFill.cancel}
            >
              Cancel
            </Button>
          ) : null}
        </div>
      </div>

      {autoFill.isRunning && autoFill.stage ? (
        <p className="mb-4 text-xs text-muted-foreground" role="status">
          {autoFill.stage}
        </p>
      ) : null}

      {!autoFill.isRunning && autoFill.filledCount > 0 ? (
        <p className="mb-4 text-xs text-success">
          {autoFill.filledCount} field(s) filled — verify against the scan
        </p>
      ) : null}

      {autoFill.error ? (
        <p className="mb-4 text-xs text-destructive" role="alert">
          {autoFill.error}
        </p>
      ) : null}

      <nav
        aria-label="Delayed claim steps"
        className="mb-5 grid gap-2 border-b border-border/60 pb-5 sm:grid-cols-2"
      >
        <button
          type="button"
          onClick={() => setStep(1)}
          aria-current={step === 1 ? "step" : undefined}
          className={cn(
            "group flex min-w-0 items-center gap-3 rounded-md border p-3 text-left transition-colors",
            step === 1
              ? "border-primary/35 bg-primary/[0.06]"
              : "border-border/70 bg-muted/20 hover:bg-muted/40",
          )}
        >
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-md text-xs font-bold",
              step === 1
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            1
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-bold tracking-[0.12em] text-muted-foreground uppercase">
              Step 1
            </span>
            <span className="block truncate text-sm font-semibold text-foreground">
              Applicant details
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStep(2)}
          aria-current={step === 2 ? "step" : undefined}
          className={cn(
            "group flex min-w-0 items-center gap-3 rounded-md border p-3 text-left transition-colors",
            step === 2
              ? "border-primary/35 bg-primary/[0.06]"
              : "border-border/70 bg-muted/20 hover:bg-muted/40",
          )}
        >
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-md text-xs font-bold",
              step === 2
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            2
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-bold tracking-[0.12em] text-muted-foreground uppercase">
              Step 2
            </span>
            <span className="block truncate text-sm font-semibold text-foreground">
              Statement of investment
            </span>
          </span>
        </button>
      </nav>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 ? (
          <>
            <section className="grid gap-4 rounded-md bg-muted/20 p-4 sm:grid-cols-2">
              <FormField
                label="Serial Number"
                {...fieldProps("serialNumber")}
                placeholder="Enter serial number"
              />
              <FormField
                label="Def. C.A. CLNO"
                {...fieldProps("defCaClno")}
                placeholder="Enter Def. C.A. CLNO"
              />
              <SelectField
                label="Competent Authority"
                {...fieldProps("competentAuthority")}
                placeholder="Select Competent Authority"
                options={competentAuthorities}
                required
              />
              <SelectField
                label="Financial Establishment"
                {...fieldProps("financialEstablishment")}
                placeholder="Select Financial Establishment"
                options={financialEstablishments}
                required
              />
              <FormField
                label="Claim Application Number"
                {...fieldProps("claimApplicationNumber")}
                placeholder="Enter claim application number"
              />
              <FormField
                label="Date of Claim"
                {...fieldProps("dateOfClaim")}
                type="date"
                required
              />
            </section>

            <FormSection number={1} title="Applicant details">
              <FormField
                label="Name of the applicant"
                {...fieldProps("applicantName")}
                required
                placeholder="Full name"
              />
              <FormField
                label="Father / Husband name"
                {...fieldProps("fatherOrHusbandName")}
                placeholder="Enter name"
              />
              <FormField
                label="Customer / Client ID"
                {...fieldProps("customerId")}
                placeholder="Enter customer ID"
              />
              <label className="grid min-w-0 gap-1.5 sm:col-span-2">
                <span className="text-xs font-medium text-foreground">
                  Correspondence address
                  <span className="ml-0.5 text-destructive">*</span>
                </span>
                <Textarea
                  id="address"
                  name="address"
                  required
                  placeholder="Enter full postal address with PIN code"
                  value={displayValue("address")}
                  onChange={(event) => setValue("address", event.target.value)}
                  className="min-h-20 rounded-md bg-background"
                />
              </label>
              <FormField label="Date of birth" {...fieldProps("dob")} type="date" />
              <FormField
                label="Age"
                {...fieldProps("age")}
                type="number"
                placeholder="Age"
              />
              <FormField
                label="Mobile number"
                {...fieldProps("mobile")}
                required
                placeholder="10-digit mobile"
              />
              <FormField
                label="Alternate mobile"
                {...fieldProps("altMobile")}
                placeholder="Optional"
              />
              <FormField
                label="Email"
                {...fieldProps("email")}
                type="email"
                placeholder="name@example.com"
                className="sm:col-span-2"
              />
              <FormField
                label="Aadhaar / Passport / DL No."
                {...fieldProps("idNumber")}
                placeholder="Enter ID number"
              />
              <FileField label="Upload ID proof" name="idProof" />
              <FormField
                label="PAN number"
                {...fieldProps("pan")}
                placeholder="ABCDE1234F"
              />
              <FileField label="Upload PAN" name="panProof" />
              <FormField
                label="Delay condonation order No. & date"
                {...fieldProps("condonationOrder")}
                placeholder="Order number and date"
                className="sm:col-span-2"
              />
              <FileField
                label="Upload delay condonation order"
                name="condonationOrderFile"
              />
            </FormSection>

            <FormSection number={2} title="Nominee details (if applicable)">
              <FormField
                label="Nominee name"
                {...fieldProps("nomineeName")}
                placeholder="Enter nominee name"
              />
              <FormField
                label="Gender & age"
                {...fieldProps("nomineeGenderAge")}
                placeholder="e.g. Female, 42"
              />
              <FormField
                label="Relationship"
                {...fieldProps("nomineeRelationship")}
                placeholder="Relationship"
              />
              <FormField
                label="Nominee ID proof No."
                {...fieldProps("nomineeId")}
                placeholder="Enter ID number"
              />
              <FileField
                label="Upload nominee ID proof"
                name="nomineeIdProof"
              />
            </FormSection>

            <FormSection number={3} title="Statement of investment">
              <FormField
                label="Type of the scheme"
                {...fieldProps("schemeType")}
                required
                placeholder="Scheme type"
              />
              <FormField
                label="Name of the scheme"
                {...fieldProps("schemeName")}
                required
                placeholder="Scheme name"
              />
            </FormSection>

            <FormSection number={4} title="Depositor bank details">
              <FormField
                label="Bank account No."
                {...fieldProps("depositorAccount")}
                required
                placeholder="Account number"
              />
              <FormField
                label="IFSC code"
                {...fieldProps("depositorIfsc")}
                required
                placeholder="IFSC"
              />
              <FormField
                label="Bank name"
                {...fieldProps("depositorBank")}
                required
                placeholder="Bank name"
              />
              <FormField
                label="Branch name"
                {...fieldProps("depositorBranch")}
                placeholder="Branch name"
              />
            </FormSection>

            <FormSection number={5} title="Bank details for refund">
              <FormField
                label="Bank account No."
                {...fieldProps("refundAccount")}
                required
                placeholder="Account number"
              />
              <FormField
                label="IFSC code"
                {...fieldProps("refundIfsc")}
                required
                placeholder="IFSC"
              />
              <FormField
                label="Bank name"
                {...fieldProps("refundBank")}
                required
                placeholder="Bank name"
              />
              <FormField
                label="Branch name"
                {...fieldProps("refundBranch")}
                placeholder="Branch name"
              />
            </FormSection>

            <FormSection number={6} title="Total amount due">
              <FormField
                label="Amount (in figures)"
                {...fieldProps("amountFigures")}
                type="number"
                required
                placeholder="0.00"
              />
              <FormField
                label="Amount (in words)"
                {...fieldProps("amountWords")}
                required
                placeholder="Amount in words"
              />
            </FormSection>

            <FormSection number={7} title="Declaration">
              <label className="flex cursor-pointer items-start gap-3 sm:col-span-2">
                <input
                  type="checkbox"
                  name="declaration"
                  required
                  checked={displayValue("declaration") === "true"}
                  onChange={(event) =>
                    setValue("declaration", event.target.checked ? "true" : "")
                  }
                  className="mt-0.5 size-4.5 rounded border-input accent-primary"
                />
                <span className="text-xs leading-relaxed text-muted-foreground">
                  I hereby declare that the particulars furnished above are true
                  and correct to the best of my knowledge, and I undertake to
                  abide by the orders of the Competent Authority under the KPID
                  Act.
                </span>
              </label>
              <FormField
                label="Place"
                {...fieldProps("place")}
                required
                placeholder="Place"
              />
              <FormField
                label="Date"
                {...fieldProps("declarationDate")}
                type="date"
                required
              />
              <FileField label="Signature upload" name="signature" />
            </FormSection>

            <div className="flex justify-end border-t border-border/60 pt-4">
              <Button type="button" onClick={() => setStep(2)}>
                Next
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <FormSection number={1} title="Statement of investment">
              <FormField
                label="Financial Establishment"
                {...fieldProps("investmentFinancialEstablishment")}
                required
                placeholder="M/s. Lancer Finance Company"
              />
              <FormField
                label="Del_CA_CLNO"
                {...fieldProps("delCaClno")}
                placeholder="Enter Del_CA_CLNO"
              />
              <FormField
                label="Customer / Client ID"
                {...fieldProps("investmentCustomerId")}
                placeholder="Enter customer or client ID"
              />
              <label className="grid min-w-0 gap-1.5">
                <span className="text-xs font-medium text-foreground">
                  Remarks
                </span>
                <Textarea
                  id="investmentRemarks"
                  name="investmentRemarks"
                  placeholder="Enter remarks"
                  value={displayValue("investmentRemarks")}
                  onChange={(event) =>
                    setValue("investmentRemarks", event.target.value)
                  }
                  className="min-h-20 rounded-md bg-background"
                />
              </label>
              <SelectField
                label="PARTICULARS (CASH / NEFT / RTGS / IMPS OR CHEQUE)"
                {...fieldProps("paymentParticulars")}
                placeholder="Select payment mode"
                options={["Cash", "NEFT", "RTGS", "IMPS", "Cheque"]}
                required
              />
              <FormField
                label="NAME OF THE SCHEME"
                {...fieldProps("investmentSchemeName")}
                required
                placeholder="Enter scheme name"
              />
            </FormSection>

            <FormSection number={2} title="Depositor bank details">
              <FormField
                label="Bank Account No."
                {...fieldProps("stepTwoDepositorAccount")}
                required
                placeholder="Enter account number"
              />
              <FormField
                label="IFSC code"
                {...fieldProps("stepTwoDepositorIfsc")}
                required
                placeholder="Enter IFSC code"
              />
              <FormField
                label="Bank name"
                {...fieldProps("stepTwoDepositorBank")}
                placeholder="Enter bank name"
              />
              <FormField
                label="Branch name"
                {...fieldProps("stepTwoDepositorBranch")}
                placeholder="Enter branch name"
              />
              <DepositTransactionTable
                prefix="depositorTransaction"
                getValue={displayValue}
                setValue={setValue}
              />
            </FormSection>

            <FormSection number={3} title="F.E. Bank Details">
              <FormField
                label="Bank Account No."
                {...fieldProps("entityBankAccount")}
                placeholder="Enter account number"
              />
              <FormField
                label="IFSC code"
                {...fieldProps("entityBankIfsc")}
                placeholder="Enter IFSC code"
              />
              <FormField
                label="Bank name"
                {...fieldProps("entityBankName")}
                placeholder="Enter bank name"
              />
              <FormField
                label="Branch name"
                {...fieldProps("entityBankBranch")}
                placeholder="Enter branch name"
              />
              <DepositTransactionTable
                prefix="entityTransaction"
                getValue={displayValue}
                setValue={setValue}
              />
            </FormSection>

            <section className="grid gap-4 rounded-md border border-black/[0.05] bg-muted/20 p-4 dark:border-white/[0.08] dark:bg-white/[0.025] sm:grid-cols-2">
              <p className="border-l-2 border-primary pl-3 text-xs leading-relaxed text-muted-foreground sm:col-span-2">
                <span className="font-semibold text-foreground">Note:</span> FE
                is Financial Enterprise. Please ensure Account Number, IFSC Code
                and amounts written for Deposit and Receipt are correct as it
                will be cross verified. False information is punishable.
              </p>
              <FormField
                label="Place"
                {...fieldProps("investmentDeclarationPlace")}
                placeholder="Enter place"
              />
              <FormField
                label="Date"
                {...fieldProps("investmentDeclarationDate")}
                type="date"
              />
              <FileField
                label="Signature Upload"
                name="investmentSignature"
                accept="image/*"
              />
            </section>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>
              <Button type="submit">Register Claim</Button>
            </div>
          </>
        )}
      </form>
        </div>
      </div>
    </SectionCard>
  )
}

function DelayedClaimsPage() {
  const [instructionsOpen, setInstructionsOpen] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  return (
    <PageShell className="space-y-5 sm:space-y-6">
      <PageHero
        eyebrow="Claim settlement"
        title="Delayed claims"
        description="File a delayed claim application under 7(2) of the KPID Act."
        icon={Clock3}
        backTo="/"
        backLabel="Back to overview"
        accent="#2563eb"
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setInstructionsOpen(true)}
          >
            <FileText />
            View instructions
          </Button>
        }
      />

      <ApplicantInstructions
        open={instructionsOpen}
        onOpenChange={setInstructionsOpen}
      />

      {submitted ? (
        <SectionCard className="stagger-in">
          <section className="rounded-md border border-success/25 bg-success/5 p-8 text-center">
            <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-success text-white">
              <Check className="size-5" />
            </span>
            <h2 className="mt-3 font-display text-lg font-semibold">
              Delayed claim submitted
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The delayed claim application has been recorded for verification.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Button onClick={() => setSubmitted(false)}>
                File another delayed claim
              </Button>
            </div>
          </section>
        </SectionCard>
      ) : (
        <DelayedClaimForm onSubmitted={() => setSubmitted(true)} />
      )}
    </PageShell>
  )
}
