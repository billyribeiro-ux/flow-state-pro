"use client";

import { useChat } from "ai/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCoaching() {
  const queryClient = useQueryClient();

  const chat = useChat({
    api: "/api/coaching",
    id: "coach",
  });

  const messagesQuery = useQuery({
    queryKey: ["coaching-messages"],
    queryFn: async () => {
      const res = await fetch("/api/coaching");
      if (!res.ok) throw new Error("Failed to fetch coaching data");
      return res.json();
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const res = await fetch(`/api/coaching/messages/${messageId}/read`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to mark as read");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaching-messages"] });
    },
  });

  const dismissMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const res = await fetch(`/api/coaching/messages/${messageId}/dismiss`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to dismiss");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaching-messages"] });
    },
  });

  return {
    chat,
    conversations: messagesQuery.data?.conversations ?? [],
    unreadMessages: messagesQuery.data?.unreadMessages ?? [],
    isLoading: messagesQuery.isLoading,
    markRead: markReadMutation.mutate,
    dismiss: dismissMutation.mutate,
  };
}
