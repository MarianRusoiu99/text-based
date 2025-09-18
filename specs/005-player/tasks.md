# Tasks: Player Sessions (005-player)

- [ ] Prisma
  - [ ] Add `PlayerSession` and `SessionEvent` models; generate & migrate
- [ ] Backend
  - [ ] Module `player-sessions/` (controller, service, dto)
  - [ ] DTOs: `ApplyChoiceDto`
  - [ ] Guards: optional JWT, story visibility guard
  - [ ] Services: create/resume, get state, apply choice (eval conditions/effects), history logger
- [ ] Evaluator
  - [ ] Implement deterministic evaluator aligned with `RpgTemplateConfig`
  - [ ] Unit tests for evaluator functions
- [ ] E2E
  - [ ] Session lifecycle tests (start → visit → choice → end)
