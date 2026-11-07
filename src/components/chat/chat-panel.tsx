"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FormEvent, useMemo, useRef, useState } from "react";

function messageText(
  parts: { type: string; text?: string }[] | undefined,
): string {
  if (!parts) return "";
  return parts
    .filter((p) => p.type === "text" && p.text)
    .map((p) => p.text)
    .join("");
}

export function ChatPanel() {
  const conversationIdRef = useRef<string | undefined>(undefined);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => ({ conversationId: conversationIdRef.current }),
        fetch: async (url, init) => {
          const res = await fetch(url, init);
          const id = res.headers.get("X-Conversation-Id");
          if (id) conversationIdRef.current = id;
          return res;
        },
      }),
    [],
  );

  const { messages, sendMessage, status, error } = useChat({
    transport,
  });

  const isBusy = status === "submitted" || status === "streaming";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isBusy) return;
    setInput("");
    await sendMessage({ text });
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="flex h-[calc(100vh-4.5rem)] flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center text-sm text-zinc-600">
              سلام! برای امنیت، تست نفوذ مجاز، hardening، یا برنامه‌نویسی سوالت را
              با زمینه (مثلاً lab یا scope مجوز) بنویس.
            </div>
          ) : null}
          {messages.map((m) => (
            <div
              key={m.id}
              className={
                m.role === "user"
                  ? "ms-auto max-w-[85%] rounded-2xl rounded-br-md bg-violet-600 px-4 py-3 text-sm text-white"
                  : "me-auto max-w-[85%] rounded-2xl rounded-bl-md border border-zinc-200 bg-white px-4 py-3 text-sm leading-7 text-zinc-800"
              }
            >
              {messageText(m.parts as { type: string; text?: string }[])}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {error ? (
        <p className="px-4 pb-2 text-center text-sm text-red-600">
          خطا در ارتباط با سرور. تنظیمات API را بررسی کنید.
        </p>
      ) : null}

      <form
        onSubmit={onSubmit}
        className="border-t border-zinc-200 bg-white px-4 py-4"
      >
        <div className="mx-auto flex max-w-3xl gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="پیام خود را بنویسید..."
            disabled={isBusy}
            className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none ring-violet-500 focus:ring-2 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isBusy || !input.trim()}
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
          >
            ارسال
          </button>
        </div>
      </form>
    </div>
  );
}
