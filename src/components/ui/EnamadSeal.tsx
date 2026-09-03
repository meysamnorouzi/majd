import { siteConfig } from "@/data/site";

/** Official Enamad trust-seal embed — keep attributes as Enamad requires. */
export function EnamadSeal({ className }: { className?: string }) {
  const { href, image, code } = siteConfig.enamad;

  return (
    <a referrerPolicy="origin" target="_blank" href={href} className={className}>
      <img
        referrerPolicy="origin"
        src={image}
        alt=""
        width={125}
        height={54}
        loading="lazy"
        decoding="async"
        style={{ cursor: "pointer" }}
        {...{ code }}
      />
    </a>
  );
}
