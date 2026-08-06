"use client";

import { useMemo } from "react";
import { BlogEmbedCard } from "@/components/content/BlogEmbedCard";
import { splitWpContent } from "@/lib/wordpress/shortcodes";

/**
 * Renders WordPress HTML and expands `[majd_blog]` shortcodes into embed cards.
 *
 * Editor usage examples:
 * `[majd_blog url="https://vakilmajd.com/blog/post/slug/"]`
 * `[majd_blog slug="slug"]`
 */
export function WpRichContent({
  html,
  className,
  proseClassName = "prose-wp",
}: {
  html: string;
  className?: string;
  proseClassName?: string;
}) {
  const parts = useMemo(() => splitWpContent(html), [html]);

  return (
    <div className={className} dir="rtl">
      {parts.map((part, index) => {
        if (part.type === "blog") {
          return (
            <BlogEmbedCard key={`blog-${part.slug}-${index}`} slug={part.slug} />
          );
        }

        return (
          <div
            key={`html-${index}`}
            className={proseClassName}
            dangerouslySetInnerHTML={{ __html: part.html }}
          />
        );
      })}
    </div>
  );
}
