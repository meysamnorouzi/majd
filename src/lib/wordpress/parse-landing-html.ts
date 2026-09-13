import type {
  PillarLanding,
  PillarLandingCardCopy,
  PillarLandingProcessStep,
  PillarLandingSection,
  PillarLandingSubsection,
} from "@/data/pillar-landings";
import type { ServiceFAQ } from "@/types";

type LandingChunk = {
  tag: "h2" | "h3" | "p" | "li";
  text: string;
};

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#8220;|&#8221;/g, "«")
    .replace(/&[a-z]+;/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeLandingHtml(html: string): LandingChunk[] {
  const chunks: LandingChunk[] = [];
  const re = /<(h2|h3|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  for (const match of html.matchAll(re)) {
    const tag = match[1].toLowerCase() as LandingChunk["tag"];
    const text = stripTags(match[2]);
    if (text) chunks.push({ tag, text });
  }
  return chunks;
}

function isFaqHeading(heading: string): boolean {
  return /سوالات متداول|سؤالات متداول|پرسش‌های متداول|پرسش های متداول/.test(
    heading,
  );
}

function isCtaHeading(heading: string): boolean {
  return /همین حالا|مشورت کنید|تماس بگیرید/.test(heading);
}

function isServicesHeading(heading: string, isFirst: boolean): boolean {
  return isFirst || /خدمات تخصصی|خدمات ما|خدمات .*حوزه/.test(heading);
}

function isProcessHeading(heading: string): boolean {
  return /مراحل/.test(heading);
}

function isWhyLawyerHeading(heading: string): boolean {
  return /چرا/.test(heading) && /وکیل/.test(heading) && /نیاز/.test(heading);
}

function needlesFromTitle(title: string): string[] {
  const parts = title
    .split(/[\s،,()]+/)
    .map((part) => part.trim())
    .filter(
      (part) =>
        part.length >= 3 &&
        !["وکیل", "شامل", "حوزه", "دعاوی"].includes(part),
    );
  return parts.length ? parts : [title];
}

function parseFaqs(chunks: LandingChunk[]): ServiceFAQ[] {
  const faqs: ServiceFAQ[] = [];
  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    if (!chunk) continue;

    if (chunk.tag === "h3") {
      const answer = chunks
        .slice(i + 1)
        .find((item) => item.tag === "p")
        ?.text;
      if (answer) faqs.push({ q: chunk.text, a: answer });
      continue;
    }

    const numbered = chunk.text.match(/^\d+[.)]\s*(.+)$/);
    if (chunk.tag === "p" && numbered?.[1]) {
      const next = chunks[i + 1];
      if (next?.tag === "p" && !/^\d+[.)]/.test(next.text)) {
        faqs.push({ q: numbered[1], a: next.text });
      }
    }
  }
  return faqs;
}

function parseSteps(chunks: LandingChunk[]): PillarLandingProcessStep[] {
  const items = chunks.filter((chunk) => chunk.tag === "li" || chunk.tag === "h3");
  return items.map((item) => {
    const [title, ...rest] = item.text.split(/\s*[—–:\-]\s*/);
    return {
      title: (title || item.text).trim(),
      description: rest.join(" ").trim() || item.text,
    };
  });
}

function groupByH2(chunks: LandingChunk[]): {
  heading: string;
  body: LandingChunk[];
}[] {
  const groups: { heading: string; body: LandingChunk[] }[] = [];
  let current: { heading: string; body: LandingChunk[] } | null = null;

  for (const chunk of chunks) {
    if (chunk.tag === "h2") {
      current = { heading: chunk.text, body: [] };
      groups.push(current);
      continue;
    }
    if (!current) continue;
    current.body.push(chunk);
  }

  return groups;
}

export function parseLandingHtml(
  html: string,
  defaults: Pick<
    PillarLanding,
    | "heroTitle"
    | "heroDescription"
    | "seoTitle"
    | "seoDescription"
    | "keywords"
    | "cta"
  > & {
    servicesHeading?: string;
  },
): PillarLanding | null {
  const chunks = tokenizeLandingHtml(html);
  if (!chunks.some((chunk) => chunk.tag === "h2")) return null;

  const groups = groupByH2(chunks);
  if (!groups.length) return null;

  let servicesHeading = defaults.servicesHeading ?? groups[0]!.heading;
  let servicesIntro: string[] = [];
  const cardCopy: PillarLandingCardCopy[] = [];
  const sections: PillarLandingSection[] = [];
  let faqsHeading = "سوالات متداول";
  let faqs: ServiceFAQ[] = [];
  const cta = { ...defaults.cta };

  groups.forEach((group, index) => {
    const paragraphs = group.body
      .filter((chunk) => chunk.tag === "p")
      .map((chunk) => chunk.text);
    const h3s = group.body.filter((chunk) => chunk.tag === "h3");

    if (isFaqHeading(group.heading)) {
      faqsHeading = group.heading;
      faqs = parseFaqs(group.body);
      return;
    }

    if (isCtaHeading(group.heading)) {
      cta.heading = group.heading;
      if (paragraphs.length) cta.paragraphs = paragraphs;
      return;
    }

    if (isServicesHeading(group.heading, index === 0) && !cardCopy.length) {
      servicesHeading = group.heading;
      const firstH3 = group.body.findIndex((chunk) => chunk.tag === "h3");
      servicesIntro = group.body
        .filter((chunk, i) => chunk.tag === "p" && (firstH3 === -1 || i < firstH3))
        .map((chunk) => chunk.text);

      let currentTitle = "";
      let currentParas: string[] = [];
      const flushCard = () => {
        if (!currentTitle || !currentParas.length) return;
        cardCopy.push({
          slugs: [],
          titleIncludes: needlesFromTitle(currentTitle),
          title: currentTitle,
          excerpt: currentParas.join(" "),
        });
      };

      for (const chunk of group.body) {
        if (chunk.tag === "h3") {
          flushCard();
          currentTitle = chunk.text;
          currentParas = [];
          continue;
        }
        if (chunk.tag === "p" && currentTitle) currentParas.push(chunk.text);
      }
      flushCard();
      return;
    }

    const subsections: PillarLandingSubsection[] = [];
    let currentSub: PillarLandingSubsection | null = null;
    const lead: string[] = [];

    for (const chunk of group.body) {
      if (chunk.tag === "h3") {
        currentSub = { heading: chunk.text, paragraphs: [] };
        subsections.push(currentSub);
        continue;
      }
      if (chunk.tag === "p") {
        if (currentSub) currentSub.paragraphs.push(chunk.text);
        else lead.push(chunk.text);
      }
    }

    const process = isProcessHeading(group.heading);
    const steps = process ? parseSteps(group.body) : [];

    const section: PillarLandingSection = {
      heading: group.heading,
      paragraphs: lead.length ? lead : paragraphs.filter((_, i) => i < 4),
      variant: isWhyLawyerHeading(group.heading)
        ? "navy"
        : process
          ? "muted"
          : "default",
    };

    if (steps.length >= 2) section.steps = steps;
    else if (subsections.length) section.subsections = subsections;

    sections.push(section);
  });

  return {
    heroTitle: defaults.heroTitle,
    heroDescription: defaults.heroDescription,
    seoTitle: defaults.seoTitle,
    seoDescription: defaults.seoDescription,
    keywords: defaults.keywords,
    servicesHeading,
    servicesIntro: servicesIntro.length
      ? servicesIntro
      : [defaults.heroDescription],
    cardCopy,
    sections,
    faqsHeading,
    faqs,
    cta,
  };
}
