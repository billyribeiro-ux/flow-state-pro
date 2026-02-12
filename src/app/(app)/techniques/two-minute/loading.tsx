import { Skeleton } from "@/components/ui/skeleton";

export default function TwoMinuteLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-80" />
      </div>
      <div className="mx-auto max-w-xl space-y-4">
        <Skeleton className="h-20 rounded-[var(--radius-lg)]" />
        <Skeleton className="h-12 rounded-[var(--radius-md)]" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-[var(--radius-lg)]" />
        ))}
      </div>
    </div>
  );
}
