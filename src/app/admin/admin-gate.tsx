import { redirect } from "next/navigation";
import { AdminSettingsForm } from "@/components/admin/admin-settings-form";
import { getProfileRole } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";

export async function AdminGate() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/admin");
  }

  const role = await getProfileRole(user.id);
  if (role !== "admin") {
    redirect("/chat");
  }

  return (
    <div className="mx-auto max-w-6xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-bold text-zinc-900">پنل ادمین</h1>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600">
        اولین کاربر ثبت‌نام‌شده ادمین است. از اینجا ارائه‌دهندهٔ API، مدل و پرامپت
        سیستم را تنظیم کنید. برای OpenRouter کلید از{" "}
        <a
          href="https://openrouter.ai/keys"
          className="text-violet-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          openrouter.ai
        </a>{" "}
        بگیرید و در .env یا همین فرم بگذارید.
      </p>
      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <AdminSettingsForm />
      </div>
    </div>
  );
}
