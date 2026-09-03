/**
 * Split HTML into N roughly equal chunks on paragraph boundaries
 * so pillar/sub-pillar templates can interleave CTAs and forms.
 */
export function splitHtmlIntoParts(html: string, parts = 3): string[] {
  const trimmed = html.trim();
  if (!trimmed) return Array.from({ length: parts }, () => "");

  const blocks = trimmed.split(/(?=<p[\s>])/i).filter((block) => block.trim());
  if (blocks.length <= 1) {
    const out = [trimmed, ...Array.from({ length: parts - 1 }, () => "")];
    return out.slice(0, parts);
  }

  const size = Math.max(1, Math.ceil(blocks.length / parts));
  const result: string[] = [];
  for (let i = 0; i < parts; i += 1) {
    result.push(blocks.slice(i * size, (i + 1) * size).join("").trim());
  }
  while (result.length < parts) result.push("");
  return result.slice(0, parts);
}
