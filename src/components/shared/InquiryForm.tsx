/**
 * InquiryForm — Uthrix Digital
 *
 * Lead capture card used in the home-page hero (and reusable anywhere).
 * Styled to the site's system: raised surface card, mono eyebrow,
 * Archivo Black heading with a brand-red accent word, pill CTA.
 *
 * Fields
 * ──────
 *   Name *                       — text input
 *   Email *                      — email input
 *   Phone Number *               — tel input
 *   How Did You Hear About Us? * — select
 *   Business type                — select (optional, can be pre-filled)
 *   Where are you today?         — select (optional, can be pre-filled)
 *   What are you looking for?    — text input
 *   Message                      — textarea
 *
 * Behaviour
 * ─────────
 * • Validated on submit with the shared Zod schema (src/lib/inquiry.ts);
 *   invalid fields show inline errors.
 * • Posts to /api/inquiry, which emails the inquiry to the business inbox.
 *   Pass `onSubmit` to replace that delivery (throw to signal failure).
 * • On success the form is replaced by a confirmation with a
 *   "Continue on WhatsApp" link that pre-fills the same details.
 * • On failure an inline error appears with a WhatsApp fallback.
 */

"use client"

import * as React from "react"
import { cn } from "cn"
import { ArrowRight, CheckCircle2, Loader2, MessageCircle } from "lucide-react"
import { FormField } from "@/components/ui/form-field"
import { SelectFormField } from "@/components/ui/select-form-field"
import { Button } from "@/components/ui/button"
import { BUSINESS_TYPE_OPTIONS, STAGE_OPTIONS } from "@/config/audiences"
import { siteConfig } from "@/config/siteConfig"
import { HEAR_ABOUT_US_OPTIONS } from "@/lib/booking"
import {
  inquiryFormSchema,
  inquiryWhatsAppLink,
  type InquiryFormData,
} from "@/lib/inquiry"

export type { InquiryFormData }

type FieldKey = keyof InquiryFormData
type FieldErrors = Partial<Record<FieldKey, string>>

const EMPTY: InquiryFormData = {
  name: "",
  email: "",
  phone: "",
  lookingFor: "",
  hearAboutUs: "",
  businessType: "",
  stage: "",
  message: "",
}

export interface InquiryFormProps {
  /**
   * Custom delivery. Defaults to POST /api/inquiry. Throw to show the
   * failure state.
   */
  onSubmit?: (data: InquiryFormData) => Promise<void> | void
  /** Additional classes on the outer card. */
  className?: string
  /** Pre-select values, e.g. the business type of the page the form sits on. */
  defaultValues?: Partial<Pick<InquiryFormData, "businessType" | "stage">>
}

// ─── Delivery ─────────────────────────────────────────────────────────────────

const GENERIC_ERROR =
  "We couldn't send your inquiry right now. Please try again."

class InquirySubmitError extends Error {
  constructor(
    message: string,
    readonly fieldErrors: FieldErrors = {}
  ) {
    super(message)
  }
}

/** Default delivery: POST /api/inquiry → email to the business inbox. */
async function postInquiry(data: InquiryFormData, honeypot: string) {
  const response = await fetch("/api/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, website: honeypot }),
  })
  if (response.ok) return

  const payload = (await response.json().catch(() => null)) as {
    error?: string
    fieldErrors?: Partial<Record<FieldKey, string[]>>
  } | null

  const fieldErrors: FieldErrors = {}
  for (const [key, messages] of Object.entries(payload?.fieldErrors ?? {})) {
    if (messages?.[0]) fieldErrors[key as FieldKey] = messages[0]
  }
  throw new InquirySubmitError(payload?.error ?? GENERIC_ERROR, fieldErrors)
}

// ─── InquiryForm ──────────────────────────────────────────────────────────────

export function InquiryForm({
  onSubmit,
  className,
  defaultValues,
}: InquiryFormProps) {
  const initialBusinessType = defaultValues?.businessType ?? ""
  const initialStage = defaultValues?.stage ?? ""
  const initial = React.useMemo<InquiryFormData>(
    () => ({
      ...EMPTY,
      businessType: initialBusinessType,
      stage: initialStage,
    }),
    [initialBusinessType, initialStage]
  )
  const [values, setValues] = React.useState<InquiryFormData>(initial)
  const [errors, setErrors] = React.useState<FieldErrors>({})
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success">(
    "idle"
  )
  const [submitError, setSubmitError] = React.useState("")
  // Honeypot — hidden from people, auto-filled by bots; checked by the API.
  const [honeypot, setHoneypot] = React.useState("")
  // What was just sent — feeds the WhatsApp follow-up link.
  const [sent, setSent] = React.useState<InquiryFormData | null>(null)
  const headingId = React.useId()

  function setField(field: FieldKey, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function handleChange(field: FieldKey) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setField(field, e.target.value)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const result = inquiryFormSchema.safeParse(values)
    if (!result.success) {
      const fieldErrors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as FieldKey
        fieldErrors[key] ??= issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setStatus("submitting")
    setSubmitError("")
    try {
      if (onSubmit) await onSubmit(result.data)
      else await postInquiry(result.data, honeypot)
      setSent(result.data)
      setStatus("success")
    } catch (error) {
      if (error instanceof InquirySubmitError) setErrors(error.fieldErrors)
      setSubmitError(
        error instanceof InquirySubmitError ? error.message : GENERIC_ERROR
      )
      setStatus("idle")
    }
  }

  function handleReset() {
    setValues(initial)
    setErrors({})
    setSubmitError("")
    setSent(null)
    setStatus("idle")
  }

  const variant = (field: FieldKey) => (errors[field] ? "error" : "default")
  const busy = status === "submitting"

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "@container relative w-full overflow-hidden rounded-card-lg border border-border bg-surface-raised p-6 sm:p-7 lg:p-6",
        // Controls: 44px tall, sit on the page background so they read against the card
        "[&_input]:h-11 [&_input]:rounded-control [&_input]:bg-background [&_input]:px-4 dark:[&_input]:bg-background",
        "[&_textarea]:h-18 [&_textarea]:min-h-18 [&_textarea]:resize-none [&_textarea]:rounded-control [&_textarea]:bg-background [&_textarea]:px-4 [&_textarea]:py-2.5 dark:[&_textarea]:bg-background",
        "[&_[data-slot=select-trigger]]:h-11! [&_[data-slot=select-trigger]]:rounded-control [&_[data-slot=select-trigger]]:bg-background [&_[data-slot=select-trigger]]:pl-4 [&_[data-slot=select-trigger]]:pr-3 dark:[&_[data-slot=select-trigger]]:bg-background",
        className
      )}
    >
      {/* ── Header ── */}
      <p className="font-heading2 flex items-center gap-2 text-[0.7rem] leading-4 font-medium uppercase tracking-[0.16em] text-muted-foreground">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
        Start a project
      </p>

      <h2
        id={headingId}
        className="font-archivo-black mt-2.5 text-[clamp(1.5rem,7cqw,2.25rem)] uppercase leading-[0.95] tracking-[-0.04em] text-foreground"
      >
        Get more quality <span className="text-brand-text">leads.</span>
      </h2>

      <p className="mt-2 text-sm leading-5 text-muted-foreground">
        Tell us where you want to grow — we&apos;ll come back with a plan.
      </p>

      {status === "success" && sent ? (
        /* ── Confirmation ── */
        <div
          role="status"
          className="mt-5 flex flex-col gap-4 rounded-control border border-border bg-background p-5"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-field-success"
            />
            <div>
              <p className="type-label text-foreground">
                Thanks, {sent.name.split(" ")[0]} — your inquiry is in.
              </p>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                We&apos;ll reply to {sent.email}. Want a faster answer? Send
                us the same details on WhatsApp.
              </p>
            </div>
          </div>

          <a
            href={inquiryWhatsAppLink(sent)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-8 text-base font-medium text-background transition-colors hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <MessageCircle aria-hidden="true" className="size-4" />
            Continue on WhatsApp
          </a>

          <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
            Send another inquiry
          </Button>
        </div>
      ) : (
      /* ── Form ── */
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-4 grid grid-cols-1 gap-x-3 gap-y-3 @[20rem]:grid-cols-2"
      >
        <FormField
          type="text"
          name="name"
          label="Name"
          placeholder="John David"
          required
          autoComplete="name"
          value={values.name}
          onChange={handleChange("name")}
          variant={variant("name")}
          helperText={errors.name}
        />

        <FormField
          type="email"
          name="email"
          label="Email"
          placeholder="you@company.com"
          required
          autoComplete="email"
          value={values.email}
          onChange={handleChange("email")}
          variant={variant("email")}
          helperText={errors.email}
        />

        <FormField
          type="tel"
          name="phone"
          label="Phone Number"
          placeholder="+94 77 123 4567"
          required
          autoComplete="tel"
          value={values.phone}
          onChange={handleChange("phone")}
          variant={variant("phone")}
          helperText={errors.phone}
        />

        <SelectFormField
          label="How did you find us?"
          placeholder="Select an option"
          required
          options={HEAR_ABOUT_US_OPTIONS}
          value={values.hearAboutUs}
          onValueChange={(val) => setField("hearAboutUs", val ?? "")}
          variant={variant("hearAboutUs")}
          helperText={errors.hearAboutUs}
        />

        <SelectFormField
          label="Business type"
          placeholder="Select your business"
          options={BUSINESS_TYPE_OPTIONS}
          value={values.businessType}
          onValueChange={(val) => setField("businessType", val ?? "")}
        />

        <SelectFormField
          label="Where are you today?"
          placeholder="Select your stage"
          options={STAGE_OPTIONS}
          value={values.stage}
          onValueChange={(val) => setField("stage", val ?? "")}
        />

        <FormField
          type="text"
          name="lookingFor"
          label="What are you looking for?"
          placeholder="e.g. A new website, SEO, social media"
          value={values.lookingFor}
          onChange={handleChange("lookingFor")}
          className="@[20rem]:col-span-2"
        />

        <FormField
          as="textarea"
          name="message"
          label="Message"
          placeholder="My goal is to increase leads and web traffic."
          value={values.message}
          onChange={handleChange("message")}
          className="@[20rem]:col-span-2"
        />

        {/* Honeypot — off-screen, skipped by keyboard and screen readers */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] size-px overflow-hidden"
        >
          <label>
            Website
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </label>
        </div>

        <div className="flex flex-col gap-2 @[20rem]:col-span-2">
          {submitError && (
            <p
              role="alert"
              className="rounded-control border border-field-error/40 bg-field-error/10 px-4 py-2.5 text-sm leading-5 text-field-error"
            >
              {submitError}{" "}
              <a
                href={siteConfig.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2"
              >
                Message us on WhatsApp
              </a>
            </p>
          )}

          <Button
            type="submit"
            disabled={busy}
            className="mt-1 w-full bg-brand text-brand-foreground hover:border-transparent hover:bg-brand-hover hover:text-brand-foreground active:bg-brand disabled:bg-brand/70 disabled:text-brand-foreground"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                Send inquiry
                <ArrowRight
                  aria-hidden="true"
                  className="transition-transform group-hover/button:translate-x-0.5"
                />
              </>
            )}
          </Button>

          <p className="type-caption text-center text-muted-foreground">
            Fields marked * are required. No spam, ever.
          </p>
        </div>
      </form>
      )}
    </section>
  )
}
