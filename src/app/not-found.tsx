import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-[family-name:var(--font-syne)] text-6xl font-bold text-[var(--text-primary)]">
        404
      </h1>
      <p className="text-lg text-[var(--text-secondary)]">
        This page doesn&apos;t exist. Let&apos;s get you back on track.
      </p>
      <Link
        href="/dashboard"
        className="mt-4 rounded-[var(--radius-lg)] bg-[var(--color-brand-600)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-700)]"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
