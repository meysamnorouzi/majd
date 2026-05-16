import { siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function CoursesCTA() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(212,175,55,0.15),_transparent_50%)]" />
      <Container className="relative text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          آماده شروع یادگیری هستید؟
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-white/75">
          با واحد آموزش موسسه حقوقی مجد تماس بگیرید یا فرم تماس را تکمیل کنید تا
          در انتخاب بهترین دوره راهنمایی شوید.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button href="/cart/" size="lg">
            مشاهده سبد خرید
          </Button>
          <Button href="/contact/?subject=دوره-آموزشی" variant="secondary" size="lg">
            مشاوره رایگان
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
