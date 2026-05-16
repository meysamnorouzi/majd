export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "right";
  light?: boolean;
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-right";

  return (
    <div className={`mb-12 max-w-2xl ${alignClass}`}>
      {eyebrow && (
        <span
          className={`mb-3 inline-block text-sm font-semibold tracking-wide ${
            light ? "text-gold-400" : "text-gold-600"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-2xl font-bold sm:text-3xl lg:text-4xl ${
          light ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            light ? "text-white/75" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      )}
      <div
        className={`mt-4 h-1 w-16 rounded-full gold-gradient ${
          align === "center" ? "mx-auto" : "ms-auto"
        }`}
      />
    </div>
  );
}
