/**
 * Split HTML into N chunks so a landing can place a call button and a form
 * between sections. Headings stay with the paragraphs that follow them.
 */
export function splitHtmlIntoParts(html: string, parts = 3): string[] {
  const trimmed = html.trim();
  const empty = Array.from({ length: parts }, () => "");
  if (!trimmed) return empty;

  const sections = trimmed
    .split(/(?=<h2\b)/i)
    .map((section) => section.trim())
    .filter(Boolean);

  if (sections.length >= 2) {
    return packBlocks(sections, parts);
  }

  const blocks = trimmed.split(/(?=<p[\s>])/i).filter((block) => block.trim());
  if (blocks.length <= 1) {
    return [trimmed, ...empty.slice(1)].slice(0, parts);
  }
  return packBlocks(blocks, parts);
}

function packBlocks(blocks: string[], parts: number): string[] {
  const size = Math.max(1, Math.ceil(blocks.length / parts));
  const result: string[] = [];
  for (let i = 0; i < parts; i += 1) {
    result.push(blocks.slice(i * size, (i + 1) * size).join("\n").trim());
  }
  while (result.length < parts) result.push("");
  return result.slice(0, parts);
}
