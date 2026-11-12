/**
 * Booking — shared scheduling rules + validation for the "Book a call" flow.
 *
 * Used by both the client UI (to render available days / slots in the
 * visitor's time zone) and the API route (to re-validate a requested slot),
 * so the two can never disagree about what is bookable.
 *
 * Availability is defined in the studio's own time zone and converted to the
 * visitor's zone with Intl only — no date library needed.
 */

import { z } from "zod"

// ─── Availability config ──────────────────────────────────────────────────────

export const bookingConfig = {
  /** Time zone the availability below is written in. */
  hostTimeZone: "Asia/Colombo",
  /** Length of the call in minutes. */
  durationMinutes: 20,
  /** Gap between slot start times in minutes. */
  intervalMinutes: 30,
  /** 0 = Sunday … 6 = Saturday, in the host time zone. */
  workingDays: [1, 2, 3, 4, 5],
  /** First and last slot start, "HH:mm" in the host time zone. */
  firstSlot: "09:00",
  lastSlot: "17:00",
  /** Earliest bookable slot, measured from now. */
  minNoticeHours: 12,
  /** How far ahead visitors can book. */
  maxDaysAhead: 60,
  /** Where the call happens — shown in the summary and confirmation. */
  location: "Google Meet",
  maxGuests: 5,
} as const

export const HEAR_ABOUT_US_OPTIONS = [
  { value: "google", label: "Google Search" },
  { value: "social", label: "Social Media" },
  { value: "referral", label: "Referral / Word of Mouth" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "event", label: "Event or Conference" },
  { value: "other", label: "Other" },
]

// ─── Time-zone helpers (Intl only) ────────────────────────────────────────────

const partsFormatterCache = new Map<string, Intl.DateTimeFormat>()

function partsFormatter(timeZone: string) {
  let f = partsFormatterCache.get(timeZone)
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    partsFormatterCache.set(timeZone, f)
  }
  return f
}

/** Wall-clock parts of `date` as seen in `timeZone`. */
function zonedParts(date: Date, timeZone: string) {
  const out: Record<string, number> = {}
  for (const p of partsFormatter(timeZone).formatToParts(date)) {
    if (p.type !== "literal") out[p.type] = Number(p.value)
  }
  return {
    year: out.year,
    month: out.month,
    day: out.day,
    hour: out.hour === 24 ? 0 : out.hour,
    minute: out.minute,
    second: out.second,
  }
}

/** Offset of `timeZone` from UTC at `date`, in minutes (Colombo → +330). */
export function tzOffsetMinutes(date: Date, timeZone: string) {
  const p = zonedParts(date, timeZone)
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second)
  return Math.round((asUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000)
}

/** The UTC instant of a wall-clock time in `timeZone`. */
export function zonedTimeToUtc(
  year: number,
  month: number, // 1-12
  day: number,
  hour: number,
  minute: number,
  timeZone: string
) {
  const guess = Date.UTC(year, month - 1, day, hour, minute)
  let offset = tzOffsetMinutes(new Date(guess), timeZone)
  let utc = guess - offset * 60000
  // Second pass settles DST transitions.
  const offset2 = tzOffsetMinutes(new Date(utc), timeZone)
  if (offset2 !== offset) {
    offset = offset2
    utc = guess - offset * 60000
  }
  return new Date(utc)
}

/** "YYYY-MM-DD" for `date` as seen in `timeZone`. */
export function dateKeyInZone(date: Date, timeZone: string) {
  const p = zonedParts(date, timeZone)
  return toDateKey(p.year, p.month, p.day)
}

export function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

/** Local calendar date (as DayPicker uses) → "YYYY-MM-DD". */
export function localDateKey(date: Date) {
  return toDateKey(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

/** "YYYY-MM-DD" → local Date at midnight (for DayPicker). */
export function keyToLocalDate(key: string) {
  const [y, m, d] = key.split("-").map(Number)
  return new Date(y, m - 1, d)
}

function shiftKey(key: string, days: number) {
  const [y, m, d] = key.split("-").map(Number)
  const t = new Date(Date.UTC(y, m - 1, d + days))
  return toDateKey(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate())
}

export function isValidTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone })
    return true
  } catch {
    return false
  }
}

// ─── Slot generation ──────────────────────────────────────────────────────────

function hm(value: string) {
  const [h, m] = value.split(":").map(Number)
  return h * 60 + m
}

/** Every slot start (UTC) on one host-zone calendar date, ignoring notice rules. */
function hostSlotsOnHostDate(hostKey: string) {
  const { hostTimeZone, workingDays, firstSlot, lastSlot, intervalMinutes } =
    bookingConfig
  const [y, m, d] = hostKey.split("-").map(Number)
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  if (!(workingDays as readonly number[]).includes(weekday)) return []

  const slots: Date[] = []
  for (let t = hm(firstSlot); t <= hm(lastSlot); t += intervalMinutes) {
    slots.push(
      zonedTimeToUtc(y, m, d, Math.floor(t / 60), t % 60, hostTimeZone)
    )
  }
  return slots
}

/** Bookable window relative to `now`. */
export function bookingWindow(now: Date) {
  return {
    earliest: new Date(now.getTime() + bookingConfig.minNoticeHours * 3600_000),
    latest: new Date(now.getTime() + bookingConfig.maxDaysAhead * 86400_000),
  }
}

/**
 * Bookable slot starts that fall on `dateKey` in the visitor's `timeZone`.
 * Host days either side are included so slots that cross midnight after
 * conversion still land on the right visitor day.
 */
export function getSlotsForDate(dateKey: string, timeZone: string, now: Date) {
  const { earliest, latest } = bookingWindow(now)
  const result: Date[] = []
  for (const offset of [-1, 0, 1]) {
    for (const slot of hostSlotsOnHostDate(shiftKey(dateKey, offset))) {
      if (slot < earliest || slot > latest) continue
      if (dateKeyInZone(slot, timeZone) !== dateKey) continue
      result.push(slot)
    }
  }
  return result.sort((a, b) => a.getTime() - b.getTime())
}

/** True when `slot` is exactly one of the published, still-bookable slots. */
export function isBookableSlot(slot: Date, now: Date) {
  const { earliest, latest } = bookingWindow(now)
  if (slot < earliest || slot > latest) return false
  const hostKey = dateKeyInZone(slot, bookingConfig.hostTimeZone)
  return hostSlotsOnHostDate(hostKey).some((s) => s.getTime() === slot.getTime())
}

// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

export function formatLongDate(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

/** "GMT+05:30" */
export function formatGmtOffset(timeZone: string, at: Date = new Date()) {
  const total = tzOffsetMinutes(at, timeZone)
  const sign = total < 0 ? "-" : "+"
  const abs = Math.abs(total)
  const h = String(Math.floor(abs / 60)).padStart(2, "0")
  const m = String(abs % 60).padStart(2, "0")
  return `GMT${sign}${h}:${m}`
}

/** Hour of `date` in `timeZone` (0-23). */
export function zonedHour(date: Date, timeZone: string) {
  return zonedParts(date, timeZone).hour
}

// ─── Validation ───────────────────────────────────────────────────────────────

export const bookingDetailsSchema = z.object({
  name: z.string().trim().min(1, "Full name is required.").max(120),
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
  website: z
    .string()
    .trim()
    .max(200)
    .refine(
      (v) => v === "" || /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v),
      "Please enter a valid website, e.g. yourcompany.com"
    ),
  hearAboutUs: z.string().min(1, "Please select an option."),
  // Optional: lets us arrive at the call already knowing their problem.
  businessType: z.string().max(60),
  stage: z.string().max(60),
  message: z.string().trim().max(2000),
  guests: z
    .array(z.string().trim().email("Please enter a valid guest email."))
    .max(bookingConfig.maxGuests, `You can add up to ${bookingConfig.maxGuests} guests.`),
})

export type BookingDetails = z.infer<typeof bookingDetailsSchema>

export const bookingRequestSchema = bookingDetailsSchema.extend({
  slot: z.string().datetime({ message: "Please choose a time slot." }),
  timeZone: z
    .string()
    .min(1)
    .refine(isValidTimeZone, "Unknown time zone."),
  /** Honeypot — hidden from people, so any value means a bot filled it. */
  bk_check: z.string().max(200).optional(),
})

export type BookingRequest = z.infer<typeof bookingRequestSchema>
