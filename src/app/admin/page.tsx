import { Suspense } from "react";
import { AdminGate } from "@/app/admin/admin-gate";

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-16 text-center text-sm text-zinc-500">
          بارگذاری پنل ادمین...
        </div>
      }
    >
      <AdminGate />
    </Suspense>
  );
}
