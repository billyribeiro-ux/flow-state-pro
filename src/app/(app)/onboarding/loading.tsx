import { Skeleton } from "@/components/ui/skeleton";

export default function OnboardingLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 py-8">
      <div className="text-center">
        <Skeleton className="mx-auto h-10 w-80" />
        <Skeleton className="mx-auto mt-3 h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-[var(--radius-xl)]" />
        ))}
      </div>
    </div>
  );
}
