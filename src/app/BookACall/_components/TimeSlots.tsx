"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, CalendarDays, Moon, Sun, Sunrise } from "lucide-react"
import { cn } from "cn"
import { formatTime, zonedHour } from "@/lib/booking"

type TimeSlotsProps = {
  /** Heading for the selected day, or null when no day is picked yet. */
  dayLabel: string | null
  slots: Date[]
  timeZone: string
  selected: string | null
  onSelect: (iso: string) => void
  onConfirm: () => void
}

const GROUPS = [
  { id: "morning", label: "Morning", icon: Sunrise, test: (h: number) => h < 12 },
  { id: "afternoon", label: "Afternoon", icon: Sun, test: (h: number) => h >= 12 && h < 17 },
  { id: "evening", label: "Evening", icon: Moon, test: (h: number) => h >= 17 },
] as const

export function TimeSlots({
  dayLabel,
  slots,
  timeZone,
  selected,
  onSelect,
  onConfirm,
}: TimeSlotsProps) {
  if (!dayLabel) {
    return (
      <div className="flex h-full min-h-56 flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border px-6 py-10 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-foreground/5">
          <CalendarDays aria-hidden="true" className="size-5 text-muted-foreground" />
        </span>
        <p className="type-label text-foreground">Pick a date first</p>
        <p className="max-w-[16rem] text-sm text-muted-foreground">
          Available times for that day will show up here.
        </p>
      </div>
    )
  }

  const grouped = GROUPS.map((g) => ({
    ...g,
    slots: slots.filter((s) => g.test(zonedHour(s, timeZone))),
  })).filter((g) => g.slots.length > 0)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-heading2 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Available times
        </p>
        <p className="text-xs text-muted-foreground">
          {slots.length} {slots.length === 1 ? "slot" : "slots"}
        </p>
      </div>
      <p className="-mt-3 text-base font-extrabold text-foreground">{dayLabel}</p>

      {slots.length === 0 ? (
        <p className="rounded-card border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No times left on this day — try another date.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {grouped.map((group) => (
            <fieldset key={group.id} className="flex flex-col gap-2.5">
              <legend className="mb-2.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <group.icon aria-hidden="true" className="size-3.5" />
                {group.label}
              </legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-2">
                {group.slots.map((slot) => {
                  const iso = slot.toISOString()
                  const isSelected = iso === selected
                  return (
                    <div
                      key={iso}
                      className={cn(
                        "relative flex h-12 overflow-hidden rounded-control transition-[grid-column] duration-200",
                        isSelected && "col-span-2 sm:col-span-3 lg:col-span-2"
                      )}
                    >
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => onSelect(iso)}
                        className={cn(
                          "flex h-full flex-1 items-center justify-center rounded-control border text-sm font-medium tabular-nums transition-[color,background-color,border-color] duration-150",
                          "outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          isSelected
                            ? "rounded-r-none border-foreground bg-foreground text-background"
                            : "border-border bg-background text-foreground hover:border-brand hover:text-brand-text"
                        )}
                      >
                        {formatTime(slot, timeZone)}
                      </button>
                      <AnimatePresence initial={false}>
                        {isSelected && (
                          <motion.button
                            type="button"
                            onClick={onConfirm}
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "50%", opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className="group/next flex h-full items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-r-control bg-brand text-sm font-extrabold uppercase tracking-[0.08em] text-brand-foreground outline-none transition-colors hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          >
                            Next
                            <ArrowRight
                              aria-hidden="true"
                              className="size-4 transition-transform group-hover/next:translate-x-0.5"
                            />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </div>
      )}
    </div>
  )
}
