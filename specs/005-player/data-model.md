# Data Model: Player Sessions

## Prisma Models

- PlayerSession
  - id: string (cuid)
  - userId: string | null (User)
  - storyId: string (Story)
  - templateVersion: int
  - currentNodeId: string
  - state: Json (JSONB)
  - completedAt: DateTime | null
  - createdAt/updatedAt: DateTime
  - Unique: (userId, storyId) where userId not null

- SessionEvent
  - id: string (cuid)
  - sessionId: string (FK → PlayerSession)
  - type: 'start' | 'visit' | 'choice' | 'end'
  - payload: Json (JSONB)
  - createdAt: DateTime

## State JSON Shape (TypeScript)

interface RuntimeState {
  variables: Record<string, unknown>;
  stats: Record<string, number | boolean | string>;
  inventory: Array<{ id: string; qty: number }>;
}
