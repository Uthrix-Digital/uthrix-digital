/**
 * Structured data (schema.org JSON-LD). Search engines and AI answer engines
 * read it to understand what a page is about and who is behind it. The
 * builders live in `@/lib/schema`.
 *
 * Server Component: the script is in the HTML on first load, so crawlers that
 * don't run JavaScript still see it.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // "<" is escaped so text inside the data can never close the script tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
