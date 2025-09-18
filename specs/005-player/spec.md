# Feature Specification: Player Sessions & Runtime State

Feature Branch: `005-player`
Status: Draft

## User Scenarios
- Start/resume a play session for a published story using its RPG template.
- Fetch current node, narrative, stats, items, and available choices.
- Choose an option; engine evaluates conditions, applies effects, advances node, records history.

## Functional Requirements
- FR-001: Create/Resume session per story per user (or anonymous via sessionId).
- FR-002: Persist runtime state: currentNodeId, variables JSONB, stats, inventory.
- FR-003: Evaluate conditions/effects deterministically (no RNG server-side for now).
- FR-004: Record history (visited nodes, taken choices, timestamps) for analytics.
- FR-005: Expose read-only endpoints for current state and next choices.
- FR-006: Apply choice endpoint with validation of ownership and availability.

## Edge Cases
- Invalid choice for current node → 400.
- Story/template changed after session start → version pinning in session; warn on mismatch.
- Dead-ends (no choices) → mark session completed.

## Non-Functional
- Auth required for persistent sessions; anonymous supported with generated token.
- Response format uses standard envelope.

## Entities
- PlayerSession: id, userId|null, storyId, templateVersion, currentNodeId, state(JSONB), completedAt, createdAt, updatedAt
- SessionEvent: id, sessionId, type('choice'|'visit'|'start'|'end'), payload(JSONB), createdAt
- State shape: { variables: Record<string, any>, stats: Record<string, number|boolean|string>, inventory: Array<{id: string, qty: number}> }
