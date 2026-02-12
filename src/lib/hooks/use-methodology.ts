"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

export function useMethodology() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const progressQuery = useQuery({
    queryKey: ["methodology-progress", user?.id],
    queryFn: async () => {
      const res = await fetch("/api/methodology/progress");
      if (!res.ok) throw new Error("Failed to fetch progress");
      return res.json();
    },
    enabled: !!user?.id,
  });

  const selectMutation = useMutation({
    mutationFn: async (methodology: string) => {
      const res = await fetch("/api/methodology/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ methodology }),
      });
      if (!res.ok) throw new Error("Failed to select methodology");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["methodology-progress"] });
    },
  });

  return {
    progress: progressQuery.data ?? [],
    isLoading: progressQuery.isLoading,
    error: progressQuery.error,
    selectMethodology: selectMutation.mutate,
    isSelecting: selectMutation.isPending,
  };
}
