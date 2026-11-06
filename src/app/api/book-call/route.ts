import { NextResponse } from "next/server"
import { bookingRequestSchema, isBookableSlot } from "@/lib/booking"

/**
 * POST /api/book-call
 *
 * Validates a booking request (Zod) and re-checks that the requested slot is
 * one of the published, still-bookable slots. Delivery (email / CRM /
 * calendar invite) is the integration point marked below.
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

  if (!isBookableSlot(slot, new Date())) {
    return NextResponse.json(
      {
        ok: false,
        error: "That time is no longer available. Please pick another slot.",
      },
      { status: 409 }
    )
  }

  const id = crypto.randomUUID()

  // TODO: deliver the booking — send the confirmation email / calendar
  // invite, and push the lead into the CRM. Until then it is logged.
  console.info("[book-call] new booking", {
    id,
    slot: slot.toISOString(),
    timeZone: booking.timeZone,
    name: booking.name,
    email: booking.email,
    guests: booking.guests.length,
  })

  return NextResponse.json({ ok: true, id }, { status: 201 })
}
