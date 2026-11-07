import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const vazir = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazir",
});

export const metadata: Metadata = {
  title: "آریا AI | گفتگو با هوش مصنوعی",
  description:
    "پلتفرم فارسی گفتگو با هوش مصنوعی — ثبت‌نام، تأیید ایمیل و چت هوشمند",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-zinc-50 font-sans text-zinc-900 antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
