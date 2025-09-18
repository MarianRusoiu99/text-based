# Copilot Instructions for text-based

Last updated: 2025-09-18

## Project Overview
- Domain: Text-based adventure game platform with authoring (nodes/choices), RPG templates, player sessions, analytics, and community.
- Monorepo structure:
  - `backend/` — NestJS 10+, TypeScript 5+, Prisma 5, PostgreSQL 15+, Redis 7
  - `frontend/` — React + TypeScript, Vite, Tailwind, React Query, Zustand, React Flow
  - `specs/` — Spec Kit feature folders (e.g., `001-auth`, `003-nodes`, `004-rpg`, `005-player`)
  - `tests/` — Playwright setup for CT/E2E

## Architectural Principles (Constitution excerpts)
- Provider-agnostic: interfaces over implementations.
- Consistent API envelope: `{ success, message, data }`.
- Security baseline: JWT auth, input validation, rate limiting, least privilege.
- JSONB for flexible content (nodes, positions, RPG config).
- Test-first: contract tests before implementation; observability via structured logs.

## Backend Standards
- Framework: NestJS (modules/services/controllers) with Prisma ORM.
- DTOs: `class-validator` + `class-transformer`; align with OpenAPI 3.1.0 contracts in `specs/*/contracts/openapi.yaml`.
- Errors: return envelope with `success=false`, informative `message`, and optional `data` details.
- Auth: JWT bearer; guards for ownership (story, template, comments).
- Database: PostgreSQL; use indexes specified in data-model docs; JSONB fields for dynamic shapes.

## Frontend Standards
- React + TypeScript; state via Zustand; data via React Query.
- Editor: React Flow for nodes/choices graph; debounce autosave; batch positions endpoint.
- Styling: TailwindCSS; components co-located under `frontend/src/components`.

## Spec Kit Workflow
- Features live under `specs/NNN-*` with: `spec.md`, `plan.md`, `data-model.md`, `contracts/`, `quickstart.md`, `tasks.md`.
- Use FEATURE override to target a feature without switching branches:
  ```bash
  export FEATURE=004-rpg
  .specify/scripts/bash/get-feature-paths.sh
  ```
- Commands used by prompts:
  - `/specify`: Create/update spec (uses `.github/prompts/specify.prompt.md`).
  - `/plan`: Generate Phase 0–1 artifacts (research, data-model, contracts, quickstart).
  - `/tasks`: Create tasks.md from artifacts.

## Response Rules for Copilot
- Always respect the API envelope and OpenAPI 3.1.0 contracts in `specs/*/contracts/openapi.yaml`.
- Prefer pure functions and dependency injection; don’t hardcode providers.
- Validate inputs; never use `eval` for formulae (use safe parsers).
- Write tests first when adding endpoints or services; ensure failing tests before implementation.
- Use absolute paths in tool outputs.

## Key Feature Contracts
- Auth: `specs/001-auth/contracts/openapi.yaml`
- Nodes/Choices: `specs/003-nodes/contracts/openapi.yaml`
- RPG Templates: `specs/004-rpg/contracts/openapi.yaml`
- Player Sessions: `specs/005-player/contracts/openapi.yaml`
- Analytics: `specs/006-analytics/contracts/openapi.yaml`
- Community: `specs/007-community/contracts/openapi.yaml`

## Commands & Scripts
- Get feature paths: `.specify/scripts/bash/get-feature-paths.sh`
- Setup plan (copies plan template): `.specify/scripts/bash/setup-plan.sh --json`
- Check tasks prerequisites: `.specify/scripts/bash/check-task-prerequisites.sh --json`
- Update agent context: `.specify/scripts/bash/update-agent-context.sh copilot`

## Manual Additions
<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
