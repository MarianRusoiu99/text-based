# Data Model: Authentication & User Management

## Entities

### User
- id: UUID (PK)
- username: string (unique, 3-50, [a-zA-Z0-9_])
- email: string (unique)
- passwordHash: string
- displayName: string (<=100)
- isVerified: boolean (default false)
- isActive: boolean (default true)
- preferences: JSONB
- createdAt: timestamp
- updatedAt: timestamp
- lastLogin: timestamp nullable

### RefreshToken
- id: UUID (PK)
- userId: FK → User(id)
- tokenHash: string (unique index)
- issuedAt: timestamp
- expiresAt: timestamp
- revokedAt: timestamp nullable
- ip: string nullable
- userAgent: string nullable

### VerificationToken
- id: UUID (PK)
- userId: FK → User(id)
- tokenHash: string (unique index)
- expiresAt: timestamp
- usedAt: timestamp nullable

### PasswordResetToken
- id: UUID (PK)
- userId: FK → User(id)
- tokenHash: string (unique index)
- expiresAt: timestamp
- usedAt: timestamp nullable

## Indexing Strategy
- Unique indexes on username, email (soft delete filtering if applicable)
- Indexes on (userId, revokedAt is null) for active tokens
- GIN index on preferences JSONB if queried

## Validation Rules
- Password policy: >= 8 chars, mixed case, numbers, symbols
- Username: regex ^[a-zA-Z0-9_]{3,50}$
- Email: RFC-compliant

## Relations & Cascade
- On user delete (dev only), cascade remove tokens; in prod, prefer soft delete
