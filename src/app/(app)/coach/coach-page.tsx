"use client";

import { useState, useRef, useEffect } from "react";
import { PaperPlaneTilt, Robot, User, Sparkle, ArrowDown } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your FlowState productivity coach. I can help you choose the right technique, optimize your workflow, and build better habits. What would you like to work on today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/coaching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistantContent += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id ? { ...m, content: assistantContent } : m
            )
          );
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I encountered an issue. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "What technique should I use for my current task?",
    "How can I improve my focus today?",
    "Give me a productivity tip",
    "Help me plan my day",
  ];

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">AI Coach</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Your personal productivity assistant
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  message.role === "assistant"
                    ? "bg-[var(--color-brand-600)] text-white"
                    : "bg-[var(--surface-tertiary)] text-[var(--text-secondary)]"
                }`}
              >
                {message.role === "assistant" ? (
                  <Robot size={16} weight="fill" />
                ) : (
                  <User size={16} weight="fill" />
                )}
              </div>
              <div
                className={`max-w-[75%] rounded-[var(--radius-lg)] px-4 py-3 ${
                  message.role === "user"
                    ? "bg-[var(--color-brand-600)] text-white"
                    : "bg-[var(--surface-secondary)] text-[var(--text-primary)]"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-600)] text-white">
                <Robot size={16} weight="fill" />
              </div>
              <div className="rounded-[var(--radius-lg)] bg-[var(--surface-secondary)] px-4 py-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-[var(--text-tertiary)]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-[var(--text-tertiary)] [animation-delay:0.2s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-[var(--text-tertiary)] [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => setInput(prompt)}
              className="flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-primary)] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--border-default)] hover:text-[var(--text-primary)]"
            >
              <Sparkle size={12} weight="fill" className="text-[var(--color-brand-500)]" />
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Ask your coach anything..."
          rows={1}
          className="flex-1 resize-none rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-primary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--color-brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-500)]"
        />
        <Button type="submit" disabled={!input.trim() || isLoading}>
          <PaperPlaneTilt size={18} weight="fill" />
        </Button>
      </form>
    </div>
  );
}
