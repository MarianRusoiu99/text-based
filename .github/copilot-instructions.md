# GitHub Copilot Instructions for Text-Based Adventure Platform

## Project Overview

You are working on a text-based adventure platform that combines a powerful story creation editor with an immersive story player, enhanced by completely flexible RPG mechanics that story creators can define without any hardcoded constraints.

**Key Technologies:**
- **Backend:** NestJS 10+ with TypeScript 5+
- **Frontend:** React 18+ with TypeScript 5+
- **Database:** PostgreSQL 15+ with Prisma 5+ ORM
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
// Schema patterns
model Story {
  id              String   @id @default(cuid())
  title           String
  description     String?
  authorId        String
  rpgTemplateId   String?

  author          User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  rpgTemplate     RpgTemplate? @relation(fields: [rpgTemplateId], references: [id])
  nodes           StoryNode[]

  @@map("stories")
}

// Service usage
const story = await this.prisma.story.findUnique({
  where: { id },
  include: {
    author: {
      select: { id: true, username: true, displayName: true },
    },
    rpgTemplate: true,
    nodes: {
      orderBy: { order: 'asc' },
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
Use functional components with proper TypeScript typing:

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
### Please prioritize adding schadcn/ui components where applicable


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
Use React Flow for node-based editing:

```typescript
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

## Testing Patterns

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

Follow these guidelines to maintain consistency, quality, and maintainability across the codebase. When in doubt, refer to existing patterns in the codebase or ask for clarification.</content>
<parameter name="filePath">/home/vali/Apps/text-based/copilot-instructions.md