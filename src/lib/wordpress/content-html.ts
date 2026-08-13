/** Detect and wrap inline WordPress contact callouts (centered text + phone numbers). */

const CENTERED_P_BLOCK_RE =
  /(?:<p\b[^>]*(?:has-text-align-center|text-align:\s*center)[^>]*>[\s\S]*?<\/p>\s*){2,6}/gi;

const CONSULTATION_TEXT_RE = /مشاوره|ارتباط\s*باشید|تماس\s*با\s*ما|تماس\s*بگیرید/i;
const PHONE_SIGNAL_RE = /tel:|href=["']tel:|09\d{9}|021[\d–—-]+/i;

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
  return wrapWpContactCallouts(fixSplitPersianWords(html));
}
