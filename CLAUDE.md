# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sub-Agents Directory is a Next.js web application serving as a searchable directory of Claude Code sub-agent prompts and MCP (Model Context Protocol) servers. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Commands

```bash
# Development
bun install          # Install dependencies (uses bun as package manager)
bun dev              # Start dev server at localhost:3000

# Build & Production
bun build            # Build for production
bun start            # Start production server

# Code Quality
bun typecheck        # TypeScript type checking (tsc --noEmit)
bun lint             # Run Oxlint
bun lint:fix         # Auto-fix linting issues
bun format           # Format code with Oxfmt
bun format:check     # Check formatting without modifying
```

## Architecture

### Data Flow

- **Rules** (`src/data/rules/`): 87 language/framework rule files exported via `src/data/rules/index.ts`
- **MCP Servers** (`src/data/mcp/index.ts`): Registry of MCP server definitions
- **API Routes**: Static JSON endpoints at `/api` and `/api/[slug]` with 24h ISR revalidation

### Key Patterns

- **Server Components** by default, Client Components marked with `"use client"`
- **URL State Management** via Nuqs for search/filter state
- **Server Actions** in `src/actions/` for mutations (AI rule generation, subscriptions)
- **Static Generation** with `generateStaticParams()` for dynamic routes
- **Supabase Auth** for protected features (rule generation requires login)

### Directory Structure

```
src/
├── app/              # Next.js App Router pages and API routes
├── components/       # React components (ui/ for shadcn components)
├── data/             # Static data (rules/, mcp/)
├── actions/          # Server actions
├── lib/              # Utility functions
└── utils/supabase/   # Supabase client configuration
```

## Adding New Rules

Create a new file in `src/data/rules/` following this structure:

```typescript
export const yourRule = {
  title: "Display Name",
  slug: "url-friendly-slug",
  tags: ["Category1", "Category2"],
  libs: ["optional-library-list"],
  content: `Your markdown prompt content here`,
  author: {
    name: "Author Name",
    url: "https://author-url.com",
    avatar: "https://avatar-url.com/image.png"
  }
}
```

Then export it from `src/data/rules/index.ts`.

## Environment Variables

Required (see `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Code Style

- Oxlint enforces: strict equality (`===`), no console/debugger, React hooks rules, no import cycles
- Oxfmt for formatting
- Path alias: `@/*` maps to `./src/*`
- Component files: kebab-case (e.g., `rule-card.tsx`)
- Component names: PascalCase (e.g., `RuleCard`)
