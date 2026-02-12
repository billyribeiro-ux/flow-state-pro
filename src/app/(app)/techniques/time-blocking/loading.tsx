import { Skeleton } from "@/components/ui/skeleton";

export default function TimeBlockingLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <Skeleton className="h-12 rounded-[var(--radius-lg)]" />
      <Skeleton className="h-[600px] rounded-[var(--radius-xl)]" />
    </div>
  );
}
