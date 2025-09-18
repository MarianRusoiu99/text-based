# Data Model: Analytics

## Prisma Model

- AnalyticsEvent
  - id: string (cuid)
  - sessionId: string (PlayerSession)
  - storyId: string (Story)
  - type: 'start' | 'visit' | 'choice' | 'end'
  - payload: Json (JSONB)
  - createdAt: DateTime

## Indexes
- (storyId, createdAt)
- (storyId, type, createdAt)
