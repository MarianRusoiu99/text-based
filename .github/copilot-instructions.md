# GitHub Copilot Instructions for Text-Based Adventure Platform

## Project Overview

You are working on a text-based adventure platform that combines a powerful story creation editor with an immersive story player, enhanced by completely flexible RPG mechanics that story creators can define without any hardcoded constraints.

Command to start the backend server:
```bash
cd backend && npm run start:dev
```
Command to start the frontend server:
```bash
cd frontend && npm run dev
```
Please ensure both servers are running for full functionality.
Please start a new terminal session for each server and do not run other commands in those sessions. If you need to run other commands, please open a new terminal session.
Always check if frontend and backend are running before running tests

## Development Setup

### Database & Infrastructure
```bash
# Start PostgreSQL and Redis
cd docker && docker-compose up -d

# Run database migrations
cd backend && npx prisma migrate dev

# Generate Prisma client
cd backend && npx prisma generate

# Seed database with sample data
cd backend && npx prisma db seed

# View database in Prisma Studio
cd backend && npx prisma studio
```

### Full Development Environment
```bash
# Terminal 1: Start backend
cd backend && npm run start:dev

# Terminal 2: Start frontend
cd frontend && npm run dev

# Terminal 3: Run tests (optional)
cd tests && npm run test:api
```

### Testing Commands
```bash
# Run all tests
cd tests && npm run test:all

# Run API tests only
cd tests && npm run test:api

# Run E2E tests in browser
cd tests && npm run test:e2e:ui

# Run E2E tests headlessly
cd tests && npm run test:e2e
```

**Key Technologies:**
- **Backend:** NestJS 11+ with TypeScript 5+
- **Frontend:** React 19+ with TypeScript 5+, Vite
- **Database:** PostgreSQL 15+ with Prisma 6+ ORM
- **UI Framework:** shadcn/ui with Radix UI primitives, Tailwind CSS 4+
- **State Management:** Zustand + TanStack Query (React Query)
- **Story Editor:** React Flow for node-based editing
- **Caching:** Redis 7+
- **Testing:** Jest, Playwright, Supertest
- **Deployment:** Docker, GitHub Actions

## Architecture Principles

### SOLID Principles
Always follow SOLID principles in your code:

- **Single Responsibility:** Each class/module has one clear purpose
- **Open/Closed:** Components extensible without modification
- **Liskov Substitution:** Derived classes substitutable for base classes
- **Interface Segregation:** Focused, specific interfaces
- **Dependency Inversion:** Abstractions over concrete implementations

### Provider-Agnostic Design
All external dependencies must be abstracted through interfaces. Never hardcode provider implementations:

```typescript
// ✅ Good: Interface-based abstraction
export interface IEmailProvider {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}

@Injectable()
export class SendGridProvider implements IEmailProvider {
  // Implementation
}

// ❌ Bad: Direct provider usage
@Injectable()
export class AuthService {
  constructor(private readonly sendGrid: SendGridService) {} // Never do this
}
```

### Domain-Driven Design
Organize code around business domains with clear boundaries:
- User Management
- Story Creation
- RPG Template Management
- Gameplay Sessions

## Backend Development (NestJS)

### Project Structure
Follow this consistent module structure:

```
modules/{feature}/
├── {feature}.module.ts          # Module definition with imports/exports
├── controllers/                 # HTTP request handlers
│   └── {feature}.controller.ts
├── services/                    # Business logic
│   └── {feature}.service.ts
├── dto/                        # Data transfer objects
│   ├── create-{feature}.dto.ts
│   └── update-{feature}.dto.ts
├── entities/                   # Domain entities (if needed)
├── guards/                     # Route guards
├── decorators/                 # Module-specific decorators
└── {feature}.spec.ts           # Unit tests
```

### Controller Patterns
Use consistent controller patterns with proper HTTP status codes and response envelopes:

```typescript
@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get()
  async findAll(@Query() query: FindStoriesDto) {
    const result = await this.storiesService.findAll(query);
    return {
      success: true,
      data: result.data,
      message: 'Stories retrieved successfully',
      meta: {
        pagination: result.pagination,
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateStoryDto, @Req() req: Request) {
    const result = await this.storiesService.create(createDto, req.user.id);
    return {
      success: true,
      data: result,
      message: 'Story created successfully',
    };
  }
}
```

### Service Patterns
Services should be focused on business logic with proper error handling:

```typescript
@Injectable()
export class StoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rpgTemplateService: RpgTemplatesService,
  ) {}

  async create(createDto: CreateStoryDto, authorId: string) {
    // Validate RPG template exists if provided
    if (createDto.rpgTemplateId) {
      await this.rpgTemplateService.findOne(createDto.rpgTemplateId);
    }

    return this.prisma.story.create({
      data: {
        ...createDto,
        authorId,
      },
      include: {
        author: {
          select: { id: true, username: true, displayName: true },
        },
        rpgTemplate: true,
      },
    });
  }
}
```

### DTO Patterns
Use class-validator decorators for comprehensive validation:

```typescript
export class CreateStoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsUUID()
  rpgTemplateId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  tags?: string[];
}

export class FindStoriesDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsUUID()
  authorId?: string;

  @IsOptional()
  @IsIn(['public', 'unlisted', 'private'])
  visibility?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
```

### Database Patterns
Use Prisma with proper relations and type safety:

```typescript
// Schema patterns from prisma/schema.prisma
model Story {
  id                String          @id @default(uuid())
  authorId          String          @map("author_id")
  title             String
  description       String?
  coverImageUrl     String?         @map("cover_image_url")
  category          String?
  tags              String[]        @default([])
  isPublished       Boolean         @default(false) @map("is_published")
  visibility        String          @default("public")
  rpgTemplateId     String?         @map("rpg_template_id")
  createdAt         DateTime        @default(now()) @map("created_at")
  updatedAt         DateTime        @updatedAt @map("updated_at")

  author            User            @relation(fields: [authorId], references: [id], onDelete: Cascade)
  rpgTemplate       RpgTemplate?    @relation(fields: [rpgTemplateId], references: [id])
  chapters          Chapter[]
  nodes             Node[]
  playSessions      PlaySession[]

  @@map("stories")
}

// Complex queries with relations
const story = await this.prisma.story.findUnique({
  where: { id },
  include: {
    author: {
      select: { id: true, username: true, displayName: true },
    },
    rpgTemplate: true,
    chapters: {
      include: {
        nodes: {
          orderBy: { createdAt: 'asc' },
        },
      },
    },
    nodes: {
      where: { chapterId: null }, // Root level nodes
    },
  },
});
```

## Frontend Development (React)

### Project Structure
Follow atomic design principles:

```
src/
├── components/               # Reusable UI components
│   ├── ui/                  # Basic UI components (Button, Input, etc.)
│   ├── layout/              # Layout components (Header, Sidebar)
│   ├── editor/              # Story editor components
│   ├── player/              # Story player components
│   └── rpg/                 # RPG-specific components
├── pages/                   # Page components
├── hooks/                   # Custom React hooks
├── services/                # API service layer
├── stores/                  # Zustand state management
├── utils/                   # Utility functions
├── types/                   # TypeScript type definitions
└── constants/               # Application constants
```

### Component Patterns
Use functional components with proper TypeScript typing and shadcn/ui components:

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
}) => {
  return (
    <button
      className={cn(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        { 'btn-loading': loading, 'btn-disabled': disabled }
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
};
```

### UI Component Library (shadcn/ui)
Prioritize shadcn/ui components for consistent design:

```typescript
// Use shadcn/ui components from src/components/ui/
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Example usage
export const StoryCard: React.FC<{ story: Story }> = ({ story }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{story.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{story.description}</p>
        <Button className="mt-4">Read Story</Button>
      </CardContent>
    </Card>
  );
};
```

### Utility Functions
Use the `cn` utility for conditional class names:

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage in components
<div className={cn(
  "base-classes",
  variant === 'primary' && "primary-classes",
  disabled && "disabled-classes"
)} />
```


### State Management (Zustand)
Use Zustand for complex state management:

```typescript
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login(credentials);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false
      });
      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    set({ user: null, isAuthenticated: false });
  },

  refreshUser: async () => {
    try {
      const response = await authApi.getProfile();
      set({ user: response.data });
    } catch (error) {
      // Handle token expiry
      get().logout();
    }
  },
}));
```

### API Integration (React Query)
Use React Query for server state management:

```typescript
export const useStories = (filters: StoryFilters) => {
  return useQuery({
    queryKey: ['stories', filters],
    queryFn: () => storyApi.getStories(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
  });
};

export const useCreateStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storyApi.createStory,
    onSuccess: () => {
      queryClient.invalidateQueries(['stories']);
    },
  });
};
```

### Story Editor (React Flow)
Use React Flow for node-based story editing with custom node types:

```typescript
// From frontend/src/components/StoryFlow.tsx
export const StoryEditor: React.FC = () => {
  const { nodes, edges, onNodesChange, onEdgesChange } = useStoryStore();

  const nodeTypes = useMemo(() => ({
    storyNode: StoryNode,
    choiceNode: ChoiceNode,
    rpgCheckNode: RpgCheckNode,
  }), []);

  return (
    <div className="editor-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
      >
        <Background variant="dots" gap={15} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
```

### Flexible RPG Mechanics
The platform supports completely customizable RPG mechanics through templates and variables:

```typescript
// RPG Template structure
interface RpgTemplate {
  id: string;
  name: string;
  config: {
    stats: string[];           // e.g., ["strength", "intelligence", "charisma"]
    skills: string[];          // e.g., ["combat", "stealth", "persuasion"]
    attributes: string[];      // Custom attributes
    diceSystem: string;        // e.g., "d20", "d6"
  };
}

// Story Variables for dynamic content
interface StoryVariable {
  variableName: string;
  variableType: "boolean" | "number" | "string";
  defaultValue?: any;
}

// RPG Checks in story nodes
interface RpgCheck {
  stat: string;
  skill?: string;
  difficulty: number;
  successNodeId: string;
  failureNodeId: string;
}
```

## Testing Patterns

### Playwright E2E and API Testing
The project uses a dedicated test suite with Playwright for comprehensive testing:

```typescript
// playwright.config.ts - Multi-project setup
export default defineConfig({
  projects: [
    {
      name: 'api',
      testDir: './api',
      use: {
        baseURL: 'http://localhost:3000',
      },
      workers: 1, // API tests run sequentially
    },
    {
      name: 'chromium',
      testDir: './e2e',
      use: {
        baseURL: 'http://localhost:5173',
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});

// API Test Example (tests/api/stories.spec.ts)
test('should create and retrieve story', async ({ request }) => {
  // Create story
  const createResponse = await request.post('/stories', {
    data: {
      title: 'Test Adventure',
      description: 'A test story',
    },
  });
  expect(createResponse.ok()).toBeTruthy();
  
  const story = await createResponse.json();
  expect(story.success).toBe(true);
  
  // Retrieve story
  const getResponse = await request.get(`/stories/${story.data.id}`);
  expect(getResponse.ok()).toBeTruthy();
});
```

### Backend Unit Tests
Use Jest with proper mocking:

```typescript
describe('StoriesService', () => {
  let service: StoriesService;
  let mockPrisma: MockType<PrismaService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        StoriesService,
        {
          provide: PrismaService,
          useFactory: jest.fn(() => ({
            story: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          })),
        },
      ],
    }).compile();

    service = module.get<StoriesService>(StoriesService);
    mockPrisma = module.get(MockType<PrismaService>);
  });

  it('should create a story', async () => {
    const createDto = { title: 'Test Story', description: 'A test story' };
    const expectedResult = { id: '1', ...createDto, authorId: 'user1' };

    mockPrisma.story.create.mockResolvedValue(expectedResult);

    const result = await service.create(createDto, 'user1');

    expect(result).toEqual(expectedResult);
    expect(mockPrisma.story.create).toHaveBeenCalledWith({
      data: { ...createDto, authorId: 'user1' },
      include: expect.any(Object),
    });
  });
});
```

### Backend E2E Tests
Use Supertest for API testing:

```typescript
describe('Stories (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);

    await app.init();
  });

  afterEach(async () => {
    await prisma.cleanDatabase(); // Custom utility
  });

  it('/stories (POST) - should create story', () => {
    return request(app.getHttpServer())
      .post('/stories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Test Story',
        description: 'A test story',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe('Test Story');
      });
  });
});
```

### Frontend Component Tests
Use React Testing Library:

```typescript
describe('StoryCard', () => {
  const mockStory: Story = {
    id: '1',
    title: 'Test Story',
    description: 'A test story',
    author: { username: 'testuser', displayName: 'Test User' },
    isPublished: true,
    createdAt: new Date().toISOString(),
  };

  it('renders story information correctly', () => {
    render(<StoryCard story={mockStory} />);

    expect(screen.getByText('Test Story')).toBeInTheDocument();
    expect(screen.getByText('A test story')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const mockOnClick = jest.fn();
    const user = userEvent.setup();

    render(<StoryCard story={mockStory} onClick={mockOnClick} />);

    await user.click(screen.getByRole('button'));

    expect(mockOnClick).toHaveBeenCalledWith(mockStory);
  });
});
```

## Security Guidelines

### Authentication
- Always validate JWT tokens
- Use bcrypt for password hashing (12+ rounds)
- Implement proper session management
- Never store sensitive data in JWT payloads

### Input Validation
- Validate all inputs with class-validator
- Sanitize user inputs to prevent XSS
- Use parameterized queries (Prisma handles this)
- Implement rate limiting on public endpoints

### Error Handling
- Never expose internal errors to clients
- Use consistent error response format
- Log errors with appropriate context
- Implement proper exception filters

## Code Quality Standards

### TypeScript Configuration
- Strict type checking enabled
- No implicit `any` types
- Explicit return types for all functions
- Comprehensive interface definitions

### Naming Conventions
- PascalCase for classes, interfaces, types
- camelCase for variables, functions, methods
- kebab-case for files and directories
- UPPER_SNAKE_CASE for constants

### Commit Messages
Follow conventional commit format:
```
feat: add user registration endpoint
fix: resolve story creation validation bug
docs: update API documentation
refactor: simplify story service logic
test: add unit tests for auth service
```

## Common Patterns & Best Practices

### Error Handling
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

// Usage in services
throw new ApiException(
  HttpStatus.BAD_REQUEST,
  'VALIDATION_ERROR',
  'Invalid story data',
  { field: 'title', issue: 'too long' }
);
```

### Logging
```typescript
@Injectable()
export class StoriesService {
  constructor(
    private readonly logger: LoggerService,
    private readonly prisma: PrismaService,
  ) {}

  async create(createDto: CreateStoryDto, authorId: string) {
    this.logger.info('Creating story', {
      authorId,
      title: createDto.title,
    });

    try {
      const result = await this.prisma.story.create({ /* ... */ });
      this.logger.info('Story created successfully', { storyId: result.id });
      return result;
    } catch (error) {
      this.logger.error('Failed to create story', {
        authorId,
        error: error.message,
      });
      throw error;
    }
  }
}
```

### Database Transactions
```typescript
async createWithNodes(createDto: CreateStoryDto, nodes: CreateNodeDto[], authorId: string) {
  return this.prisma.$transaction(async (tx) => {
    const story = await tx.story.create({
      data: { ...createDto, authorId },
    });

    await tx.storyNode.createMany({
      data: nodes.map(node => ({
        ...node,
        storyId: story.id,
      })),
    });

    return tx.story.findUnique({
      where: { id: story.id },
      include: { nodes: true },
    });
  });
}
```

### API Response Consistency
Always use the standardized response envelope:

```typescript
// Success response
return {
  success: true,
  data: result,
  message: 'Operation completed successfully',
  meta: {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  },
};

// Error response
throw new ApiException(
  HttpStatus.BAD_REQUEST,
  'VALIDATION_ERROR',
  'Invalid input data',
  validationErrors
);
```

## Troubleshooting & Common Issues

### Database Connection Issues
```bash
# Check if PostgreSQL is running
cd docker && docker-compose ps

# Reset database if needed
cd backend && npx prisma migrate reset --force

# Re-seed database
cd backend && npx prisma db seed
```

### Frontend Build Issues
```bash
# Clear node_modules and reinstall
cd frontend && rm -rf node_modules && npm install

# Clear Vite cache
cd frontend && rm -rf dist && npm run build
```

### Test Failures
```bash
# Run tests with debug output
cd tests && npm run test:api -- --reporter=verbose

# Run E2E tests in headed mode for debugging
cd tests && npm run test:e2e:headed
```

### Common Development Errors
- **"Prisma client not generated"**: Run `cd backend && npx prisma generate`
- **"Module not found"**: Check import paths and ensure all dependencies are installed
- **"Database connection timeout"**: Ensure Docker containers are running with `docker-compose ps`
- **"Port already in use"**: Kill process using port 3000 or 5173, or use different ports

### Performance Issues
- Use React.memo for expensive components
- Implement proper loading states with Suspense
- Use React Query for caching API responses
- Optimize Prisma queries with select/include to fetch only needed data

Follow these guidelines to maintain consistency, quality, and maintainability across the codebase. When in doubt, refer to existing patterns in the codebase or ask for clarification.</content>
<parameter name="filePath">/home/vali/Apps/text-based/copilot-instructions.md