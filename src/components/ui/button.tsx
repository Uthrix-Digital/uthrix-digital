import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/**
 * Button — Uthrix Design System
 *
 * Implements the UX designer spec (Website Component Library / 01):
 *   One clear action. Three appearances. Four visual states.
 *   Pill controls use 16/24 Medium type and a 48 px touch target.
 *
 * Variant × State matrix:
 *   Primary   | default: black fill, white text
 *             | hover:   white bg + black border + black text (inversion)
 *             | pressed: deep charcoal fill, white text
 *             | disabled: muted-foreground fill, white text, no opacity fade
 *
 *   Secondary | default: light grey fill, dark text
 *             | hover:   slightly darker grey (+8 % foreground mix)
 *             | pressed: noticeably darker grey (+18 % foreground mix)
 *             | disabled: very light grey fill, muted-foreground text
 *
 *   Ghost     | default: transparent bg, dark text, no border
 *             | hover:   light grey fill (muted token)
 *             | pressed: medium grey fill (border token)
 *             | disabled: transparent, muted-foreground text only
 */
const buttonVariants = cva(
  // ─── Base — shared across all variants ───────────────────────────────────
  [
    "group/button",
    "inline-flex shrink-0 items-center justify-center",
    // Pill shape — fully rounded per spec
    "rounded-full",
    // Border slot — each variant sets its own border colour
    "border border-transparent bg-clip-padding",
    // Typography: 16 px / 24 lh Medium — matches spec
    "text-base leading-6 font-medium whitespace-nowrap",
    "select-none cursor-pointer",
    // 150 ms transition — snappy, not sluggish
    "transition-[color,background-color,border-color,box-shadow] duration-150 ease-in-out",
    // Focus ring — 2 px ring + 2 px offset, uses --ring token
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    // Disabled — pointer events off; colour handled per-variant
    "disabled:pointer-events-none",
    // Validation state
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
    "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
    // SVG icons
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        // ── Primary ────────────────────────────────────────────────────────
        // Spec: solid black (foreground) fill with white text at rest,
        //       inverts to white + black border on hover,
        //       pressed darkens to near-black charcoal,
        //       disabled uses a mid-grey fill so it reads as unavailable.
        default: [
          // ① default
          "bg-foreground text-background",
          // ② hover — inversion: transparent bg, black border, black text
          "hover:bg-background hover:border-foreground hover:text-foreground",
          // ③ pressed — deep charcoal (oklch ≈ #1a1a1a), resets border
          "active:bg-[oklch(0.18_0_0)] active:text-background active:border-transparent",
          // ④ disabled — medium grey fill, white text (communicates state without opacity trick)
          "disabled:bg-muted-foreground disabled:text-background disabled:opacity-100",
        ],

        // ── Secondary ──────────────────────────────────────────────────────
        // Spec: light grey pill at rest, darkens progressively on hover → pressed,
        //       becomes very light with muted text when disabled.
        secondary: [
          // ① default
          "bg-secondary text-secondary-foreground",
          // ② hover — foreground 8 % tint into secondary
          "hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_8%)] hover:text-foreground",
          // ③ pressed — foreground 18 % tint
          "active:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_18%)] active:text-foreground",
          // ④ disabled — background 40 % lightens fill; muted text
          "disabled:bg-[color-mix(in_oklch,var(--secondary),var(--background)_40%)] disabled:text-muted-foreground disabled:opacity-100",
        ],

        // ── Ghost ──────────────────────────────────────────────────────────
        // Spec: no background / no border at rest, fills with muted on hover,
        //       slightly darker (border token) on press, muted text when disabled.
        ghost: [
          // ① default
          "bg-transparent text-foreground",
          // ② hover — light grey fill
          "hover:bg-muted hover:text-foreground",
          // ③ pressed — medium grey (border token is slightly darker than muted)
          "active:bg-border active:text-foreground",
          // ④ disabled — no fill, muted text only
          "disabled:bg-transparent disabled:text-muted-foreground disabled:opacity-100",
          // Dark mode adjustments
          "dark:hover:bg-muted/50",
        ],

        // ── Outline ────────────────────────────────────────────────────────
        // Kept for compatibility; not part of the current spec sheet.
        outline: [
          "border-border bg-background text-foreground",
          "hover:bg-muted hover:text-foreground",
          "aria-expanded:bg-muted aria-expanded:text-foreground",
          "active:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_10%)]",
          "disabled:opacity-50",
          "dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        ],

        // ── Destructive ────────────────────────────────────────────────────
        destructive: [
          "bg-destructive/10 text-destructive",
          "hover:bg-destructive/20",
          "active:bg-destructive/25",
          "focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
          "dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
          "disabled:opacity-50",
        ],

        // ── Link ───────────────────────────────────────────────────────────
        link: "text-primary underline-offset-4 hover:underline",
      },

      size: {
        // 48 px — the spec explicitly calls for a 48 px touch target
        default: "h-12 gap-2 px-10 has-data-[icon=inline-end]:pr-8 has-data-[icon=inline-start]:pl-8",
        xs: "h-8 gap-1 px-3 text-xs in-data-[slot=button-group]:rounded-full has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-10 gap-1.5 px-6 text-sm in-data-[slot=button-group]:rounded-full has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-14 gap-2 px-12 text-lg has-data-[icon=inline-end]:pr-10 has-data-[icon=inline-start]:pl-10",
        icon: "size-12",
        "icon-xs": "size-8 in-data-[slot=button-group]:rounded-full [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-10 in-data-[slot=button-group]:rounded-full",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
