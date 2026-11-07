# آریا AI — پلتفرم چت هوش مصنوعی

سایت Next.js با **ثبت‌نام**، **تأیید ایمیل** (Supabase Auth)، و **چت استریم** (OpenAI).

مسیر پروژه: `ai-chat-platform/` داخل workspace فعلی.

## تیم مشاور (نقش‌ها و تصمیم‌ها)

| نقش | تصمیم |
|-----|--------|
| محصول | فارسی RTL، چت بعد از تأیید ایمیل، لندینگ ساده |
| بک‌اند | Supabase Auth + Postgres (RLS)، API `/api/chat` فقط برای کاربر لاگین |
| فرانت | Next.js App Router، `useChat` + استریم |
| امنیت | کلید OpenAI فقط سرور؛ RLS روی `conversations` و `messages` |
| هوش مصنوعی | GPT-4o-mini، پرامپت فارسی با خطوط قرمز امنیتی استاندارد |

## راه‌اندازی

### ۱. متغیرهای محیطی

```bash
cp .env.example .env.local
```

مقادیر را پر کنید.

### ۲. Supabase

1. پروژه جدید در [supabase.com](https://supabase.com)
2. **Authentication → Providers → Email**: Confirm email را روشن کنید
3. **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`
4. SQL Editor → به ترتیب اجرا کنید:
   - `supabase/migrations/001_chat_schema.sql`
   - `supabase/migrations/002_admin_and_ai_settings.sql`
5. **اولین ایمیل** که ثبت‌نام می‌کند نقش **admin** می‌گیرد → مسیر `/admin`
6. `SUPABASE_SERVICE_ROLE_KEY` را در `.env.local` بگذارید (تنظیمات AI از دیتابیس)

### ۳. اجرای لوکال

```bash
npm install
npm run dev
```

مرورگر: [http://localhost:3000](http://localhost:3000)

## استقرار

- Vercel + همان env vars
- در Supabase، Site URL و Redirect URLs را به دامنه production به‌روز کنید
- `NEXT_PUBLIC_SITE_URL` را روی URL نهایی بگذارید

## درباره «بدون محدودیت»

این پروژه برای **پاسخ‌گویی گسترده و کمک حرفه‌ای** طراحی شده است، اما عمداً **دور زدن قوانین، آسیب، یا محتوای غیرقانونی** را پشتیبانی نمی‌کند — هم از نظر اخلاقی و هم از نظر سیاست ارائه‌دهنده مدل (OpenAI).

ارائه‌دهنده از **پنل ادمین** قابل تغییر است: OpenRouter، OpenAI، Anthropic، Gemini، Ollama. پرامپت سیستم هم از همان پنل ذخیره می‌شود.
