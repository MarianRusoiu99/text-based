# Implementation Plan: Community & Discovery

## Success Criteria
- Public stories can be discovered and interacted with; moderation controls enforced.

## Steps
1) Prisma: `StoryLike`, `StoryComment`; add fields to `Story` (isPublic, tags JSONB)
2) Controllers/Services: publish toggle, tags update; list/search public stories
3) Likes API (idempotent like/unlike), Comments CRUD with ownership checks
4) Rate limiting and content validation (length, sanitization)
5) Tests: e2e for list/search/like/comment

## Risks
- Abuse vectors: add server-side validation and rate limits
