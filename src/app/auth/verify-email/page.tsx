import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-8">
        <h1 className="text-xl font-bold text-zinc-900">ایمیل خود را تأیید کنید</h1>
        <p className="mt-4 text-sm leading-7 text-zinc-600">
          یک لینک تأیید به آدرس ایمیل شما فرستاده شد. پس از کلیک روی لینک، می‌توانید
          وارد شوید و گفتگو را شروع کنید.
        </p>
        <p className="mt-4 text-xs text-zinc-500">
          ایمیل را نمی‌بینید؟ پوشه اسپم را هم چک کنید.
        </p>
        <Link
          href="/auth/login"
          className="mt-6 inline-block rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
        >
          رفتن به صفحه ورود
        </Link>
      </div>
    </div>
  );
}
