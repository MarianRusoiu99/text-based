# Specification: Testing Strategy

Feature Branch: `008-testing`
Status: Draft

## Goals
- Establish a consistent testing strategy across backend and frontend
- Integrate with Spec Kit-driven plans and tasks

## Scope
- Backend: unit (services, validators), e2e (Nest + Supertest), coverage gates
- Frontend: unit (components, hooks), component tests (CT) with Playwright, e2e (Playwright)
- CI: run lint, typecheck, test, e2e; generate coverage report

## Requirements
- TR-001: Minimum coverage thresholds (backend 80%, frontend 70%)
- TR-002: Deterministic tests; avoid network flakiness
- TR-003: Seed data utilities for e2e
- TR-004: Testing helpers for auth headers and envelopes

## Non-Functional
- Fast feedback: parallelize test runs; cache dependencies
