"use client"

/**
 * Calendar — Uthrix Design System
 *
 * shadcn/ui's Calendar (react-day-picker v9) restyled to the site system:
 *   • Mono uppercase weekday labels, Archivo Black month caption.
 *   • Square-ish 16px "control" radius cells, 44px+ touch targets.
 *   • Selected day = solid brand red; today = brand dot underneath.
 *   • Disabled days fade and lose pointer events.
 */

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, getDefaultClassNames, type DayButton } from "react-day-picker"
import { cn } from "cn"

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaults = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("w-full select-none", className)}
      classNames={{
        root: cn("w-full", defaults.root),
        months: cn("relative flex w-full flex-col", defaults.months),
        month: cn("flex w-full flex-col gap-5", defaults.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex items-center justify-end gap-2",
          defaults.nav
        ),
        button_previous: cn(
          "inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-30",
          defaults.button_previous
        ),
        button_next: cn(
          "inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-30",
          defaults.button_next
        ),
        month_caption: cn("flex h-10 items-center", defaults.month_caption),
        caption_label: cn(
          "font-archivo-black text-xl uppercase tracking-[-0.03em] text-foreground sm:text-2xl",
          defaults.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaults.month_grid),
        weekdays: cn("flex", defaults.weekdays),
        weekday: cn(
          "font-heading2 flex-1 pb-2 text-center text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground",
          defaults.weekday
        ),
        week: cn("mt-1.5 flex w-full gap-1.5", defaults.week),
        day: cn(
          "relative aspect-square flex-1 p-0 text-center",
          defaults.day
        ),
        today: cn("", defaults.today),
        outside: cn("text-muted-foreground/40", defaults.outside),
        disabled: cn("", defaults.disabled),
        hidden: cn("invisible", defaults.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClass, ...rest }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("size-4", chevronClass)} {...rest} />
          ) : (
            <ChevronRight className={cn("size-4", chevronClass)} {...rest} />
          ),
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.date.toDateString()}
      data-selected={modifiers.selected || undefined}
      data-today={modifiers.today || undefined}
      data-available={!modifiers.disabled || undefined}
      className={cn(
        "group/day relative flex size-full items-center justify-center rounded-control font-sans text-sm font-medium tabular-nums transition-[color,background-color,border-color,transform] duration-150 sm:text-base",
        "border border-transparent",
        // Available day: subtle tinted chip so bookable days read at a glance
        "data-available:bg-foreground/[0.045] data-available:text-foreground data-available:hover:border-foreground data-available:hover:bg-background",
        // Selected
        "data-selected:bg-brand! data-selected:text-brand-foreground! data-selected:border-transparent! data-selected:shadow-[0_8px_24px_-8px_rgb(196_2_2/0.6)]",
        // Disabled
        "disabled:pointer-events-none disabled:text-muted-foreground/40",
        "active:scale-95",
        "outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      {...props}
    >
      {props.children}
      {modifiers.today && (
        <span
          aria-hidden="true"
          className="absolute bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-brand group-data-selected/day:bg-brand-foreground sm:bottom-2"
        />
      )}
    </button>
  )
}

export { Calendar, CalendarDayButton }
