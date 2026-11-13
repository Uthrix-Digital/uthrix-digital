"use client"

import * as React from "react"
import { cn } from "cn"
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { FormField } from "@/components/ui/form-field"
import { SelectFormField } from "@/components/ui/select-form-field"
import { Button } from "@/components/ui/button"
import { CAREER_AREAS, GENERAL_APPLICATION } from "@/config/careers"
import {
  ROLE_OPTIONS,
  careerFormSchema,
  type CareerFormData,
} from "@/lib/career"

type FieldKey = keyof CareerFormData
type FieldErrors = Partial<Record<FieldKey, string>>

const GENERIC_ERROR =
  "Something went wrong while sending your application. Please try again, or email us directly."

const EMPTY: CareerFormData = {
  name: "",
  email: "",
  phone: "",
  role: GENERAL_APPLICATION,
  area: "",
  portfolio: "",
  message: "",
}

class SubmitError extends Error {
  constructor(
    message: string,
    readonly fieldErrors: FieldErrors = {}
  ) {
    super(message)
  }
}

async function postApplication(data: CareerFormData, honeypot: string) {
  const response = await fetch("/api/apply", {
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
  throw new SubmitError(payload?.error ?? GENERIC_ERROR, fieldErrors)
}

interface ApplicationFormProps {
  /** Role chosen from the open-roles list; changes pre-select it. */
  selectedRole: string
  onRoleChange: (role: string) => void
  email: string
}

export function ApplicationForm({
  selectedRole,
  onRoleChange,
  email,
}: ApplicationFormProps) {
  const [values, setValues] = React.useState<CareerFormData>(EMPTY)
  const [honeypot, setHoneypot] = React.useState("")
  const [errors, setErrors] = React.useState<FieldErrors>({})
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success">(
    "idle"
  )
  const formRef = React.useRef<HTMLFormElement>(null)

  // The form follows the role picked in the list above it.
  const role = selectedRole
  const current = { ...values, role }

  function setField(field: FieldKey, value: string) {
    if (field === "role") onRoleChange(value)
    else setValues((prev) => ({ ...prev, [field]: value }))
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitError(null)

    const result = careerFormSchema.safeParse(current)
    if (!result.success) {
      const next: FieldErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as FieldKey
        next[key] ??= issue.message
      }
      setErrors(next)
      requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>("[aria-invalid=true]")
          ?.focus()
      })
      return
    }

    setStatus("submitting")
    try {
      await postApplication(result.data, honeypot)
      setStatus("success")
    } catch (error) {
      setStatus("idle")
      if (error instanceof SubmitError) {
        setErrors(error.fieldErrors)
        setSubmitError(error.message)
      } else {
        setSubmitError(GENERIC_ERROR)
      }
    }
  }

  function reset() {
    setValues(EMPTY)
    setErrors({})
    setSubmitError(null)
    setStatus("idle")
  }

  const variant = (field: FieldKey) => (errors[field] ? "error" : "default")

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-4 rounded-card-lg border border-border bg-background p-6 sm:p-8"
      >
        <CheckCircle2 aria-hidden="true" className="size-8 text-field-success" />
        <h3 className="font-archivo-black text-3xl uppercase leading-[0.95] tracking-[-0.04em]">
          Application sent
        </h3>
        <p className="max-w-md leading-relaxed text-foreground/75">
          Thank you, {values.name.split(" ")[0] || "and welcome"}. We read every
          application and will reply to {values.email} with next steps.
        </p>
        <Button type="button" variant="outline" onClick={reset}>
          Send another application
        </Button>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Career application"
      className={cn(
        "@container relative grid grid-cols-1 gap-x-4 gap-y-4 rounded-card-lg border border-border bg-background p-6 sm:p-8 @[32rem]:grid-cols-2",
        "[&_input]:h-12 [&_input]:rounded-control [&_input]:bg-background [&_input]:px-4",
        "[&_textarea]:min-h-32 [&_textarea]:resize-y [&_textarea]:rounded-control [&_textarea]:bg-background [&_textarea]:px-4 [&_textarea]:py-3",
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
        placeholder="you@email.com"
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
        name="portfolio"
        label="Portfolio, LinkedIn or GitHub"
        placeholder="yourportfolio.com"
        inputMode="url"
        value={values.portfolio}
        onChange={handle("portfolio")}
        variant={variant("portfolio")}
        helperText={errors.portfolio}
      />
      <SelectFormField
        label="Role"
        placeholder="Choose a role"
        required
        options={ROLE_OPTIONS}
        value={role}
        onValueChange={(v) => setField("role", v ?? "")}
        variant={variant("role")}
        helperText={errors.role}
      />
      <SelectFormField
        label="Your area"
        placeholder="Choose your area"
        required
        options={CAREER_AREAS}
        value={values.area}
        onValueChange={(v) => setField("area", v ?? "")}
        variant={variant("area")}
        helperText={errors.area}
      />
      <FormField
        as="textarea"
        name="message"
        label="Tell us about yourself"
        placeholder="What you've worked on, what you're good at and what you'd like to do here."
        required
        value={values.message}
        onChange={handle("message")}
        variant={variant("message")}
        helperText={errors.message}
        className="@[32rem]:col-span-2"
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

      <div className="flex flex-col gap-3 @[32rem]:col-span-2">
        {submitError && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-control border border-field-error/30 bg-field-error/5 px-4 py-3 text-sm text-field-error"
          >
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <span>
              {submitError}{" "}
              <a href={`mailto:${email}`} className="font-semibold underline">
                {email}
              </a>
            </span>
          </p>
        )}
        <Button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-brand text-brand-foreground font-extrabold uppercase tracking-[0.1em] text-sm hover:border-transparent hover:bg-brand-hover hover:text-brand-foreground active:bg-brand disabled:bg-brand/70 disabled:text-brand-foreground"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              Send application
              <ArrowRight
                aria-hidden="true"
                className="transition-transform group-hover/button:translate-x-0.5"
              />
            </>
          )}
        </Button>
        <p className="type-caption text-center text-muted-foreground">
          Fields marked * are required. We only use your details to reply about
          this application.
        </p>
      </div>
    </form>
  )
}
