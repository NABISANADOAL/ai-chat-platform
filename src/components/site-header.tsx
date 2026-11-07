import Link from "next/link";
import { Suspense } from "react";
import { SiteHeaderAuth } from "@/components/site-header-auth";

function AuthNavFallback() {
  return <span className="text-sm text-zinc-400">...</span>;
}

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-bold text-violet-700">
          آریا AI
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Suspense fallback={<AuthNavFallback />}>
            <SiteHeaderAuth />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
