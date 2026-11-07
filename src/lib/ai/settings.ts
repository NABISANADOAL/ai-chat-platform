import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import type { AiProvider, AiSettingsRecord } from "@/lib/ai/types";
import { createServiceClient } from "@/lib/supabase/service";

const DEFAULT: AiSettingsRecord = {
  provider: "openai",
  model: "gpt-4o-mini",
  systemPrompt: "",
  baseUrl: null,
  apiKey: null,
};

function isAiProvider(value: unknown): value is AiProvider {
  return (
    value === "openai" ||
    value === "openrouter" ||
    value === "anthropic" ||
    value === "google" ||
    value === "ollama"
  );
}

export function parseAiSettings(raw: unknown): AiSettingsRecord {
  if (!raw || typeof raw !== "object") return DEFAULT;
  const o = raw as Record<string, unknown>;
  const provider = isAiProvider(o.provider) ? o.provider : DEFAULT.provider;
  const model = typeof o.model === "string" && o.model.trim() ? o.model : DEFAULT.model;
  const systemPrompt =
    typeof o.systemPrompt === "string" ? o.systemPrompt : "";
  const baseUrl =
    typeof o.baseUrl === "string" && o.baseUrl.trim() ? o.baseUrl : null;
  const apiKey =
    typeof o.apiKey === "string" && o.apiKey.trim() ? o.apiKey : null;

  return { provider, model, systemPrompt, baseUrl, apiKey };
}

export function resolveSystemPrompt(settings: AiSettingsRecord): string {
  const custom = settings.systemPrompt.trim();
  return custom.length > 0 ? custom : SYSTEM_PROMPT;
}

export function envApiKeyForProvider(provider: AiProvider): string | undefined {
  switch (provider) {
    case "openai":
      return process.env.OPENAI_API_KEY;
    case "openrouter":
      return process.env.OPENROUTER_API_KEY;
    case "anthropic":
      return process.env.ANTHROPIC_API_KEY;
    case "google":
      return process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    case "ollama":
      return "ollama";
    default: {
      const _exhaustive: never = provider;
      return _exhaustive;
    }
  }
}

export async function loadAiSettings(): Promise<AiSettingsRecord> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "ai")
      .maybeSingle();

    if (error || !data?.value) return DEFAULT;
    return parseAiSettings(data.value);
  } catch {
    return DEFAULT;
  }
}

export function maskApiKey(key: string | null | undefined): {
  configured: boolean;
  hint?: string;
} {
  if (!key || !key.trim()) return { configured: false };
  const t = key.trim();
  if (t.length <= 4) return { configured: true, hint: "****" };
  return { configured: true, hint: `…${t.slice(-4)}` };
}
