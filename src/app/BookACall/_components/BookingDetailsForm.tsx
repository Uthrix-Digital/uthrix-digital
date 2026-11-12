"use client"

import * as React from "react"
import { cn } from "cn"
import { AlertCircle, ArrowRight, Loader2, Plus, X } from "lucide-react"
import { FormField } from "@/components/ui/form-field"
import { SelectFormField } from "@/components/ui/select-form-field"
import { Button } from "@/components/ui/button"
import {
  HEAR_ABOUT_US_OPTIONS,
  bookingConfig,
  bookingDetailsSchema,
  type BookingDetails,
} from "@/lib/booking"

type FieldKey = Exclude<keyof BookingDetails, "guests">
type Errors = Partial<Record<FieldKey, string>> & { guests?: Record<number, string> }

export const EMPTY_DETAILS: BookingDetails = {
  name: "",
  email: "",
  phone: "",
  website: "",
  hearAboutUs: "",
  message: "",
  guests: [],
}

type BookingDetailsFormProps = {
  values: BookingDetails
  onChange: (values: BookingDetails) => void
  /** `trap` is the honeypot value — empty for real visitors. */
  onSubmit: (values: BookingDetails, trap: string) => Promise<void>
  /** Error from the server (e.g. slot taken), shown above the submit button. */
  submitError: string | null
}

export function BookingDetailsForm({
  values,
  onChange,
  onSubmit,
  submitError,
}: BookingDetailsFormProps) {
  const [errors, setErrors] = React.useState<Errors>({})
  const [submitting, setSubmitting] = React.useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)

  function setField(field: FieldKey, value: string) {
    onChange({ ...values, [field]: value })
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handle =
    (field: FieldKey) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setField(field, e.target.value)

  function setGuest(index: number, email: string) {
    const guests = values.guests.slice()
    guests[index] = email
    onChange({ ...values, guests })
    if (errors.guests?.[index]) {
      setErrors((prev) => {
        const next = { ...prev.guests }
        delete next[index]
        return { ...prev, guests: next }
      })
    }
  }

  function addGuest() {
    if (values.guests.length >= bookingConfig.maxGuests) return
    onChange({ ...values, guests: [...values.guests, ""] })
    // Focus the new guest input once it renders.
    requestAnimationFrame(() => {
      const inputs = formRef.current?.querySelectorAll<HTMLInputElement>(
        "input[data-guest]"
      )
      inputs?.[inputs.length - 1]?.focus()
    })
  }

  function removeGuest(index: number) {
    onChange({ ...values, guests: values.guests.filter((_, i) => i !== index) })
    setErrors((prev) => ({ ...prev, guests: undefined }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Blank guest rows are ignored rather than flagged.
    const cleaned = { ...values, guests: values.guests.map((g) => g.trim()).filter(Boolean) }
    const result = bookingDetailsSchema.safeParse(cleaned)

    if (!result.success) {
      const next: Errors = {}
      for (const issue of result.error.issues) {
        const [key, index] = issue.path
        if (key === "guests" && typeof index === "number") {
          // Map back to the index among non-empty rows.
          const original = values.guests
            .map((g, i) => ({ g: g.trim(), i }))
            .filter((x) => x.g)[index]?.i
          if (original !== undefined) {
            next.guests = { ...next.guests, [original]: issue.message }
          }
        } else {
          next[key as FieldKey] ??= issue.message
        }
      }
      setErrors(next)
      // Move focus to the first invalid control.
      requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>("[aria-invalid=true]")
          ?.focus()
      })
      return
    }

    setSubmitting(true)
    try {
      const trap =
        formRef.current?.querySelector<HTMLInputElement>("input[name=bk_check]")
          ?.value ?? ""
      await onSubmit(result.data, trap)
    } finally {
      setSubmitting(false)
    }
  }

  const variant = (field: FieldKey) => (errors[field] ? "error" : "default")

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className={cn(
        "@container grid grid-cols-1 gap-x-4 gap-y-4 @[34rem]:grid-cols-2",
        // Site control sizing (matches InquiryForm)
        "[&_input]:h-12 [&_input]:rounded-control [&_input]:bg-background [&_input]:px-4",
        "[&_textarea]:min-h-28 [&_textarea]:resize-y [&_textarea]:rounded-control [&_textarea]:bg-background [&_textarea]:px-4 [&_textarea]:py-3",
        "[&_[data-slot=select-trigger]]:h-12! [&_[data-slot=select-trigger]]:rounded-control [&_[data-slot=select-trigger]]:bg-background [&_[data-slot=select-trigger]]:pl-4 [&_[data-slot=select-trigger]]:pr-3"
      )}
    >
      <FormField
        name="name"
        label="Full name"
        placeholder="John David"
        required
        autoComplete="name"
        value={values.name}
        onChange={handle("name")}
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
        onChange={handle("email")}
        variant={variant("email")}
        helperText={errors.email}
      />
      <FormField
        type="tel"
        name="phone"
        label="Phone / WhatsApp"
        placeholder="+94 77 123 4567"
        required
        autoComplete="tel"
        value={values.phone}
        onChange={handle("phone")}
        variant={variant("phone")}
        helperText={errors.phone}
      />
      <FormField
        type="url"
        name="website"
        label="Website"
        placeholder="yourcompany.com"
        autoComplete="url"
        inputMode="url"
        value={values.website}
        onChange={handle("website")}
        variant={variant("website")}
        helperText={errors.website}
      />
      <SelectFormField
        label="How did you hear about us?"
        placeholder="Select one"
        required
        options={HEAR_ABOUT_US_OPTIONS}
        value={values.hearAboutUs}
        onValueChange={(v) => setField("hearAboutUs", v ?? "")}
        variant={variant("hearAboutUs")}
        helperText={errors.hearAboutUs}
        className="@[34rem]:col-span-2"
      />
      <FormField
        as="textarea"
        name="message"
        label="What would you like to talk about?"
        placeholder="e.g. We want more qualified leads from our website and ads."
        value={values.message}
        onChange={handle("message")}
        variant={variant("message")}
        helperText={errors.message}
        className="@[34rem]:col-span-2"
      />

      {/* Honeypot — off-screen and unfocusable; only bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="bk_check" tabIndex={-1} autoComplete="one-time-code" data-1p-ignore data-lpignore="true" data-form-type="other" defaultValue="" />
        </label>
      </div>

      {/* ── Guests ── */}
      <div className="flex flex-col gap-2.5 @[34rem]:col-span-2">
        <div className="flex items-center justify-between gap-3">
          <span className="type-label text-foreground">Guests</span>
          <span className="text-xs text-muted-foreground">
            {values.guests.length}/{bookingConfig.maxGuests}
          </span>
        </div>

        {values.guests.map((guest, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <input
                data-guest
                type="email"
                value={guest}
                onChange={(e) => setGuest(i, e.target.value)}
                placeholder="teammate@company.com"
                aria-label={`Guest ${i + 1} email`}
                aria-invalid={errors.guests?.[i] ? true : undefined}
                className={cn(
                  "w-full min-w-0 border border-input text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:ring-3 focus-visible:ring-foreground/10",
                  errors.guests?.[i] && "border-field-error ring-3 ring-field-error/15"
                )}
              />
              <button
                type="button"
                onClick={() => removeGuest(i)}
                aria-label={`Remove guest ${i + 1}`}
                className="inline-flex size-12 shrink-0 items-center justify-center rounded-control border border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
            {errors.guests?.[i] && (
              <p role="alert" className="text-sm text-field-error">
                {errors.guests[i]}
              </p>
            )}
          </div>
        ))}

        {values.guests.length < bookingConfig.maxGuests && (
          <button
            type="button"
            onClick={addGuest}
            className="inline-flex h-10 w-fit items-center gap-1.5 rounded-full border border-dashed border-border-strong/50 px-4 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <Plus aria-hidden="true" className="size-4" />
            Add guest
          </button>
        )}
      </div>

      {/* ── Submit ── */}
      <div className="flex flex-col gap-3 pt-1 @[34rem]:col-span-2">
        {submitError && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-control border border-field-error/30 bg-field-error/5 px-4 py-3 text-sm text-field-error"
          >
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            {submitError}
          </p>
        )}
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand text-brand-foreground font-extrabold uppercase tracking-[0.1em] text-sm hover:border-transparent hover:bg-brand-hover hover:text-brand-foreground active:bg-brand disabled:bg-brand/70 disabled:text-brand-foreground"
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Booking your call…
            </>
          ) : (
            <>
              Confirm booking
              <ArrowRight
                aria-hidden="true"
                className="transition-transform group-hover/button:translate-x-0.5"
              />
            </>
          )}
        </Button>
        <p className="type-caption text-center text-muted-foreground">
          Fields marked * are required. We&apos;ll send the meeting link to your email.
        </p>
      </div>
    </form>
  )
}
