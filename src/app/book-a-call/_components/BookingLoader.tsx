"use client"

import dynamic from "next/dynamic"

/**
 * The scheduler depends on "now" and the visitor's time zone, which only
 * exist in the browser — render it client-only to avoid hydration mismatches.
 */
const BookingFlow = dynamic(() => import("./BookingFlow"), {
  ssr: false,
  loading: () => <BookingSkeleton />,
})

export function BookingLoader() {
  return <BookingFlow />
}

function BookingSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading available times"
      className="grid min-h-[38rem] overflow-hidden rounded-card-lg border border-border bg-surface-raised lg:grid-cols-[19rem_minmax(0,1fr)] xl:grid-cols-[22rem_minmax(0,1fr)]"
    >
      <div className="flex flex-col gap-4 border-b border-border p-8 lg:border-b-0 lg:border-r">
        <div className="h-3 w-28 animate-pulse rounded-full bg-foreground/10" />
        <div className="h-8 w-48 animate-pulse rounded-md bg-foreground/10" />
        <div className="mt-2 h-4 w-40 animate-pulse rounded-full bg-foreground/5" />
        <div className="h-4 w-44 animate-pulse rounded-full bg-foreground/5" />
        <div className="h-4 w-36 animate-pulse rounded-full bg-foreground/5" />
      </div>
      <div className="flex flex-col gap-6 p-8">
        <div className="h-12 w-full max-w-md animate-pulse rounded-control bg-foreground/5" />
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 35 }, (_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-control bg-foreground/[0.04]" />
          ))}
        </div>
      </div>
    </div>
  )
}
