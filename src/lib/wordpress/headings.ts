export type TocNode = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
  children: TocNode[];
};

const HEADING_RE = /<h([2-4])(\b[^>]*)>([\s\S]*?)<\/h\1>/gi;
const CONTACT_BOX_RE = /<div class="wp-contact-box">[\s\S]*?<\/div>/gi;

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
      String.fromCharCode(parseInt(n, 16)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/gi, " ");
}

function headingText(inner: string): string {
  return decodeEntities(stripTags(inner)).replace(/\s+/g, " ").trim();
}

function slugify(text: string): string {
  const slug = text
    .trim()
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 80);
  return slug || "section";
}

function uniqueId(base: string, used: Set<string>): string {
  let id = base;
  let n = 2;
  while (used.has(id)) {
    id = `${base}-${n++}`;
  }
  used.add(id);
  return id;
}

function existingId(attrs: string): string | null {
  const match = attrs.match(/\bid\s*=\s*["']([^"']+)["']/i);
  const id = match?.[1]?.trim();
  return id || null;
}

function nestToc(
  items: { id: string; text: string; level: 2 | 3 | 4 }[],
): TocNode[] {
  const root: TocNode[] = [];
  const stack: TocNode[] = [];

  for (const item of items) {
    const node: TocNode = { ...item, children: [] };
    while (stack.length && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }
    if (!stack.length) {
      root.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }
    stack.push(node);
  }

  return root;
}

/** Add stable ids to h2–h4 so in-page TOC links can jump to them. */
export function ensureHeadingIds(html: string): string {
  if (!html) return html;

  const used = new Set<string>();
  HEADING_RE.lastIndex = 0;

  return html.replace(HEADING_RE, (full, level, attrs: string, inner: string) => {
    const current = existingId(attrs);
    if (current) {
      used.add(current);
      return full;
    }
    const text = headingText(inner);
    if (!text) return full;
    const id = uniqueId(slugify(text), used);
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });
}

/**
 * Nested outline from article headings (h2 / h3 / h4).
 * h4 nests under the preceding h3, h3 under the preceding h2.
 */
export function extractContentToc(html: string): TocNode[] {
  if (!html) return [];

  const source = html.replace(CONTACT_BOX_RE, " ");
  const items: { id: string; text: string; level: 2 | 3 | 4 }[] = [];
  const used = new Set<string>();
  const re = new RegExp(HEADING_RE.source, "gi");

  let match: RegExpExecArray | null;
  while ((match = re.exec(source))) {
    const level = Number(match[1]) as 2 | 3 | 4;
    const text = headingText(match[3]);
    if (!text) continue;
    const id = existingId(match[2]) ?? uniqueId(slugify(text), used);
    used.add(id);
    items.push({ id, text, level });
  }

  return nestToc(items);
}

export function flattenToc(nodes: TocNode[]): TocNode[] {
  const out: TocNode[] = [];
  for (const node of nodes) {
    out.push(node);
    if (node.children.length) out.push(...flattenToc(node.children));
  }
  return out;
}
