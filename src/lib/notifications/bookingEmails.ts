/**
 * Booking emails — the two messages sent when a call is booked:
 *
 *   1. Team notification  → BOOKING_NOTIFY_EMAIL (defaults to siteConfig.email)
 *      Times in the studio's zone, reply-to set to the client.
 *   2. Client confirmation → the person who booked
 *      Times in their zone, reply-to set to the studio.
 *
 * Both carry an .ics invite. All visitor input is HTML-escaped.
 */

import { siteConfig } from "@/config/siteConfig"
import {
  HEAR_ABOUT_US_OPTIONS,
  bookingConfig,
  formatGmtOffset,
  formatLongDate,
  formatTime,
  type BookingRequest,
} from "@/lib/booking"
import { sendEmail, type EmailAttachment, type EmailMessage } from "./email"
import {
  EMAIL_LOGO_CID,
  EMAIL_LOGO_HEIGHT,
  EMAIL_LOGO_PNG_BASE64,
  EMAIL_LOGO_WIDTH,
} from "./logo"

// ─── Config ───────────────────────────────────────────────────────────────────

function fromAddress() {
  return (
    process.env.BOOKING_FROM_EMAIL?.trim() ||
    `${siteConfig.companyName} <bookings@uthrix.com>`
  )
}

function teamAddresses() {
  return (process.env.BOOKING_NOTIFY_EMAIL?.trim() || siteConfig.email)
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/** Strip line breaks so visitor input can't inject email headers. */
function oneLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim()
}

function websiteUrl(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`
}

function when(slot: Date, timeZone: string) {
  const end = new Date(slot.getTime() + bookingConfig.durationMinutes * 60_000)
  return {
    date: formatLongDate(slot, timeZone),
    time: `${formatTime(slot, timeZone)} – ${formatTime(end, timeZone)}`,
    zone: `${timeZone.replace(/_/g, " ")} (${formatGmtOffset(timeZone, slot)})`,
  }
}

// ─── Calendar invite (.ics) ───────────────────────────────────────────────────

function icsEscape(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n")
}

function icsStamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
}

function buildIcs(id: string, booking: BookingRequest, slot: Date): EmailAttachment {
  const end = new Date(slot.getTime() + bookingConfig.durationMinutes * 60_000)
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Uthrix Digital//Book a Call//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${id}@uthrix.com`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(slot)}`,
    `DTEND:${icsStamp(end)}`,
    `SUMMARY:${icsEscape(`Strategy call — ${oneLine(booking.name)} × ${siteConfig.companyName}`)}`,
    `DESCRIPTION:${icsEscape(
      `Free ${bookingConfig.durationMinutes}-minute strategy call with ${siteConfig.companyName}.\nThe ${bookingConfig.location} link will be shared by email before the call.`
    )}`,
    `LOCATION:${icsEscape(bookingConfig.location)}`,
    `ORGANIZER;CN=${icsEscape(siteConfig.companyName)}:mailto:${siteConfig.email}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Strategy call in 15 minutes",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
  return {
    filename: "strategy-call.ics",
    content: Buffer.from(lines.join("\r\n"), "utf8").toString("base64"),
    contentType: "text/calendar; charset=utf-8; method=PUBLISH",
  }
}

// ─── HTML shell ───────────────────────────────────────────────────────────────

const BRAND = "#C40202"
const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

function shell(opts: { eyebrow: string; heading: string; body: string; preheader: string }) {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:${FONT};color:#111113;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${opts.preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e4e4e7;border-radius:16px;overflow:hidden;">
<tr><td style="background:#0a0a0a;padding:20px 32px;">
  <img src="cid:${EMAIL_LOGO_CID}" width="${EMAIL_LOGO_WIDTH}" height="${EMAIL_LOGO_HEIGHT}" alt="${esc(siteConfig.companyName)}" style="display:block;border:0;outline:none;height:${EMAIL_LOGO_HEIGHT}px;width:${EMAIL_LOGO_WIDTH}px;color:#ffffff;font-size:18px;font-weight:800;">
</td></tr>
<tr><td style="padding:32px;">
  <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#71717a;">
    <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${BRAND};vertical-align:middle;margin-right:6px;"></span>${opts.eyebrow}
  </p>
  <h1 style="margin:0 0 20px;font-size:26px;line-height:1.1;font-weight:800;letter-spacing:-0.03em;color:#111113;">${opts.heading}</h1>
  ${opts.body}
</td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid #e4e4e7;font-size:12px;line-height:18px;color:#71717a;">
  ${esc(siteConfig.companyName)} · <a href="mailto:${siteConfig.email}" style="color:#71717a;">${siteConfig.email}</a>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

function row(label: string, valueHtml: string) {
  return `<tr>
<td style="padding:10px 0;border-bottom:1px solid #f0f0f1;font-size:13px;color:#71717a;width:38%;vertical-align:top;">${label}</td>
<td style="padding:10px 0;border-bottom:1px solid #f0f0f1;font-size:14px;color:#111113;vertical-align:top;">${valueHtml}</td>
</tr>`
}

function timeCard(w: { date: string; time: string; zone: string }) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;background:#fdf2f2;border:1px solid #f5c6c6;border-radius:12px;">
<tr><td style="padding:16px 20px;">
  <p style="margin:0;font-size:18px;font-weight:800;color:#111113;">${esc(w.time)}</p>
  <p style="margin:4px 0 0;font-size:14px;color:#3f3f46;">${esc(w.date)}</p>
  <p style="margin:4px 0 0;font-size:12px;color:#71717a;">${esc(w.zone)} · ${esc(bookingConfig.location)}</p>
</td></tr>
</table>`
}

// ─── 1. Team notification ─────────────────────────────────────────────────────

export function buildTeamEmail(id: string, booking: BookingRequest): EmailMessage {
  const slot = new Date(booking.slot)
  const host = when(slot, bookingConfig.hostTimeZone)
  const client = when(slot, booking.timeZone)
  const sameZone = booking.timeZone === bookingConfig.hostTimeZone
  const name = oneLine(booking.name)
  const heard =
    HEAR_ABOUT_US_OPTIONS.find((o) => o.value === booking.hearAboutUs)?.label ??
    booking.hearAboutUs

  const rows = [
    row("Name", esc(name)),
    row("Email", `<a href="mailto:${esc(booking.email)}" style="color:${BRAND};">${esc(booking.email)}</a>`),
    row("Phone / WhatsApp", `<a href="tel:${esc(booking.phone.replace(/[^\d+]/g, ""))}" style="color:${BRAND};">${esc(booking.phone)}</a>`),
    booking.website
      ? row("Website", `<a href="${esc(websiteUrl(booking.website))}" style="color:${BRAND};">${esc(booking.website)}</a>`)
      : "",
    row("Heard about us", esc(heard)),
    sameZone ? "" : row("Client's local time", `${esc(client.time)}<br><span style="color:#71717a;font-size:12px;">${esc(client.date)} · ${esc(client.zone)}</span>`),
    booking.guests.length
      ? row("Guests", booking.guests.map((g) => esc(g)).join("<br>"))
      : "",
    booking.message
      ? row("Wants to discuss", esc(booking.message).replace(/\r?\n/g, "<br>"))
      : "",
    row("Booking ID", `<span style="font-family:monospace;font-size:12px;color:#71717a;">${esc(id)}</span>`),
  ].join("")

  const html = shell({
    eyebrow: "New call booking",
    heading: `${esc(name)} booked a call`,
    preheader: `${esc(host.date)}, ${esc(host.time)}`,
    body: `${timeCard(host)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
<p style="margin:24px 0 0;font-size:13px;line-height:20px;color:#71717a;">Reply to this email to reach ${esc(name)} directly. Remember to send the ${esc(bookingConfig.location)} link before the call.</p>`,
  })

  const text = [
    `New call booking — ${name}`,
    "",
    `When:   ${host.date}, ${host.time}`,
    `        ${host.zone}`,
    sameZone ? "" : `Client: ${client.date}, ${client.time} — ${client.zone}`,
    `Where:  ${bookingConfig.location}`,
    "",
    `Name:    ${name}`,
    `Email:   ${booking.email}`,
    `Phone:   ${booking.phone}`,
    booking.website ? `Website: ${booking.website}` : "",
    `Heard about us: ${heard}`,
    booking.guests.length ? `Guests:  ${booking.guests.join(", ")}` : "",
    booking.message ? `\nWants to discuss:\n${booking.message}` : "",
    "",
    `Booking ID: ${id}`,
  ]
    .filter((line, i, all) => line !== "" || all[i - 1] !== "")
    .join("\n")

  return {
    from: fromAddress(),
    to: teamAddresses(),
    replyTo: booking.email,
    subject: `New call booking — ${name}, ${host.date}, ${formatTime(slot, bookingConfig.hostTimeZone)}`,
    html,
    text,
    attachments: [buildIcs(id, booking, slot), logoAttachment()],
  }
}

// ─── 2. Client confirmation ───────────────────────────────────────────────────

export function buildClientEmail(id: string, booking: BookingRequest): EmailMessage {
  const slot = new Date(booking.slot)
  const w = when(slot, booking.timeZone)
  const firstName = oneLine(booking.name).split(" ")[0]

  const html = shell({
    eyebrow: "Booking confirmed",
    heading: `You're booked, ${esc(firstName)}.`,
    preheader: `Your strategy call: ${esc(w.date)}, ${esc(w.time)}`,
    body: `<p style="margin:0 0 20px;font-size:15px;line-height:24px;color:#3f3f46;">Thanks for booking a free ${bookingConfig.durationMinutes}-minute strategy call with ${esc(siteConfig.companyName)}. Here are the details:</p>
${timeCard(w)}
<p style="margin:0 0 12px;font-size:15px;line-height:24px;color:#3f3f46;"><strong style="color:#111113;">What happens next</strong></p>
<ul style="margin:0 0 20px;padding-left:20px;font-size:14px;line-height:24px;color:#3f3f46;">
  <li>Open the attached invite to add the call to your calendar.</li>
  <li>We'll email you the ${esc(bookingConfig.location)} link before the call.</li>
  <li>Need to change the time? Just reply to this email.</li>
</ul>
<p style="margin:0;font-size:14px;line-height:22px;color:#3f3f46;">Talk soon,<br><strong style="color:#111113;">The ${esc(siteConfig.companyName)} team</strong></p>`,
  })

  const text = [
    `You're booked, ${firstName}.`,
    "",
    `Thanks for booking a free ${bookingConfig.durationMinutes}-minute strategy call with ${siteConfig.companyName}.`,
    "",
    `When:  ${w.date}, ${w.time}`,
    `       ${w.zone}`,
    `Where: ${bookingConfig.location}`,
    "",
    "What happens next",
    "- Open the attached invite to add the call to your calendar.",
    `- We'll email you the ${bookingConfig.location} link before the call.`,
    "- Need to change the time? Just reply to this email.",
    "",
    "Talk soon,",
    `The ${siteConfig.companyName} team`,
  ].join("\n")

  return {
    from: fromAddress(),
    to: booking.email,
    replyTo: siteConfig.email,
    subject: `Your call with ${siteConfig.companyName} — ${w.date}, ${formatTime(slot, booking.timeZone)}`,
    html,
    text,
    attachments: [buildIcs(id, booking, slot), logoAttachment()],
  }
}

// ─── Senders ──────────────────────────────────────────────────────────────────

export function sendTeamNotification(id: string, booking: BookingRequest) {
  return sendEmail(buildTeamEmail(id, booking))
}

export function sendClientConfirmation(id: string, booking: BookingRequest) {
  return sendEmail(buildClientEmail(id, booking))
}

/** The logo, embedded inline so it shows without loading remote images. */
function logoAttachment(): EmailAttachment {
  return {
    filename: "uthrix-logo.png",
    content: EMAIL_LOGO_PNG_BASE64,
    contentType: "image/png",
    contentId: EMAIL_LOGO_CID,
  }
}
