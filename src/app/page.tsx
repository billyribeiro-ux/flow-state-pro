import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--surface-primary)] px-4">
      <main className="flex max-w-2xl flex-col items-center gap-8 text-center">
        {/* Logo */}
        <div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-xl)] bg-[var(--color-brand-600)]">
          <span className="text-2xl font-bold text-white">F</span>
        </div>

        {/* Hero */}
        <div className="space-y-4">
          <h1 className="font-[family-name:var(--font-syne)] text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl md:text-6xl">
            FlowState Pro
          </h1>
          <p className="mx-auto max-w-lg text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            AI-powered productivity coaching integrating 10 scientifically-backed
            time management methodologies. Master one. Unlock the next.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-[var(--color-brand-600)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-700)]"
          >
            Get Started
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-transparent px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-secondary)]"
          >
            Sign In
          </Link>
        </div>

        {/* Methodology pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { name: "Pomodoro", color: "var(--color-pomodoro)" },
            { name: "Eisenhower", color: "var(--color-eisenhower)" },
            { name: "Time Blocking", color: "var(--color-time-blocking)" },
            { name: "Two-Minute", color: "var(--color-two-minute)" },
            { name: "GTD", color: "var(--color-gtd)" },
            { name: "Deep Work", color: "var(--color-deep-work)" },
          ].map((m) => (
            <span
              key={m.name}
              className="rounded-[var(--radius-full)] border border-[var(--border-subtle)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]"
            >
              <span
                className="mr-1.5 inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: m.color }}
              />
              {m.name}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
}
