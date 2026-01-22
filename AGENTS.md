# AGENTS.md

This file provides guidance to AI coding agents working in this repository.

## Commands

### Development
- `bun run dev` - Start development server with hot reload (port 3000)

### Building
- `bun run build` - Build all assets (CSS and JS)
- `bun run build:css` - Build CSS using Tailwind CLI
- `bun run build:js` - Bundle JavaScript with Bun

### Testing
- `bun run test` - Run all tests
- `bun run test:run` - Run tests without watch mode
- `bun run test:ui` - Run tests with Vitest UI
- `bun run test:coverage` - Run tests with coverage report
- `bun test path/to/test-file.test.ts` - Run single test file
- `bun test --grep "pattern"` - Run tests matching pattern

## Code Style

### Imports & Formatting
- Use `@/*` path alias for imports from `src/*`
- Group: external libs first, then internal modules
- 2 spaces, single quotes, no semicolons, no trailing whitespace
- **IMPORTANT: DO NOT add comments unless explicitly asked**

```typescript
import { Hono } from 'hono'
import { getDatabase } from '@/lib/db'
import { TrendingTopic, CreateTrendingTopicDto } from '@/models/trending-topic.model'
```

### Types & Naming
- Interfaces in `src/types/*.type.ts` or model files
- Use `*Dto` suffix (CreateXDto, UpdateXDto)
- Database: snake_case | Application: camelCase
- Files: kebab-case | Variables: camelCase | Classes/Interfaces: PascalCase

```typescript
export interface TrendingTopic {
  id: number
  source: string
  uniqueKey: string
  title: string
  url: string
  firstSeenAt: Date | null
}
```

### Repository Pattern
Use postgres tagged templates with `postgres.toCamel` transform:

```typescript
export const trendingTopicRepository = {
  findAll: async (): Promise<TrendingTopic[]> => {
    const db = getDatabase()
    return db`SELECT * FROM trending_topics ORDER BY first_seen_at DESC` as any
  },
  create: async (dto: CreateTrendingTopicDto): Promise<TrendingTopic> => {
    const db = getDatabase()
    const topics = await db`INSERT INTO trending_topics ${db(dto)} RETURNING *`
    return topics[0] as any
  }
}
```

### Route Handlers (Hono)
Return JSON with `{ success, data, error }` structure:

```typescript
users.get('/', async (c) => {
  const users = await userService.getAllUsers()
  return c.json({ success: true, data: users })
})
users.get('/:id', async (c) => {
  const id = c.req.param('id')
  const user = await userService.getUserById(id)
  if (!user) return c.json({ success: false, error: 'User not found' }, 404)
  return c.json({ success: true, data: user })
})
```

### JSX Components
Use Hono JSX with SSR:

```typescript
import type { FC } from 'hono/jsx'
export const Home: FC<{ latestBatch: CrawlBatch }> = ({ latestBatch }) => {
  return <div className="max-w-[1200px] mx-auto px-6 py-12"><h1>{latestBatch.aiTitle}</h1></div>
}
```

### Testing (Vitest)
```typescript
import { describe, it, expect } from 'vitest'
describe('userService', () => {
  it('should return undefined when invalid id is provided', async () => {
    const user = await userService.getUserById('nonexistent-id-999')
    expect(user).toBeUndefined()
  })
})
```

## Architecture

```
Route Handler (Hono) -> Service -> Repository -> Database
```

- `src/routes/` - API endpoints and page routes
- `src/services/` - Business logic
- `src/models/` - Database repositories and types
- `src/types/` - TypeScript definitions
- `src/views/` - JSX components
- `src/utils/` - Utility functions
- `src/lib/db.ts` - Singleton database connection with `postgres.toCamel` transform

## Environment

- `DATABASE_URL` - PostgreSQL connection string
- `src/config/database.ts` - Database config
- `src/static/` - Static assets served at `/static/*`
- `@/*` resolves to `./src/*` via tsconfig.json
