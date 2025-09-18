# Data Model: Community

## Prisma Models

- Story (augment)
  - isPublic: boolean (default false)
  - tags: Json (JSONB) | null

- StoryLike
  - id: string (cuid)
  - storyId: string (Story)
  - userId: string (User)
  - createdAt: DateTime
  - Unique: (storyId, userId)

- StoryComment
  - id: string (cuid)
  - storyId: string (Story)
  - userId: string (User)
  - content: string
  - createdAt: DateTime
  - updatedAt: DateTime
