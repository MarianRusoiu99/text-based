# Implementation Plan: Analytics

## Success Criteria
- Ingestion endpoint accepts events; stores with enrichment.
- Author metrics endpoints return aggregated stats, using the standard envelope.

## Steps
1) Prisma model `AnalyticsEvent` (JSONB payload)
2) Ingestion controller/service with rate limiting and schema validation
3) Aggregation queries (SQL + Prisma) for metrics
4) Endpoints for metrics per story with time filters
5) Tests: unit for validator; e2e for ingestion + metrics

## Risks
- Volume spikes: consider buffering via Redis Stream later; start with direct writes
- Query performance: add indexes on (storyId, type, createdAt)
