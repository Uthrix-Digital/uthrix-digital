# CLAUDE.md - Next.js Project Context

## Tech Stack
- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4 + shadcn/ui components and Framer Motion
<!-- - Database: Prisma ORM with PostgreSQL via Supabase (use server-side client for Server Components) -->

## Build & Development Commands
- Dev Server: `npm run dev`
- Build Project: `npm run build`
- Run Linter: `npm run lint`
- Type Check: `npm exec tsc -- --noEmit`

## Important Files
- Routes: `src/app/`
- Shared components: `src/components/shared/`
- Layout components: `src/components/layout/`
- shadcn/ui primitives: `src/components/ui/`
- Hooks: `src/hooks/`
- Site configuration: `src/config/siteConfig.ts`
- Global styles: `src/app/globals.css`
- Next.js configuration: `next.config.ts`

## Architecture & Code Conventions
- **Routing**: Always use the App Router within `src/app/`. 
- **Server vs Client**: Use Server Components by default. Add `"use client"` strictly at the top of files that require browser interactivity or hooks.
- **Component Colocation**: Put route-specific sub-components inside a private `_components/` folder inside that route's directory. Do not clutter the global `src/components/` folder.
- **Imports**: Always use absolute path aliases (e.g., `@/components/ui/button` or `@/lib/db`).
- **Data Validation**: Use Zod schemas for all API route validation and form payloads.

## Important Rules
- Never use `Math.random()` on the server side for dynamic key generations to prevent Next.js hydration mismatch errors.
- Always run `npm run lint` and a type check before considering a feature complete.
