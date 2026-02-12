import { Skeleton } from "@/components/ui/skeleton";

export default function EisenhowerLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-2 h-4 w-80" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-[var(--radius-xl)]" />
        ))}
      </div>
    </div>
  );
}
