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
 *   What are you looking for?    — text input
 *   Message                      — textarea
 *
 * Behaviour
 * ─────────
 * • Validated on submit with a Zod schema; invalid fields show inline errors.
 * • On success the button confirms, then the form resets after 3 s.
 * • Wire the `onSubmit` prop to a server action / API route for real delivery.
 */

"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "cn"
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { FormField } from "@/components/ui/form-field"
import { SelectFormField } from "@/components/ui/select-form-field"
import { Button } from "@/components/ui/button"

// ─── Schema ───────────────────────────────────────────────────────────────────

const HEAR_ABOUT_US_OPTIONS = [
  { value: "google", label: "Google Search" },
  { value: "social", label: "Social Media" },
  { value: "referral", label: "Referral / Word of Mouth" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "event", label: "Event or Conference" },
  { value: "other", label: "Other" },
]

export const inquiryFormSchema = z.object({
  name: z.string().trim().min(1, "Full name is required."),
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .regex(/^\+?[\d\s()-]{7,20}$/, "Please enter a valid phone number."),
  lookingFor: z.string().trim(),
  hearAboutUs: z.string().min(1, "Please select an option."),
  message: z.string().trim(),
})

export type InquiryFormData = z.infer<typeof inquiryFormSchema>

type FieldKey = keyof InquiryFormData
type FieldErrors = Partial<Record<FieldKey, string>>

const EMPTY: InquiryFormData = {
  name: "",
  email: "",
  phone: "",
  lookingFor: "",
  hearAboutUs: "",
  message: "",
}

export interface InquiryFormProps {
  /** Called with validated form data on successful submission. */
  onSubmit?: (data: InquiryFormData) => Promise<void> | void
  /** Additional classes on the outer card. */
  className?: string
}

// ─── InquiryForm ──────────────────────────────────────────────────────────────

export function InquiryForm({ onSubmit, className }: InquiryFormProps) {
  const [values, setValues] = React.useState<InquiryFormData>(EMPTY)
  const [errors, setErrors] = React.useState<FieldErrors>({})
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success">(
    "idle"
  )
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
    try {
      await onSubmit?.(result.data)
      setStatus("success")
      setTimeout(() => {
        setStatus("idle")
        setValues(EMPTY)
        setErrors({})
      }, 3000)
    } catch {
      setStatus("idle")
    }
  }

  const variant = (field: FieldKey) => (errors[field] ? "error" : "default")
  const busy = status !== "idle"

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

      {/* ── Form ── */}
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

        <div className="flex flex-col gap-2 @[20rem]:col-span-2">
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
            ) : status === "success" ? (
              <>
                <CheckCircle2 aria-hidden="true" />
                Message sent!
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

          <p
            aria-live="polite"
            className="type-caption text-center text-muted-foreground"
          >
            {status === "success"
              ? "Thanks — we'll be in touch shortly."
              : "Fields marked * are required. No spam, ever."}
          </p>
        </div>
      </form>
    </section>
  )
}
