import Link from "next/link";
import { getProfileRole } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeaderAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const role = await getProfileRole(user.id);
    return (
      <>
        <Link
          href="/chat"
          className="rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100"
        >
          گفتگو
        </Link>
        {role === "admin" ? (
          <Link
            href="/admin"
            className="rounded-lg px-3 py-2 text-violet-700 hover:bg-violet-50"
          >
            ادمین
          </Link>
        ) : null}
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="rounded-lg border border-zinc-200 px-3 py-2 text-zinc-700 hover:bg-zinc-50"
          >
            خروج
          </button>
        </form>
      </>
    );
  }

  return (
    <>
      <Link
        href="/auth/login"
        className="rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-100"
      >
        ورود
      </Link>
      <Link
        href="/auth/signup"
        className="rounded-lg bg-violet-600 px-3 py-2 font-medium text-white hover:bg-violet-700"
      >
        ثبت‌نام
      </Link>
    </>
  );
}
