import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";
import {
  envApiKeyForProvider,
  resolveSystemPrompt,
} from "@/lib/ai/settings";
import type { AiProvider, AiSettingsRecord } from "@/lib/ai/types";

export function resolveLanguageModel(
  settings: AiSettingsRecord,
): LanguageModel {
  const apiKey = settings.apiKey?.trim() || envApiKeyForProvider(settings.provider);

  if (!apiKey && settings.provider !== "ollama") {
    throw new Error(`API key for provider "${settings.provider}" is not set`);
  }

  switch (settings.provider) {
    case "openai": {
      const openai = createOpenAI({ apiKey: apiKey! });
      return openai(settings.model);
    }
    case "openrouter": {
      const site =
        process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
      const openrouter = createOpenAI({
        apiKey: apiKey!,
        baseURL: settings.baseUrl?.trim() || "https://openrouter.ai/api/v1",
        headers: {
          "HTTP-Referer": site,
          "X-Title": "Aria AI",
        },
      });
      return openrouter(settings.model);
    }
    case "anthropic": {
      const anthropic = createAnthropic({ apiKey: apiKey! });
      return anthropic(settings.model);
    }
    case "google": {
      const google = createGoogleGenerativeAI({ apiKey: apiKey! });
      return google(settings.model);
    }
    case "ollama": {
      const base =
        settings.baseUrl?.trim() ||
        process.env.OLLAMA_BASE_URL ||
        "http://127.0.0.1:11434/v1";
      const ollama = createOpenAI({
        apiKey: "ollama",
        baseURL: base,
      });
      return ollama(settings.model);
    }
    default: {
      const _exhaustive: never = settings.provider;
      throw new Error(`Unknown provider: ${String(_exhaustive)}`);
    }
  }
}

export function describeActiveProvider(settings: AiSettingsRecord): {
  provider: AiProvider;
  model: string;
  systemPromptLength: number;
} {
  return {
    provider: settings.provider,
    model: settings.model,
    systemPromptLength: resolveSystemPrompt(settings).length,
  };
}
