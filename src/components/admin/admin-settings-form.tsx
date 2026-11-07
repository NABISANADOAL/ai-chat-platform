"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { AiProvider, AiSettingsPublic } from "@/lib/ai/types";

const PROVIDER_HINTS: Record<AiProvider, string> = {
  openai: "OPENAI_API_KEY در .env یا کلید در همین فرم",
  openrouter: "openrouter.ai — مدل‌های مختلف (مثلاً meta-llama/...)",
  anthropic: "ANTHROPIC_API_KEY — claude-3-5-sonnet-latest",
  google: "GOOGLE_GENERATIVE_AI_API_KEY — gemini-2.0-flash",
  ollama: "لوکال؛ مدل نصب‌شده مثل llama3.2",
};

export function AdminSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [provider, setProvider] = useState<AiProvider>("openrouter");
  const [model, setModel] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [apiKeyHint, setApiKeyHint] = useState<string | undefined>();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) {
        const j = (await res.json()) as { error?: string };
        throw new Error(j.error ?? res.statusText);
      }
      const data = (await res.json()) as AiSettingsPublic;
      setProvider(data.provider);
      setModel(data.model);
      setSystemPrompt(data.systemPrompt);
      setBaseUrl(data.baseUrl ?? "");
      setApiKeyConfigured(data.apiKeyConfigured);
      setApiKeyHint(data.apiKeyHint);
      setApiKey("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در بارگذاری");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          model,
          systemPrompt,
          baseUrl: baseUrl.trim() || null,
          ...(apiKey.trim() ? { apiKey: apiKey.trim() } : {}),
        }),
      });
      if (!res.ok) {
        const j = (await res.json()) as { error?: string };
        throw new Error(j.error ?? res.statusText);
      }
      const data = (await res.json()) as AiSettingsPublic;
      setApiKeyConfigured(data.apiKeyConfigured);
      setApiKeyHint(data.apiKeyHint);
      setApiKey("");
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ذخیره نشد");
    } finally {
      setSaving(false);
    }
  }

  async function clearStoredKey() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          model,
          systemPrompt,
          baseUrl: baseUrl.trim() || null,
          clearApiKey: true,
        }),
      });
      if (!res.ok) throw new Error("حذف کلید ناموفق");
      setApiKeyConfigured(false);
      setApiKeyHint(undefined);
      setApiKey("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-zinc-500">بارگذاری تنظیمات...</p>;
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-2xl flex-col gap-5">
      <div>
        <label className="text-sm font-medium text-zinc-800">ارائه‌دهنده API</label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as AiProvider)}
          className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm"
        >
          <option value="openrouter">OpenRouter (پیشنهادی — چند مدل)</option>
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic (Claude)</option>
          <option value="google">Google Gemini</option>
          <option value="ollama">Ollama (لوکال)</option>
        </select>
        <p className="mt-1 text-xs text-zinc-500">{PROVIDER_HINTS[provider]}</p>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-800">شناسه مدل</label>
        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          required
          className="mt-1.5 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm font-mono"
          dir="ltr"
          placeholder="مثلاً gpt-4o-mini یا meta-llama/llama-3.3-70b-instruct:free"
        />
      </div>

      {(provider === "ollama" || provider === "openrouter") && (
        <div>
          <label className="text-sm font-medium text-zinc-800">
            Base URL (اختیاری)
          </label>
          <input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm font-mono"
            dir="ltr"
            placeholder={
              provider === "ollama"
                ? "http://127.0.0.1:11434/v1"
                : "https://openrouter.ai/api/v1"
            }
          />
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-zinc-800">
          پرامپت سیستم (خالی = پرامپت پیش‌فرض فایل)
        </label>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={14}
          className="mt-1.5 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm leading-7"
          placeholder="دستورالعمل کامل دستیار — هر ذخیره برای همهٔ چت‌ها اعمال می‌شود."
        />
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-800">
          کلید API (اختیاری — جایگزین .env)
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          autoComplete="off"
          className="mt-1.5 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm font-mono"
          dir="ltr"
          placeholder={apiKeyConfigured ? `ذخیره‌شده ${apiKeyHint ?? ""}` : "sk-..."}
        />
        {apiKeyConfigured ? (
          <button
            type="button"
            onClick={() => void clearStoredKey()}
            className="mt-2 text-xs text-red-600 hover:underline"
          >
            حذف کلید ذخیره‌شده در دیتابیس
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}
      {saved ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          ذخیره شد. چت‌های جدید با این تنظیمات اجرا می‌شوند.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
      >
        {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
      </button>
    </form>
  );
}
