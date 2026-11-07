import { createClient } from "@/lib/supabase/server";

export async function getProfileRole(
  userId: string,
): Promise<"admin" | "user" | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data?.role) return null;
  if (data.role === "admin" || data.role === "user") {
    return data.role;
  }
  return null;
}

export async function requireAdmin(): Promise<
  { ok: true; userId: string } | { ok: false; status: number; message: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }

  const role = await getProfileRole(user.id);
  if (role !== "admin") {
    return { ok: false, status: 403, message: "Admin only" };
  }

  return { ok: true, userId: user.id };
}
