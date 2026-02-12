import { Skeleton } from "@/components/ui/skeleton";

export default function PomodoroLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <Skeleton className="h-[400px] rounded-[var(--radius-xl)]" />
        <div className="space-y-4">
          <Skeleton className="h-48 rounded-[var(--radius-lg)]" />
          <Skeleton className="h-32 rounded-[var(--radius-lg)]" />
        </div>
      </div>
    </div>
  );
}
