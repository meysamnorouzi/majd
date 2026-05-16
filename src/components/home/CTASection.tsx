import { siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-20">
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80)",
          }}
        />
      </div>
      <div className="absolute left-0 top-0 h-full w-1 gold-gradient" />
      <Container className="relative text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
          نیاز به مشاوره حقوقی دارید؟
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/75">
          همین الان با موسسه حقوقی مجد تماس بگیرید. مشاوره رایگان برای اشخاص
          نیازمند.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button href="/contact/" size="lg">
            درخواست مشاوره
          </Button>
          <a
            href={`tel:${siteConfig.phonesTel[0]}`}
            className="text-lg font-bold text-gold-400 hover:text-gold-300"
            dir="ltr"
          >
            {siteConfig.phones[0]}
          </a>
        </div>
      </Container>
    </section>
  );
}
