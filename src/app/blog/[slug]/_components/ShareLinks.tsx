"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

interface ShareLinksProps {
  /** The post's full address, e.g. https://uthrix.com/blog/<slug>. */
  url: string;
  title: string;
}

const buttonClass =
  "inline-flex size-10 items-center justify-center rounded-full border border-border text-xs font-semibold transition-colors hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

/** Plain share links (no third-party scripts) plus copy-link. */
export function ShareLinks({ url, title }: ShareLinksProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { label: "Share on LinkedIn", short: "in", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: "Share on WhatsApp", short: "WA", href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: "Share on X", short: "X", href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context): nothing else to do.
    }
  };

  return (
    <div>
      <p className="nav-panel-label mb-3">Share</p>
      <ul className="flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.short}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className={buttonClass}
            >
              {link.short}
            </a>
          </li>
        ))}
        <li>
          <button type="button" onClick={copy} aria-label="Copy link" className={buttonClass}>
            {copied ? (
              <Check aria-hidden="true" className="size-4 text-brand-text" />
            ) : (
              <Link2 aria-hidden="true" className="size-4" />
            )}
          </button>
        </li>
      </ul>
      <p aria-live="polite" className="sr-only">
        {copied ? "Link copied" : ""}
      </p>
    </div>
  );
}
