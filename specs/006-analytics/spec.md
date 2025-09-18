# Feature Specification: Analytics & Events

Feature Branch: `006-analytics`
Status: Draft

## Goals
- Capture gameplay events for insights: session start/end, node visits, choices
- Provide aggregated dashboards for authors (per story)

## Scenarios
- Client emits events with minimal payload; server enriches and stores
- Author fetches metrics: plays, completion rate, drop-off by node, choice distribution

## Functional Requirements
- FR-001: Event ingestion endpoint (auth optional; session association required)
- FR-002: Server-side enrichment (storyId, userId, timestamps, templateVersion)
- FR-003: Aggregations per story with time window filters

## Non-Functional
- Low overhead ingestion; tolerant to bursts
- Privacy-aware (no PII in payloads)

## Entities
- AnalyticsEvent: id, sessionId, storyId, type, payload(JSONB), createdAt
- Aggregations are computed via SQL views or materialized tables
