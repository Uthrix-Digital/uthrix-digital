"use client"

/**
 * BookingFlow — "Book a free call" scheduler.
 *
 *   1. Schedule  — pick a date on the calendar, then a time slot.
 *   2. Details   — fill the inquiry form.
 *   3. Done      — confirmation + add-to-calendar.
 *
 * Rendered client-only (see BookingLoader) because "today" and the visitor's
 * time zone only exist in the browser.
 */

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowLeft,
  BadgeCheck,
  CalendarCheck2,
  Check,
  Clock,
  Globe2,
  Video,
} from "lucide-react"
import { cn } from "cn"
import { Calendar } from "@/components/ui/calendar"
import {
  bookingConfig,
  dateKeyInZone,
  formatGmtOffset,
  formatLongDate,
  formatTime,
  getSlotsForDate,
  isValidTimeZone,
  keyToLocalDate,
  localDateKey,
  type BookingDetails,
} from "@/lib/booking"
import { TimezonePicker } from "./TimezonePicker"
import { TimeSlots } from "./TimeSlots"
import { BookingDetailsForm, EMPTY_DETAILS } from "./BookingDetailsForm"
import { BookingConfirmation } from "./BookingConfirmation"

type Step = "schedule" | "details" | "done"

const STEPS: { id: Step; label: string }[] = [
  { id: "schedule", label: "Date & time" },
  { id: "details", label: "Your details" },
  { id: "done", label: "Confirmed" },
]

const EASE = [0.22, 1, 0.36, 1] as const

const AGENDA = [
  "Where your growth is stuck today",
  "Quick wins for your website, ads or content",
  "A clear next step — no hard sell",
]

function detectTimeZone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (tz && isValidTimeZone(tz)) return tz
  } catch {
    /* ignore */
  }
  return bookingConfig.hostTimeZone
}

function dayHeading(key: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(keyToLocalDate(key))
}

export default function BookingFlow() {
  const [now] = React.useState(() => new Date())
  const [timeZone, setTimeZone] = React.useState(detectTimeZone)
  const [step, setStep] = React.useState<Step>("schedule")
  const [dateKey, setDateKey] = React.useState<string | null>(null)
  const [slotIso, setSlotIso] = React.useState<string | null>(null)
  const [details, setDetails] = React.useState<BookingDetails>(EMPTY_DETAILS)
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  const cardRef = React.useRef<HTMLElement>(null)
  const slotsRef = React.useRef<HTMLDivElement>(null)

  // Every visitor-local day in the booking window that has at least one slot.
  const availability = React.useMemo(() => {
    const map = new Map<string, Date[]>()
    const todayKey = dateKeyInZone(now, timeZone)
    const start = keyToLocalDate(todayKey)
    for (let i = 0; i <= bookingConfig.maxDaysAhead + 1; i++) {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
      const key = localDateKey(d)
      const slots = getSlotsForDate(key, timeZone, now)
      if (slots.length) map.set(key, slots)
    }
    return { map, todayKey }
  }, [now, timeZone])

  const availableKeys = [...availability.map.keys()]
  const firstKey = availableKeys[0]
  const lastKey = availableKeys[availableKeys.length - 1]

  const slots = dateKey ? (availability.map.get(dateKey) ?? []) : []
  const selectedSlot = slotIso ? new Date(slotIso) : null

  function scrollCardIntoView() {
    const top = cardRef.current?.getBoundingClientRect().top ?? 0
    if (top < 80) {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  function handleDateSelect(date: Date | undefined) {
    if (!date) return
    setDateKey(localDateKey(date))
    setSlotIso(null)
    // On stacked (mobile/tablet) layouts, bring the times into view.
    if (window.matchMedia("(max-width: 767px)").matches) {
      requestAnimationFrame(() =>
        slotsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      )
    }
  }

  function handleTimeZoneChange(zone: string) {
    setTimeZone(zone)
    setSlotIso(null)
  }

  function goToDetails() {
    if (!slotIso) return
    setSubmitError(null)
    setStep("details")
    requestAnimationFrame(scrollCardIntoView)
  }

  function backToSchedule() {
    setStep("schedule")
    requestAnimationFrame(scrollCardIntoView)
  }

  async function submit(values: BookingDetails, trap: string) {
    if (!slotIso) return
    setSubmitError(null)
    try {
      const res = await fetch("/api/book-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, slot: slotIso, timeZone, bk_check: trap }),
      })
      const data = (await res.json().catch(() => null)) as
        | { ok: boolean; error?: string }
        | null
      if (!res.ok || !data?.ok) {
        setSubmitError(
          data?.error ?? "Something went wrong. Please try again in a moment."
        )
        return
      }
      setStep("done")
      requestAnimationFrame(scrollCardIntoView)
    } catch {
      setSubmitError("We couldn't reach the server. Check your connection and try again.")
    }
  }

  function reset() {
    setDetails(EMPTY_DETAILS)
    setSlotIso(null)
    setDateKey(null)
    setSubmitError(null)
    setStep("schedule")
  }

  const stepIndex = STEPS.findIndex((s) => s.id === step)

  return (
    <section
      ref={cardRef}
      aria-label="Book a call"
      className="scroll-mt-28 overflow-hidden rounded-card-lg border border-border bg-surface-raised"
    >
      <div className="grid lg:grid-cols-[19rem_minmax(0,1fr)] xl:grid-cols-[22rem_minmax(0,1fr)]">
        {/* ── Summary rail ─────────────────────────────────────────────── */}
        <aside className="flex flex-col gap-6 border-b border-border p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <div>
            <p className="font-heading2 flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
              Free strategy call
            </p>
            <h2 className="font-archivo-black mt-3 text-[1.75rem] uppercase leading-[0.95] tracking-[-0.04em] text-foreground">
              {bookingConfig.durationMinutes}-min growth <span className="text-brand-text">call.</span>
            </h2>
          </div>

          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-center gap-3 text-foreground">
              <Clock aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
              {bookingConfig.durationMinutes} minutes
            </li>
            <li className="flex items-center gap-3 text-foreground">
              <Video aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
              {bookingConfig.location} — link sent by email
            </li>
            <li className="flex items-center gap-3 text-foreground">
              <BadgeCheck aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
              Free, no obligation
            </li>
            <li className="flex items-center gap-3 text-foreground">
              <Globe2 aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">
                {timeZone.replace(/_/g, " ")} ({formatGmtOffset(timeZone, now)})
              </span>
            </li>
          </ul>

          {/* Selected slot — appears once a time is picked */}
          <AnimatePresence initial={false}>
            {selectedSlot && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-3 rounded-card border border-brand/30 bg-brand/[0.06] p-4">
                  <CalendarCheck2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-text" />
                  <div className="text-sm">
                    <p className="font-extrabold text-foreground">
                      {formatTime(selectedSlot, timeZone)} –{" "}
                      {formatTime(
                        new Date(selectedSlot.getTime() + bookingConfig.durationMinutes * 60_000),
                        timeZone
                      )}
                    </p>
                    <p className="text-muted-foreground">{formatLongDate(selectedSlot, timeZone)}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="hidden border-t border-border pt-6 md:block">
            <p className="font-heading2 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              What we&apos;ll cover
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {AGENDA.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-5 text-foreground/85">
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-text" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Stepper */}
          <ol className="mt-auto flex gap-2 border-t border-border pt-6 lg:flex-col lg:gap-3" aria-label="Booking progress">
            {STEPS.map((s, i) => {
              const state = i < stepIndex ? "done" : i === stepIndex ? "current" : "todo"
              return (
                <li
                  key={s.id}
                  aria-current={state === "current" ? "step" : undefined}
                  className="flex flex-1 items-center gap-2.5 text-xs lg:flex-none lg:text-sm"
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border text-[0.7rem] font-extrabold tabular-nums transition-colors",
                      state === "done" && "border-transparent bg-foreground text-background",
                      state === "current" && "border-transparent bg-brand text-brand-foreground",
                      state === "todo" && "border-border text-muted-foreground"
                    )}
                  >
                    {state === "done" ? <Check aria-hidden="true" className="size-3.5" strokeWidth={3} /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      "hidden font-medium sm:inline",
                      state === "todo" ? "text-muted-foreground" : "text-foreground"
                    )}
                  >
                    {s.label}
                  </span>
                </li>
              )
            })}
          </ol>
        </aside>

        {/* ── Step content ─────────────────────────────────────────────── */}
        <div className="min-w-0 bg-background/60 p-5 sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            {step === "schedule" && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-extrabold text-foreground">Select a date &amp; time</h3>
                  <p className="text-sm text-muted-foreground">
                    Pick a day first, then choose a time that suits you.
                  </p>
                </div>

                <TimezonePicker value={timeZone} onChange={handleTimeZoneChange} className="max-w-md" />

                <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_15rem] xl:grid-cols-[minmax(0,1fr)_17rem]">
                  <div className="min-w-0">
                    {firstKey ? (
                      <Calendar
                        mode="single"
                        required
                        selected={dateKey ? keyToLocalDate(dateKey) : undefined}
                        onSelect={handleDateSelect}
                        today={keyToLocalDate(availability.todayKey)}
                        defaultMonth={keyToLocalDate(firstKey)}
                        startMonth={keyToLocalDate(availability.todayKey)}
                        endMonth={keyToLocalDate(lastKey)}
                        disabled={(date) => !availability.map.has(localDateKey(date))}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No availability right now — please check back soon.
                      </p>
                    )}
                    <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <span aria-hidden="true" className="size-3 rounded-[4px] bg-foreground/[0.08]" />
                      Available
                      <span aria-hidden="true" className="ml-3 size-3 rounded-[4px] bg-brand" />
                      Selected
                    </p>
                  </div>

                  <div
                    ref={slotsRef}
                    className="scroll-mt-24 md:border-l md:border-border md:pl-8"
                  >
                    <TimeSlots
                      dayLabel={dateKey ? dayHeading(dateKey) : null}
                      slots={slots}
                      timeZone={timeZone}
                      selected={slotIso}
                      onSelect={setSlotIso}
                      onConfirm={goToDetails}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === "details" && selectedSlot && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="mx-auto flex max-w-2xl flex-col gap-6"
              >
                <button
                  type="button"
                  onClick={backToSchedule}
                  className="group inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <ArrowLeft aria-hidden="true" className="size-4 transition-transform group-hover:-translate-x-0.5" />
                  Change date or time
                </button>

                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-extrabold text-foreground">Tell us about you</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatLongDate(selectedSlot, timeZone)} at{" "}
                    <span className="font-medium text-foreground">{formatTime(selectedSlot, timeZone)}</span>
                    {" · "}
                    {bookingConfig.durationMinutes} min
                  </p>
                </div>

                <BookingDetailsForm
                  values={details}
                  onChange={setDetails}
                  onSubmit={submit}
                  submitError={submitError}
                />
              </motion.div>
            )}

            {step === "done" && selectedSlot && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <BookingConfirmation
                  slot={selectedSlot}
                  timeZone={timeZone}
                  name={details.name}
                  email={details.email}
                  onBookAnother={reset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
