"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useConsent } from "@/hooks/useConsent";

export function CookieBanner() {
  const { bannerOpen, acceptAll, rejectAll } = useConsent();

  return (
    <AnimatePresence>
      {bannerOpen && (
        <motion.section
          role="region"
          aria-label="Cookie consent"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-x-4 bottom-4 z-60 rounded-2xl border border-border bg-background p-6 text-foreground shadow-2xl sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-md"
        >
          <h2 className="text-lg font-medium leading-6">We use cookies</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            With your permission, we use advertising cookies (Meta Pixel) to
            measure our ads and show you relevant ones. The site works the same
            if you reject them. Read more in our{" "}
            <Link
              href="/privacy#cookies"
              className="text-foreground underline underline-offset-4"
            >
              privacy policy
            </Link>
            .
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button size="sm" className="flex-1" onClick={acceptAll}>
              Accept
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="flex-1"
              onClick={rejectAll}
            >
              Reject
            </Button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
