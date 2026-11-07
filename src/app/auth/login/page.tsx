import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">ورود</h1>
        <p className="mt-2 text-sm text-zinc-600">
          برای چت با هوش مصنوعی وارد حساب خود شوید.
        </p>
      </div>
      <Suspense fallback={<p className="text-sm text-zinc-500">بارگذاری...</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
