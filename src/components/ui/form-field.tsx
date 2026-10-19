/**
 * FormField — Uthrix Digital UI
 *
 * A fully-accessible, composable form control that wraps shadcn's
 * <Input> or <Textarea> primitive with a label, helper text, and
 * validation-state styling (default | error | success).
 *
 * Usage
 * ─────
 * // Single-line input (default)
 * <FormField
 *   label="Email address"
 *   placeholder="you@company.com"
 *   helperText="We'll use this email to reply to your enquiry."
 * />
 *
 * // Multi-line textarea with error state
 * <FormField
 *   as="textarea"
 *   label="Message"
 *   placeholder="Tell us about your project…"
 *   helperText="This field is required."
 *   variant="error"
 * />
 *
 * API
 * ───
 * All native <input> / <textarea> props are forwarded — type, name,
 * value, onChange, disabled, required, autoComplete, maxLength, etc.
 * className is applied to the outer wrapper div.
 */

"use client"

import * as React from "react"
import { cn } from "cn"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle2 } from "lucide-react"

// ─── Public types ─────────────────────────────────────────────────────────────

/** Validation state of the field. */
export type FieldVariant = "default" | "error" | "success"

/** Which HTML control to render. */
export type FieldAs = "input" | "textarea"

interface FormFieldBaseProps {
  /** Label rendered above the control. */
  label?: string
  /** Helper / hint / error text rendered below the control. */
  helperText?: string
  /**
   * Visual & semantic validation state.
   * @default "default"
   */
  variant?: FieldVariant
  /**
   * Render as a single-line `<Input>` or a resizable `<Textarea>`.
   * @default "input"
   */
  as?: FieldAs
  /**
   * Additional class names applied to the **outer wrapper** `<div>`.
   * Use to control width, margin, grid placement, etc.
   */
  className?: string
}

// Discriminated union — `as` narrows the spread props correctly.
type InputFormFieldProps = FormFieldBaseProps & { as?: "input" } & Omit<
    React.ComponentProps<"input">,
    "className"
  >

type TextareaFormFieldProps = FormFieldBaseProps & { as: "textarea" } & Omit<
    React.ComponentProps<"textarea">,
    "className"
  >

export type FormFieldProps = InputFormFieldProps | TextareaFormFieldProps

// ─── Design-system colour tokens ─────────────────────────────────────────────
// Defined in globals.css; referenced here so a single token change in CSS
// propagates automatically without touching component code.

const VARIANT_STYLES = {
  control: {
    default: "",
    error: [
      "border-[--color-field-error]",
      "ring-3 ring-[--color-field-error]/15",
      "focus-visible:border-[--color-field-error]",
      "focus-visible:ring-[--color-field-error]/15",
    ].join(" "),
    success: [
      "border-[--color-field-success]",
      "ring-3 ring-[--color-field-success]/15",
      "focus-visible:border-[--color-field-success]",
      "focus-visible:ring-[--color-field-success]/15",
    ].join(" "),
  },
  helper: {
    default: "text-muted-foreground",
    error: "text-[--color-field-error]",
    success: "text-[--color-field-success]",
  },
  icon: {
    error: "text-[--color-field-error]",
    success: "text-[--color-field-success]",
  },
} as const

// ─── Trailing status icon ─────────────────────────────────────────────────────

function StatusIcon({ variant }: { variant: "error" | "success" }) {
  const Icon = variant === "error" ? AlertCircle : CheckCircle2
  return (
    <Icon
      aria-hidden="true"
      className={cn(
        "pointer-events-none h-4 w-4 shrink-0",
        VARIANT_STYLES.icon[variant]
      )}
    />
  )
}

// ─── FormField ────────────────────────────────────────────────────────────────

const FormField = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormFieldProps
>(function FormField(
  { label, helperText, variant = "default", as = "input", className, id, ...props },
  ref
) {
  // Stable, collision-free id for accessibility associations.
  const uid = React.useId()
  const fieldId = id ?? uid
  const helperId = `${fieldId}-helper`

  const hasStatus = variant === "error" || variant === "success"
  const controlClass = cn(
    VARIANT_STYLES.control[variant],
    // Reserve space for trailing icon so text never overlaps it.
    hasStatus && "pr-9"
  )

  // Forward aria-invalid only when there is actually an error so
  // assistive technologies announce the field correctly.
  const ariaInvalid = variant === "error" ? (true as const) : undefined

  // Shared accessibility props for both controls.
  const a11y = {
    id: fieldId,
    "aria-invalid": ariaInvalid,
    "aria-describedby": helperText ? helperId : undefined,
  } as const

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* ── Label ── */}
      {label && (
        <label
          htmlFor={fieldId}
          className="type-label select-none text-foreground"
        >
          {label}
        </label>
      )}

      {/* ── Control + trailing icon ── */}
      <div className="relative flex items-start">
        {as === "textarea" ? (
          <Textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={controlClass}
            {...a11y}
            {...(props as React.ComponentProps<"textarea">)}
          />
        ) : (
          <Input
            ref={ref as React.Ref<HTMLInputElement>}
            className={controlClass}
            {...a11y}
            {...(props as React.ComponentProps<"input">)}
          />
        )}

        {hasStatus && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute right-3",
              // Input: vertically centred. Textarea: pinned to the top edge.
              as === "textarea" ? "top-[0.65rem]" : "inset-y-0 flex items-center"
            )}
          >
            <StatusIcon variant={variant} />
          </span>
        )}
      </div>

      {/* ── Helper / error / success text ── */}
      {helperText && (
        <p
          id={helperId}
          role={variant === "error" ? "alert" : undefined}
          className={cn("type-body-sm", VARIANT_STYLES.helper[variant])}
        >
          {helperText}
        </p>
      )}
    </div>
  )
})

FormField.displayName = "FormField"

export { FormField }
