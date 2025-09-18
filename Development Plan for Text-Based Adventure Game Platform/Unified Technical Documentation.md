# Text-Based Adventure Platform: Unified Technical Documentation

## Executive Summary

This unified technical documentation consolidates all platform specifications, removing redundancy and resolving conflicts across multiple overlapping documents. The text-based adventure platform combines a powerful story creation editor with an immersive story player, enhanced by completely flexible RPG mechanics that story creators can define without any hardcoded constraints.

The platform is built on modern web technologies with NestJS (backend), React (frontend), TypeScript, Prisma ORM, and PostgreSQL, emphasizing modularity, maintainability, and provider-agnostic design patterns.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Principles](#architecture-principles)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [API Design](#api-design)
6. [Backend Architecture](#backend-architecture)
7. [Frontend Architecture](#frontend-architecture)
8. [Testing Strategy](#testing-strategy)
9. [Implementation Plan](#implementation-plan)
10. [Development Guidelines](#development-guidelines)

## Project Overview

### Core Features

**Story Editor (Node-Based Interface):**
- Visual story creation with drag-and-drop nodes
- Flexible RPG mechanics definition by story creators
- Live preview and testing capabilities
- Keyboard shortcuts and quality-of-life features

**Story Player (Immersive Reader):**
- Rich text-based RPG experience
- Dynamic character progression and choices
- Visual elements and branching narratives
- Save/load functionality and progress tracking

**Community Features:**
- Story sharing and rating system
- Author profiles and follower mechanics
- Comments and discussion forums
- Story discovery and recommendations

### Flexible RPG System

The platform implements a completely flexible RPG mechanics system where story creators define their own game rules without any hardcoded constraints:

- **Custom Stats:** Creators define any type of character attributes
- **Flexible Checks:** Configurable success/failure mechanics
- **Dynamic Calculations:** Creator-defined formulas and logic
- **Template System:** Reusable RPG configurations across stories
- **No Prescriptive Systems:** Complete freedom from specific game mechanics

## Architecture Principles

### Core Design Philosophy

The platform follows strict architectural principles emphasizing modularity, maintainability, scalability, and provider-agnostic design:

#### SOLID Principles
- **Single Responsibility:** Each component has one clear purpose
- **Open/Closed:** Components extensible without modification
- **Liskov Substitution:** Derived classes substitutable for base classes
- **Interface Segregation:** Focused, specific interfaces
- **Dependency Inversion:** Abstractions over concrete implementations

#### Provider-Agnostic Design
All external dependencies abstracted through interfaces:
- Storage providers (AWS S3, MinIO, local filesystem)
- Email providers (SendGrid, Mailgun, SMTP)
- Logging providers (Winston, Pino, console)
- Cache providers (Redis, Memcached, in-memory)
- Authentication providers (JWT, OAuth, SAML)

#### Domain-Driven Design
Code organized around business domains with clear boundaries and well-defined interfaces between User Management, Story Creation, RPG Template Management, and Gameplay modules.

### Security Principles

- JWT-based authentication with refresh token rotation
- Rate limiting and DDoS protection
- Input validation and sanitization
- Secure password hashing with bcrypt
- CORS configuration for frontend integration
- Audit logging for security monitoring

## Technology Stack

### Backend
- **NestJS 10+:** Progressive Node.js framework with TypeScript
- **TypeScript 5+:** Static type checking and modern JavaScript features
- **Prisma 5+:** Type-safe database ORM with auto-generated client
- **PostgreSQL 15+:** Primary relational database
- **Redis 7+:** Caching and session management
- **Passport.js:** Authentication middleware with JWT strategy

### Frontend
- **React 18+:** Component-based UI framework with TypeScript
- **TypeScript 5+:** Type-safe frontend development
- **Vite:** Fast build tool and development server
- **TailwindCSS:** Utility-first CSS framework
- **Zustand:** Lightweight state management
- **React Router v6:** Client-side routing
- **React Flow:** Node-based editor interface

### Testing & Quality
- **Jest:** Unit testing framework
- **Playwright:** End-to-end testing
- **ESLint & Prettier:** Code quality and formatting
- **Husky:** Git hooks for pre-commit validation

### DevOps & Deployment
- **Docker:** Containerization
- **GitHub Actions:** CI/CD pipelines
- **Prometheus:** Metrics collection
- **Sentry:** Error tracking and monitoring

## Database Schema

### Core Design Principles

- **UUID Primary Keys:** Cryptographically secure unique identifiers
- **Audit Trail:** Created/updated timestamps on all tables
- **Soft Deletes:** Deleted flags for data preservation
- **JSONB Flexibility:** Semi-structured data for RPG mechanics
- **Strategic Indexing:** Performance optimization for query patterns
- **Referential Integrity:** Foreign key constraints with cascade options

### Core Tables

#### Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);
```

#### Stories
```sql
CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    category VARCHAR(50),
    tags TEXT[],
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted', 'private')),
    content_rating VARCHAR(10) DEFAULT 'general' CHECK (content_rating IN ('general', 'teen', 'mature', 'adult')),
    estimated_duration INTERVAL,
    rpg_template_id UUID REFERENCES rpg_templates(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Story Nodes
```sql
CREATE TABLE story_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    node_type VARCHAR(50) NOT NULL,
    title VARCHAR(255),
    content JSONB,
    position JSONB,
    connections JSONB,
    rpg_mechanics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### RPG Templates
```sql
CREATE TABLE rpg_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version VARCHAR(20) DEFAULT '1.0.0',
    is_public BOOLEAN DEFAULT FALSE,
    config JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Indexing Strategy

- Unique indexes on usernames, emails, and other identifiers
- Performance indexes on frequently queried fields
- Composite indexes for complex query patterns
- Partial indexes for filtered queries
- GIN indexes for JSONB fields

## API Design

### RESTful Principles

All APIs follow REST principles with proper HTTP methods, status codes, and resource-based URLs:

- **GET:** Retrieve resources
- **POST:** Create new resources
- **PUT/PATCH:** Update existing resources
- **DELETE:** Remove resources

### Base URL and Versioning

```
Base URL: https://api.textadventure.com/v1
```

All endpoints are versioned for backward compatibility.

### Authentication

JWT-based authentication with Bearer token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

Token expiration: 24 hours (access), 30 days (refresh)

### Response Format

Consistent JSON envelope for all responses:

```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "errors": [],
  "meta": {
    "timestamp": "2025-09-18T00:00:00Z",
    "version": "1.0.0",
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100
    }
  }
}
```

### Error Handling

Structured error responses with appropriate HTTP status codes:

```json
{
  "success": false,
  "data": null,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "code": "VALIDATION_ERROR",
      "message": "Email format is invalid"
    }
  ],
  "meta": {
    "timestamp": "2025-09-18T00:00:00Z",
    "version": "1.0.0"
  }
}
```

### Key Endpoints

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - Session termination
- `POST /auth/verify-email` - Email verification
- `POST /auth/forgot-password` - Password reset initiation
- `POST /auth/reset-password` - Password reset completion

#### Stories
- `GET /stories` - List stories with filtering/pagination
- `POST /stories` - Create new story
- `GET /stories/{id}` - Get story details
- `PUT /stories/{id}` - Update story
- `DELETE /stories/{id}` - Delete story
- `POST /stories/{id}/publish` - Publish story

#### RPG Templates
- `GET /rpg-templates` - List templates
- `POST /rpg-templates` - Create template
- `GET /rpg-templates/{id}` - Get template
- `PUT /rpg-templates/{id}` - Update template
- `DELETE /rpg-templates/{id}` - Delete template

#### User Management
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update user profile
- `GET /users/{id}` - Get user by ID
- `GET /users/{id}/stories` - Get user's stories

### Validation and Security

- **Input Validation:** DTOs with class-validator decorators
- **Rate Limiting:** Configurable limits per endpoint
- **CORS:** Proper cross-origin resource sharing
- **Sanitization:** XSS and injection prevention
- **Audit Logging:** Security event tracking

## Backend Architecture

### Project Structure

```
backend/
├── src/
│   ├── app.module.ts              # Root application module
│   ├── main.ts                    # Application entry point
│   ├── common/                    # Shared utilities and abstractions
│   │   ├── providers/            # Provider-agnostic service abstractions
│   │   ├── decorators/           # Custom decorators
│   │   ├── guards/               # Authentication and authorization
│   │   ├── interceptors/         # Request/response processing
│   │   ├── pipes/                # Validation and transformation
│   │   └── filters/              # Exception handling
│   ├── modules/                  # Feature modules
│   │   ├── auth/                 # Authentication module
│   │   ├── users/                # User management
│   │   ├── stories/              # Story management
│   │   ├── rpg-templates/        # RPG template management
│   │   ├── gameplay/             # Game session management
│   │   └── analytics/            # Analytics and reporting
│   └── config/                   # Configuration management
├── prisma/
│   └── schema.prisma             # Database schema
├── test/                        # Test files
└── docker/                      # Docker configuration
```

### Module Organization

Each feature module follows consistent structure:

```
modules/{feature}/
├── {feature}.module.ts          # Module definition
├── controllers/                 # HTTP request handlers
├── services/                    # Business logic
├── dto/                        # Data transfer objects
├── entities/                   # Domain entities
├── guards/                     # Route guards
├── decorators/                 # Module-specific decorators
└── {feature}.spec.ts           # Unit tests
```

### Provider-Abstraction Pattern

All external services abstracted through interfaces:

```typescript
// Interface definition
export interface IEmailProvider {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}

// Concrete implementations
@Injectable()
export class SendGridProvider implements IEmailProvider {
  // SendGrid implementation
}

@Injectable()
export class SMTPProvider implements IEmailProvider {
  // SMTP implementation
}

// Factory for provider selection
@Injectable()
export class EmailProviderFactory {
  create(provider: string): IEmailProvider {
    // Return appropriate implementation
  }
}
```

### Dependency Injection

Extensive use of NestJS dependency injection:

```typescript
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: IJwtService,
    private readonly emailProvider: IEmailProvider,
    private readonly cacheProvider: ICacheProvider,
  ) {}
}
```

### Configuration Management

Environment-based configuration with validation:

```typescript
export class ConfigService {
  @IsString()
  @IsNotEmpty()
  databaseUrl: string;

  @IsString()
  @IsNotEmpty()
  jwtSecret: string;

  @IsEnum(['sendgrid', 'smtp'])
  emailProvider: string;
}
```

## Frontend Architecture

### Project Structure

```
frontend/
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── ui/                  # Basic UI components
│   │   ├── layout/              # Layout components
│   │   ├── editor/              # Story editor components
│   │   ├── player/              # Story player components
│   │   └── rpg/                 # RPG-specific components
│   ├── pages/                   # Page components
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API service layer
│   ├── stores/                  # State management
│   ├── utils/                   # Utility functions
│   ├── types/                   # TypeScript type definitions
│   └── constants/               # Application constants
├── public/                      # Static assets
└── tests/                       # Test files
```

### Component Architecture

**Atomic Design Methodology:**
- **Atoms:** Basic UI elements (Button, Input, Icon)
- **Molecules:** Combinations of atoms (FormField, Card, Navigation)
- **Organisms:** Complex UI sections (Header, Sidebar, StoryEditor)
- **Templates:** Page layouts
- **Pages:** Complete application views

### State Management

Zustand for lightweight, scalable state management:

```typescript
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Store implementation
}));
```

### API Integration

React Query for server state management:

```typescript
export const useStories = (filters: StoryFilters) => {
  return useQuery({
    queryKey: ['stories', filters],
    queryFn: () => storyApi.getStories(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### Story Editor (React Flow)

Node-based editor using React Flow:

```typescript
export const StoryEditor = () => {
  const { nodes, edges, onNodesChange, onEdgesChange } = useStoryStore();

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
};
```

## Testing Strategy

### Testing Pyramid

**Unit Tests (70%):**
- Service layer business logic
- Component rendering and interactions
- Utility function correctness
- Mock external dependencies

**Integration Tests (20%):**
- API endpoint testing with Supertest
- Database integration with test containers
- Component integration with React Testing Library
- End-to-end API workflows

**End-to-End Tests (10%):**
- Complete user workflows with Playwright
- Cross-browser compatibility
- Real user interaction simulation

### Backend Testing

**Unit Testing with Jest:**
```typescript
describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepo: MockType<IUserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: IUserRepository, useFactory: jest.fn() },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockUserRepo = module.get(MockType<IUserRepository>);
  });

  it('should authenticate valid user', async () => {
    // Test implementation
  });
});
```

**E2E Testing with Supertest:**
```typescript
describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(201);
  });
});
```

### Frontend Testing

**Component Testing with React Testing Library:**
```typescript
describe('LoginForm', () => {
  it('submits form with valid credentials', async () => {
    const mockLogin = jest.fn();
    render(<LoginForm onSubmit={mockLogin} />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
    });
  });
});
```

### Playwright E2E Testing

```typescript
test('user can register and login', async ({ page }) => {
  await page.goto('/register');

  await page.fill('[data-testid="username"]', 'testuser');
  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="register-button"]');

  await expect(page).toHaveURL('/login');

  await page.fill('[data-testid="username"]', 'testuser');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="login-button"]');

  await expect(page).toHaveURL('/dashboard');
});
```

## Implementation Plan

### Development Phases

**Phase 1: Foundation (Weeks 1-4)**
- Project setup and architecture
- Authentication system implementation
- Basic user management
- Database schema and migrations

**Phase 2: Core Features (Weeks 5-12)**
- Story creation and editing
- Node-based editor development
- Basic story player
- RPG template system

**Phase 3: Advanced Features (Weeks 13-16)**
- Advanced RPG mechanics
- Community features
- Analytics and reporting
- Performance optimization

**Phase 4: Testing & Deployment (Weeks 17-20)**
- Comprehensive testing
- CI/CD pipeline setup
- Production deployment
- Monitoring and maintenance

### Feature Breakdown

#### 001-auth: Authentication System
- User registration with email verification
- JWT-based authentication
- Password reset functionality
- Profile management
- Security features (rate limiting, audit logging)

#### 002-editor: Story Editor
- Node-based visual editor
- Story structure management
- Basic content creation
- Preview functionality

#### 003-rpg: RPG Mechanics
- Template creation system
- Flexible stat definitions
- Custom check mechanics
- Character progression

#### 004-player: Story Player
- Immersive reading experience
- Choice navigation
- Save/load functionality
- Progress tracking

#### 005-community: Social Features
- Story sharing and rating
- Comments and discussions
- Author profiles
- Discovery features

#### 006-analytics: Analytics & Reporting
- User engagement metrics
- Story performance analytics
- Creator dashboards
- Platform insights

#### 007-testing: Testing Infrastructure
- Unit test coverage
- Integration testing
- E2E test automation
- Performance testing

#### 008-deployment: DevOps & Deployment
- Docker containerization
- CI/CD pipelines
- Production deployment
- Monitoring setup

### Development Methodology

- **Test-Driven Development:** Tests written before implementation
- **Continuous Integration:** Automated testing and deployment
- **Code Reviews:** Mandatory peer review for all changes
- **Documentation:** Comprehensive technical documentation
- **Agile Planning:** Iterative development with regular milestones

## Development Guidelines

### Code Quality Standards

**TypeScript Configuration:**
- Strict type checking enabled
- No implicit any types
- Explicit return types for all functions
- Interface definitions for all data structures

**Code Style:**
- ESLint configuration for consistent formatting
- Prettier for automated code formatting
- Husky pre-commit hooks for quality gates
- Conventional commit messages

**Documentation:**
- JSDoc comments for all public APIs
- README files for all modules
- API documentation with OpenAPI/Swagger
- Inline code comments for complex logic

### Security Guidelines

**Authentication & Authorization:**
- JWT tokens with appropriate expiration
- Password hashing with bcrypt (12+ rounds)
- Rate limiting on all public endpoints
- Input validation and sanitization
- CORS configuration for frontend domains

**Data Protection:**
- Encryption at rest for sensitive data
- Secure transmission with HTTPS/TLS
- GDPR compliance for user data
- Regular security audits and updates

### Performance Optimization

**Backend:**
- Database query optimization with indexes
- Caching strategy with Redis
- Request/response compression
- Connection pooling for database
- Horizontal scaling considerations

**Frontend:**
- Code splitting and lazy loading
- Image optimization and CDN usage
- Bundle size monitoring
- Virtual scrolling for large lists
- Memory leak prevention

### Error Handling

**Consistent Error Responses:**
```typescript
export class ApiException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly errorCode: string,
    message: string,
    public readonly details?: any,
  ) {
    super(message);
  }
}
```

**Global Exception Filter:**
```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Centralized error handling
  }
}
```

### Logging Strategy

**Structured Logging:**
```typescript
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  userId?: string;
  requestId: string;
  context: Record<string, any>;
}
```

**Provider-Agnostic Logging:**
```typescript
@Injectable()
export class LoggerService {
  constructor(private readonly provider: ILoggerProvider) {}

  info(message: string, context?: any) {
    this.provider.log('info', message, context);
  }
}
```

This unified documentation provides a single source of truth for the text-based adventure platform, consolidating information from multiple overlapping documents while resolving conflicts and eliminating redundancy. The documentation serves as a comprehensive guide for development, deployment, and maintenance of the platform.</content>
<parameter name="filePath">/home/vali/Apps/text-based/Development Plan for Text-Based Adventure Game Platform/Unified Technical Documentation.md