# Plan: Testing Strategy

## Success Criteria
- One-command local test runs for backend and frontend; CI green when thresholds met.

## Steps
1) Backend: ensure `npm run test`, `test:e2e`, coverage config; add helpers for envelope assertions
2) Frontend: CT config in `tests/` already present; add RTL + vitest where missing
3) Data seeding for e2e: prisma seed scripts; test containers via docker-compose
4) CI: add jobs for lint/typecheck/tests/e2e; cache node_modules; upload reports

## Risks
- Flaky e2e in CI; mitigate with retries and isolated seeds
