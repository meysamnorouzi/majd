import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <Container className="text-center">
        <p className="text-6xl font-black text-gold-500">۴۰۴</p>
        <h1 className="mt-4 text-2xl font-bold text-navy-900">
          صفحه مورد نظر یافت نشد
        </h1>
        <p className="mt-2 text-slate-600">
          ممکن است آدرس را اشتباه وارد کرده باشید.
        </p>
        <div className="mt-8">
          <Button href="/">بازگشت به صفحه اصلی</Button>
        </div>
      </Container>
    </section>
  );
}
