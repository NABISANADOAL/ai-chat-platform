"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lawfulUse, setLawfulUse] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!lawfulUse) {
      setError(
        "لطفاً تأیید کنید که فقط در چارچوب مجوز قانونی و سیاست ارائه‌دهندهٔ AI استفاده می‌کنید.",
      );
      return;
    }
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
      window.location.origin;

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback?next=/chat`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    router.push("/auth/verify-email");
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700">
          ایمیل
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none ring-violet-500 focus:ring-2"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700">
          رمز عبور (حداقل ۸ کاراکتر)
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none ring-violet-500 focus:ring-2"
        />
      </div>
      <label className="flex cursor-pointer items-start gap-3 text-start text-sm text-zinc-600">
        <input
          type="checkbox"
          checked={lawfulUse}
          onChange={(e) => setLawfulUse(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-zinc-300"
        />
        <span>
          استفادهٔ من فقط برای تست مجاز، دفاع سایبری و یادگیری قانونی است و{" "}
          <a
            href="https://openai.com/policies/terms-of-use"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-600 hover:underline"
          >
            شرایط OpenAI
          </a>{" "}
          و قوانین محلی را می‌پذیرم.
        </span>
      </label>
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-violet-600 px-4 py-3 font-medium text-white transition hover:bg-violet-700 disabled:opacity-60"
      >
        {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
      </button>
      <p className="text-center text-sm text-zinc-600">
        حساب دارید؟{" "}
        <Link href="/auth/login" className="text-violet-600 hover:underline">
          ورود
        </Link>
      </p>
    </form>
  );
}
