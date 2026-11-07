import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">ثبت‌نام</h1>
        <p className="mt-2 text-sm text-zinc-600">
          پس از ثبت‌نام، لینک تأیید به ایمیل شما ارسال می‌شود.
        </p>
      </div>
      <SignupForm />
    </div>
  );
}
