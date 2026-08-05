type JsonLdValue =
  | Record<string, unknown>
  | Record<string, unknown>[];

/** Safe JSON-LD script for crawlers (escapes `<` to avoid XSS in HTML). */
export function JsonLd({ data }: { data: JsonLdValue }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
