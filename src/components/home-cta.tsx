import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function HomeCta() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mt-10 flex flex-wrap gap-3">
      {user ? (
        <Link
          href="/chat"
          className="rounded-xl bg-violet-600 px-6 py-3 font-medium text-white hover:bg-violet-700"
        >
          شروع گفتگو
        </Link>
      ) : (
        <>
          <Link
            href="/auth/signup"
            className="rounded-xl bg-violet-600 px-6 py-3 font-medium text-white hover:bg-violet-700"
          >
            ثبت‌نام رایگان
          </Link>
          <Link
            href="/auth/login"
            className="rounded-xl border border-zinc-300 bg-white px-6 py-3 font-medium text-zinc-800 hover:bg-zinc-50"
          >
            ورود
          </Link>
        </>
      )}
    </div>
  );
}
