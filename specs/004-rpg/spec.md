# Feature Specification: RPG Templates & Mechanics

**Feature Branch**: `004-rpg`
**Created**: 2025-09-18
**Status**: Draft
**Input**: RPG Mechanics Guidelines, Database Schema, Technical Specs

## User Scenarios & Testing

### Primary User Story
As an author, I define an RPG template with custom stats, items, mechanics, and calculations, reuse it across stories, and validate checks in player sessions.

### Acceptance Scenarios
1. Create RPG template with stats/items; mark as public/private; update version.
2. Attach template to a story; nodes can reference stats/variables.
3. During play, conditional choices evaluate stat/item checks; effects modify state.

### Edge Cases
- Invalid formula variable references → validation error.
- Removing a stat used by nodes → disallow or require migration.

## Requirements
- FR-001: CRUD RPG templates with JSONB `config`.
- FR-002: Template ownership and sharing.
- FR-003: Attach template to stories; enforce single template per story.
- FR-004: Validate configuration (stats unique ids/types; formulas parse).
- FR-005: Evaluate conditions/effects deterministically.

## Key Entities
- RpgTemplate: id, name, description, authorId, isPublic, version, config(JSONB), createdAt, updatedAt
- RpgTemplateConfig: stats[], items[], mechanics[], calculations[]
