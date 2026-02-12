#!/bin/bash
# ============================================================================
# FlowState Pro — Complete Project Setup
# Run this script from the directory where you want the project created.
# 
# Usage: chmod +x setup.sh && ./setup.sh
# ============================================================================

set -e

echo "🚀 FlowState Pro — Project Setup"
echo "================================="
echo ""

# ============================================================================
# 1. CREATE NEXT.JS PROJECT
# ============================================================================

echo "📦 Step 1: Creating Next.js 16 project..."
pnpm create next-app@latest flowstate-pro \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --turbopack \
  --use-pnpm

cd flowstate-pro

echo ""
echo "✅ Next.js project created"
echo ""

# ============================================================================
# 2. CORE DEPENDENCIES
# ============================================================================

echo "📦 Step 2: Installing core dependencies..."

# Database
pnpm add drizzle-orm @neondatabase/serverless
pnpm add -D drizzle-kit

# Redis
pnpm add @upstash/redis @upstash/ratelimit

# Auth
pnpm add @clerk/nextjs

# Validation
pnpm add zod

# TanStack Suite
pnpm add @tanstack/react-query @tanstack/react-table @tanstack/react-virtual

echo ""
echo "✅ Core dependencies installed"
echo ""

# ============================================================================
# 3. VISUALIZATION + MOTION
# ============================================================================

echo "📦 Step 3: Installing visualization & motion libraries..."

# Charts
pnpm add d3
pnpm add -D @types/d3

# Animation
pnpm add gsap
pnpm add motion

echo ""
echo "✅ Visualization & motion libraries installed"
echo ""

# ============================================================================
# 4. UI + ICONS
# ============================================================================

echo "📦 Step 4: Installing UI dependencies..."

# Icons
pnpm add @phosphor-icons/react

# Utilities
pnpm add clsx tailwind-merge
pnpm add class-variance-authority

# DnD (for Eisenhower Matrix, Time Blocking)
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Date handling
pnpm add date-fns

# Client state
pnpm add zustand

echo ""
echo "✅ UI dependencies installed"
echo ""

# ============================================================================
# 5. AI + COACHING
# ============================================================================

echo "📦 Step 5: Installing AI & coaching dependencies..."

# Vercel AI SDK
pnpm add ai @ai-sdk/anthropic @ai-sdk/openai

echo ""
echo "✅ AI dependencies installed"
echo ""

# ============================================================================
# 6. BACKGROUND JOBS + REALTIME
# ============================================================================

echo "📦 Step 6: Installing background jobs & realtime dependencies..."

# Inngest
pnpm add inngest

# Email
pnpm add resend
pnpm add @react-email/components react-email

# Web Push
pnpm add web-push
pnpm add -D @types/web-push

echo ""
echo "✅ Background jobs & realtime dependencies installed"
echo ""

# ============================================================================
# 7. VIDEO
# ============================================================================

echo "📦 Step 7: Installing video dependencies..."

# Mux
pnpm add @mux/mux-player-react @mux/mux-node

echo ""
echo "✅ Video dependencies installed"
echo ""

# ============================================================================
# 8. OBSERVABILITY
# ============================================================================

echo "📦 Step 8: Installing observability dependencies..."

# Sentry
pnpm add @sentry/nextjs

# PostHog
pnpm add posthog-js posthog-node

echo ""
echo "✅ Observability dependencies installed"
echo ""

# ============================================================================
# 9. DEV TOOLING
# ============================================================================

echo "📦 Step 9: Installing dev tooling..."

# Testing
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# E2E
pnpm add -D @playwright/test

# Linting & Formatting
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier

# Type checking utilities
pnpm add -D tsx

echo ""
echo "✅ Dev tooling installed"
echo ""

# ============================================================================
# 10. CREATE FOLDER STRUCTURE
# ============================================================================

echo "📁 Step 10: Creating folder structure..."

# App Router structure
mkdir -p src/app/\(auth\)/sign-in/\[\[...sign-in\]\]
mkdir -p src/app/\(auth\)/sign-up/\[\[...sign-up\]\]
mkdir -p src/app/\(marketing\)/pricing
mkdir -p src/app/\(marketing\)/features
mkdir -p src/app/\(app\)/onboarding/\[methodology\]
mkdir -p src/app/\(app\)/dashboard
mkdir -p src/app/\(app\)/techniques/pomodoro/history
mkdir -p src/app/\(app\)/techniques/pomodoro/settings
mkdir -p src/app/\(app\)/techniques/gtd/inbox
mkdir -p src/app/\(app\)/techniques/gtd/projects
mkdir -p src/app/\(app\)/techniques/gtd/contexts
mkdir -p src/app/\(app\)/techniques/gtd/waiting
mkdir -p src/app/\(app\)/techniques/gtd/review
mkdir -p src/app/\(app\)/techniques/eisenhower
mkdir -p src/app/\(app\)/techniques/time-blocking
mkdir -p src/app/\(app\)/techniques/pareto
mkdir -p src/app/\(app\)/techniques/deep-work
mkdir -p src/app/\(app\)/techniques/eat-the-frog
mkdir -p src/app/\(app\)/techniques/two-minute
mkdir -p src/app/\(app\)/techniques/batch
mkdir -p src/app/\(app\)/techniques/time-audit/reports
mkdir -p src/app/\(app\)/coach/insights
mkdir -p src/app/\(app\)/analytics/productivity
mkdir -p src/app/\(app\)/analytics/reports
mkdir -p src/app/\(app\)/settings/notifications
mkdir -p src/app/\(app\)/settings/integrations
mkdir -p src/app/\(app\)/settings/billing
mkdir -p src/app/\(app\)/admin/users
mkdir -p src/app/\(app\)/admin/audit-log
mkdir -p src/app/api/webhooks/clerk
mkdir -p src/app/api/webhooks/inngest
mkdir -p src/app/api/webhooks/mux
mkdir -p src/app/api/webhooks/stripe
mkdir -p src/app/api/coaching
mkdir -p src/app/api/notifications/push
mkdir -p src/app/api/notifications/sse
mkdir -p src/app/api/timer
mkdir -p src/app/api/analytics

# Components
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/components/methodology/pomodoro
mkdir -p src/components/methodology/gtd
mkdir -p src/components/methodology/eisenhower
mkdir -p src/components/methodology/time-blocking
mkdir -p src/components/methodology/pareto
mkdir -p src/components/methodology/deep-work
mkdir -p src/components/methodology/eat-the-frog
mkdir -p src/components/methodology/two-minute
mkdir -p src/components/methodology/batch
mkdir -p src/components/methodology/time-audit
mkdir -p src/components/coaching
mkdir -p src/components/charts
mkdir -p src/components/onboarding
mkdir -p src/components/shared

# Lib
mkdir -p src/lib/db/schema
mkdir -p src/lib/db/queries
mkdir -p src/lib/db/migrations
mkdir -p src/lib/redis
mkdir -p src/lib/auth
mkdir -p src/lib/coaching/prompts
mkdir -p src/lib/notifications/templates
mkdir -p src/lib/inngest/functions
mkdir -p src/lib/video
mkdir -p src/lib/analytics
mkdir -p src/lib/validations
mkdir -p src/lib/hooks
mkdir -p src/lib/stores
mkdir -p src/lib/constants
mkdir -p src/lib/utils

# Styles
mkdir -p src/styles

# Types
mkdir -p src/types

# Tests
mkdir -p tests/unit
mkdir -p tests/integration
mkdir -p tests/e2e

# Public
mkdir -p public/fonts
mkdir -p public/icons
mkdir -p public/og

echo ""
echo "✅ Folder structure created"
echo ""

# ============================================================================
# 11. PLAYWRIGHT SETUP
# ============================================================================

echo "📦 Step 11: Installing Playwright browsers..."
pnpm exec playwright install --with-deps chromium

echo ""
echo "✅ Playwright ready"
echo ""

# ============================================================================
# DONE
# ============================================================================

echo ""
echo "==========================================="
echo "🎉 FlowState Pro setup complete!"
echo "==========================================="
echo ""
echo "Next steps:"
echo "  1. Copy your architecture files into the project root"
echo "  2. Create .env.local with your API keys (see .env.example)"
echo "  3. Run: pnpm dev"
echo ""
echo "Total packages installed. Run 'pnpm list' to verify."
echo ""
