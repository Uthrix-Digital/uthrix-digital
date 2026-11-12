/**
 * Email transport — thin wrapper over the Resend REST API.
 *
 * Server-only: reads RESEND_API_KEY. Never import from a client component.
 * Uses fetch directly, so there is no SDK dependency.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails"

export type EmailAttachment = {
  filename: string
  /** Base64-encoded file content. */
  content: string
  contentType?: string
  /** Set to embed the file inline; reference it in HTML as `cid:<contentId>`. */
  contentId?: string
}

export type EmailMessage = {
  from: string
  to: string | string[]
  subject: string
  html: string
  text: string
  replyTo?: string
  attachments?: EmailAttachment[]
}

export type EmailResult =
  | { ok: true; id: string }
  /** `skipped` — no API key configured, nothing was sent. */
  | { ok: false; skipped: boolean; error: string }

export async function sendEmail(message: EmailMessage): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { ok: false, skipped: true, error: "RESEND_API_KEY is not set." }
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: message.from,
        to: Array.isArray(message.to) ? message.to : [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
        reply_to: message.replyTo,
        attachments: message.attachments?.map((a) => ({
          filename: a.filename,
          content: a.content,
          content_type: a.contentType,
          content_id: a.contentId,
        })),
      }),
      signal: AbortSignal.timeout(10_000),
    })

    const data = (await res.json().catch(() => null)) as
      | { id?: string; message?: string }
      | null

    if (!res.ok || !data?.id) {
      return {
        ok: false,
        skipped: false,
        error: data?.message ?? `Resend responded with ${res.status}.`,
      }
    }
    return { ok: true, id: data.id }
  } catch (error) {
    return {
      ok: false,
      skipped: false,
      error: error instanceof Error ? error.message : "Unknown email error.",
    }
  }
}
