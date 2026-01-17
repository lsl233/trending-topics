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
- `bun test` - Run all tests
- `bun run test:run` - Alias for `bun test`
- `bun run test:ui` - Run tests with Vitest UI
- `bun run test:coverage` - Run tests with coverage report

**To run a single test file:**
```bash
bun test path/to/test-file.test.ts
```

**To run tests matching a pattern:**
```bash
bun test --grep "describeOrTestName"
```

## Code Style Guidelines

### Imports
- Use path alias `@/*` for all imports from `src/*`
- Import types/interfaces alongside their implementations when defined in same file
- Group imports: external libs first, then internal modules
- No unused imports

```typescript
import { Hono } from 'hono'
import { getDatabase } from '@/lib/db'
import { toCamelCase } from '@/utils/case-converter'
import { TrendingTopic, CreateTrendingTopicDto } from '@/models/trending-topic.model'
```

### Formatting
- Use 2 spaces for indentation
- Use single quotes for strings
- No trailing whitespace
- No semicolons (consistent with existing codebase)
- **IMPORTANT: DO NOT add comments unless explicitly asked**

### Types
- Define interfaces in model files alongside repositories
- Use `*Dto` suffix for data transfer objects (CreateXDto, UpdateXDto)
- Database columns use snake_case, application uses camelCase
- Always use `toCamelCase()` when reading from database
- Always use `toSnakeCase()` when writing to database (via `db(dto)`)
- Use `Omit<T, 'key'>` for excluding fields in DTOs

```typescript
export interface TrendingTopic {
  id: number
  source: string
  uniqueKey: string
  title: string
  url: string
  firstSeenAt: Date | null
}

export interface CreateTrendingTopicDto {
  source: string
  uniqueKey: string
  title: string
  url: string
  firstSeenAt?: Date
}
```

### Naming Conventions
- **Files**: kebab-case (e.g., `user.service.ts`, `trending-topic.model.ts`)
- **Variables/Functions**: camelCase
- **Classes/Interfaces**: PascalCase
- **Constants**: SCREAMING_SNAKE_CASE (if global)
- **Database tables/columns**: snake_case
- **Repository functions**: descriptive names (findAll, findById, create, update, delete)
- **Service functions**: match repository but with semantic names (getTopicById, createTopic)
- **Route handlers**: named after resource (users, topics)

### Repository Pattern
All database access uses postgres tagged template literals:

```typescript
export const trendingTopicRepository = {
  findAll: async (): Promise<TrendingTopic[]> => {
    const db = getDatabase()
    const topics = await db`SELECT * FROM trending_topics ORDER BY first_seen_at DESC`
    return toCamelCase<TrendingTopic[]>(topics)
  },

  create: async (dto: CreateTrendingTopicDto): Promise<TrendingTopic> => {
    const db = getDatabase()
    const topics = await db`INSERT INTO trending_topics ${db(dto)} RETURNING *`
    return toCamelCase<TrendingTopic[]>(topics)[0]
  }
}
```

### Service Layer
Services are thin wrappers around repositories that add business logic:

```typescript
export const trendingTopicService = {
  getAllTopics: async (): Promise<TrendingTopic[]> => {
    return trendingTopicRepository.findAll()
  },

  createTopic: async (dto: CreateTrendingTopicDto): Promise<TrendingTopic> => {
    return trendingTopicRepository.create(dto)
  }
}
```

### Route Handlers
Use Hono framework, return JSON with `{ success, data, error }` structure:

```typescript
import { Hono } from 'hono'
import { userService } from '@/services/user.service'

const users = new Hono()

users.get('/', async (c) => {
  const users = await userService.getAllUsers()
  return c.json({ success: true, data: users })
})

users.get('/:id', async (c) => {
  const id = c.req.param('id')
  const user = await userService.getUserById(id)
  if (!user) {
    return c.json({ success: false, error: 'User not found' }, 404)
  }
  return c.json({ success: true, data: user })
})

export { users }
```

### JSX Components
Use Hono JSX with server-side rendering:

```typescript
import type { FC } from 'hono/jsx'

export const Home: FC<{ latestBatch: CrawlBatch, histories: TrendingHistoryWithTopic[] }> = ({ latestBatch, histories }) => {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <h1>{latestBatch.aiTitle}</h1>
    </div>
  )
}
```

### Error Handling
- Return 404 with error message when resource not found
- Log errors to console with context
- For database errors, catch and return appropriate HTTP status
- Use try-catch blocks in async functions

### Testing
Use Vitest with describe/it/expect pattern:

```typescript
import { describe, it, expect } from 'vitest'
import { userService } from '../../src/services/user.service'

describe('userService', () => {
  describe('getUserById', () => {
    it('should return undefined when invalid id is provided', async () => {
      const user = await userService.getUserById('nonexistent-id-999')
      expect(user).toBeUndefined()
    })
  })
})
```

### Database Connection
- Database is singleton in `src/lib/db.ts`
- Use `getDatabase()` to get connection
- Use `db()` tagged template for queries
- Connection config in `src/config/database.ts`
- Test connection via `GET /api/db/test`

### Environment Variables
- `DATABASE_URL` - Full PostgreSQL connection string
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - Alternative config options
- Store in `.env` file (not committed to git)

## Architecture

```
Route Handler (Hono) -> Service (Business Logic) -> Repository (Model) -> Database
```

- **src/routes/**: API endpoints and page routes
- **src/services/**: Business logic layer
- **src/models/**: Database repositories and types
- **src/views/**: JSX components for SSR
- **src/middleware/**: Hono middleware (logger, CORS)
- **src/utils/**: Utility functions
- **src/lib/**: Core libraries (database connection)
- **src/config/**: Configuration files

## Path Alias

`tsconfig.json` configures `@/*` to resolve to `./src/*` for cleaner imports.

## Asset Building

- CSS compiled from `src/assets/css/` to `src/static/css/` using Tailwind CLI
- JS bundled from `src/assets/js/` to `src/static/js/` using Bun

## Static Files

Static assets served at `/static/*` from `src/static/` directory.
