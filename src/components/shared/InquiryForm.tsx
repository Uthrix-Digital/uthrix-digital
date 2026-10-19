/**
 * InquiryForm — Uthrix Digital
 *
 * "I want more quality leads for my company"
 * Lead capture form used on the home page (and reusable anywhere).
 *
 * Fields
 * ──────
 *   Name              — text input
 *   Email             — email input
 *   Phone Number *    — tel input  (required)
 *   What are you looking for? — text input
 *   How Did You Hear About Us? * — select  (required)
 *   Message           — textarea
 *
 * Behaviour
 * ─────────
 * • Client-side validation on submit — fields marked required are validated.
 * • Each invalid field switches to variant="error" with an inline message.
 * • On success the form resets and shows a brief confirmation state.
 * • All validation state is managed locally — wire `onSubmit` prop to your
 *   server action / API route for real submission.
 */

"use client"

import * as React from "react"
import { cn } from "cn"
import { FormField } from "@/components/ui/form-field"
import { SelectFormField } from "@/components/ui/select-form-field"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2 } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InquiryFormData {
  name: string
  email: string
  phone: string
  lookingFor: string
  hearAboutUs: string
  message: string
}

export interface InquiryFormProps {
  /** Called with validated form data on successful submission. */
  onSubmit?: (data: InquiryFormData) => Promise<void> | void
  /** Additional classes on the outer wrapper. */
  className?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const HEAR_ABOUT_US_OPTIONS = [
  { value: "google",      label: "Google Search" },
  { value: "social",      label: "Social Media" },
  { value: "referral",    label: "Referral / Word of Mouth" },
  { value: "linkedin",    label: "LinkedIn" },
  { value: "event",       label: "Event or Conference" },
  { value: "other",       label: "Other" },
]

type FieldKey = keyof InquiryFormData

interface FieldError {
  message: string
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(data: InquiryFormData): Partial<Record<FieldKey, FieldError>> {
  const errors: Partial<Record<FieldKey, FieldError>> = {}

  if (!data.name.trim()) {
    errors.name = { message: "Full name is required." }
  }

  if (!data.email.trim()) {
    errors.email = { message: "Email address is required." }
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = { message: "Please enter a valid email address." }
  }

  if (!data.phone.trim()) {
    errors.phone = { message: "Phone number is required." }
  }

  if (!data.hearAboutUs) {
    errors.hearAboutUs = { message: "Please select an option." }
  }

  return errors
}

// ─── InquiryForm ──────────────────────────────────────────────────────────────

export function InquiryForm({ onSubmit, className }: InquiryFormProps) {
  const [values, setValues] = React.useState<InquiryFormData>({
    name: "",
    email: "",
    phone: "",
    lookingFor: "",
    hearAboutUs: "",
    message: "",
  })

  const [errors, setErrors] = React.useState<
    Partial<Record<FieldKey, FieldError>>
  >({})

  const [status, setStatus] = React.useState<
    "idle" | "submitting" | "success"
  >("idle")

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleChange(field: FieldKey) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }))
      clearError(field)
    }
  }

  // For Base UI Select — receives string | null directly, not a DOM event
  function handleSelectChange(field: FieldKey) {
    return (val: string | null) => {
      setValues((prev) => ({ ...prev, [field]: val ?? "" }))
      clearError(field)
    }
  }

  function clearError(field: FieldKey) {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const validationErrors = validate(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setStatus("submitting")
    try {
      await onSubmit?.(values)
      setStatus("success")
      // Reset after 3 s so the form can be reused
      setTimeout(() => {
        setStatus("idle")
        setValues({
          name: "",
          email: "",
          phone: "",
          lookingFor: "",
          hearAboutUs: "",
          message: "",
        })
        setErrors({})
      }, 3000)
    } catch {
      setStatus("idle")
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  function variant(field: FieldKey): "default" | "error" {
    return errors[field] ? "error" : "default"
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className={cn(
        "w-full max-w-[32rem] rounded-3xl bg-secondary/60 p-6 sm:p-8",
        "border border-border shadow-sm",
        className
      )}
    >
      {/* ── Heading ── */}
      <h2 className="type-h4 mb-6 text-foreground">
        I want more quality leads for my company
      </h2>

      {/* ── Form ── */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4"
      >
        {/* Name */}
        <FormField
          as="input"
          type="text"
          name="name"
          label="Name"
          placeholder="John David"
          autoComplete="name"
          value={values.name}
          onChange={handleChange("name")}
          variant={variant("name")}
          helperText={errors.name?.message}
        />

        {/* Email */}
        <FormField
          as="input"
          type="email"
          name="email"
          label="Email"
          placeholder="example@gmail.com"
          autoComplete="email"
          value={values.email}
          onChange={handleChange("email")}
          variant={variant("email")}
          helperText={errors.email?.message}
        />

        {/* Phone Number */}
        <FormField
          as="input"
          type="tel"
          name="phone"
          label="Phone Number"
          placeholder="94 123 4567"
          autoComplete="tel"
          required
          value={values.phone}
          onChange={handleChange("phone")}
          variant={variant("phone")}
          helperText={errors.phone?.message}
        />

        {/* What are you looking for? */}
        <FormField
          as="input"
          type="text"
          name="lookingFor"
          label="What are you looking for?"
          placeholder="I want to help to manage my social media"
          value={values.lookingFor}
          onChange={handleChange("lookingFor")}
          variant="default"
        />

        {/* How Did You Hear About Us? */}
        <SelectFormField
          label="How Did You Hear About Us?"
          placeholder="select"
          required
          options={HEAR_ABOUT_US_OPTIONS}
          value={values.hearAboutUs}
          onValueChange={handleSelectChange("hearAboutUs")}
          variant={variant("hearAboutUs")}
          helperText={errors.hearAboutUs?.message}
        />

        {/* Message */}
        <FormField
          as="textarea"
          name="message"
          label="Message"
          placeholder="My goal is to increase leads, web traffic."
          value={values.message}
          onChange={handleChange("message")}
          variant="default"
          className="[&_textarea]:min-h-[7rem]"
        />

        {/* Submit */}
        <Button
          type="submit"
          disabled={status === "submitting" || status === "success"}
          className="mt-2 w-full"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : status === "success" ? (
            <>
              <CheckCircle2 aria-hidden="true" />
              Message Sent!
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </div>
  )
}
