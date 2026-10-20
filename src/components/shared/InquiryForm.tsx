/**
 * InquiryForm — Uthrix Digital
 * Lead capture form. Required (matches the design): Phone Number, How Did You Hear About Us?
 * Pass `onSubmit` to call your own API; otherwise it POSTs JSON to /api/inquiry.
 */
"use client"

import * as React from "react"
import { CheckCircle2, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { FormField } from "@/components/ui/form-field"
import { SelectFormField } from "@/components/ui/select-form-field"
import { Button } from "@/components/ui/button"

export interface InquiryFormData {
  name: string
  email: string
  phone: string
  lookingFor: string
  hearAboutUs: string
  message: string
}

export interface InquiryFormProps {
  onSubmit?: (data: InquiryFormData) => Promise<void>
  className?: string
}

const HEAR_ABOUT_US_OPTIONS = [
  { value: "google", label: "Google Search" },
  { value: "social", label: "Social Media" },
  { value: "referral", label: "Referral / Word of Mouth" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "event", label: "Event or Conference" },
  { value: "other", label: "Other" },
]

const EMPTY: InquiryFormData = {
  name: "",
  email: "",
  phone: "",
  lookingFor: "",
  hearAboutUs: "",
  message: "",
}

type FieldKey = keyof InquiryFormData
type Errors = Partial<Record<FieldKey, string>>
type Status = "idle" | "submitting" | "success" | "error"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/

function validate(d: InquiryFormData): Errors {
  const errors: Errors = {}
  if (d.email.trim() && !EMAIL_RE.test(d.email.trim())) {
    errors.email = "Enter a valid email address."
  }
  if (!d.phone.trim()) {
    errors.phone = "Phone number is required."
  } else if (!PHONE_RE.test(d.phone.trim())) {
    errors.phone = "Enter a valid phone number, e.g. 94 123 4567."
  }
  if (!d.hearAboutUs) {
    errors.hearAboutUs = "Please select an option."
  }
  return errors
}

async function submitInquiry(data: InquiryFormData) {
  const res = await fetch("/api/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Inquiry request failed")
}

export function InquiryForm({
  onSubmit = submitInquiry,
  className,
}: InquiryFormProps) {
  const [values, setValues] = React.useState<InquiryFormData>(EMPTY)
  const [errors, setErrors] = React.useState<Errors>({})
  const [status, setStatus] = React.useState<Status>("idle")
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  React.useEffect(() => () => clearTimeout(timer.current), [])

  function setValue(field: FieldKey, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const onText =
    (field: FieldKey) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValue(field, e.target.value)

  // Base UI Select passes string | null, not a DOM event
  const onSelect = (field: FieldKey) => (val: string | null) =>
    setValue(field, val ?? "")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const found = validate(values)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      return
    }

    setStatus("submitting")
    try {
      await onSubmit(values)
      setValues(EMPTY)
      setStatus("success")
      timer.current = setTimeout(() => setStatus("idle"), 4000)
    } catch {
      setStatus("error")
    }
  }

  const variant = (f: FieldKey): "default" | "error" =>
    errors[f] ? "error" : "default"

  return (
    <div
      className={cn(
        "w-full rounded-[2rem] bg-[#f4f4f4] px-6 py-8 sm:px-8 xl:px-14 xl:py-10",
        // Stop-gap sizing until FormField gets a `size` prop (design: 52px controls)
        "[&_input]:h-[52px] [&_[role=combobox]]:h-[52px] [&_textarea]:min-h-[104px]",
        className
      )}
    >
      <h2 className="mb-4 text-xl font-normal leading-snug tracking-[-0.02em] text-foreground sm:text-2xl">
        I want more quality leads for my company
      </h2>

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-busy={status === "submitting"}
        className="flex flex-col gap-4"
      >
        <FormField
          as="input"
          type="text"
          name="name"
          label="Name"
          placeholder="John David"
          autoComplete="name"
          value={values.name}
          onChange={onText("name")}
          variant={variant("name")}
          helperText={errors.name}
        />

        <FormField
          as="input"
          type="email"
          name="email"
          label="Email"
          placeholder="example@gmail.com"
          autoComplete="email"
          value={values.email}
          onChange={onText("email")}
          variant={variant("email")}
          helperText={errors.email}
        />

        <FormField
          as="input"
          type="tel"
          name="phone"
          label="Phone Number"
          placeholder="94 123 4567"
          autoComplete="tel"
          required
          value={values.phone}
          onChange={onText("phone")}
          variant={variant("phone")}
          helperText={errors.phone}
        />

        <FormField
          as="input"
          type="text"
          name="lookingFor"
          label="What are you looking for?"
          placeholder="I want to help to manage my social media"
          value={values.lookingFor}
          onChange={onText("lookingFor")}
          variant="default"
        />

        <SelectFormField
          label="How Did You Hear About Us?"
          placeholder="select"
          required
          options={HEAR_ABOUT_US_OPTIONS}
          value={values.hearAboutUs}
          onValueChange={onSelect("hearAboutUs")}
          variant={variant("hearAboutUs")}
          helperText={errors.hearAboutUs}
        />

        <FormField
          as="textarea"
          name="message"
          label="Message"
          placeholder="My goal is to increase leads, web traffic."
          value={values.message}
          onChange={onText("message")}
          variant="default"
        />

        <Button
          type="submit"
          disabled={status === "submitting" || status === "success"}
          className="mt-1 h-12 w-full rounded-full bg-black text-sm font-medium text-white hover:bg-black/85"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : status === "success" ? (
            <>
              <CheckCircle2 aria-hidden="true" />
              Message sent
            </>
          ) : (
            "Submit"
          )}
        </Button>

        <p role="status" aria-live="polite" className="min-h-5 text-sm">
          {status === "success" && "Thanks, we’ll get back to you shortly."}
          {status === "error" && (
            <span className="text-[#D1001F]">
              We couldn’t send your message. Please try again.
            </span>
          )}
        </p>
      </form>
    </div>
  )
}
