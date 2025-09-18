# Tasks: Analytics (006-analytics)

- [ ] Prisma
  - [ ] Add `AnalyticsEvent` model; indexes; generate & migrate
- [ ] Backend
  - [ ] Module `analytics/` (controller, service, dto)
  - [ ] DTOs: `IngestEventDto`
  - [ ] Ingestion: rate limit, validate, enrich, store
  - [ ] Metrics: plays, completion rate, drop-off by node, choice distribution
- [ ] Tests
  - [ ] Unit tests for validator and aggregation helpers
  - [ ] E2E tests for ingest + metrics endpoints
