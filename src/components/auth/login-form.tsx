"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const callbackError = searchParams.get("error");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    const next = searchParams.get("next") ?? "/chat";
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-4">
      {callbackError ? (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          تأیید ایمیل ناموفق بود. دوباره تلاش کنید یا لینک را از نو بزنید.
        </p>
      ) : null}
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
          رمز عبور
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none ring-violet-500 focus:ring-2"
        />
      </div>
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
        {loading ? "در حال ورود..." : "ورود"}
      </button>
      <p className="text-center text-sm text-zinc-600">
        حساب ندارید؟{" "}
        <Link href="/auth/signup" className="text-violet-600 hover:underline">
          ثبت‌نام
        </Link>
      </p>
    </form>
  );
}
