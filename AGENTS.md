# AGENTS.md

This file provides guidelines and instructions for agentic coding agents working in this repository.

## Project Overview

This is a **TanStack Start** full-stack React application with **Convex** database. It features a starter template with a simple todo list example demonstrating real-time data synchronization, TypeScript, TailwindCSS, and TanStack Query/Router.

## Build Commands

| Command | Description |
|---------|-------------|
| `bun dev` | Start development with Convex, web dev server, and database seeding |
| `bun dev:web` | Start Vite dev server on port 3000 |
| `bun dev:db` | Run Convex dev with todos:seed function |
| `bun build` | Build production bundle with type checking (`vite build && tsc --noEmit`) |
| `bun preview` | Preview production build locally |
| `bun start` | Start production server |

**Package manager:** bun

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** - all TypeScript strict flags are on
- Use explicit types for function parameters and return values
- Avoid `any` - use `unknown` or proper types instead
- Use `zod` for runtime validation (schemas in `convex/schema.ts`)
- Import types with `import type` when not using the value

### Imports and Paths

- Use path alias `~/*` for imports from `src/*` (e.g., `~/components/Loader`)
- External libraries: named imports (e.g., `import { useCallback } from 'react'`)
- Convex generated code: use `.js` extension (e.g., `import { api } from '../../convex/_generated/api.js'`)
- Import order: external libraries → internal components → hooks/utils → CSS/assets

### Naming Conventions

- **Components**: PascalCase named exports (`export function Board(...)`)
- **Files**: camelCase for utilities/hooks, PascalCase for components
- **Variables/functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE or camelCase for local constants
- **Types/Interfaces**: PascalCase
- **Zod schemas**: camelCase (e.g., `itemSchema`, `deleteItemSchema`)

### React Patterns

- Use `useCallback`, `useMemo`, `useRef` for performance optimization
- Use `useSuspenseQuery` with `convexQuery` for data fetching
- Use `tiny-invariant` for runtime assertions (never throw raw errors)
- Prefer function components with hooks over class components
- Destructure props explicitly

### Error Handling

- Use `tiny-invariant(condition, message)` for assertion failures
- Handle errors with TanStack Query's error boundaries and `DefaultCatchBoundary`
- Use `try/catch` for async operations with meaningful error messages

### CSS and Styling

- Use TailwindCSS v4 with `@tailwindcss/vite` plugin
- Classes use kebab-case (e.g., `className="flex items-center gap-4"`)
- Use arbitrary values sparingly (e.g., `bg-[#123456]`)

### Component Structure

```tsx
// 1. Imports (external → internal → types → CSS)
import { useCallback } from 'react'
import { api } from '../../convex/_generated/api.js'
import { SomeComponent } from './SomeComponent'
import type { Column } from 'convex/schema.js'

// 2. Component definition with props
export function ComponentName({ prop1, prop2 }: { prop1: string; prop2: number }) {
  // 3. Hooks
  const data = useSomething()

  // 4. Callbacks
  const handleClick = useCallback(() => {
    // ...
  }, [deps])

  // 5. Memoized values
  const processed = useMemo(() => {
    // ...
  }, [deps])

  // 6. Render
  return <div>...</div>
}
```

### File Organization

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── icons/         # Icon components
├── routes/        # TanStack Router routes
├── styles/        # CSS files
├── utils/         # Utility functions
└── queries.ts     # TanStack Query definitions
```

### TanStack Router

- Routes defined in `src/routes/` with file-based routing
- Use `createRootRouteWithContext` for root routes
- Use `Link` component for navigation
- Use `useRouterState` for routing state

### Convex

- Functions in `convex/` directory
- Use `@convex-dev/react-query` for React Query integration
- Schema defined in `convex/schema.ts`

### Miscellaneous

- No comments in code unless explaining complex logic
- Vite reference: `/// <reference types="vite/client" />` at top of files
- Avoid console.log - use proper logging or toasts
- Use `React.ReactNode` for children prop types
