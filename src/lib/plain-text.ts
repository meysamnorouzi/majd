/** Turn WordPress editor entities such as `&nbsp;` into normal spaces. */
export function plainText(value: string | undefined | null): string {
  let text = value ?? "";
  text = text.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, " ");

  for (let i = 0; i < 3; i += 1) {
    const next = text
      .replace(/&amp;(#?[a-z0-9]+;)/gi, "&$1")
      .replace(/&nbsp;|&#160;|&#x0*a0;/gi, " ")
      .replace(/\u00a0/g, " ");
    if (next === text) break;
    text = next;
  }

  return text.replace(/\s+/g, " ").trim();
}
