"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, CalendarPlus, Check, Clock, Globe2, Video } from "lucide-react"
import { bookingConfig, formatGmtOffset, formatLongDate, formatTime } from "@/lib/booking"
import { siteConfig } from "@/config/siteConfig"

type BookingConfirmationProps = {
  slot: Date
  timeZone: string
  name: string
  email: string
  onBookAnother: () => void
}

function googleCalendarUrl(slot: Date) {
  const end = new Date(slot.getTime() + bookingConfig.durationMinutes * 60_000)
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Strategy call with ${siteConfig.companyName}`,
    dates: `${stamp(slot)}/${stamp(end)}`,
    details: `Free ${bookingConfig.durationMinutes}-minute strategy call. The ${bookingConfig.location} link will be emailed to you.`,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function BookingConfirmation({
  slot,
  timeZone,
  name,
  email,
  onBookAnother,
}: BookingConfirmationProps) {
  const firstName = name.split(" ")[0]
  const end = new Date(slot.getTime() + bookingConfig.durationMinutes * 60_000)

  return (
    <div className="flex flex-col items-center px-2 py-6 text-center sm:py-10">
      <motion.span
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="relative flex size-16 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-[0_12px_36px_-10px_rgb(196_2_2/0.7)]"
      >
        <Check aria-hidden="true" className="size-8" strokeWidth={3} />
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-ping rounded-full bg-brand/30 [animation-iteration-count:2]"
        />
      </motion.span>

      <p className="font-heading2 mt-6 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        Booking confirmed
      </p>
      <h2 className="font-archivo-black mt-2 text-[clamp(1.75rem,4vw,2.75rem)] uppercase leading-[0.95] tracking-[-0.04em] text-foreground">
        You&apos;re booked, <span className="text-brand-text">{firstName}.</span>
      </h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        A calendar invite with the {bookingConfig.location} link is on its way to{" "}
        <span className="font-medium text-foreground">{email}</span>.
      </p>

      <dl className="mt-8 grid w-full max-w-md gap-3 rounded-card border border-border bg-background p-5 text-left text-sm">
        <div className="flex items-start gap-3">
          <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-text" />
          <div>
            <dt className="sr-only">When</dt>
            <dd className="font-extrabold text-foreground">
              {formatTime(slot, timeZone)} – {formatTime(end, timeZone)}
            </dd>
            <dd className="text-muted-foreground">{formatLongDate(slot, timeZone)}</dd>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Globe2 aria-hidden="true" className="size-4 shrink-0 text-brand-text" />
          <dt className="sr-only">Time zone</dt>
          <dd className="text-muted-foreground">
            {timeZone.replace(/_/g, " ")} ({formatGmtOffset(timeZone, slot)})
          </dd>
        </div>
        <div className="flex items-center gap-3">
          <Video aria-hidden="true" className="size-4 shrink-0 text-brand-text" />
          <dt className="sr-only">Where</dt>
          <dd className="text-muted-foreground">{bookingConfig.location}</dd>
        </div>
      </dl>

      <div className="mt-6 flex w-full max-w-md flex-col gap-2.5 whitespace-nowrap sm:max-w-lg sm:flex-row">
        <a
          href={googleCalendarUrl(slot)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-foreground/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <CalendarPlus aria-hidden="true" className="size-4" />
          Add to Google Calendar
        </a>
        <button
          type="button"
          onClick={onBookAnother}
          className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-border px-6 text-sm font-medium text-foreground transition-colors hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Book another time
        </button>
      </div>

      <Link
        href="/"
        className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Back to home
        <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}
