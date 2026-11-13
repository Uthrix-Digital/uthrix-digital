/**
 * Email — thin wrapper around the Resend REST API. Server only: import it
 * from route handlers / server actions, never from a client component.
 *
 * Environment
 * ───────────
 *   RESEND_API_KEY     required — Resend API key
 *   RESEND_FROM_EMAIL  optional — sender, must be on a domain verified in
 *                      Resend. Defaults to no-reply@uthrix.com.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails"
const DEFAULT_FROM = "Uthrix Website <no-reply@uthrix.com>"

export interface SendEmailInput {
  to: string
  subject: string
  text: string
  html: string
  /** Where "Reply" goes — e.g. the visitor who filled in the form. */
  replyTo?: string
}

export type SendEmailResult =
  | { ok: true; id: string }
  | { ok: false; status: number; error: string }

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { ok: false, status: 500, error: "RESEND_API_KEY is not set." }
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM,
        to: [input.to],
        subject: input.subject,
        text: input.text,
        html: input.html,
        reply_to: input.replyTo,
      }),
      signal: AbortSignal.timeout(10_000),
    })

    const payload = (await response.json().catch(() => null)) as {
      id?: string
      message?: string
    } | null

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: payload?.message ?? `Resend responded with ${response.status}.`,
      }
    }
    return { ok: true, id: payload?.id ?? "" }
  } catch (error) {
    return {
      ok: false,
      status: 502,
      error: error instanceof Error ? error.message : "Email request failed.",
    }
  }
}

/** Escape text for safe interpolation into an HTML email. */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
