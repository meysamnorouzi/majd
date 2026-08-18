import { ensureHeadingIds } from "@/lib/wordpress/headings";

/** Detect and wrap inline WordPress contact callouts (centered text + phone numbers). */

const CENTERED_P_BLOCK_RE =
  /(?:<p\b[^>]*(?:has-text-align-center|text-align:\s*center)[^>]*>[\s\S]*?<\/p>\s*){2,6}/gi;

const CONSULTATION_TEXT_RE = /مشاوره|ارتباط\s*باشید|تماس\s*با\s*ما|تماس\s*بگیرید/i;
const PHONE_SIGNAL_RE =
  /tel:|href=["']tel:|0?9[\d\u06F0-\u06F9]{2}[\s.\u00A0-]*[\d\u06F0-\u06F9]|0?21[\d\s.\u00A0–—\u06F0-\u06F9-]{7,}/i;

const DIGIT = "[0-9\\u06F0-\\u06F9\\u0660-\\u0669]";
const SEP = "[\\s.\\u00A0\\u200C\\-]";
const JOIN = "(?:[–—\\-/|]|&#8211;|&ndash;|&mdash;|&minus;)";
/** Iranian mobile (09xx…) or Tehran landline (021…). */
const ONE_PHONE = `(?:(?:\\+|00)${DIGIT}{2}${SEP}?)?(?:0?9${DIGIT}{2}(?:${SEP}*${DIGIT}){7}|0?21(?:${SEP}*${DIGIT}){8})`;
const PHONE_SEQ_RE = new RegExp(
  `${ONE_PHONE}(?:\\s*${JOIN}\\s*${ONE_PHONE})*`,
  "g",
);

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactPhoneLine(text: string): string {
  return text
    .replace(/&nbsp;|&#160;/gi, "")
    .replace(/&#8211;|&ndash;|&mdash;|&minus;/gi, "")
    .replace(/[\s.\-–—|/()+]/g, "");
}

function isPhoneLine(text: string): boolean {
  const compact = compactPhoneLine(text);
  return /^(?:\+?98)?0?[0-9\u06F0-\u06F9\u0660-\u0669]{8,24}$/.test(compact);
}

function wrapPhoneSpan(inner: string): string {
  if (/\bwp-phone\b/.test(inner)) return inner;
  return `<span class="wp-phone" dir="ltr">${inner}</span>`;
}

function wrapPhonesInText(text: string): string {
  if (!text) return text;
  PHONE_SEQ_RE.lastIndex = 0;
  return text.replace(PHONE_SEQ_RE, (match) => wrapPhoneSpan(match));
}

function wrapPhonesInFragment(html: string): string {
  return html.replace(/(^|>)([^<]*)/g, (_, prefix: string, text: string) => {
    return prefix + wrapPhonesInText(text);
  });
}

/**
 * Keep phone numbers in source order inside RTL content.
 * Spaced groups ("0912 10 110 92") and dashed pairs ("021…–021…") otherwise
 * render right-to-left as separate bidi runs.
 */
export function isolatePhoneNumbers(html: string): string {
  if (!html) return html;

  return html.replace(
    /<(p|li|h[1-6])(\b[^>]*)>([\s\S]*?)<\/\1>/gi,
    (full, tag: string, attrs: string, inner: string) => {
      if (/\bwp-phone\b/.test(inner)) return full;
      if (isPhoneLine(stripTags(inner))) {
        return `<${tag}${attrs}>${wrapPhoneSpan(inner)}</${tag}>`;
      }
      return `<${tag}${attrs}>${wrapPhonesInFragment(inner)}</${tag}>`;
    },
  );
}

/** Fix WordPress/Elementor splitting Persian words across nested spans (e.g. "ج<span>هت"). */
export function fixSplitPersianWords(html: string): string {
  return html
    .replace(/<strong>\s*ج\s*<span\b([^>]*)>\s*هت/gi, "<strong><span$1>جهت")
    .replace(/<strong>\s*<span\b([^>]*)>\s*مشاوره/gi, "<strong><span$1>مشاوره");
}

export function wrapWpContactCallouts(html: string): string {
  if (!html || html.includes("wp-contact-box")) return html;

  return html.replace(CENTERED_P_BLOCK_RE, (block) => {
    if (block.includes("wp-contact-box")) return block;

    const plain = block.replace(/<[^>]+>/g, " ");
    if (!CONSULTATION_TEXT_RE.test(plain) || !PHONE_SIGNAL_RE.test(block)) {
      return block;
    }

    return `<div class="wp-contact-box">${block}</div>`;
  });
}

export function enhanceWpContentHtml(html: string): string {
  return wrapWpContactCallouts(
    ensureHeadingIds(isolatePhoneNumbers(fixSplitPersianWords(html))),
  );
}
