# Feature Specification: Visual Story Editor

Feature Branch: `002-editor`
Status: Draft

## Goals
- Visual graph editor for nodes/choices using React Flow
- Autosave positions and content edits to backend
- Ownership and auth enforced; real-time UI reflects DB state

## Scenarios
- Load story graph with nodes and edges; pan/zoom, drag, select
- Edit node content/metadata; autosave debounce
- Create/delete edges (choices) with inline label editing
- Batch-save positions on drag end

## Functional Requirements
- FR-001: Load nodes/choices via API and normalize into React Flow
- FR-002: Autosave node content edits with optimistic updates and retry
- FR-003: On drag end, batch-save node positions
- FR-004: Create/Delete choice edges via API; disallow self-loops if prohibited
- FR-005: Ownership guard: only author can edit

## Non-Functional
- Smooth interactions, debounced network calls, error toasts
- Keyboard shortcuts: delete, duplicate, undo (MVP: delete)

## Dependencies
- Nodes/Choices APIs, Auth store (`useAuthStore`), React Query, Zustand, React Flow
