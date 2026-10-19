/**
 * SelectFormField — Uthrix Digital UI
 *
 * Composes the shadcn <Select> primitive (powered by @base-ui/react/select)
 * with the same label, helper-text, and validation-state system as <FormField>.
 *
 * Usage
 * ─────
 * // Uncontrolled
 * <SelectFormField
 *   label="How Did You Hear About Us?"
 *   placeholder="Select an option"
 *   required
 *   options={[
 *     { value: "google",   label: "Google Search" },
 *     { value: "social",   label: "Social Media" },
 *   ]}
 * />
 *
 * // Controlled
 * <SelectFormField
 *   label="How Did You Hear About Us?"
 *   placeholder="Select an option"
 *   value={value}
 *   onValueChange={setValue}
 *   variant="error"
 *   helperText="Please select an option."
 *   options={OPTIONS}
 * />
 */

"use client"

import * as React from "react"
import { cn } from "cn"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ─── Public types ─────────────────────────────────────────────────────────────

export type SelectFormFieldVariant = "default" | "error" | "success"

export interface SelectOption {
  value: string
  label: string
}

export interface SelectFormFieldProps {
  /** Label rendered above the trigger. */
  label?: string
  /** Helper / hint / error text rendered below the trigger. */
  helperText?: string
  /**
   * Visual & semantic validation state.
   * @default "default"
   */
  variant?: SelectFormFieldVariant
  /** Placeholder shown inside the trigger when no value is selected. */
  placeholder?: string
  /** Option items. */
  options?: SelectOption[]
  /** Controlled value — the selected option's `value` string. */
  value?: string
  /** Called when the user selects a new option. */
  onValueChange?: (value: string | null) => void
  /** Default value for uncontrolled usage. */
  defaultValue?: string
  /** Mark the field as required — appends a red asterisk to the label. */
  required?: boolean
  /** Disable the trigger. */
  disabled?: boolean
  /**
   * Additional class names applied to the outer wrapper `<div>`.
   * Use to control width, margin, grid placement, etc.
   */
  className?: string
  /** Explicit id — auto-generated with useId() if omitted. */
  id?: string
}

// ─── Variant style maps ───────────────────────────────────────────────────────

const triggerVariant: Record<SelectFormFieldVariant, string> = {
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
}

const helperVariant: Record<SelectFormFieldVariant, string> = {
  default: "text-muted-foreground",
  error: "text-[--color-field-error]",
  success: "text-[--color-field-success]",
}

// ─── Status icon ──────────────────────────────────────────────────────────────

function StatusIcon({ variant }: { variant: "error" | "success" }) {
  const Icon = variant === "error" ? AlertCircle : CheckCircle2
  const colorClass =
    variant === "error"
      ? "text-[--color-field-error]"
      : "text-[--color-field-success]"

  return (
    <Icon
      aria-hidden="true"
      className={cn("pointer-events-none h-4 w-4 shrink-0", colorClass)}
    />
  )
}

// ─── SelectFormField ──────────────────────────────────────────────────────────

export function SelectFormField({
  label,
  helperText,
  variant = "default",
  placeholder,
  options = [],
  value,
  onValueChange,
  defaultValue,
  required,
  disabled,
  className,
  id,
}: SelectFormFieldProps) {
  const uid = React.useId()
  const fieldId = id ?? uid
  const helperId = `${fieldId}-helper`

  const hasStatus = variant === "error" || variant === "success"

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {/* ── Label ── */}
      {label && (
        <label
          htmlFor={fieldId}
          className="type-label select-none text-foreground"
        >
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 text-[--color-field-error]">
              *
            </span>
          )}
        </label>
      )}

      {/* ── Trigger row: select + status icon ── */}
      <div className="relative flex items-center">
        <Select
          value={value}
          onValueChange={onValueChange ?? undefined}
          defaultValue={defaultValue}
          disabled={disabled}
        >
          <SelectTrigger
            id={fieldId}
            aria-invalid={variant === "error" ? true : undefined}
            aria-describedby={helperText ? helperId : undefined}
            aria-required={required}
            className={cn(
              // Full-width override — the base component uses w-fit
              "w-full",
              // Status-aware border / ring
              triggerVariant[variant],
              // Push text left to avoid overlap with the status icon
              hasStatus && "pr-9"
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status icon — sits between the value text and the chevron */}
        {hasStatus && (
          <span className="pointer-events-none absolute right-7 flex items-center">
            <StatusIcon variant={variant} />
          </span>
        )}
      </div>

      {/* ── Helper / error / success text ── */}
      {helperText && (
        <p
          id={helperId}
          role={variant === "error" ? "alert" : undefined}
          className={cn("type-body-sm", helperVariant[variant])}
        >
          {helperText}
        </p>
      )}
    </div>
  )
}
