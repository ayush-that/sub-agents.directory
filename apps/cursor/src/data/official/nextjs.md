---
description: Guidelines for Next.js
globs: "**/*.ts, **/*.tsx, **/*.js, **/*.jsx"
---

## Overview

This document outlines best practices for Next.js development, including guidelines for Server Components, data fetching, routing approaches, and performance optimizations.

## React Server Components & Server Actions

1. Don't push React Server Components (RSC) or Server Actions too aggressively.
2. Consider the existing patterns in the codebase before introducing new paradigms.
3. Server Components are excellent for SEO and initial page load but may not be needed for every component.

## Data Fetching Approaches

1. If the codebase already uses SWR or React Query:
   - Continue using the existing data fetching library
   - Don't force migration to use Server Components for data fetching
   - Follow established patterns for consistency

2. If using client components (with "use client" directive):
   - It's perfectly acceptable to continue using client components
   - For SWR, recommend latest patterns from the SPA documentation
   - Example pattern:
     ```typescript
     'use client'
     
     import useSWR from 'swr'
     
     export default function Profile() {
       const { data, error, isLoading } = useSWR('/api/user', fetcher)
       
       if (error) return <div>Failed to load</div>
       if (isLoading) return <div>Loading...</div>
       
       return <div>Hello {data.name}!</div>
     }
     ```

## Routing Approaches

1. If the project uses Pages Router:
   - Continue using the Pages Router for existing functionality
   - Consider incrementally adopting App Router for new features
   - Don't rewrite the entire application at once
   - When adding new routes, consider implementing them in the App Router if feasible

2. Migration strategy:
   - Start with simple, isolated pages when adopting App Router
   - Use the [Incremental Adoption Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration) from Next.js docs
   - Keep shared components compatible with both routing systems during transition

## Build and Development Tools

1. Turbopack adoption:
   - If not already using Turbopack, recommend updating to the latest Next.js version
   - Enable Turbopack in development with `next dev --turbopack`
   - Monitor for any compatibility issues with existing code

2. Webpack configuration:
   - Avoid overriding the webpack configuration if possible
   - Explore supported Turbopack loaders in the Next.js documentation
   - If customization is necessary, use the most minimal changes possible
   - Document any webpack overrides thoroughly with justifications

## Performance and Middleware

1. Middleware best practices:
   - **Avoid making blocking network calls inside middleware**
   - This can significantly slow down every request in the application
   - Keep middleware functions lightweight and focused

2. Authentication implementation:
   - Prefer checking auth cookies in middleware for route protection
   - Then add detailed authorization/authentication checks at the page or action level
   - Example middleware approach:
     ```typescript
     export async function middleware(request: NextRequest) {
       // Quick cookie check (non-blocking)
       const hasAuthCookie = request.cookies.has('auth-token')
       
       if (!hasAuthCookie && !request.nextUrl.pathname.startsWith('/login')) {
         return NextResponse.redirect(new URL('/login', request.url))
       }
       
       // Leave detailed validation to the page/component level
       return NextResponse.next()
     }
     ```

## Code Quality and Patterns

1. Maintain consistency with existing patterns
2. Add TypeScript types for all components and functions
3. Use named exports for better tree-shaking
4. Break down large components into smaller, focused ones
5. Follow the principle of progressive enhancement

Remember: These guidelines aim to provide a balanced approach that respects existing codebases while encouraging modern Next.js practices. 