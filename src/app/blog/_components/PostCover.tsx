import Image from "next/image";

import type { PostCover as PostCoverData } from "@/config/blog";

interface PostCoverProps {
  cover?: PostCoverData;
  /** "card": 16:9 for lists. "wide": 21:9 for the top of a post. */
  variant: "card" | "wide";
  /** Shown on the placeholder when a post has no cover image yet. */
  topicLabel: string;
  /** Only for the first image on screen (largest contentful paint). */
  priority?: boolean;
  /** next/image sizes: how wide the image is shown at each breakpoint. */
  sizes: string;
  /** Hide the topic name on the placeholder when a tag already shows it. */
  hideLabel?: boolean;
  className?: string;
}

/**
 * A post's cover image from Sanity, at a fixed aspect ratio so the page
 * never jumps while it loads. Posts without a cover get a branded
 * placeholder instead of an empty box.
 */
export function PostCover({
  cover,
  variant,
  topicLabel,
  priority = false,
  sizes,
  hideLabel = false,
  className = "",
}: PostCoverProps) {
  const ratio = variant === "wide" ? "aspect-[21/9]" : "aspect-video";

  if (!cover) {
    return (
      <div
        aria-hidden="true"
        className={`relative flex ${ratio} items-end overflow-hidden rounded-card-lg bg-brand-surface-foreground p-[clamp(1rem,3vw,2rem)] text-white ${className}`}
      >
        <span className="absolute -right-[0.06em] -top-[0.18em] font-archivo-black text-[clamp(6rem,18vw,16rem)] leading-none text-brand opacity-90">
          U
        </span>
        {!hideLabel && (
          <span className="relative font-archivo-black text-[clamp(1.1rem,2.4vw,2rem)] uppercase leading-[0.9] tracking-[-0.06em]">
            {topicLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${ratio} overflow-hidden rounded-card-lg bg-muted ${className}`}>
      <Image
        src={variant === "wide" ? cover.wide : cover.card}
        alt={cover.alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={cover.lqip ? "blur" : "empty"}
        blurDataURL={cover.lqip}
        className="object-cover"
      />
    </div>
  );
}
