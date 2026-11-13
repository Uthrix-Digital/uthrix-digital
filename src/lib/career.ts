/**
 * Career application — shared validation + formatting.
 *
 * Used by the client form (inline errors) and by POST /api/apply (the
 * authoritative check), so both always agree on what a valid application is.
 */

import { z } from "zod"
import { CAREER_AREAS, GENERAL_APPLICATION, ROLES } from "@/config/careers"

export const ROLE_OPTIONS = [
  ...ROLES.map((role) => ({ value: role.id, label: role.title })),
  { value: GENERAL_APPLICATION, label: "General application" },
]

export const careerFormSchema = z.object({
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
  role: z.string().min(1, "Please choose a role.").max(60),
  area: z.string().min(1, "Please choose your area.").max(40),
  portfolio: z
    .string()
    .trim()
    .max(300, "Please keep the link under 300 characters.")
    .refine(
      (v) => v === "" || /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v),
      "Please enter a valid link, e.g. yourportfolio.com"
    ),
  message: z
    .string()
    .trim()
    .min(1, "Please tell us a little about yourself.")
    .max(4000, "Please keep this under 4000 characters."),
})

export type CareerFormData = z.infer<typeof careerFormSchema>

/**
 * What the API accepts: the form fields plus a honeypot. Real visitors never
 * see or fill `website`; bots that auto-fill every input do.
 */
export const careerRequestSchema = careerFormSchema.extend({
  website: z.string().max(200).optional().default(""),
})

function labelFor(
  options: readonly { value: string; label: string }[],
  value: string
) {
  return options.find((o) => o.value === value)?.label ?? value
}

/** Label / value rows for the application, skipping fields left empty. */
export function careerRows(data: CareerFormData): [string, string][] {
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Role", labelFor(ROLE_OPTIONS, data.role)],
    ["Area", labelFor(CAREER_AREAS, data.area)],
    ["Portfolio / profile", data.portfolio],
    ["About them", data.message],
  ]
  return rows.filter(([, value]) => value.trim() !== "")
}
