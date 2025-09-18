# Implementation Plan: RPG Templates & Mechanics

Scope: Backend first, minimal UI hooks. Aligns with Constitution: provider-agnostic, JSONB, ownership, testing first.

## Success Criteria
- CRUD endpoints return standard envelope.
- Config validator rejects bad formulas/duplicates.
- Story can link one template; enforced by DB and service.

## Architecture
- Module: `rpg/` (controller, service, dto, prisma)
- Prisma: `RpgTemplate` model with JSONB `config`
- Services: validation, evaluation (pure functions), attachment service

## Steps
1) Data model & Prisma migration
2) DTOs and validation (class-validator + zod schema for config)
3) Controller endpoints and guards (JWT + ownership)
4) Service logic (create/update with validation; list; delete with constraints)
5) Story linkage endpoints (attach/detach; guard one-per-story)
6) Evaluation utilities (condition/effect execution) with unit tests
7) E2E tests for CRUD and linkage

## Risks & Mitigations
- Complex formulas: use safe parser (e.g., expr-eval) in FE; BE uses deterministic evaluator w/o `eval`.
- Back-compat: version field and config `schemaVersion`.
