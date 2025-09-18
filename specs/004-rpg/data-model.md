# Data Model: RPG Templates

## Prisma Models

- RpgTemplate
  - id: string (cuid)
  - authorId: string (User)
  - name: string
  - description: string | null
  - isPublic: boolean (default false)
  - version: int (default 1)
  - config: Json (JSONB)
  - createdAt/updatedAt: DateTime

- Story (existing)
  - rpgTemplateId: string | null (FK → RpgTemplate, unique when not null)

## JSONB Config Shape (TypeScript)

interface RpgTemplateConfig {
  schemaVersion: 1;
  stats: Array<{ id: string; name: string; type: 'number'|'boolean'|'string'; min?: number; max?: number; default?: number|string|boolean; description?: string }>;
  items: Array<{ id: string; name: string; description?: string; stackable?: boolean; maxStack?: number }>;
  mechanics?: {
    damage?: { formula: string }; // e.g. "attack - defense"
    skillCheck?: { formula: string; successThreshold?: number };
  };
  calculations?: Array<{ id: string; expression: string; description?: string }>; // derived values
}

## Indexes & Constraints
- (authorId, name) unique to prevent duplicates per author
- Story.rpgTemplateId unique where not null to ensure single template per story
