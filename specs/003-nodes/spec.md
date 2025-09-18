# Feature Specification: Story Nodes & Choices

**Feature Branch**: `003-nodes`
**Created**: 2025-09-18
**Status**: Draft
**Input**: Derived from Backend/Frontend docs: Story editor flow, JSONB storage, ownership checks

## User Scenarios & Testing

### Primary User Story
As an author, I can visually create and rearrange story nodes, connect them with choices, and save content/positions with auto-save; as a player, choices determine next node following conditions.

### Acceptance Scenarios
1. Given an existing story I own, when I create a node with text and position, then it persists and appears in the editor.
2. Given two nodes, when I connect them with a choice, then the edge is saved and visible; deleting the choice removes the edge.
3. Given I drag nodes, when auto-save triggers, then positions update in DB.
4. Given I try to edit a story I don’t own, then I receive 403 Forbidden.

### Edge Cases
- Deleting a node with incoming/outgoing choices cascades appropriately.
- Invalid `toNodeId` in choice creation returns 422.
- Concurrent edits resolve last-write-wins at position level, with server-side validation.

## Requirements

### Functional Requirements
- FR-001: System MUST allow CRUD on nodes with JSONB `content` and `position`.
- FR-002: System MUST allow CRUD on choices linking nodes with `fromNodeId -> toNodeId`.
- FR-003: Auto-save endpoint MUST support batch position updates.
- FR-004: Ownership guards MUST protect all endpoints.
- FR-005: Response envelope MUST be consistent.

### Key Entities
- StoryNode: id, storyId, content(JSONB), position(JSONB), nodeType, createdAt, updatedAt
- Choice: id, storyId, fromNodeId, toNodeId, choiceText, conditions(JSONB), effects(JSONB)
