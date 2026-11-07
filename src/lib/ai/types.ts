export type AiProvider =
  | "openai"
  | "openrouter"
  | "anthropic"
  | "google"
  | "ollama";

export type AiSettingsRecord = {
  provider: AiProvider;
  model: string;
  systemPrompt: string;
  baseUrl?: string | null;
  apiKey?: string | null;
};

export type AiSettingsPublic = Omit<AiSettingsRecord, "apiKey"> & {
  apiKeyConfigured: boolean;
  apiKeyHint?: string;
};
