/**
 * Bookings store — Neon Postgres.
 *
 * Server-only. The database is the record of a booking, and a partial unique
 * index on `slot` (see scripts/setup-db.mjs) is what makes double booking
 * impossible, even when two people submit at the same moment.
 *
 * Connection string: UTHRIX_DATABASE_URL (the name the Vercel ↔ Neon
 * integration creates for this project), falling back to DATABASE_URL.
 */

import { neon, type NeonQueryFunction } from "@neondatabase/serverless"
import type { BookingRequest } from "@/lib/booking"

function connectionString() {
  return (
    process.env.UTHRIX_DATABASE_URL?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    ""
  )
}

export function isDatabaseConfigured() {
  return connectionString() !== ""
}

let cached: NeonQueryFunction<false, false> | null = null

function sql() {
  cached ??= neon(connectionString())
  return cached
}

export type InsertResult = "created" | "slot_taken"

/** Postgres unique-violation error code. */
const UNIQUE_VIOLATION = "23505"

/**
 * Save a confirmed booking. Returns "slot_taken" when another confirmed
 * booking already holds the slot; throws on any other database error.
 */
export async function insertBooking(
  id: string,
  booking: BookingRequest
): Promise<InsertResult> {
  try {
    await sql()`
      insert into bookings
        (id, slot, time_zone, name, email, phone, website, hear_about_us, message, guests)
      values
        (${id}, ${booking.slot}, ${booking.timeZone}, ${booking.name}, ${booking.email},
         ${booking.phone}, ${booking.website}, ${booking.hearAboutUs}, ${booking.message},
         ${booking.guests})
    `
    return "created"
  } catch (error) {
    if ((error as { code?: string } | null)?.code === UNIQUE_VIOLATION) {
      return "slot_taken"
    }
    throw error
  }
}

/** Record that a notification went out, so missed emails can be found later. */
export async function markEmailSent(id: string, which: "team" | "client") {
  if (which === "team") {
    await sql()`update bookings set team_email_sent_at = now() where id = ${id}`
  } else {
    await sql()`update bookings set client_email_sent_at = now() where id = ${id}`
  }
}

/** ISO start times of confirmed bookings from `from` onwards. No personal data. */
export async function getTakenSlots(from: Date): Promise<string[]> {
  const rows = (await sql()`
    select slot from bookings
    where status = 'confirmed' and slot >= ${from.toISOString()}
    order by slot
  `) as { slot: Date | string }[]
  return rows.map((r) => new Date(r.slot).toISOString())
}
