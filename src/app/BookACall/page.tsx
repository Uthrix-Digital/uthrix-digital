import type { Metadata } from "next"
import { siteConfig } from "@/config/siteConfig"
import { bookingConfig } from "@/lib/booking"
import { BookingLoader } from "./_components/BookingLoader"

export const metadata: Metadata = {
  title: `Book a free ${bookingConfig.durationMinutes}-min call | ${siteConfig.companyName}`,
  description: `Schedule a free ${bookingConfig.durationMinutes}-minute strategy call with ${siteConfig.companyName}. Pick a date, choose a time and tell us about your project.`,
}

export default function BookACallPage() {
  return (
    <div className="relative bg-background text-foreground">
      <div className="mx-auto w-full max-w-[100rem] px-4 pb-20 pt-32 sm:px-6 sm:pb-24 lg:px-[clamp(1.5rem,4vw,4rem)] lg:pt-40">
        <header className="mb-10 grid gap-6 lg:mb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
          <div>
            <p className="font-heading2 flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
              Book a call
            </p>
            <h1 className="font-archivo-black mt-4 text-[clamp(2.5rem,8vw,7rem)] uppercase leading-[0.86] tracking-[-0.06em]">
              Let&apos;s talk <span className="text-brand-text">growth.</span>
            </h1>
          </div>
          <p className="max-w-md text-base leading-7 text-muted-foreground lg:justify-self-end">
            Book a free {bookingConfig.durationMinutes}-minute strategy call with{" "}
            {siteConfig.companyName}. Pick a date, choose a time that works for you,
            and tell us a little about your project.
          </p>
        </header>

        <BookingLoader />
      </div>
    </div>
  )
}
