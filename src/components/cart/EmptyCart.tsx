import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function EmptyCart() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-cream/50 px-8 py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-navy-900/5">
        <svg
          className="h-10 w-10 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
          />
        </svg>
      </div>
      <h2 className="mt-6 text-xl font-bold text-navy-900">سبد خرید شما خالی است</h2>
      <p className="mt-2 text-slate-600">
        دوره‌های آموزشی را مشاهده کنید و به سبد اضافه نمایید.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button href="/courses/">مشاهده دوره‌ها</Button>
        <Link
          href="/shop/"
          className="inline-flex items-center rounded-lg border-2 border-navy-900 px-6 py-3 text-sm font-semibold text-navy-900 transition hover:bg-navy-900 hover:text-white"
        >
          فروشگاه
        </Link>
      </div>
    </div>
  );
}
