"use client";

import { useMemo } from "react";
import { BlogEmbedCard } from "@/components/content/BlogEmbedCard";
import { ContentContactBox } from "@/components/content/ContentContactBox";
import { splitWpContent } from "@/lib/wordpress/shortcodes";

/**
 * Renders WordPress HTML and expands shortcodes into rich components.
 *
 * Editor usage examples:
 * `[majd_blog url="https://vakilmajd.com/blog/post/slug/"]`
 * `[majd_blog slug="slug"]`
 * `[majd_contact title="نیاز به مشاوره دارید؟" subject="مشاوره حقوقی"]`
 */
export function WpRichContent({
  html,
  className,
  proseClassName = "prose-wp",
  defaultContactMessage = "",
  showTrailingContact = false,
  trailingContactTitle,
  trailingContactDescription,
}: {
  html: string;
  className?: string;
  proseClassName?: string;
  /** Pre-filled message for `[majd_contact]` and trailing contact box */
  defaultContactMessage?: string;
  /** Append a contact form after content (blog/service detail pattern) */
  showTrailingContact?: boolean;
  trailingContactTitle?: string;
  trailingContactDescription?: string;
}) {
  const parts = useMemo(() => splitWpContent(html), [html]);
  const hasInlineContact = parts.some((p) => p.type === "contact");

  return (
    <div className={className} dir="rtl">
      {parts.map((part, index) => {
        if (part.type === "blog") {
          return (
            <BlogEmbedCard key={`blog-${part.slug}-${index}`} slug={part.slug} />
          );
        }

        if (part.type === "contact") {
          const attrs = part.attrs;
          return (
            <ContentContactBox
              key={`contact-${index}`}
              title={attrs.title || attrs.heading}
              description={attrs.description || attrs.desc}
              defaultSubject={attrs.subject || attrs.area || "مشاوره حقوقی"}
              defaultMessage={attrs.message || defaultContactMessage}
              showLawyerPicker={attrs.lawyer !== "false"}
            />
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

      {showTrailingContact && !hasInlineContact ? (
        <ContentContactBox
          title={trailingContactTitle}
          description={trailingContactDescription}
          defaultMessage={defaultContactMessage}
        />
      ) : null}
    </div>
  );
}
