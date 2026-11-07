import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import { resolveLanguageModel } from "@/lib/ai/resolve-model";
import { loadAiSettings, resolveSystemPrompt } from "@/lib/ai/settings";
import { createClient } from "@/lib/supabase/server";

type ChatRequestBody = {
  messages: UIMessage[];
  conversationId?: string;
};

function textFromParts(message: UIMessage): string {
  return message.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const { messages, conversationId: incomingConversationId } = body;
  if (!messages?.length) {
    return new Response("messages required", { status: 400 });
  }

  let conversationId = incomingConversationId;

  if (conversationId) {
    const { data: existingConversation, error: lookupError } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (lookupError) {
      return new Response("Could not verify conversation", { status: 500 });
    }
    if (!existingConversation) {
      return new Response("Conversation not found", { status: 404 });
    }
  }

  if (!conversationId) {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const titleSource = lastUser ? textFromParts(lastUser) : "گفتگوی جدید";
    const title =
      titleSource.trim().slice(0, 80) || "گفتگوی جدید";

    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .insert({ user_id: user.id, title })
      .select("id")
      .single();

    if (convError || !conversation) {
      return new Response(convError?.message ?? "Could not create conversation", {
        status: 500,
      });
    }
    conversationId = conversation.id;
  }

  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.role === "user") {
    const content = textFromParts(lastMessage);
    if (content) {
      const { error: messageError } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        role: "user",
        content,
      });
      if (messageError) {
        return new Response("Could not save user message", { status: 500 });
      }
    }
  }

  const aiSettings = await loadAiSettings();
  let model;
  try {
    model = resolveLanguageModel(aiSettings);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "AI not configured";
    return new Response(msg, { status: 500 });
  }

  const result = streamText({
    model,
    system: resolveSystemPrompt(aiSettings),
    messages: await convertToModelMessages(messages),
    onFinish: async ({ text }) => {
      if (text) {
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          role: "assistant",
          content: text,
        });
        await supabase
          .from("conversations")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", conversationId);
      }
    },
  });

  return result.toUIMessageStreamResponse({
    headers: {
      "X-Conversation-Id": conversationId ?? "",
    },
  });
}
