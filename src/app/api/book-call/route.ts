import { NextResponse, after } from "next/server"
import { bookingRequestSchema, isBookableSlot } from "@/lib/booking"
import {
  sendClientConfirmation,
  sendTeamNotification,
} from "@/lib/notifications/bookingEmails"
import { siteConfig } from "@/config/siteConfig"

/**
 * POST /api/book-call
 *
 * 1. Validates the request (Zod) and re-checks the slot is still bookable.
 * 2. Emails the team. This is the only record of the booking, so if it
 *    fails the visitor is told and nothing is confirmed.
 * 3. Emails the client a confirmation + calendar invite after the response
 *    is sent — a failure there is logged, never shown to the visitor.
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
  // so bots get no signal, and send nothing.
  if (booking.bk_check) {
    console.warn(`[book-call] honeypot tripped — booking ${id} ignored.`)
    return NextResponse.json({ ok: true, id }, { status: 201 })
  }

  if (!isBookableSlot(slot, new Date())) {
    return NextResponse.json(
      {
        ok: false,
        error: "That time is no longer available. Please pick another slot.",
      },
      { status: 409 }
    )
  }

  const team = await sendTeamNotification(id, booking)

  if (!team.ok) {
    const isDev = process.env.NODE_ENV !== "production"
    if (team.skipped && isDev) {
      // Local development without an API key: keep the flow usable.
      console.warn(
        `[book-call] ${team.error} Booking ${id} for ${slot.toISOString()} was NOT emailed.`
      )
      return NextResponse.json({ ok: true, id }, { status: 201 })
    }

    console.error(`[book-call] team notification failed for ${id}: ${team.error}`)
    return NextResponse.json(
      {
        ok: false,
        error: `We couldn't complete your booking just now. Please try again, or email us at ${siteConfig.email}.`,
      },
      { status: 502 }
    )
  }

  after(async () => {
    const client = await sendClientConfirmation(id, booking)
    if (!client.ok) {
      console.error(
        `[book-call] client confirmation failed for ${id}: ${client.error}`
      )
    }
  })

  return NextResponse.json({ ok: true, id }, { status: 201 })
}
