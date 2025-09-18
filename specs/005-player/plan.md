# Implementation Plan: Player Sessions

## Success Criteria
- Sessions can be created/resumed; applying a choice updates state and moves to next node.
- History captured; endpoints return envelope responses.

## Steps
1) Prisma models for `PlayerSession` and `SessionEvent` with JSONB state
2) Services: session lifecycle, evaluator (conditions/effects), history logger
3) Controllers: session CRUD (create/get/resume), get current state, apply choice
4) Guards: auth (optional), story access rules (only published stories for non-auth users)
5) Tests: unit tests for evaluator; e2e for session flows

## Notes
- Deterministic evaluator mirrors `RpgTemplateConfig` (no RNG now)
- Version pinning: copy `rpgTemplate.version` into session
- Idempotency for apply choice: detect duplicate submission via last node/choice id
