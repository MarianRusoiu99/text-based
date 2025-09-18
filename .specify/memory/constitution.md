# Text-Based Adventure Platform Constitution

## Core Principles

### I. Provider-Agnostic Architecture
All external dependencies (storage, email, logging, cache) MUST be abstracted via interfaces with swappable implementations. Business logic MUST depend on abstractions, not concrete providers. Configuration selects providers per environment.

### II. Consistent API Contract
All backend endpoints MUST return the standard JSON envelope: `{ success: boolean, message: string, data: T }` with optional metadata and error arrays. Breaking changes to contracts require migration notes and versioning.

### III. Ownership and Authorization
All operations that mutate or read story-scoped resources MUST verify ownership (e.g., `story.authorId === userId`) or explicit permissions. Access MUST be enforced at controller guard and service layers.

### IV. Test-First Development (Non-Negotiable)
Write tests before implementation. Contract tests (API), integration tests (DB/Prisma), and unit tests MUST be authored to fail (RED) before code is written (GREEN), followed by refactor. Minimum coverage thresholds apply per module.

### V. Modular Feature Architecture
Use NestJS modularization on the backend and feature-based folders on the frontend. Each feature encapsulates controllers/components, services/hooks, DTOs/types, and tests. Shared utilities live under `common`/`components/ui` with no circular deps.

### VI. JSONB Flexibility for Story Data
Node content, positions, variables, and RPG configurations MUST use JSONB to allow evolution without schema churn. Enforce validation via DTOs and runtime schema guards.

### VII. Simplicity and Direct Framework Use
Prefer built-in framework capabilities (NestJS providers, Prisma client, React hooks) over custom abstractions. Avoid premature generalization. Introduce indirection ONLY with demonstrated need and tests.

### VIII. Security Baseline
Enforce JWT auth with Bearer tokens, input validation (class-validator), sanitization, rate limiting, secure password hashing, and email verification. Sensitive operations MUST be audited and logged.

### IX. Observability and Error Handling
All errors MUST map to appropriate HTTP status codes and API error objects with actionable messages. Logging MUST include context (requestId, userId, storyId) and avoid PII leakage. Performance metrics SHOULD be captured for key flows.

## Non-Functional Requirements

### Performance & Scale
- API p95 latency targets SHOULD be documented per endpoint group (auth, editor, player).
- Database queries MUST have appropriate indexes; long-running queries require justification.

### Reliability
- Cascading deletes for stories MUST preserve referential integrity (nodes/choices cascade).
- Idempotency SHOULD be considered for writes where applicable (e.g., connect/choice creation).

### Accessibility & UX
- Frontend components MUST meet WCAG 2.1 AA. Keyboard navigation and ARIA attributes are mandatory for editor/player UIs.

## Development Workflow and Quality Gates

### Spec-Driven Flow
- Use Spec Kit `/specify` → `/plan` → `/tasks` for all substantial features.
- Feature specs MUST include user scenarios, acceptance criteria, and explicit clarifications.

### Quality Gates
- Build, lint, typecheck MUST pass.
- Tests: contract → integration → unit order. Minimum coverage per module (backend 80%+, critical auth 100%).
- API contract diffs reviewed against constitution (II.).

### Database Changes
- Prisma migrations MUST accompany schema changes; run `prisma generate` after changes; annotate indexes and constraints.

## Governance

This Constitution supersedes ad-hoc practices. Amendments require:
1) Rationale and impact analysis, 2) Review/approval by maintainers, 3) Migration guidance where applicable. All PRs MUST include a constitution compliance checklist.

**Version**: 1.0.0 | **Ratified**: 2025-09-18 | **Last Amended**: 2025-09-18