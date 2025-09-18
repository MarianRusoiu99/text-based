# Tasks: RPG Templates (004-rpg)

- [ ] Prisma
  - [ ] Add `RpgTemplate` model and `Story.rpgTemplateId` relation; generate & migrate
- [ ] Backend
  - [ ] Module scaffolding `rpg/` (controller, service, dto)
  - [ ] DTOs + validators: `CreateRpgTemplateDto`, `UpdateRpgTemplateDto`, config zod schema
  - [ ] Guards: JWT, ownership checks, story ownership on attach
  - [ ] Controller endpoints per OpenAPI
  - [ ] Services: CRUD, validation, attach/detach
- [ ] Tests
  - [ ] Unit tests for config validator
  - [ ] E2E tests for CRUD and attach/detach
- [ ] Docs
  - [ ] Update README endpoints list (optional)
