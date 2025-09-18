# Implementation Plan: Story Nodes & Choices

**Branch**: `003-nodes` | **Date**: 2025-09-18 | **Spec**: ./spec.md
**Input**: Feature specification from `/specs/003-nodes/spec.md`

## Summary
CRUD for nodes and choices with JSONB content/position, ownership checks, batch position updates, and cascading deletes.

## Technical Context
**Language/Version**: TypeScript 5 (NestJS), Node 18+
**Dependencies**: Prisma, class-validator, @nestjs/jwt
**Storage**: PostgreSQL JSONB
**Testing**: Jest + Supertest (contracts), Playwright for editor E2E
**Project Type**: web (backend+frontend)
**Performance Goals**: Batch updates < 100ms per 100 nodes
**Constraints**: Ownership enforced; JSONB for flexibility

## Constitution Check
- Provider agnostic: N/A (DB fixed) PASS
- API envelope: PASS
- Ownership: PASS
- Simplicity: PASS (direct Nest/Prisma)

## Project Structure
```
specs/003-nodes/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md (via /tasks)
```

## Phase 0: Outline & Research
- Validate JSONB indexing strategies for positions/conditions
- Evaluate transaction handling for batch position updates

## Phase 1: Design & Contracts
- Models: StoryNode, Choice
- Contracts: CRUD for nodes/choices; batch position update
- Contract tests for each endpoint

## Phase 2: Task Planning Approach
- Generate tests first; implement controllers/services; add Prisma schema/migrations

## Progress Tracking
- [ ] Research
- [ ] Design
- [ ] Tasks
- [ ] Impl
- [ ] Validation
