# FlowState Pro — Reference Specifications

These files are the **original design specifications** used to build FlowState Pro. They are kept as living documentation alongside the codebase.

> **Note:** These `.ts` files are excluded from TypeScript compilation (`tsconfig.json → exclude`). They are reference documents, not runnable source code.

## Files

| File | Purpose |
|------|---------|
| `ARCHITECTURE.md` | Product vision, tech stack, database schema, API routes, design system, build phases |
| `schema-extended.ts` | Extended DB schema spec (coaching, notifications, analytics, audit, relations) |
| `coaching-engine.ts` | Coaching triggers, progressive unlock criteria, AI prompt templates |
| `inngest-functions.ts` | Background job specs (timer completion, digests, analytics, streaks) |
| `setup.sh` | Original project bootstrap script |

## Implementation Status

All specs have been implemented in `src/`. The canonical source of truth is the running code — these specs are for reference only.
