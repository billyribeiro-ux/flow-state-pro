"use client";

import { useState, useRef, useEffect } from "react";
import { PaperPlaneTilt, Robot, User } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface CoachChatProps {
  initialMessages?: ChatMessage[];
  onSend?: (message: string) => Promise<string>;
}

export function CoachChat({ initialMessages = [], onSend }: CoachChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = onSend
        ? await onSend(userMsg.content)
        : "I'm here to help! (Connect the coaching API for real responses)";
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", content: response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                msg.role === "assistant"
                  ? "bg-[var(--color-brand-600)] text-white"
                  : "bg-[var(--surface-tertiary)] text-[var(--text-secondary)]"
              }`}
            >
              {msg.role === "assistant" ? <Robot size={14} /> : <User size={14} />}
            </div>
            <div
              className={`max-w-[80%] rounded-[var(--radius-lg)] px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-[var(--color-brand-600)] text-white"
                  : "bg-[var(--surface-secondary)] text-[var(--text-primary)]"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-600)] text-white">
              <Robot size={14} />
            </div>
            <div className="rounded-[var(--radius-lg)] bg-[var(--surface-secondary)] px-3 py-2">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--text-tertiary)]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--text-tertiary)] [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--text-tertiary)] [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2 border-t border-[var(--border-subtle)] p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Ask your coach..."
          className="flex-1 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--color-brand-500)] focus:outline-none"
        />
        <Button size="sm" onClick={handleSend} disabled={!input.trim() || isLoading}>
          <PaperPlaneTilt size={14} weight="fill" />
        </Button>
      </div>
    </div>
  );
}
