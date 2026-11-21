"use client"

import * as React from "react"
import { cn } from "cn"
import { Check, ChevronDown, Globe2, Search } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formatGmtOffset, tzOffsetMinutes } from "@/lib/booking"

type ZoneOption = {
  value: string
  city: string
  region: string
  offset: number
  gmt: string
}

function listTimeZones(): string[] {
  const intl = Intl as typeof Intl & {
    supportedValuesOf?: (key: "timeZone") => string[]
  }
  try {
    const zones = intl.supportedValuesOf?.("timeZone")
    if (zones?.length) return zones
  } catch {
    /* fall through */
  }
  return [
    "UTC",
    "Asia/Colombo",
    "Asia/Kolkata",
    "Asia/Dubai",
    "Asia/Singapore",
    "Australia/Sydney",
    "Europe/London",
    "Europe/Berlin",
    "America/New_York",
    "America/Chicago",
    "America/Los_Angeles",
  ]
}

function buildOptions(): ZoneOption[] {
  const now = new Date()
  return listTimeZones()
    .map((value) => {
      const segments = value.split("/")
      return {
        value,
        city: segments[segments.length - 1].replace(/_/g, " "),
        region: segments.length > 1 ? segments[0] : "",
        offset: tzOffsetMinutes(now, value),
        gmt: formatGmtOffset(value, now),
      }
    })
    .sort((a, b) => a.offset - b.offset || a.city.localeCompare(b.city))
}

type TimezonePickerProps = {
  value: string
  onChange: (zone: string) => void
  className?: string
}

export function TimezonePicker({ value, onChange, className }: TimezonePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const options = React.useMemo(() => buildOptions(), [])
  const listRef = React.useRef<HTMLUListElement>(null)
  const labelId = React.useId()

  const current =
    options.find((o) => o.value === value) ??
    ({
      value,
      city: value.split("/").pop()?.replace(/_/g, " ") ?? value,
      region: "",
      offset: 0,
      gmt: formatGmtOffset(value),
    } satisfies ZoneOption)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter(
      (o) =>
        o.value.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q) ||
        o.gmt.toLowerCase().includes(q)
    )
  }, [options, query])

  // Bring the selected zone into view when the list opens.
  React.useEffect(() => {
    if (!open || query) return
    const id = window.requestAnimationFrame(() => {
      listRef.current
        ?.querySelector<HTMLElement>("[data-selected=true]")
        ?.scrollIntoView({ block: "center" })
    })
    return () => window.cancelAnimationFrame(id)
  }, [open, query])

  function select(zone: string) {
    onChange(zone)
    setOpen(false)
    setQuery("")
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span id={labelId} className="type-label text-foreground">
        Time zone
      </span>
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) setQuery("")
        }}
      >
        <PopoverTrigger
          aria-labelledby={labelId}
          className="group flex h-12 w-full items-center gap-3 rounded-control border border-input bg-background px-4 text-left text-sm transition-colors hover:border-foreground/40 focus-visible:border-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-foreground/10 data-popup-open:border-foreground"
        >
          <Globe2 aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate">
            <span className="font-heading2 mr-2 text-xs font-medium text-muted-foreground">
              {current.gmt}
            </span>
            <span className="font-medium text-foreground">{current.city}</span>
            {current.region && (
              <span className="text-muted-foreground"> · {current.region}</span>
            )}
          </span>
          <ChevronDown
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground transition-transform group-data-popup-open:rotate-180"
          />
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={8}
          className="w-(--anchor-width) min-w-[min(90vw,20rem)] gap-0 overflow-hidden rounded-card p-0 sm:p-0"
        >
          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filtered[0]) {
                  e.preventDefault()
                  select(filtered[0].value)
                }
              }}
              placeholder="Search city or GMT offset…"
              aria-label="Search time zones"
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <ul
            ref={listRef}
            role="listbox"
            aria-labelledby={labelId}
            className="max-h-72 overflow-y-auto overscroll-contain p-1.5"
          >
            {filtered.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                No time zones match “{query}”.
              </li>
            )}
            {filtered.map((o) => {
              const selected = o.value === value
              return (
                <li key={o.value} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    data-selected={selected}
                    onClick={() => select(o.value)}
                    className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none data-[selected=true]:bg-muted"
                  >
                    <span className="font-heading2 w-[5.5rem] shrink-0 text-xs text-muted-foreground">
                      {o.gmt}
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                      <span className="text-foreground">{o.city}</span>
                      {o.region && (
                        <span className="text-muted-foreground"> · {o.region}</span>
                      )}
                    </span>
                    {selected && (
                      <Check aria-hidden="true" className="size-4 shrink-0 text-brand-text" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  )
}
