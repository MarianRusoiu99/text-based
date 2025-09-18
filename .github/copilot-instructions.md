# Text-Based Adventure Platform - AI Coding Guidelines

## Architecture Overview
This is a full-stack text-based adventure platform with:
- **Backend**: NestJS + TypeScript + Prisma + PostgreSQL + Redis
- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS + Zustand + React Query
- **Key Feature**: Node-based story editor using React Flow for visual story creation

## Core Patterns & Conventions

### API Response Format
All backend endpoints return consistent JSON structure:
```typescript
{
  success: boolean;
  message: string;
  data: T;  // The actual response data
}
```
**Example**: `/backend/src/nodes/nodes.service.ts` - All methods return wrapped responses

### Authentication & Authorization
- JWT-based auth with `Authorization: Bearer <token>` headers
- Guards verify story ownership before operations
- Frontend uses Zustand store: `useAuthStore.getState().accessToken`

### Database Schema Patterns
- **JSONB Storage**: Node content and positions stored as JSONB for flexibility
- **Cascade Deletes**: Story deletion removes all related nodes/choices
- **Ownership Checks**: All operations verify `story.authorId === userId`

### State Management
- **Client State**: Zustand stores (`authStore.ts`, `useAuthStore`)
- **Server State**: React Query for API data (`@tanstack/react-query`)
- **Local Component State**: React hooks for UI state

## Development Workflow

### Local Development Setup
```bash
# Start database and cache
docker-compose -f docker/docker-compose.yml up -d

# Backend development
cd backend && npm run start:dev  # Runs on :3000 with hot reload

# Frontend development
cd frontend && npm run dev      # Runs on :5173 with Vite HMR
```

### Database Operations
```bash
# Generate Prisma client after schema changes
cd backend && npx prisma generate

# Run migrations
cd backend && npx prisma migrate dev

# Reset database (development only)
cd backend && npx prisma migrate reset
```

### Build & Deploy
```bash
# Backend build
cd backend && npm run build

# Frontend build
cd frontend && npm run build
```

## Key Integration Points

### Story Editor Flow
1. **Load Data**: `StoryFlow.tsx` fetches nodes/choices on mount
2. **Visual Editing**: React Flow handles drag-and-drop interactions
3. **Auto-Save**: Position/content changes save via API calls
4. **Real-time Sync**: UI updates reflect database state

### Authentication Flow
- Login stores JWT tokens in Zustand + localStorage (via persist middleware)
- API calls include `Authorization: Bearer ${token}` headers
- Guards validate tokens and check ownership permissions

### Data Relationships
```
Story (authorId)
├── Chapters (storyId, chapterOrder)
├── Nodes (storyId, position: JSONB, content: JSONB)
│   └── Choices (fromNodeId → toNodeId, choiceText)
├── Variables (storyId, variableName, defaultValue: JSONB)
└── Items (storyId, itemName, description)
```

## Common Patterns

### Error Handling
```typescript
// Backend: Throw specific exceptions
throw new NotFoundException('Story not found');
throw new ForbiddenException('Access denied');

// Frontend: Check response.success
if (!response.success) {
  setError(response.message);
}
```

### Service Layer
```typescript
// Frontend services use auth store
const token = useAuthStore.getState().accessToken;
headers: { Authorization: `Bearer ${token}` }

// Backend services verify ownership
if (story.authorId !== userId) {
  throw new ForbiddenException('Access denied');
}
```

### Component Structure
- **Pages**: Route-level components (`/pages/`)
- **Components**: Reusable UI (`/components/ui/`, `/components/layout/`)
- **Services**: API communication (`/services/`)
- **Stores**: Global state (`/stores/`)

## React Flow Integration

### Node Data Structure
```typescript
interface RFNode {
  id: string;
  type: 'default';
  data: { label: string };
  position: { x: number; y: number };
}
```

### Event Handlers
- `onNodesChange`: Updates node positions
- `onEdgesChange`: Updates connections
- `onConnect`: Creates new choices between nodes
- `onNodeClick`: Opens node editor panel

## Testing & Quality

### Available Scripts
```bash
# Backend testing
npm run test              # Unit tests
npm run test:e2e          # End-to-end tests
npm run test:cov          # Coverage report

# Frontend testing (when implemented)
npm run test
```

### Code Quality
- ESLint + Prettier configured for both frontend/backend
- TypeScript strict mode enabled
- Pre-commit hooks via Husky (planned)

## File Organization Examples

### Backend Service Pattern
```
nodes/
├── nodes.controller.ts    # REST endpoints
├── nodes.service.ts       # Business logic
├── nodes.module.ts        # NestJS module
└── dto/                   # Request/response DTOs
    ├── create-node.dto.ts
    └── update-node.dto.ts
```

### Frontend Feature Pattern
```
pages/Editor.tsx           # Route component
components/StoryFlow.tsx   # Main editor component
services/nodesService.ts   # API client
stores/authStore.ts        # Global state
```

## Key Dependencies

### Backend
- `@nestjs/common`, `@nestjs/core` - Framework
- `@prisma/client`, `prisma` - Database ORM
- `@nestjs/jwt`, `passport-jwt` - Authentication
- `class-validator` - Request validation

### Frontend
- `react`, `react-dom` - UI framework
- `@xyflow/react` - Node editor
- `zustand` - State management
- `@tanstack/react-query` - Server state
- `tailwindcss` - Styling

## Development Tips

1. **Database Changes**: Always run `prisma generate` after schema updates
2. **API Testing**: Use tools like Postman/Insomnia with JWT auth headers
3. **Story Editor**: Test with both existing stories and new story creation
4. **Error States**: Check both network errors and API error responses
5. **Authentication**: Test with different user roles and story ownership

## Current Development Focus

- Node-based story editor with React Flow
- Story publishing and player experience
- User analytics and engagement tracking
- Advanced story branching and variables system</content>
<parameter name="filePath">/home/vali/Apps/text-based/.github/copilot-instructions.md
