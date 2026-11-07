import Link from "next/link";
import { Suspense } from "react";
import { HomeCta } from "@/components/home-cta";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-violet-100 bg-gradient-to-b from-violet-50 to-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="mb-4 text-sm font-medium text-violet-700">
            پلتفرم گفتگوی هوش مصنوعی
          </p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-zinc-900 md:text-5xl">
            با آریا هوشمندانه گفتگو کنید
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
            ثبت‌نام امن با تأیید ایمیل، تاریخچه گفتگو، و پاسخ‌های سریع بر پایه
            مدل‌های پیشرفته OpenAI. مناسب یادگیری، ایده‌پردازی و پرسش‌های تخصصی.
          </p>
          <Suspense
            fallback={
              <div className="mt-10 h-12 w-40 animate-pulse rounded-xl bg-violet-200" />
            }
          >
            <HomeCta />
          </Suspense>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-3">
        {[
          {
            title: "ثبت‌نام و تأیید ایمیل",
            body: "حساب کاربری امن با Supabase Auth و لینک تأیید قبل از ورود به چت.",
          },
          {
            title: "چت زنده",
            body: "پاسخ استریم‌شونده، رابط فارسی RTL، و ذخیره پیام‌ها در دیتابیس شما.",
          },
          {
            title: "معماری قابل گسترش",
            body: "Next.js 16، API مسیر امن، و آماده اتصال دامنه و استقرار روی Vercel.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-zinc-900">{card.title}</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600">{card.body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
