import { Reveal } from "@/components/shared/(ServicePage)/Reveal";
import { EYEBROW, SECTION_TITLE } from "@/components/shared/(AudiencePage)/styles";

/** Section header: eyebrow + big title on the left, supporting copy on the right. */
export function SectionHead({
  id,
  eyebrow,
  title,
  body,
  dark = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  dark?: boolean;
}) {
  return (
    <Reveal className="mb-[clamp(2.5rem,6vw,5rem)] grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)] lg:items-end lg:gap-16">
      <div>
        <p
          className={
            dark
              ? "font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-background/60"
              : EYEBROW
          }
        >
          {eyebrow}
        </p>
        <h2 id={id} className={`${SECTION_TITLE} mt-4 max-w-[16ch]`}>
          {title}
        </h2>
      </div>
      <p
        className={`max-w-md text-base leading-relaxed sm:text-lg ${
          dark ? "text-background/70" : "text-foreground/75"
        }`}
      >
        {body}
      </p>
    </Reveal>
  );
}
