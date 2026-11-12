import { NextResponse, connection } from "next/server"
import { getTakenSlots, isDatabaseConfigured } from "@/lib/db/bookings"

/**
 * GET /api/book-call/availability
 *
 * Start times (ISO, UTC) that are already booked, so the calendar can hide
 * them. Returns times only — never who booked them.
 */
export async function GET() {
  // Always answer at request time; a cached list would show taken slots as free.
  await connection()

  const headers = { "Cache-Control": "no-store" }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: true, taken: [] }, { headers })
  }

  try {
    const taken = await getTakenSlots(new Date())
    return NextResponse.json({ ok: true, taken }, { headers })
  } catch (error) {
    console.error("[book-call] could not load taken slots:", error)
    // The booking endpoint still rejects a taken slot, so fail open here.
    return NextResponse.json({ ok: false, taken: [] }, { status: 503, headers })
  }
}
