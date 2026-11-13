import { NextResponse } from "next/server"
import { siteConfig } from "@/config/siteConfig"
import { careerRequestSchema, careerRows } from "@/lib/career"
import { escapeHtml, sendEmail } from "@/lib/email"

/**
 * POST /api/apply
 *
 * Validates a career application (Zod) and emails it to the business inbox
 * through Resend. "Reply" in the inbox goes straight to the applicant.
 *
 * Environment: RESEND_API_KEY (required), RESEND_FROM_EMAIL and
 * CAREERS_TO_EMAIL (optional overrides; falls back to INQUIRY_TO_EMAIL, then
 * the site email — see src/lib/email.ts).
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

  const parsed = careerRequestSchema.safeParse(body)
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

  const { website, ...application } = parsed.data

  // Honeypot filled → a bot. Answer as if it worked, send nothing.
  if (website) {
    return NextResponse.json({ ok: true }, { status: 201 })
  }

  const rows = careerRows(application)

  const text = [
    `New career application from the ${siteConfig.companyName} website`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
  ].join("\n")

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111113;max-width:560px">
      <h2 style="margin:0 0 16px;font-size:20px">New career application</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px;line-height:22px">
        ${rows
          .map(
            ([label, value]) => `
        <tr>
          <td style="padding:8px 12px 8px 0;border-top:1px solid #e5e5e5;color:#666;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
          <td style="padding:8px 0;border-top:1px solid #e5e5e5;white-space:pre-wrap">${escapeHtml(value)}</td>
        </tr>`
          )
          .join("")}
      </table>
      <p style="margin:16px 0 0;font-size:12px;color:#666">Reply to this email to answer ${escapeHtml(application.name)} directly.</p>
    </div>`

  const result = await sendEmail({
    to:
      process.env.CAREERS_TO_EMAIL ||
      process.env.INQUIRY_TO_EMAIL ||
      siteConfig.email,
    subject: `Career application — ${application.name}`,
    text,
    html,
    replyTo: application.email,
  })

  if (!result.ok) {
    console.error("[apply] email delivery failed", {
      status: result.status,
      error: result.error,
    })
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't send your application right now. Please try again.",
      },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true, id: result.id }, { status: 201 })
}
