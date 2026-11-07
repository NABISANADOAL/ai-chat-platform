import { NextResponse } from "next/server";
import {
  loadAiSettings,
  maskApiKey,
  parseAiSettings,
} from "@/lib/ai/settings";
import type { AiProvider, AiSettingsPublic } from "@/lib/ai/types";
import { requireAdmin } from "@/lib/auth/profile";
import { createServiceClient } from "@/lib/supabase/service";

function toPublic(settings: Awaited<ReturnType<typeof loadAiSettings>>): AiSettingsPublic {
  const { apiKey, ...rest } = settings;
  const masked = maskApiKey(apiKey);
  return {
    ...rest,
    apiKeyConfigured: masked.configured,
    apiKeyHint: masked.hint,
  };
}

function isAiProvider(value: unknown): value is AiProvider {
  return (
    value === "openai" ||
    value === "openrouter" ||
    value === "anthropic" ||
    value === "google" ||
    value === "ollama"
  );
}

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.message }, { status: gate.status });
  }

  const settings = await loadAiSettings();
  return NextResponse.json(toPublic(settings));
}

type PutBody = {
  provider?: unknown;
  model?: unknown;
  systemPrompt?: unknown;
  baseUrl?: unknown;
  apiKey?: unknown;
  clearApiKey?: unknown;
};

export async function PUT(request: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.message }, { status: gate.status });
  }

  let body: PutBody;
  try {
    body = (await request.json()) as PutBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const current = await loadAiSettings();

  const provider = isAiProvider(body.provider)
    ? body.provider
    : current.provider;
  const model =
    typeof body.model === "string" && body.model.trim()
      ? body.model.trim()
      : current.model;
  const systemPrompt =
    typeof body.systemPrompt === "string"
      ? body.systemPrompt
      : current.systemPrompt;
  const baseUrl =
    body.baseUrl === null || body.baseUrl === ""
      ? null
      : typeof body.baseUrl === "string"
        ? body.baseUrl.trim() || null
        : current.baseUrl ?? null;

  let apiKey = current.apiKey ?? null;
  if (body.clearApiKey === true) {
    apiKey = null;
  } else if (typeof body.apiKey === "string" && body.apiKey.trim()) {
    apiKey = body.apiKey.trim();
  }

  const next = parseAiSettings({
    provider,
    model,
    systemPrompt,
    baseUrl,
    apiKey,
  });

  const supabase = createServiceClient();
  const { error } = await supabase.from("app_settings").upsert(
    {
      key: "ai",
      value: next,
      updated_at: new Date().toISOString(),
      updated_by: gate.userId,
    },
    { onConflict: "key" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(toPublic(next));
}
