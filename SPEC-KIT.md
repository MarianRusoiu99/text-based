# Spec Kit Usage in this Repo

This repository uses the Specify CLI (Spec Kit) with customized scripts and prompts.

## Feature Targeting
- Prefer feature branches named `NNN-feature-name`.
- Or, set `FEATURE` to target an existing folder under `specs/`.

```bash
export FEATURE=004-rpg
```

## Commands

/specify (create or update spec)
- Decides feature folder using `FEATURE`, current branch, or creates a new folder.
- Consumes:
  - `.specify/templates/spec-template.md`
  - `specs/*` and `Development Plan for Text-Based Adventure Game Platform/*`
  - `.specify/memory/constitution.md`

/plan (Phase 0–1 only)
- Generates Phase 0 and Phase 1 artifacts:
  - `research.md`, `data-model.md`, `contracts/`, `quickstart.md`
- Reads:
  - `specs/[NNN-feature]/*`, Constitution, Development Plan docs

/tasks (Phase 2)
- Generates `tasks.md` based on available artifacts.
- Reads `plan.md`, and if available: `data-model.md`, `contracts/`, `research.md`, `quickstart.md`.

## Script Utilities
- `.specify/scripts/bash/get-feature-paths.sh` — prints resolved paths (uses FEATURE override)
- `.specify/scripts/bash/update-agent-context.sh [copilot|claude|...]` — updates agent guidance using plan details

## Notes
- All responses use the standard API envelope `{ success, message, data }`.
- OpenAPI contracts are 3.1.0.
