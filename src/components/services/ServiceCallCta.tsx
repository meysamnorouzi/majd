import { siteConfig } from "@/data/site";

export function ServiceCallCta({
  title = "نیاز به مشاوره فوری دارید؟",
  description = "همین حالا با موسسه حقوقی مجد تماس بگیرید؛ وکیل متخصص پرونده شما را بررسی می‌کند.",
}: {
  title?: string;
  description?: string;
}) {
  const phone = siteConfig.phones[0];
  const tel = siteConfig.phonesTel[0];

  return (
    <section className="my-12 overflow-hidden rounded-2xl bg-navy-900 px-6 py-10 text-white sm:px-10">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
            {description}
          </p>
        </div>
        <a
          href={`tel:${tel}`}
          className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-6 py-3.5 text-sm font-bold text-navy-950 transition hover:bg-gold-400"
          dir="ltr"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
            />
          </svg>
          {phone}
        </a>
      </div>
    </section>
  );
}
