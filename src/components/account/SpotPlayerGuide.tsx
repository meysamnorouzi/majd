export function SpotPlayerGuide() {
  const platforms = [
  {
    name: "ویندوز",
    href: "https://spotplayer.ir/download/windows",
    icon: "🖥️",
  },
  {
    name: "اندروید",
    href: "https://spotplayer.ir/download/android",
    icon: "📱",
  },
  {
    name: "iOS",
    href: "https://spotplayer.ir/download/ios",
    icon: "🍎",
  },
];

  const steps = [
    "نرم‌افزار Spot Player را برای سیستم‌عامل خود دانلود و نصب کنید.",
    "برنامه را باز کرده و کد لایسنس دریافتی را وارد نمایید.",
    "پس از فعال‌سازی، ویدیوهای دوره به‌صورت خودکار در کتابخانه شما ظاهر می‌شوند.",
    "در صورت بروز مشکل، با پشتیبانی موسسه تماس بگیرید.",
  ];

  return (
    <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-white">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-navy-900">راهنمای فعال‌سازی اسپات پلیر</h3>
          <p className="mt-1 text-sm text-slate-600">
            نرم‌افزار پخش امن ویدیوهای آموزشی — روی ویندوز، اندروید و iOS
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {platforms.map((p) => (
          <a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:border-sky-400 hover:bg-sky-50"
          >
            <span>{p.icon}</span>
            دانلود {p.name}
          </a>
        ))}
      </div>

      <ol className="mt-6 space-y-3">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3 text-sm text-slate-600">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
              {i + 1}
            </span>
            <span className="leading-relaxed">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
