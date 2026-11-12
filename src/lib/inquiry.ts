/**
 * Inquiry — shared validation + formatting for the lead capture form.
 *
 * Used by the client form (inline errors) and by POST /api/inquiry (the
 * authoritative check), so both always agree on what a valid inquiry is.
 */

import { z } from "zod"
import { siteConfig } from "@/config/siteConfig"
import { BUSINESS_TYPE_OPTIONS, STAGE_OPTIONS } from "@/config/audiences"
import { HEAR_ABOUT_US_OPTIONS } from "@/lib/booking"

export const inquiryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Full name is required.")
    .max(120, "Name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address.")
    .max(254, "Email address is too long."),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .regex(/^\+?[\d\s()-]{7,20}$/, "Please enter a valid phone number."),
  lookingFor: z.string().trim().max(200, "Please keep this under 200 characters."),
  hearAboutUs: z.string().min(1, "Please select an option.").max(40),
  businessType: z.string().max(60),
  stage: z.string().max(60),
  message: z.string().trim().max(4000, "Please keep this under 4000 characters."),
})

export type InquiryFormData = z.infer<typeof inquiryFormSchema>

/**
 * What the API accepts: the form fields plus a honeypot. Real visitors never
 * see or fill `website`; bots that auto-fill every input do.
 */
export const inquiryRequestSchema = inquiryFormSchema.extend({
  website: z.string().max(200).optional().default(""),
})

// ─── Formatting ───────────────────────────────────────────────────────────────

function labelFor(
  options: readonly { value: string; label: string }[],
  value: string
) {
  return options.find((o) => o.value === value)?.label ?? value
}

/** Label / value rows for the inquiry, skipping fields left empty. */
export function inquiryRows(data: InquiryFormData): [string, string][] {
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Found us via", labelFor(HEAR_ABOUT_US_OPTIONS, data.hearAboutUs)],
    ["Business type", labelFor(BUSINESS_TYPE_OPTIONS, data.businessType)],
    ["Stage", labelFor(STAGE_OPTIONS, data.stage)],
    ["Looking for", data.lookingFor],
    ["Message", data.message],
  ]
  return rows.filter(([, value]) => value.trim() !== "")
}

/** wa.me link that opens a chat with the inquiry pre-filled. */
export function inquiryWhatsAppLink(data: InquiryFormData) {
  const lines = [
    `Hi ${siteConfig.companyName}, I just sent an inquiry from your website.`,
    "",
    ...inquiryRows(data)
      .filter(([label]) => label !== "Email" && label !== "Phone")
      .map(([label, value]) => `${label}: ${value}`),
  ]
  return `${siteConfig.whatsappLink}?text=${encodeURIComponent(lines.join("\n"))}`
}
