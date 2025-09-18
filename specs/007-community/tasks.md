# Tasks: Community (007-community)

- [ ] Prisma
  - [ ] Augment `Story` with `isPublic` and `tags`; add `StoryLike`, `StoryComment`; migrate
- [ ] Backend
  - [ ] Module `community/` (controller, service, dto)
  - [ ] Endpoints: publish toggle, list public, like/unlike, comments CRUD
  - [ ] Guards: JWT for like/comment; ownership for delete
  - [ ] Rate limiting and content sanitization
- [ ] Tests
  - [ ] E2E tests for publish/list/like/comment flows
