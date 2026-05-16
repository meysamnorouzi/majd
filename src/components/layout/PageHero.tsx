import { Container } from "@/components/ui/Container";

export function PageHero({
  title,
  description,
  breadcrumb,
}: {
  title: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-20 text-white">
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-l from-navy-950/90 to-navy-800/80" />
      <Container className="relative">
        {breadcrumb && (
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-white/60">
            <a href="/" className="hover:text-gold-400">
              خانه
            </a>
            {breadcrumb.map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                <span>/</span>
                {item.href ? (
                  <a href={item.href} className="hover:text-gold-400">
                    {item.label}
                  </a>
                ) : (
                  <span className="text-gold-400">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg text-white/75">{description}</p>
        )}
      </Container>
    </section>
  );
}
