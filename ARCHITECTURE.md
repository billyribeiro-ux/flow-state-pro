# FlowState Pro — Master Architecture Document

> **Built for the next 10 years. Apple Principal Engineer ICT Level 7+ standards.**
> **This document is the single source of truth for Claude Code / Windsurf execution.**

---

## 1. Product Vision

**FlowState Pro** is an AI-powered productivity coaching platform that integrates 10 scientifically-backed time management methodologies into one unified system. It doesn't just track your time — it actively coaches you through your day, learns your patterns, and progressively unlocks complementary techniques as you master each one.

**Core Differentiator:** Cross-methodology intelligence. Every technique feeds data into every other technique. Your Pomodoro completion rates inform Deep Work session recommendations. Your Eisenhower Matrix placements combined with Time Audit data reveal if you're spending time in the right quadrants. The system gets smarter the longer you use it.

---

## 2. The 10 Methodologies

| ID | Technique | Category | Core Mechanic |
|-----|-----------|----------|---------------|
| `pomodoro` | Pomodoro Technique | Execute | 25min focus / 5min break cycles |
| `gtd` | Getting Things Done | Capture | Inbox → Clarify → Organize → Review → Execute |
| `eisenhower` | Eisenhower Matrix | Prioritize | 2×2 urgency/importance grid |
| `time-blocking` | Time Blocking | Execute | Calendar-based task scheduling |
| `pareto` | 80/20 Rule | Optimize | Identify highest-leverage activities |
| `deep-work` | Deep Work | Execute | Extended distraction-free focus |
| `eat-the-frog` | Eat That Frog | Execute | Hardest task first, every morning |
| `two-minute` | Two-Minute Rule | Execute | Immediate execution of <2min tasks |
| `batch` | Batch Processing | Optimize | Group similar tasks together |
| `time-audit` | Time Audit | Reflect | Track actual vs. planned time |

### Methodology Progression Map (Unlock Tree)

```
START → User picks ONE technique
         │
         ├─ pomodoro ──────→ time-blocking → deep-work → batch
         ├─ eisenhower ────→ eat-the-frog → pareto → time-audit
         ├─ gtd ───────────→ two-minute → eisenhower → batch
         ├─ time-blocking ─→ pomodoro → deep-work → batch
         ├─ deep-work ─────→ time-blocking → eat-the-frog → pomodoro
         ├─ eat-the-frog ──→ eisenhower → pomodoro → deep-work
         ├─ two-minute ────→ gtd → batch → eisenhower
         ├─ batch ─────────→ time-blocking → pomodoro → two-minute
         ├─ pareto ────────→ eisenhower → time-audit → eat-the-frog
         └─ time-audit ────→ pareto → time-blocking → eisenhower
```

**Unlock criteria:** 7 days of active use OR X completed sessions (methodology-specific threshold).

---

## 3. Tech Stack (Locked)

### Frontend
- **Next.js 16** (App Router, RSC, Server Actions, PPR)
- **React 19** (use, useOptimistic, useActionState, Suspense)
- **TypeScript** (strict: true, noUncheckedIndexedAccess: true)
- **Tailwind CSS 4** (CSS-first config, @theme directive)
- **Phosphor Icons** (`@phosphor-icons/react`)

### Data/UI Layer
- **TanStack Query v5** (server state, optimistic updates, infinite queries)
- **TanStack Table v8** (headless enterprise tables)
- **TanStack Virtual v3** (virtualized lists for GTD inboxes, task lists)

### Visualization + Motion
- **D3.js v7** (Time Audit charts, Pareto curves, productivity heatmaps, Eisenhower scatter)
- **GSAP v3 + ScrollTrigger** (onboarding orchestration, page transitions, cinematic reveals)
- **Motion** (component/layout animations, shared layout, exit animations)
- **D3 transitions** (chart-internal animations only)

### Backend
- **Next.js Route Handlers** (REST-like endpoints)
- **Next.js Server Actions** (mutations, form handling)
- **PostgreSQL 16** (primary OLTP database)
- **Drizzle ORM** (typed schema, migrations, query builder)
- **Redis** (cache, rate-limit, real-time timer state, session queues)
- **Zod** (all validation — request, response, forms, env vars)

### Auth / Security
- **Clerk** (auth, user management, organizations, webhooks)
- RBAC with role-based middleware
- Tenant isolation at DB query level
- Rate limiting via Upstash `@upstash/ratelimit`
- Audit log table for all admin/critical actions

### Video / Media
- **Mux** (methodology explainer videos, adaptive streaming, completion tracking)
- Mux Player React component

### AI / Coaching Intelligence
- **Vercel AI SDK v4** (streaming, tool calling, structured output)
- **Anthropic Claude API** (primary LLM for coaching messages)
- **OpenAI API** (fallback / embeddings for pattern matching)
- Custom coaching prompt templates per methodology

### Realtime / Async
- **SSE** (timer sync, live coaching nudges, dashboard updates)
- **WebSockets** (shared Pomodoro sessions, accountability partner sync)
- **Inngest** (all scheduled/background jobs):
  - Timer completion workflows
  - Progressive unlock evaluation
  - Daily coaching digest generation
  - Weekly review compilation
  - Analytics aggregation jobs
  - Streak calculation and notification triggers

### Notifications / Engagement
- **Resend** (transactional email — daily digests, weekly reviews, streak alerts)
- **Web Push API** + **Service Worker** (real-time coaching nudges)
- **Expo Push Notifications** (if React Native wrapper is added later)
- In-app notification center (SSE-powered)

### QA / Tooling
- **pnpm** (workspace-ready)
- **ESLint v9** (flat config) + **Prettier**
- **Vitest** + **Testing Library** (unit + integration)
- **Playwright** (E2E, visual regression)
- **GitHub Actions** (CI: lint → type-check → test → build → deploy)
- **Changesets** (versioning, if packages are extracted)

### Observability / Ops
- **Sentry** (errors, performance tracing, session replay)
- **PostHog** (product analytics, feature flags, session recordings)
- **Vercel Analytics** (Core Web Vitals, speed insights)

### Deployment
- **Vercel** (app hosting, edge functions, preview deployments)
- **Neon** (managed Postgres, serverless driver, branching per PR)
- **Upstash Redis** (serverless, HTTP-based, global replication)
- **Mux** (video CDN)
- **Inngest Cloud** (managed job execution)
- **Resend** (managed email delivery)

### Non-negotiable Build Policy
- Mobile-first responsive design
- Breakpoints: `xs: 320px, sm: 480px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px, 3xl: 1920px`
- Progressive methodology unlocking
- Video progress tracking per user
- Methodology-adaptive dashboard rendering
- All components server-first (RSC), client only when interactivity requires it
- Zero `any` types — strict TypeScript everywhere
- All API boundaries validated with Zod
- Every database query parameterized (no SQL injection surface)
- WCAG 2.1 AA accessibility minimum

---

## 4. Project Structure

```
flowstate-pro/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                    # Lint → Type-check → Test → Build
│   │   ├── e2e.yml                   # Playwright E2E on preview deploys
│   │   └── db-migrate.yml            # Drizzle migration runner
│   └── PULL_REQUEST_TEMPLATE.md
│
├── public/
│   ├── fonts/                        # Self-hosted fonts (WOFF2)
│   ├── icons/                        # PWA icons, favicons
│   ├── og/                           # Open Graph images
│   └── sw.js                         # Service worker (push notifications)
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth route group
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   ├── sign-up/[[...sign-up]]/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (marketing)/              # Public marketing pages
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── pricing/page.tsx
│   │   │   ├── features/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (app)/                    # Authenticated app shell
│   │   │   ├── layout.tsx            # Sidebar + topbar + notification center
│   │   │   ├── onboarding/           # Methodology discovery + video onboarding
│   │   │   │   ├── page.tsx          # Methodology card grid
│   │   │   │   └── [methodology]/page.tsx  # Individual methodology deep-dive + video
│   │   │   │
│   │   │   ├── dashboard/            # Main dashboard (adapts to active methodology)
│   │   │   │   ├── page.tsx          # Dynamic methodology workspace
│   │   │   │   └── loading.tsx
│   │   │   │
│   │   │   ├── techniques/           # Individual technique workspaces
│   │   │   │   ├── pomodoro/
│   │   │   │   │   ├── page.tsx      # Timer interface
│   │   │   │   │   ├── history/page.tsx
│   │   │   │   │   └── settings/page.tsx
│   │   │   │   ├── gtd/
│   │   │   │   │   ├── page.tsx      # Inbox + processing workflow
│   │   │   │   │   ├── inbox/page.tsx
│   │   │   │   │   ├── projects/page.tsx
│   │   │   │   │   ├── contexts/page.tsx
│   │   │   │   │   ├── waiting/page.tsx
│   │   │   │   │   └── review/page.tsx
│   │   │   │   ├── eisenhower/
│   │   │   │   │   └── page.tsx      # 2×2 matrix drag-and-drop
│   │   │   │   ├── time-blocking/
│   │   │   │   │   └── page.tsx      # Calendar-style block editor
│   │   │   │   ├── pareto/
│   │   │   │   │   └── page.tsx      # Analysis dashboard + D3 charts
│   │   │   │   ├── deep-work/
│   │   │   │   │   └── page.tsx      # Session launcher + distraction tracker
│   │   │   │   ├── eat-the-frog/
│   │   │   │   │   └── page.tsx      # Daily frog selector + tracker
│   │   │   │   ├── two-minute/
│   │   │   │   │   └── page.tsx      # Quick-fire task queue
│   │   │   │   ├── batch/
│   │   │   │   │   └── page.tsx      # Task grouping + batch session launcher
│   │   │   │   └── time-audit/
│   │   │   │       ├── page.tsx      # Live tracker + analytics
│   │   │   │       └── reports/page.tsx
│   │   │   │
│   │   │   ├── coach/                # AI coaching interface
│   │   │   │   ├── page.tsx          # Chat-style coaching + daily briefing
│   │   │   │   └── insights/page.tsx # Cross-methodology intelligence
│   │   │   │
│   │   │   ├── analytics/            # Unified analytics
│   │   │   │   ├── page.tsx          # Overview dashboard
│   │   │   │   ├── productivity/page.tsx  # Heatmaps, trends
│   │   │   │   └── reports/page.tsx  # Exportable reports
│   │   │   │
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx          # General settings
│   │   │   │   ├── notifications/page.tsx
│   │   │   │   ├── integrations/page.tsx
│   │   │   │   └── billing/page.tsx
│   │   │   │
│   │   │   └── admin/                # Admin panel (RBAC-gated)
│   │   │       ├── page.tsx
│   │   │       ├── users/page.tsx
│   │   │       └── audit-log/page.tsx
│   │   │
│   │   ├── api/                      # Route Handlers
│   │   │   ├── webhooks/
│   │   │   │   ├── clerk/route.ts    # Clerk auth webhooks
│   │   │   │   ├── inngest/route.ts  # Inngest webhook endpoint
│   │   │   │   ├── mux/route.ts      # Mux video webhooks
│   │   │   │   └── stripe/route.ts   # Stripe payment webhooks (future)
│   │   │   ├── coaching/
│   │   │   │   └── route.ts          # AI coaching streaming endpoint
│   │   │   ├── notifications/
│   │   │   │   ├── push/route.ts     # Web Push registration
│   │   │   │   └── sse/route.ts      # SSE stream for live updates
│   │   │   ├── timer/
│   │   │   │   └── route.ts          # Pomodoro/Deep Work timer sync
│   │   │   └── analytics/
│   │   │       └── route.ts          # Event ingestion
│   │   │
│   │   ├── layout.tsx                # Root layout (Clerk provider, theme, fonts)
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   └── globals.css               # Tailwind CSS 4 + design tokens
│   │
│   ├── components/                   # Shared components
│   │   ├── ui/                       # Primitive UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── separator.tsx
│   │   │   └── index.ts              # Barrel export
│   │   │
│   │   ├── layout/                   # Layout components
│   │   │   ├── sidebar.tsx           # App sidebar with methodology nav
│   │   │   ├── topbar.tsx            # Top navigation bar
│   │   │   ├── mobile-nav.tsx        # Mobile bottom navigation
│   │   │   ├── notification-center.tsx
│   │   │   └── command-palette.tsx   # ⌘K command palette
│   │   │
│   │   ├── methodology/              # Methodology-specific components
│   │   │   ├── pomodoro/
│   │   │   │   ├── timer-display.tsx # Circular timer with GSAP animation
│   │   │   │   ├── timer-controls.tsx
│   │   │   │   ├── session-log.tsx
│   │   │   │   └── stats-card.tsx
│   │   │   ├── gtd/
│   │   │   │   ├── inbox-item.tsx
│   │   │   │   ├── processing-wizard.tsx
│   │   │   │   ├── project-list.tsx
│   │   │   │   ├── context-filter.tsx
│   │   │   │   └── weekly-review.tsx
│   │   │   ├── eisenhower/
│   │   │   │   ├── matrix-grid.tsx   # 2×2 DnD grid
│   │   │   │   ├── quadrant.tsx
│   │   │   │   └── task-card.tsx
│   │   │   ├── time-blocking/
│   │   │   │   ├── calendar-grid.tsx
│   │   │   │   ├── time-block.tsx
│   │   │   │   └── block-editor.tsx
│   │   │   ├── pareto/
│   │   │   │   ├── pareto-chart.tsx  # D3 Pareto curve
│   │   │   │   ├── impact-table.tsx
│   │   │   │   └── insight-card.tsx
│   │   │   ├── deep-work/
│   │   │   │   ├── session-launcher.tsx
│   │   │   │   ├── focus-meter.tsx
│   │   │   │   └── distraction-log.tsx
│   │   │   ├── eat-the-frog/
│   │   │   │   ├── frog-selector.tsx
│   │   │   │   ├── frog-timer.tsx
│   │   │   │   └── daily-status.tsx
│   │   │   ├── two-minute/
│   │   │   │   ├── quick-queue.tsx   # Rapid-fire task cards
│   │   │   │   └── completion-burst.tsx
│   │   │   ├── batch/
│   │   │   │   ├── group-builder.tsx
│   │   │   │   ├── batch-session.tsx
│   │   │   │   └── suggestion-card.tsx
│   │   │   └── time-audit/
│   │   │       ├── live-tracker.tsx
│   │   │       ├── audit-heatmap.tsx  # D3 heatmap
│   │   │       ├── planned-vs-actual.tsx
│   │   │       └── weekly-report.tsx
│   │   │
│   │   ├── coaching/                 # AI coaching components
│   │   │   ├── coach-chat.tsx        # Streaming chat interface
│   │   │   ├── daily-briefing.tsx    # Morning coaching card
│   │   │   ├── nudge-banner.tsx      # In-app coaching nudge
│   │   │   ├── insight-card.tsx      # Cross-methodology insight
│   │   │   └── progress-ring.tsx     # Methodology mastery ring
│   │   │
│   │   ├── charts/                   # D3 chart components
│   │   │   ├── productivity-heatmap.tsx
│   │   │   ├── pareto-curve.tsx
│   │   │   ├── focus-timeline.tsx
│   │   │   ├── quadrant-scatter.tsx
│   │   │   ├── streak-chart.tsx
│   │   │   └── time-distribution.tsx
│   │   │
│   │   ├── onboarding/               # Onboarding flow components
│   │   │   ├── methodology-card.tsx  # Animated methodology card
│   │   │   ├── video-player.tsx      # Mux video player wrapper
│   │   │   ├── progress-tracker.tsx  # Onboarding progress
│   │   │   └── methodology-grid.tsx  # Card grid with GSAP stagger
│   │   │
│   │   └── shared/                   # Cross-cutting shared components
│   │       ├── task-input.tsx        # Universal quick-add task
│   │       ├── task-card.tsx         # Shared task card component
│   │       ├── timer-widget.tsx      # Floating timer (Pomodoro/Deep Work)
│   │       ├── streak-badge.tsx
│   │       ├── empty-state.tsx
│   │       ├── error-boundary.tsx
│   │       └── loading-skeleton.tsx
│   │
│   ├── lib/                          # Core library code
│   │   ├── db/
│   │   │   ├── index.ts              # Drizzle client + connection
│   │   │   ├── schema/               # Drizzle schema (see Section 5)
│   │   │   │   ├── users.ts
│   │   │   │   ├── tasks.ts
│   │   │   │   ├── sessions.ts
│   │   │   │   ├── methodologies.ts
│   │   │   │   ├── coaching.ts
│   │   │   │   ├── notifications.ts
│   │   │   │   ├── analytics.ts
│   │   │   │   ├── time-blocks.ts
│   │   │   │   ├── gtd.ts
│   │   │   │   ├── audit-log.ts
│   │   │   │   ├── video-progress.ts
│   │   │   │   ├── relations.ts      # All Drizzle relations
│   │   │   │   └── index.ts          # Barrel export
│   │   │   ├── queries/              # Reusable query functions
│   │   │   │   ├── tasks.ts
│   │   │   │   ├── sessions.ts
│   │   │   │   ├── analytics.ts
│   │   │   │   ├── coaching.ts
│   │   │   │   └── methodologies.ts
│   │   │   └── migrations/           # Drizzle migration files
│   │   │
│   │   ├── redis/
│   │   │   ├── client.ts             # Upstash Redis client
│   │   │   ├── timer.ts              # Timer state management
│   │   │   ├── rate-limit.ts         # Rate limiter config
│   │   │   └── cache.ts              # Cache helpers
│   │   │
│   │   ├── auth/
│   │   │   ├── clerk.ts              # Clerk config + helpers
│   │   │   ├── middleware.ts          # Auth middleware
│   │   │   └── rbac.ts              # Role-based access control
│   │   │
│   │   ├── coaching/
│   │   │   ├── engine.ts             # Core coaching logic
│   │   │   ├── prompts/              # LLM prompt templates
│   │   │   │   ├── pomodoro.ts
│   │   │   │   ├── gtd.ts
│   │   │   │   ├── eisenhower.ts
│   │   │   │   ├── time-blocking.ts
│   │   │   │   ├── pareto.ts
│   │   │   │   ├── deep-work.ts
│   │   │   │   ├── eat-the-frog.ts
│   │   │   │   ├── two-minute.ts
│   │   │   │   ├── batch.ts
│   │   │   │   ├── time-audit.ts
│   │   │   │   └── cross-methodology.ts  # Intelligence layer prompts
│   │   │   ├── nudges.ts             # Nudge trigger logic
│   │   │   ├── insights.ts           # Cross-methodology insight generator
│   │   │   └── progression.ts        # Unlock evaluation logic
│   │   │
│   │   ├── notifications/
│   │   │   ├── push.ts               # Web Push helpers
│   │   │   ├── email.ts              # Resend email helpers
│   │   │   ├── sse.ts                # SSE stream manager
│   │   │   └── templates/            # Email templates
│   │   │       ├── daily-digest.tsx
│   │   │       ├── weekly-review.tsx
│   │   │       ├── streak-alert.tsx
│   │   │       └── unlock-notification.tsx
│   │   │
│   │   ├── inngest/
│   │   │   ├── client.ts             # Inngest client
│   │   │   └── functions/            # Inngest step functions
│   │   │       ├── timer-completion.ts
│   │   │       ├── daily-coaching-digest.ts
│   │   │       ├── weekly-review-compile.ts
│   │   │       ├── progressive-unlock.ts
│   │   │       ├── analytics-aggregate.ts
│   │   │       ├── streak-calculator.ts
│   │   │       └── morning-frog-reminder.ts
│   │   │
│   │   ├── video/
│   │   │   ├── mux.ts                # Mux client + helpers
│   │   │   └── progress.ts           # Video progress tracking
│   │   │
│   │   ├── analytics/
│   │   │   ├── posthog.ts            # PostHog client
│   │   │   ├── events.ts             # Typed event definitions
│   │   │   └── sentry.ts             # Sentry config
│   │   │
│   │   ├── validations/              # Zod schemas
│   │   │   ├── tasks.ts
│   │   │   ├── sessions.ts
│   │   │   ├── settings.ts
│   │   │   ├── coaching.ts
│   │   │   └── shared.ts
│   │   │
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── use-timer.ts          # Universal timer hook
│   │   │   ├── use-methodology.ts    # Active methodology context
│   │   │   ├── use-coaching.ts       # Coaching nudge consumer
│   │   │   ├── use-notifications.ts  # Push notification registration
│   │   │   ├── use-sse.ts            # SSE connection hook
│   │   │   ├── use-keyboard.ts       # Keyboard shortcut handler
│   │   │   └── use-media-query.ts    # Responsive breakpoint hook
│   │   │
│   │   ├── stores/                   # Client state (Zustand or Context)
│   │   │   ├── timer-store.ts        # Active timer state
│   │   │   ├── ui-store.ts           # Sidebar, modals, command palette
│   │   │   └── notification-store.ts # In-app notification queue
│   │   │
│   │   ├── constants/
│   │   │   ├── methodologies.ts      # Methodology definitions, metadata
│   │   │   ├── coaching-messages.ts  # Static coaching message templates
│   │   │   ├── breakpoints.ts        # Responsive breakpoint values
│   │   │   └── routes.ts             # Type-safe route constants
│   │   │
│   │   └── utils/
│   │       ├── cn.ts                 # clsx + twMerge utility
│   │       ├── format.ts             # Date, time, number formatters
│   │       ├── timer.ts              # Timer math utilities
│   │       └── env.ts                # Zod-validated env vars
│   │
│   ├── styles/
│   │   └── design-tokens.css         # CSS custom properties (colors, spacing, typography)
│   │
│   └── types/
│       ├── database.ts               # Drizzle inferred types
│       ├── methodology.ts            # Methodology type system
│       ├── coaching.ts               # Coaching types
│       ├── timer.ts                  # Timer state types
│       └── api.ts                    # API request/response types
│
├── drizzle/
│   └── drizzle.config.ts            # Drizzle Kit configuration
│
├── tests/
│   ├── unit/                         # Vitest unit tests
│   ├── integration/                  # Integration tests
│   └── e2e/                          # Playwright E2E tests
│       ├── onboarding.spec.ts
│       ├── pomodoro.spec.ts
│       ├── gtd.spec.ts
│       └── coaching.spec.ts
│
├── .env.example
├── .env.local                        # Local dev (git-ignored)
├── .eslintrc.js                      # ESLint flat config
├── .prettierrc
├── tailwind.config.ts                # Tailwind CSS 4 config
├── tsconfig.json
├── next.config.ts
├── drizzle.config.ts
├── inngest.config.ts
├── playwright.config.ts
├── vitest.config.ts
├── pnpm-lock.yaml
└── package.json
```

---

## 5. Database Schema (Drizzle ORM)

> **All tables include `created_at`, `updated_at` timestamps.**
> **All user-facing tables include `user_id` for tenant isolation.**
> **All IDs are `uuid` using `gen_random_uuid()`.**
> **Soft deletes via `deleted_at` on user-content tables.**

### Core Tables

#### `users` (Clerk-synced)
```
users
├── id: uuid (PK)
├── clerk_id: varchar(255) UNIQUE NOT NULL
├── email: varchar(255) UNIQUE NOT NULL
├── first_name: varchar(100)
├── last_name: varchar(100)
├── avatar_url: text
├── timezone: varchar(50) DEFAULT 'UTC'
├── role: enum('user', 'admin', 'super_admin') DEFAULT 'user'
├── onboarding_completed: boolean DEFAULT false
├── active_methodology: methodology_enum (nullable)
├── coaching_preferences: jsonb DEFAULT '{}'
│   ├── tone: 'encouraging' | 'direct' | 'analytical' | 'motivational'
│   ├── nudge_frequency: 'aggressive' | 'moderate' | 'minimal'
│   ├── quiet_hours_start: time
│   ├── quiet_hours_end: time
│   ├── morning_brief_time: time (default 07:00)
│   └── weekly_review_day: 0-6 (default 0 = Sunday)
├── notification_settings: jsonb DEFAULT '{}'
│   ├── push_enabled: boolean
│   ├── email_digest: boolean
│   ├── email_frequency: 'daily' | 'weekly' | 'none'
│   └── sound_enabled: boolean
├── streak_current: integer DEFAULT 0
├── streak_longest: integer DEFAULT 0
├── streak_last_active: date
├── total_focus_minutes: integer DEFAULT 0
├── created_at: timestamptz DEFAULT now()
├── updated_at: timestamptz DEFAULT now()
└── deleted_at: timestamptz (nullable)
```

#### `methodology_progress`
```
methodology_progress
├── id: uuid (PK)
├── user_id: uuid (FK → users.id) NOT NULL
├── methodology: methodology_enum NOT NULL
├── status: enum('locked', 'available', 'active', 'mastered') DEFAULT 'locked'
├── unlocked_at: timestamptz (nullable)
├── activated_at: timestamptz (nullable)
├── mastered_at: timestamptz (nullable)
├── total_sessions: integer DEFAULT 0
├── total_minutes: integer DEFAULT 0
├── current_streak: integer DEFAULT 0
├── longest_streak: integer DEFAULT 0
├── mastery_score: decimal(5,2) DEFAULT 0.00  -- 0-100 scale
├── last_session_at: timestamptz (nullable)
├── settings: jsonb DEFAULT '{}'  -- Methodology-specific user settings
│   -- Pomodoro: { focus_duration: 25, break_duration: 5, long_break: 15, cycles_before_long: 4 }
│   -- Deep Work: { session_duration: 90, warmup_minutes: 5 }
│   -- etc.
├── created_at: timestamptz
├── updated_at: timestamptz
└── UNIQUE(user_id, methodology)
```

### Task System

#### `tasks`
```
tasks
├── id: uuid (PK)
├── user_id: uuid (FK → users.id) NOT NULL
├── title: varchar(500) NOT NULL
├── description: text
├── status: enum('inbox', 'active', 'completed', 'archived', 'deleted') DEFAULT 'inbox'
├── priority: enum('none', 'low', 'medium', 'high', 'urgent') DEFAULT 'none'
│
│-- Eisenhower Matrix
├── eisenhower_quadrant: enum('do', 'schedule', 'delegate', 'eliminate') (nullable)
├── urgency_score: smallint (1-10, nullable)
├── importance_score: smallint (1-10, nullable)
│
│-- GTD
├── gtd_status: enum('inbox', 'next_action', 'waiting_for', 'someday_maybe', 'reference') (nullable)
├── gtd_context: varchar(100) (nullable)  -- @computer, @phone, @office, @home, @errands
├── gtd_project_id: uuid (FK → gtd_projects.id, nullable)
├── gtd_waiting_for: varchar(255) (nullable)  -- Person/thing being waited on
├── gtd_delegated_to: varchar(255) (nullable)
│
│-- Eat The Frog
├── is_frog: boolean DEFAULT false
├── frog_date: date (nullable)  -- The date this was assigned as "the frog"
│
│-- Two-Minute Rule
├── estimated_minutes: smallint (nullable)
├── is_two_minute: boolean DEFAULT false  -- Auto-flagged if estimated_minutes <= 2
│
│-- Batch Processing
├── batch_category: varchar(100) (nullable)  -- email, admin, creative, calls, research
├── batch_session_id: uuid (FK → sessions.id, nullable)
│
│-- Time Tracking
├── estimated_duration: interval (nullable)
├── actual_duration: interval (nullable)
├── time_block_id: uuid (FK → time_blocks.id, nullable)
│
│-- Pareto / Impact
├── impact_score: smallint (1-10, nullable)
├── effort_score: smallint (1-10, nullable)
├── pareto_category: enum('high_impact', 'low_impact') (nullable)
│
│-- Metadata
├── tags: text[] DEFAULT '{}'
├── due_date: date (nullable)
├── completed_at: timestamptz (nullable)
├── sort_order: integer DEFAULT 0
├── recurrence_rule: varchar(255) (nullable)  -- RRULE format
├── parent_task_id: uuid (FK → tasks.id, nullable)  -- Subtasks
├── created_at: timestamptz
├── updated_at: timestamptz
└── deleted_at: timestamptz (nullable)

INDEXES:
├── idx_tasks_user_status ON (user_id, status)
├── idx_tasks_user_eisenhower ON (user_id, eisenhower_quadrant) WHERE deleted_at IS NULL
├── idx_tasks_user_gtd ON (user_id, gtd_status) WHERE deleted_at IS NULL
├── idx_tasks_user_frog ON (user_id, frog_date) WHERE is_frog = true
├── idx_tasks_user_batch ON (user_id, batch_category) WHERE deleted_at IS NULL
├── idx_tasks_user_two_minute ON (user_id) WHERE is_two_minute = true AND status = 'active'
└── idx_tasks_due_date ON (user_id, due_date) WHERE due_date IS NOT NULL
```

#### `gtd_projects`
```
gtd_projects
├── id: uuid (PK)
├── user_id: uuid (FK → users.id) NOT NULL
├── title: varchar(500) NOT NULL
├── description: text
├── status: enum('active', 'completed', 'someday_maybe', 'archived') DEFAULT 'active'
├── outcome: text  -- Desired outcome (GTD principle)
├── next_action_id: uuid (FK → tasks.id, nullable)
├── sort_order: integer DEFAULT 0
├── due_date: date (nullable)
├── completed_at: timestamptz (nullable)
├── created_at: timestamptz
├── updated_at: timestamptz
└── deleted_at: timestamptz (nullable)
```

### Session System

#### `sessions`
```
sessions
├── id: uuid (PK)
├── user_id: uuid (FK → users.id) NOT NULL
├── methodology: methodology_enum NOT NULL
├── session_type: enum('focus', 'break', 'short_break', 'long_break', 'review', 'batch', 'deep_work', 'frog') NOT NULL
├── status: enum('planned', 'active', 'paused', 'completed', 'cancelled', 'abandoned') DEFAULT 'planned'
│
│-- Timing
├── planned_duration: interval NOT NULL
├── actual_duration: interval (nullable)
├── started_at: timestamptz (nullable)
├── ended_at: timestamptz (nullable)
├── paused_at: timestamptz (nullable)
├── total_pause_duration: interval DEFAULT '0'
│
│-- Pomodoro-specific
├── pomodoro_cycle: smallint (nullable)  -- Which cycle in the set (1-4)
├── pomodoro_set: smallint (nullable)    -- Which set of 4
│
│-- Deep Work-specific
├── distraction_count: integer DEFAULT 0
├── distraction_log: jsonb DEFAULT '[]'  -- [{timestamp, description, duration_seconds}]
│
│-- Batch-specific
├── batch_category: varchar(100) (nullable)
├── tasks_completed_count: integer DEFAULT 0
│
│-- Quality metrics
├── focus_rating: smallint (nullable)  -- User self-rating 1-5
├── energy_level: smallint (nullable)  -- Pre/post energy 1-5
├── notes: text (nullable)
│
│-- Linked entities
├── task_id: uuid (FK → tasks.id, nullable)  -- Primary task for this session
├── time_block_id: uuid (FK → time_blocks.id, nullable)
│
├── created_at: timestamptz
└── updated_at: timestamptz

INDEXES:
├── idx_sessions_user_methodology ON (user_id, methodology)
├── idx_sessions_user_date ON (user_id, started_at)
├── idx_sessions_active ON (user_id, status) WHERE status IN ('active', 'paused')
└── idx_sessions_completed ON (user_id, methodology, ended_at) WHERE status = 'completed'
```

#### `session_tasks` (many-to-many: sessions ↔ tasks)
```
session_tasks
├── id: uuid (PK)
├── session_id: uuid (FK → sessions.id) NOT NULL
├── task_id: uuid (FK → tasks.id) NOT NULL
├── completed_in_session: boolean DEFAULT false
├── time_spent: interval (nullable)
├── created_at: timestamptz
└── UNIQUE(session_id, task_id)
```

### Time Blocking

#### `time_blocks`
```
time_blocks
├── id: uuid (PK)
├── user_id: uuid (FK → users.id) NOT NULL
├── title: varchar(255) NOT NULL
├── description: text (nullable)
├── block_type: enum('focus', 'meeting', 'break', 'admin', 'deep_work', 'batch', 'buffer') DEFAULT 'focus'
├── color: varchar(7) (nullable)  -- Hex color
├── date: date NOT NULL
├── start_time: time NOT NULL
├── end_time: time NOT NULL
├── is_recurring: boolean DEFAULT false
├── recurrence_rule: varchar(255) (nullable)
├── methodology: methodology_enum (nullable)  -- Which technique this block serves
├── actual_start: timestamptz (nullable)
├── actual_end: timestamptz (nullable)
├── adherence_score: decimal(5,2) (nullable)  -- How well user stuck to block
├── created_at: timestamptz
├── updated_at: timestamptz
└── deleted_at: timestamptz (nullable)

INDEXES:
├── idx_time_blocks_user_date ON (user_id, date)
└── idx_time_blocks_user_date_range ON (user_id, date, start_time, end_time)
```

### Time Audit

#### `time_entries`
```
time_entries
├── id: uuid (PK)
├── user_id: uuid (FK → users.id) NOT NULL
├── category: varchar(100) NOT NULL  -- work, meetings, email, social_media, breaks, commute, etc.
├── subcategory: varchar(100) (nullable)
├── description: varchar(500) (nullable)
├── source: enum('manual', 'automatic', 'session', 'time_block') DEFAULT 'manual'
├── started_at: timestamptz NOT NULL
├── ended_at: timestamptz (nullable)
├── duration: interval (nullable)
├── is_productive: boolean (nullable)
├── productivity_score: smallint (nullable)  -- 1-5
├── task_id: uuid (FK → tasks.id, nullable)
├── session_id: uuid (FK → sessions.id, nullable)
├── time_block_id: uuid (FK → time_blocks.id, nullable)
├── created_at: timestamptz
└── updated_at: timestamptz

INDEXES:
├── idx_time_entries_user_date ON (user_id, started_at)
├── idx_time_entries_user_category ON (user_id, category)
└── idx_time_entries_user_productive ON (user_id, is_productive, started_at)
```

### Coaching System

#### `coaching_messages`
```
coaching_messages
├── id: uuid (PK)
├── user_id: uuid (FK → users.id) NOT NULL
├── methodology: methodology_enum (nullable)  -- null = cross-methodology
├── message_type: enum('nudge', 'insight', 'reminder', 'celebration', 'warning', 'daily_brief', 'weekly_review', 'suggestion', 'unlock') NOT NULL
├── trigger: enum('scheduled', 'event', 'pattern', 'ai_generated', 'system') NOT NULL
├── title: varchar(255) NOT NULL
├── body: text NOT NULL
├── action_url: varchar(500) (nullable)  -- Deep link to relevant page
├── action_label: varchar(100) (nullable)
├── priority: enum('low', 'medium', 'high', 'critical') DEFAULT 'medium'
├── channel: enum('in_app', 'push', 'email', 'sms') NOT NULL
├── status: enum('pending', 'sent', 'delivered', 'read', 'dismissed', 'acted_on') DEFAULT 'pending'
├── scheduled_for: timestamptz (nullable)
├── sent_at: timestamptz (nullable)
├── read_at: timestamptz (nullable)
├── dismissed_at: timestamptz (nullable)
├── acted_on_at: timestamptz (nullable)
├── metadata: jsonb DEFAULT '{}'  -- Context data that generated this message
├── created_at: timestamptz
└── updated_at: timestamptz

INDEXES:
├── idx_coaching_user_status ON (user_id, status) WHERE status IN ('pending', 'sent', 'delivered')
├── idx_coaching_user_type ON (user_id, message_type)
└── idx_coaching_scheduled ON (scheduled_for) WHERE status = 'pending'
```

#### `coaching_conversations` (AI chat history)
```
coaching_conversations
├── id: uuid (PK)
├── user_id: uuid (FK → users.id) NOT NULL
├── title: varchar(255) (nullable)
├── methodology_context: methodology_enum (nullable)
├── messages: jsonb NOT NULL DEFAULT '[]'
│   -- [{role: 'user'|'assistant', content: string, timestamp: ISO string}]
├── token_count: integer DEFAULT 0
├── created_at: timestamptz
└── updated_at: timestamptz
```

### Notifications

#### `push_subscriptions`
```
push_subscriptions
├── id: uuid (PK)
├── user_id: uuid (FK → users.id) NOT NULL
├── endpoint: text NOT NULL
├── p256dh: text NOT NULL
├── auth: text NOT NULL
├── device_name: varchar(255) (nullable)
├── user_agent: text (nullable)
├── is_active: boolean DEFAULT true
├── created_at: timestamptz
└── updated_at: timestamptz
```

### Video / Onboarding

#### `video_progress`
```
video_progress
├── id: uuid (PK)
├── user_id: uuid (FK → users.id) NOT NULL
├── methodology: methodology_enum NOT NULL
├── mux_asset_id: varchar(255) NOT NULL
├── watch_percentage: decimal(5,2) DEFAULT 0.00
├── total_watch_time: interval DEFAULT '0'
├── completed: boolean DEFAULT false
├── completed_at: timestamptz (nullable)
├── last_position: decimal(10,2) DEFAULT 0.00  -- Seconds
├── created_at: timestamptz
├── updated_at: timestamptz
└── UNIQUE(user_id, methodology, mux_asset_id)
```

### Analytics (Aggregated)

#### `daily_analytics`
```
daily_analytics
├── id: uuid (PK)
├── user_id: uuid (FK → users.id) NOT NULL
├── date: date NOT NULL
├── total_focus_minutes: integer DEFAULT 0
├── total_break_minutes: integer DEFAULT 0
├── sessions_completed: integer DEFAULT 0
├── sessions_abandoned: integer DEFAULT 0
├── tasks_completed: integer DEFAULT 0
├── tasks_created: integer DEFAULT 0
├── pomodoros_completed: integer DEFAULT 0
├── deep_work_minutes: integer DEFAULT 0
├── distraction_count: integer DEFAULT 0
├── frog_eaten: boolean DEFAULT false
├── frog_eaten_time: time (nullable)
├── two_minute_tasks_cleared: integer DEFAULT 0
├── batch_sessions_completed: integer DEFAULT 0
├── time_block_adherence: decimal(5,2) (nullable)  -- Percentage
├── eisenhower_q1_time: integer DEFAULT 0  -- Minutes per quadrant
├── eisenhower_q2_time: integer DEFAULT 0
├── eisenhower_q3_time: integer DEFAULT 0
├── eisenhower_q4_time: integer DEFAULT 0
├── most_productive_hour: smallint (nullable)  -- 0-23
├── energy_avg: decimal(3,2) (nullable)
├── focus_rating_avg: decimal(3,2) (nullable)
├── streak_day: integer DEFAULT 0
├── methodologies_used: text[] DEFAULT '{}'
├── created_at: timestamptz
├── updated_at: timestamptz
└── UNIQUE(user_id, date)
```

#### `weekly_analytics`
```
weekly_analytics
├── id: uuid (PK)
├── user_id: uuid (FK → users.id) NOT NULL
├── week_start: date NOT NULL  -- Monday of the week
├── total_focus_minutes: integer DEFAULT 0
├── total_sessions: integer DEFAULT 0
├── tasks_completed: integer DEFAULT 0
├── pareto_top_activities: jsonb DEFAULT '[]'  -- Top 20% activities by impact
├── pareto_bottom_activities: jsonb DEFAULT '[]'  -- Bottom 80%
├── time_audit_planned_vs_actual: jsonb DEFAULT '{}'
├── methodology_breakdown: jsonb DEFAULT '{}'
│   -- {pomodoro: {sessions: 20, minutes: 500}, deep_work: {sessions: 3, minutes: 270}}
├── coaching_insights: jsonb DEFAULT '[]'  -- AI-generated weekly insights
├── goals_hit: integer DEFAULT 0
├── goals_missed: integer DEFAULT 0
├── created_at: timestamptz
├── updated_at: timestamptz
└── UNIQUE(user_id, week_start)
```

### Audit Log

#### `audit_log`
```
audit_log
├── id: uuid (PK)
├── user_id: uuid (FK → users.id) NOT NULL
├── action: varchar(100) NOT NULL  -- 'task.create', 'session.start', 'settings.update', etc.
├── entity_type: varchar(50) NOT NULL  -- 'task', 'session', 'user', etc.
├── entity_id: uuid (nullable)
├── changes: jsonb (nullable)  -- {field: {old: value, new: value}}
├── ip_address: inet (nullable)
├── user_agent: text (nullable)
├── metadata: jsonb DEFAULT '{}'
├── created_at: timestamptz DEFAULT now()
└── INDEX idx_audit_user_action ON (user_id, action, created_at)
```

### Enums

```sql
CREATE TYPE methodology_enum AS ENUM (
  'pomodoro', 'gtd', 'eisenhower', 'time_blocking',
  'pareto', 'deep_work', 'eat_the_frog', 'two_minute',
  'batch', 'time_audit'
);
```

---

## 6. Coaching Engine Architecture

### Nudge Trigger System

```
┌─────────────────────────────────────────────────────────┐
│                   EVENT SOURCES                          │
├─────────────────────────────────────────────────────────┤
│ Timer Events     │ Session start/end/pause/abandon      │
│ Task Events      │ Create/complete/defer/overdue         │
│ Schedule Events  │ Block start/end/overrun               │
│ Pattern Events   │ Streak break, productivity dip        │
│ Clock Events     │ Morning brief, weekly review, nudge   │
│ System Events    │ Methodology unlock, milestone         │
└────────────┬────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│               INNGEST EVENT ROUTER                       │
│                                                          │
│  event.received → evaluate_triggers() → route_to_fn()   │
└────────────┬────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│             COACHING DECISION ENGINE                     │
│                                                          │
│  1. Load user context (active methodology, preferences)  │
│  2. Check quiet hours                                    │
│  3. Check nudge frequency cap (no spam)                  │
│  4. Evaluate message priority                            │
│  5. Select channel (in-app / push / email)               │
│  6. Generate message (template OR AI)                    │
│  7. Queue for delivery                                   │
└────────────┬────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│              DELIVERY CHANNELS                           │
├─────────────────────────────────────────────────────────┤
│ In-App (SSE)    │ Real-time nudge banner / toast         │
│ Web Push        │ Browser/mobile notification            │
│ Email (Resend)  │ Digest, weekly review, alerts          │
└─────────────────────────────────────────────────────────┘
```

### Coaching Message Templates by Methodology

Each methodology has a set of **trigger → message** mappings:

```typescript
type CoachingTrigger = {
  event: string;                    // e.g., 'session.completed', 'task.deferred'
  methodology: MethodologyEnum;
  condition: (ctx: UserContext) => boolean;
  message: CoachingMessageTemplate;
  cooldown: Duration;               // Min time between same trigger
  priority: 'low' | 'medium' | 'high' | 'critical';
  channels: Channel[];
};
```

### AI Coaching Layer

For personalized, context-aware messages that go beyond templates:

```typescript
// Daily briefing generation (Inngest scheduled function)
async function generateDailyBriefing(userId: string) {
  const context = await gatherUserContext(userId);
  // context includes: yesterday's analytics, today's schedule,
  // active methodology, streak status, pending tasks, frog status

  const briefing = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    system: getDailyBriefingPrompt(context.activeMethodology),
    messages: [{ role: 'user', content: JSON.stringify(context) }],
    max_tokens: 500,
  });

  await deliverCoachingMessage({
    userId,
    type: 'daily_brief',
    title: 'Your Morning Briefing',
    body: briefing.content[0].text,
    channel: 'in_app',
    priority: 'high',
  });
}
```

### Cross-Methodology Intelligence Queries

```sql
-- Find user's most productive hours (feeds Time Blocking suggestions)
SELECT
  EXTRACT(HOUR FROM s.started_at) AS hour,
  AVG(s.focus_rating) AS avg_focus,
  COUNT(*) AS session_count,
  SUM(EXTRACT(EPOCH FROM s.actual_duration) / 60) AS total_minutes
FROM sessions s
WHERE s.user_id = $1
  AND s.status = 'completed'
  AND s.started_at > NOW() - INTERVAL '30 days'
GROUP BY hour
ORDER BY avg_focus DESC;

-- Pareto analysis: which tasks generate the most completed sessions?
SELECT
  t.batch_category,
  COUNT(DISTINCT st.session_id) AS sessions,
  SUM(EXTRACT(EPOCH FROM st.time_spent) / 60) AS total_minutes,
  COUNT(CASE WHEN t.status = 'completed' THEN 1 END) AS completed
FROM tasks t
JOIN session_tasks st ON st.task_id = t.id
WHERE t.user_id = $1
  AND t.created_at > NOW() - INTERVAL '30 days'
GROUP BY t.batch_category
ORDER BY completed DESC;

-- Eisenhower quadrant time distribution (feeds Time Audit)
SELECT
  t.eisenhower_quadrant,
  SUM(EXTRACT(EPOCH FROM te.duration) / 60) AS minutes_spent,
  COUNT(DISTINCT t.id) AS task_count
FROM tasks t
JOIN time_entries te ON te.task_id = t.id
WHERE t.user_id = $1
  AND t.eisenhower_quadrant IS NOT NULL
  AND te.started_at > NOW() - INTERVAL '7 days'
GROUP BY t.eisenhower_quadrant;
```

---

## 7. Inngest Functions (Background Jobs)

| Function | Trigger | Description |
|----------|---------|-------------|
| `timer-completion` | `session.completed` event | Log session, update methodology stats, check unlock criteria, calculate streak |
| `daily-coaching-digest` | Cron: user's `morning_brief_time` | Generate AI daily briefing, surface frog task, show today's schedule |
| `weekly-review-compile` | Cron: user's `weekly_review_day` | Aggregate weekly analytics, generate AI insights, send email summary |
| `progressive-unlock` | `methodology.session_threshold` event | Evaluate if user qualifies for next methodology unlock |
| `analytics-aggregate` | Cron: daily at 00:05 UTC | Roll up `time_entries` + `sessions` into `daily_analytics` |
| `weekly-analytics-aggregate` | Cron: Monday 00:10 UTC | Roll up daily analytics into `weekly_analytics` |
| `streak-calculator` | Cron: daily at 00:15 UTC | Calculate streaks, send streak-at-risk notifications |
| `morning-frog-reminder` | Cron: user's `morning_brief_time` + 30min | If frog not started, send nudge |
| `pomodoro-break-reminder` | `pomodoro.focus.completed` event | Wait break duration → send "break's over" notification |
| `time-block-upcoming` | Cron: every 5 minutes | Check for time blocks starting in 5min, send prep notification |
| `gtd-inbox-review` | Cron: daily at user's preferred time | If inbox has >5 unprocessed items, nudge to clarify |
| `deep-work-session-prep` | 10min before scheduled deep work | Send "prepare for deep work" notification |
| `batch-suggestion` | `task.created` event | If 3+ tasks in same category, suggest batching |
| `pareto-weekly-analysis` | Cron: Friday evening | Run 80/20 analysis on week's data, surface insights |
| `video-completion-check` | `video.progress.updated` event | If video 100% watched, mark methodology as "video complete" |

---

## 8. API Routes

### Route Handlers (`/api/*`)

```
POST   /api/webhooks/clerk          # Clerk user sync
POST   /api/webhooks/inngest        # Inngest event handler
POST   /api/webhooks/mux            # Mux video events
POST   /api/webhooks/stripe         # Stripe payments (future)

GET    /api/notifications/sse        # SSE stream for real-time coaching
POST   /api/notifications/push       # Register push subscription
DELETE /api/notifications/push/:id   # Unregister push subscription

POST   /api/coaching/chat            # AI coaching chat (streaming)
GET    /api/coaching/briefing        # Get today's daily briefing
GET    /api/coaching/insights        # Cross-methodology insights

GET    /api/timer/state              # Get current timer state from Redis
POST   /api/timer/start              # Start timer (writes to Redis + DB)
POST   /api/timer/pause              # Pause timer
POST   /api/timer/resume             # Resume timer
POST   /api/timer/stop               # Stop timer

GET    /api/analytics/daily          # Daily analytics
GET    /api/analytics/weekly         # Weekly analytics
GET    /api/analytics/heatmap        # Productivity heatmap data
GET    /api/analytics/pareto         # Pareto analysis data
```

### Server Actions

```
// Tasks
createTask(formData)
updateTask(taskId, data)
deleteTask(taskId)
completeTask(taskId)
moveToQuadrant(taskId, quadrant)
setAsFrog(taskId, date)
flagAsTwoMinute(taskId)
assignBatchCategory(taskId, category)

// Sessions
startSession(methodology, taskId?)
pauseSession(sessionId)
resumeSession(sessionId)
endSession(sessionId, feedback?)
abandonSession(sessionId, reason?)

// Time Blocking
createTimeBlock(data)
updateTimeBlock(blockId, data)
deleteTimeBlock(blockId)

// GTD
processInboxItem(taskId, action)
createGtdProject(data)
completeWeeklyReview()

// Time Audit
startTimeEntry(category)
stopTimeEntry(entryId)
categorizeTimeEntry(entryId, category)

// Methodology
selectInitialMethodology(methodology)
activateMethodology(methodology)

// Settings
updateCoachingPreferences(data)
updateNotificationSettings(data)

// Video
updateVideoProgress(methodology, muxAssetId, position, percentage)
```

---

## 9. Real-time Architecture

### Timer State (Redis)

```
Key: timer:{userId}
Type: Hash
Fields:
  session_id: uuid
  methodology: string
  type: 'focus' | 'break' | 'short_break' | 'long_break' | 'deep_work'
  status: 'running' | 'paused'
  started_at: ISO timestamp
  paused_at: ISO timestamp | null
  duration_seconds: number
  elapsed_seconds: number
  total_pause_seconds: number
TTL: 24 hours (auto-cleanup)
```

### SSE Event Types

```typescript
type SSEEvent =
  | { type: 'timer.tick'; data: { elapsed: number; remaining: number } }
  | { type: 'timer.complete'; data: { sessionId: string; methodology: string } }
  | { type: 'coaching.nudge'; data: CoachingMessage }
  | { type: 'task.updated'; data: { taskId: string; changes: Partial<Task> } }
  | { type: 'methodology.unlocked'; data: { methodology: MethodologyEnum } }
  | { type: 'streak.updated'; data: { current: number; longest: number } }
  | { type: 'notification'; data: Notification };
```

---

## 10. Design System

### Typography
- **Display:** "Clash Display" (Variable, Google Fonts alternative: "Syne")
- **Heading:** "Satoshi" (Variable, alternative: "General Sans")
- **Body:** "Inter Variable" — exception to the rule here because productivity apps need maximum legibility
- **Mono:** "JetBrains Mono" (code blocks, timer displays)

### Color System (CSS Custom Properties)

```css
:root {
  /* Brand */
  --color-brand-50: #f0f4ff;
  --color-brand-100: #dbe4ff;
  --color-brand-200: #bac8ff;
  --color-brand-300: #91a7ff;
  --color-brand-400: #748ffc;
  --color-brand-500: #5c7cfa;  /* Primary */
  --color-brand-600: #4c6ef5;
  --color-brand-700: #4263eb;
  --color-brand-800: #3b5bdb;
  --color-brand-900: #364fc7;

  /* Methodology Colors (each technique gets a unique identity) */
  --color-pomodoro: #e03131;      /* Red — urgency, timer */
  --color-gtd: #2f9e44;           /* Green — capture, flow */
  --color-eisenhower: #1971c2;    /* Blue — strategic, calm */
  --color-time-blocking: #7048e8; /* Purple — structure */
  --color-pareto: #e8590c;        /* Orange — impact, fire */
  --color-deep-work: #0c8599;     /* Teal — depth, ocean */
  --color-eat-the-frog: #66a80f;  /* Lime — fresh, morning */
  --color-two-minute: #f08c00;    /* Amber — speed, lightning */
  --color-batch: #9c36b5;         /* Violet — grouping */
  --color-time-audit: #495057;    /* Gray — analytical */

  /* Surfaces */
  --surface-primary: #ffffff;
  --surface-secondary: #f8f9fa;
  --surface-tertiary: #f1f3f5;
  --surface-elevated: #ffffff;
  --surface-overlay: rgba(0, 0, 0, 0.5);

  /* Text */
  --text-primary: #212529;
  --text-secondary: #495057;
  --text-tertiary: #868e96;
  --text-inverse: #ffffff;

  /* Borders */
  --border-default: #dee2e6;
  --border-subtle: #e9ecef;
  --border-strong: #adb5bd;

  /* Shadows */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;

  /* Spacing scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* Transitions */
  --ease-default: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;

  /* Z-index scale */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-popover: 500;
  --z-toast: 600;
  --z-tooltip: 700;
  --z-timer-widget: 800;  /* Floating timer always on top */
}

/* Dark mode */
[data-theme="dark"] {
  --surface-primary: #1a1b1e;
  --surface-secondary: #25262b;
  --surface-tertiary: #2c2e33;
  --surface-elevated: #2c2e33;
  --text-primary: #f1f3f5;
  --text-secondary: #adb5bd;
  --text-tertiary: #868e96;
  --border-default: #373a40;
  --border-subtle: #2c2e33;
  --border-strong: #495057;
}
```

### Breakpoints (Non-negotiable)

```css
/* Tailwind CSS 4 @theme */
@theme {
  --breakpoint-xs: 320px;
  --breakpoint-sm: 480px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
  --breakpoint-3xl: 1920px;
}
```

### Motion Guidelines

| Element | Library | Duration | Easing |
|---------|---------|----------|--------|
| Page transitions | Motion (AnimatePresence) | 300-400ms | ease-in-out |
| Component mount | Motion | 200-300ms | spring(1, 80, 10) |
| Micro-interactions | CSS transitions | 150ms | ease-default |
| Onboarding cards | GSAP stagger | 600ms per card, 100ms stagger | power2.out |
| Chart animations | D3 transitions | 800ms | d3.easeCubicInOut |
| Timer ring | GSAP | Continuous | linear |
| Coaching nudge entry | Motion | 400ms | spring |
| Scroll reveals | GSAP ScrollTrigger | 500ms | power1.out |

---

## 11. Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=FlowState Pro

# Database
DATABASE_URL=                      # Neon connection string
DATABASE_URL_UNPOOLED=             # For migrations

# Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# AI
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# Video
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
MUX_WEBHOOK_SECRET=

# Email
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Background Jobs
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# Push Notifications
NEXT_PUBLIC_VAPID_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=

# Payments (Future)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## 12. Build Phases

### Phase 1 — Foundation + Core 4 (Weeks 1-6)
- Project setup, CI/CD, DB schema, auth
- Onboarding flow with methodology cards + video player
- Pomodoro Timer (full coaching integration)
- Eisenhower Matrix (drag-and-drop)
- Time Blocking (calendar interface)
- Two-Minute Rule (quick-fire queue)
- Basic coaching nudges (template-based)
- Push notification system

### Phase 2 — Expansion + Intelligence (Weeks 7-12)
- GTD full workflow (inbox, processing, projects, weekly review)
- Deep Work sessions (distraction tracking)
- Eat That Frog (morning frog assignment + coaching)
- AI coaching chat (Anthropic Claude integration)
- Daily briefing generation
- Progressive methodology unlocking
- Streak system

### Phase 3 — Analytics + Optimization (Weeks 13-18)
- Time Audit (live tracking + D3 heatmaps)
- Batch Processing (smart grouping suggestions)
- Pareto Analysis (D3 Pareto curves, weekly 80/20 reports)
- Cross-methodology intelligence engine
- Weekly review compilation
- Advanced D3 analytics dashboard
- Export/reporting

### Phase 4 — Polish + Scale (Weeks 19-24)
- Performance optimization (RSC, streaming, edge caching)
- Accessibility audit (WCAG 2.1 AA)
- E2E test suite (Playwright)
- Dark mode polish
- PWA enhancements (offline Pomodoro, cached coaching)
- Stripe billing integration
- Admin panel
- Marketing site

---

## 13. Performance Targets

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 1.5s |
| FID (First Input Delay) | < 50ms |
| CLS (Cumulative Layout Shift) | < 0.05 |
| INP (Interaction to Next Paint) | < 100ms |
| TTI (Time to Interactive) | < 2.5s |
| Bundle size (initial JS) | < 150KB gzipped |
| Timer accuracy | ±100ms max drift |
| SSE reconnect | < 2s on disconnect |
| API response (p95) | < 200ms |
| DB query (p95) | < 50ms |

---

*This document is the contract. Every file, every function, every pixel traces back to this blueprint.*
*Built for the next 10 years. No shortcuts. No compromises.*
