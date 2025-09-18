---
description: Create or update the feature specification from a natural language feature description.
---

Given the feature description provided as an argument, do this:

1. Determine target feature directory:
	- If env `FEATURE` or `SPECIFY_FEATURE` is set, use `specs/$FEATURE`.
	- Else, try current branch name; if it matches `NNN-*` and `specs/NNN-*` exists, use it.
	- Else, run `.specify/scripts/bash/create-new-feature.sh --json "$ARGUMENTS"` to create a new feature; parse `BRANCH_NAME` and `SPEC_FILE`.
2. Load `.specify/templates/spec-template.md` to understand required sections.
3. Aggregate source material context:
	- All files in the resolved feature directory (`spec.md` if exists)
	- All sibling docs in `specs/` relevant to cross-feature references
	- Documents under `Development Plan for Text-Based Adventure Game Platform/`
	- The constitution at `.specify/memory/constitution.md`
4. Write or update the feature `spec.md` using the template structure, replacing placeholders with concrete details derived from the feature description and source materials, while preserving section order and headings.
5. Report completion with feature name, spec file path, and readiness for the next phase.

Notes:
- Prefer updating existing `spec.md` if present; otherwise initialize using the template.
- Use absolute paths for all file operations.
