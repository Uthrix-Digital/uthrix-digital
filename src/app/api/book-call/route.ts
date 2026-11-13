import { NextResponse, after } from "next/server"
import { bookingRequestSchema, isBookableSlot } from "@/lib/booking"
import {
  insertBooking,
  isDatabaseConfigured,
  markEmailSent,
} from "@/lib/db/bookings"
import {
  sendClientConfirmation,
  sendTeamNotification,
} from "@/lib/notifications/bookingEmails"
import { siteConfig } from "@/config/siteConfig"

const SLOT_TAKEN = "That time is no longer available. Please pick another slot."
const TRY_AGAIN = `We couldn't complete your booking just now. Please try again, or email us at ${siteConfig.email}.`

/**
 * POST /api/book-call
 *
 * 1. Validates the request (Zod) and re-checks the slot is a published one.
 * 2. Saves the booking. The database is the record, and its unique index on
 *    the slot rejects a second booking for the same time (→ 409).
 * 3. Responds, then emails the team and the client in the background. Email
 *    failures are logged and left unmarked on the row — the booking stands.
 *
 * Without a database (local development only) it falls back to the team
 * email being the record: if that email fails, nothing is confirmed.
 */
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    )
  }

  const parsed = bookingRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please check the highlighted fields.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    )
  }

  const booking = parsed.data
  const slot = new Date(booking.slot)
  const id = crypto.randomUUID()

  // Honeypot: real visitors never see or fill this field. Pretend it worked
  // so bots get no signal, and store / send nothing.
  if (booking.bk_check) {
    console.warn(`[book-call] honeypot tripped — booking ${id} ignored.`)
    return NextResponse.json({ ok: true, id }, { status: 201 })
  }

  if (!isBookableSlot(slot, new Date())) {
    return NextResponse.json({ ok: false, error: SLOT_TAKEN }, { status: 409 })
  }

  // ── With a database: save first, email afterwards ──────────────────────
  if (isDatabaseConfigured()) {
    try {
      const result = await insertBooking(id, booking)
      if (result === "slot_taken") {
        return NextResponse.json(
          { ok: false, error: SLOT_TAKEN, code: "slot_taken" },
          { status: 409 }
        )
      }
    } catch (error) {
      console.error(`[book-call] could not save booking ${id}:`, error)
      return NextResponse.json({ ok: false, error: TRY_AGAIN }, { status: 503 })
    }

    after(async () => {
      const [team, client] = await Promise.all([
        sendTeamNotification(id, booking),
        sendClientConfirmation(id, booking),
      ])
      for (const [which, result] of [
        ["team", team],
        ["client", client],
      ] as const) {
        if (result.ok) {
          await markEmailSent(id, which).catch((error) =>
            console.error(`[book-call] could not mark ${which} email for ${id}:`, error)
          )
        } else {
          console.error(`[book-call] ${which} email failed for ${id}: ${result.error}`)
        }
      }
    })

    return NextResponse.json({ ok: true, id }, { status: 201 })
  }

  // ── No database ────────────────────────────────────────────────────────
  if (process.env.NODE_ENV === "production") {
    console.error("[book-call] no database connection string is configured.")
    return NextResponse.json({ ok: false, error: TRY_AGAIN }, { status: 503 })
  }

  console.warn(
    `[book-call] no database configured — booking ${id} is NOT stored and double bookings are possible.`
  )
  const team = await sendTeamNotification(id, booking)
  if (!team.ok && !team.skipped) {
    console.error(`[book-call] team email failed for ${id}: ${team.error}`)
    return NextResponse.json({ ok: false, error: TRY_AGAIN }, { status: 502 })
  }
  if (team.ok) {
    after(async () => {
      const client = await sendClientConfirmation(id, booking)
      if (!client.ok) {
        console.error(`[book-call] client email failed for ${id}: ${client.error}`)
      }
    })
  }
  return NextResponse.json({ ok: true, id }, { status: 201 })
}
