# Backend Architecture with NestJS and Prisma

## Overview

The backend architecture is built using NestJS, a progressive Node.js framework that provides a robust foundation for building scalable server-side applications. The architecture emphasizes modularity, reusability, and maintainability through dependency injection, decorators, and a clear separation of concerns. Prisma serves as the database toolkit, providing type-safe database access and automated migrations.

## Technology Stack

### Core Framework
- **NestJS 10+** - Progressive Node.js framework with TypeScript support
- **TypeScript 5+** - Static type checking and modern JavaScript features
- **Node.js 18+** - Runtime environment with LTS support

### Database and ORM
- **Prisma 5+** - Next-generation ORM with type safety and auto-generated client
- **PostgreSQL 15+** - Primary database for relational data storage
- **Redis 7+** - In-memory data store for caching and session management

### Authentication and Security
- **Passport.js** - Authentication middleware with JWT strategy
- **bcrypt** - Password hashing and verification
- **helmet** - Security middleware for HTTP headers
- **rate-limiter-flexible** - Advanced rate limiting and DDoS protection

### File Storage and CDN
- **AWS S3** - Object storage for user-generated content
- **Multer** - Middleware for handling multipart/form-data uploads
- **Sharp** - High-performance image processing

### Monitoring and Logging
- **Winston** - Comprehensive logging framework
- **Prometheus** - Metrics collection and monitoring
- **Sentry** - Error tracking and performance monitoring

## Project Structure

The backend follows NestJS conventions with a modular architecture that promotes code reusability and maintainability:

```
src/
├── app.module.ts              # Root application module
├── main.ts                    # Application entry point
├── common/                    # Shared utilities and common functionality
│   ├── decorators/           # Custom decorators
│   ├── filters/              # Exception filters
│   ├── guards/               # Authentication and authorization guards
│   ├── interceptors/         # Request/response interceptors
│   ├── pipes/                # Validation and transformation pipes
│   └── utils/                # Utility functions and helpers
├── config/                   # Configuration management
│   ├── database.config.ts    # Database configuration
│   ├── auth.config.ts        # Authentication configuration
│   └── app.config.ts         # Application configuration
├── modules/                  # Feature modules
│   ├── auth/                 # Authentication and authorization
│   ├── users/                # User management
│   ├── stories/              # Story management
│   ├── nodes/                # Story node management
│   ├── choices/              # Choice management
│   ├── gameplay/             # Game session management
│   ├── analytics/            # Analytics and statistics
│   ├── assets/               # File upload and management
│   └── notifications/        # Notification system
├── prisma/                   # Prisma schema and migrations
│   ├── schema.prisma         # Database schema definition
│   ├── migrations/           # Database migration files
│   └── seed.ts               # Database seeding script
└── test/                     # Test files and utilities
    ├── unit/                 # Unit tests
    ├── integration/          # Integration tests
    └── e2e/                  # End-to-end tests
```

## Core Architecture Principles

### Dependency Injection

NestJS uses a powerful dependency injection system that promotes loose coupling and testability. Services are injected into controllers and other services through constructor parameters, making the codebase more modular and easier to test.

```typescript
@Injectable()
export class StoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
    private readonly analyticsService: AnalyticsService,
    private readonly logger: Logger
  ) {}

  async createStory(authorId: string, createStoryDto: CreateStoryDto): Promise<Story> {
    this.logger.log(`Creating story for user ${authorId}`);
    
    const story = await this.prisma.story.create({
      data: {
        ...createStoryDto,
        authorId,
        id: uuidv4()
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        }
      }
    });

    // Invalidate relevant caches
    await this.cacheService.del(`user:${authorId}:stories`);
    
    // Track analytics event
    await this.analyticsService.trackEvent('story_created', {
      storyId: story.id,
      authorId,
      category: story.category
    });

    return story;
  }
}
```

### Module-Based Architecture

The application is organized into feature modules that encapsulate related functionality. Each module contains controllers, services, and other components specific to that feature domain.

```typescript
@Module({
  imports: [
    PrismaModule,
    CacheModule,
    AnalyticsModule
  ],
  controllers: [StoryController],
  providers: [
    StoryService,
    StoryValidationService,
    {
      provide: Logger,
      useFactory: () => new Logger('StoryModule')
    }
  ],
  exports: [StoryService]
})
export class StoryModule {}
```

### Data Transfer Objects (DTOs)

DTOs define the structure of data transferred between the client and server, providing type safety and validation. They use class-validator decorators for automatic validation.

```typescript
export class CreateStoryDto {
  @IsString()
  @Length(1, 255)
  @ApiProperty({ description: 'Story title', maxLength: 255 })
  title: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  @ApiProperty({ description: 'Story description', maxLength: 2000, required: false })
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(['fantasy', 'romance', 'mystery', 'sci-fi', 'horror', 'adventure'])
  @ApiProperty({ 
    description: 'Story category',
    enum: ['fantasy', 'romance', 'mystery', 'sci-fi', 'horror', 'adventure'],
    required: false
  })
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  @ApiProperty({ description: 'Story tags', type: [String], required: false })
  tags?: string[];

  @IsString()
  @IsIn(['general', 'teen', 'mature', 'adult'])
  @ApiProperty({ 
    description: 'Content rating',
    enum: ['general', 'teen', 'mature', 'adult']
  })
  contentRating: string;

  @IsString()
  @IsIn(['public', 'unlisted', 'private'])
  @ApiProperty({ 
    description: 'Story visibility',
    enum: ['public', 'unlisted', 'private']
  })
  visibility: string;
}
```

## Database Integration with Prisma

### Prisma Schema Design

The Prisma schema defines the database structure and relationships, providing type safety and automated client generation. The schema is designed to support complex story structures while maintaining performance and data integrity.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  username     String   @unique @db.VarChar(50)
  email        String   @unique @db.VarChar(255)
  passwordHash String   @map("password_hash") @db.VarChar(255)
  displayName  String?  @map("display_name") @db.VarChar(100)
  bio          String?  @db.Text
  avatarUrl    String?  @map("avatar_url") @db.Text
  isVerified   Boolean  @default(false) @map("is_verified")
  isActive     Boolean  @default(true) @map("is_active")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  lastLogin    DateTime? @map("last_login")

  // Relationships
  stories         Story[]
  playSessions    PlaySession[]
  ratings         Rating[]
  comments        Comment[]
  bookmarks       StoryBookmark[]
  followers       UserFollow[] @relation("UserFollowers")
  following       UserFollow[] @relation("UserFollowing")
  uploadedAssets  Asset[]
  choiceAnalytics ChoiceAnalytic[]

  @@map("users")
}

model Story {
  id                String    @id @default(uuid())
  authorId          String    @map("author_id")
  title             String    @db.VarChar(255)
  description       String?   @db.Text
  coverImageUrl     String?   @map("cover_image_url") @db.Text
  category          String?   @db.VarChar(50)
  tags              String[]
  isPublished       Boolean   @default(false) @map("is_published")
  isFeatured        Boolean   @default(false) @map("is_featured")
  visibility        String    @default("public") @db.VarChar(20)
  contentRating     String    @default("general") @map("content_rating") @db.VarChar(10)
  estimatedDuration Int?      @map("estimated_duration")
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")
  publishedAt       DateTime? @map("published_at")

  // Relationships
  author        User              @relation(fields: [authorId], references: [id], onDelete: Cascade)
  chapters      Chapter[]
  nodes         Node[]
  variables     StoryVariable[]
  items         Item[]
  playSessions  PlaySession[]
  ratings       Rating[]
  comments      Comment[]
  bookmarks     StoryBookmark[]

  @@map("stories")
}

model Node {
  id        String   @id @default(uuid())
  storyId   String   @map("story_id")
  chapterId String?  @map("chapter_id")
  title     String?  @db.VarChar(255)
  nodeType  String   @default("story") @map("node_type") @db.VarChar(20)
  content   Json
  position  Json?
  metadata  Json?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relationships
  story         Story    @relation(fields: [storyId], references: [id], onDelete: Cascade)
  chapter       Chapter? @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  choicesFrom   Choice[] @relation("ChoiceFromNode")
  choicesTo     Choice[] @relation("ChoiceToNode")
  playSessions  PlaySession[]

  @@map("nodes")
}
```

### Prisma Service Integration

The Prisma service provides a centralized way to access the database client and handle connection management, transactions, and error handling.

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'info', emit: 'event' },
        { level: 'warn', emit: 'event' },
      ],
    });

    // Log database queries in development
    if (process.env.NODE_ENV === 'development') {
      this.$on('query', (e) => {
        this.logger.debug(`Query: ${e.query}`);
        this.logger.debug(`Duration: ${e.duration}ms`);
      });
    }

    this.$on('error', (e) => {
      this.logger.error('Database error:', e);
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from database');
  }

  async executeTransaction<T>(
    operations: (prisma: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>) => Promise<T>
  ): Promise<T> {
    return this.$transaction(operations, {
      maxWait: 5000,
      timeout: 10000,
    });
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      return false;
    }
  }
}
```

## Authentication and Authorization

### JWT Authentication Strategy

The authentication system uses JWT tokens with refresh token rotation for enhanced security. The strategy integrates with Passport.js for consistent authentication handling across the application.

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findById(payload.sub);
    
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      return user;
    }
    
    return null;
  }

  async login(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = { 
      sub: user.id, 
      email: user.email,
      username: user.username 
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '24h')
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '30d')
    });

    // Store refresh token in cache
    await this.cacheService.set(
      `refresh_token:${user.id}`,
      refreshToken,
      30 * 24 * 60 * 60 // 30 days in seconds
    );

    // Update last login timestamp
    await this.userService.updateLastLogin(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 24 * 60 * 60 // 24 hours in seconds
      }
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Verify refresh token exists in cache
      const cachedToken = await this.cacheService.get(`refresh_token:${user.id}`);
      if (cachedToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
```

### Role-Based Access Control

The authorization system implements role-based access control with custom guards and decorators to protect endpoints based on user roles and resource ownership.

```typescript
export enum Role {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

@Injectable()
export class StoryOwnershipGuard implements CanActivate {
  constructor(private readonly storyService: StoryService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const storyId = request.params.storyId;

    if (!user || !storyId) {
      return false;
    }

    const story = await this.storyService.findById(storyId);
    return story && story.authorId === user.id;
  }
}

// Custom decorators
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
export const Public = () => SetMetadata('isPublic', true);
```

## Service Layer Architecture

### Story Management Service

The story service encapsulates all business logic related to story creation, management, and retrieval. It handles complex operations like story publishing, analytics tracking, and cache management.

```typescript
@Injectable()
export class StoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
    private readonly analyticsService: AnalyticsService,
    private readonly assetService: AssetService,
    private readonly logger: Logger
  ) {}

  async findPublishedStories(filters: StoryFilters, pagination: PaginationDto): Promise<PaginatedResponse<Story>> {
    const cacheKey = `stories:${JSON.stringify({ filters, pagination })}`;
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const where: Prisma.StoryWhereInput = {
      isPublished: true,
      visibility: 'public',
      ...(filters.category && { category: filters.category }),
      ...(filters.tags?.length && { tags: { hasSome: filters.tags } }),
      ...(filters.contentRating?.length && { contentRating: { in: filters.contentRating } }),
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } }
        ]
      })
    };

    const [stories, total] = await Promise.all([
      this.prisma.story.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true
            }
          },
          _count: {
            select: {
              ratings: true,
              comments: true,
              bookmarks: true,
              playSessions: true
            }
          }
        },
        orderBy: this.buildOrderBy(filters.sortBy, filters.sortOrder),
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit
      }),
      this.prisma.story.count({ where })
    ]);

    // Calculate additional statistics
    const enrichedStories = await Promise.all(
      stories.map(async (story) => {
        const [avgRating, totalReads] = await Promise.all([
          this.calculateAverageRating(story.id),
          this.getTotalReads(story.id)
        ]);

        return {
          ...story,
          stats: {
            rating: avgRating,
            totalRatings: story._count.ratings,
            reads: totalReads,
            comments: story._count.comments,
            bookmarks: story._count.bookmarks
          }
        };
      })
    );

    const result = {
      data: enrichedStories,
      pagination: {
        currentPage: pagination.page,
        totalPages: Math.ceil(total / pagination.limit),
        totalItems: total,
        hasNext: pagination.page * pagination.limit < total,
        hasPrev: pagination.page > 1
      }
    };

    // Cache for 5 minutes
    await this.cacheService.set(cacheKey, result, 300);
    
    return result;
  }

  async createStory(authorId: string, createStoryDto: CreateStoryDto): Promise<Story> {
    return this.prisma.executeTransaction(async (prisma) => {
      const story = await prisma.story.create({
        data: {
          ...createStoryDto,
          authorId,
          id: uuidv4()
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true
            }
          }
        }
      });

      // Create initial chapter
      await prisma.chapter.create({
        data: {
          id: uuidv4(),
          storyId: story.id,
          title: 'Chapter 1',
          chapterOrder: 1,
          isPublished: false
        }
      });

      // Invalidate caches
      await this.cacheService.del(`user:${authorId}:stories`);
      await this.cacheService.delPattern('stories:*');

      // Track analytics
      await this.analyticsService.trackEvent('story_created', {
        storyId: story.id,
        authorId,
        category: story.category
      });

      this.logger.log(`Story created: ${story.id} by user ${authorId}`);
      
      return story;
    });
  }

  async publishStory(storyId: string, authorId: string, isPublished: boolean): Promise<Story> {
    const story = await this.prisma.story.findFirst({
      where: { id: storyId, authorId }
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (isPublished && !this.validateStoryForPublishing(story)) {
      throw new BadRequestException('Story is not ready for publishing');
    }

    const updatedStory = await this.prisma.story.update({
      where: { id: storyId },
      data: {
        isPublished,
        publishedAt: isPublished ? new Date() : null
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true
          }
        }
      }
    });

    // Invalidate caches
    await this.cacheService.delPattern('stories:*');
    await this.cacheService.del(`story:${storyId}`);

    // Track analytics
    await this.analyticsService.trackEvent(
      isPublished ? 'story_published' : 'story_unpublished',
      { storyId, authorId }
    );

    return updatedStory;
  }

  private validateStoryForPublishing(story: Story): boolean {
    // Add validation logic for story completeness
    return !!(story.title && story.description && story.category);
  }

  private buildOrderBy(sortBy: string, sortOrder: string): Prisma.StoryOrderByWithRelationInput {
    const order = sortOrder === 'asc' ? 'asc' : 'desc';
    
    switch (sortBy) {
      case 'rating':
        return { ratings: { _count: order } };
      case 'reads':
        return { playSessions: { _count: order } };
      case 'updated_at':
        return { updatedAt: order };
      default:
        return { createdAt: order };
    }
  }

  private async calculateAverageRating(storyId: string): Promise<number> {
    const result = await this.prisma.rating.aggregate({
      where: { storyId },
      _avg: { rating: true }
    });
    
    return result._avg.rating || 0;
  }

  private async getTotalReads(storyId: string): Promise<number> {
    const result = await this.prisma.playSession.count({
      where: { storyId }
    });
    
    return result;
  }
}
```

### Gameplay Service

The gameplay service manages story sessions, choice handling, and game state persistence. It implements complex logic for conditional choices, inventory management, and progress tracking.

```typescript
@Injectable()
export class GameplayService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
    private readonly analyticsService: AnalyticsService,
    private readonly logger: Logger
  ) {}

  async startPlaySession(storyId: string, userId?: string): Promise<PlaySessionResponse> {
    const story = await this.prisma.story.findFirst({
      where: {
        id: storyId,
        OR: [
          { isPublished: true, visibility: 'public' },
          { isPublished: true, visibility: 'unlisted' },
          ...(userId ? [{ authorId: userId }] : [])
        ]
      },
      include: {
        nodes: {
          orderBy: { createdAt: 'asc' },
          take: 1
        },
        variables: true,
        items: true
      }
    });

    if (!story) {
      throw new NotFoundException('Story not found or not accessible');
    }

    if (!story.nodes.length) {
      throw new BadRequestException('Story has no starting node');
    }

    const startingNode = story.nodes[0];
    const sessionId = uuidv4();

    // Initialize game state
    const initialGameState = {
      flags: {},
      inventory: [],
      variables: story.variables.reduce((acc, variable) => {
        acc[variable.variableName] = variable.defaultValue;
        return acc;
      }, {} as Record<string, any>)
    };

    // Create or update play session
    const playSession = await this.prisma.playSession.upsert({
      where: {
        id: sessionId
      },
      create: {
        id: sessionId,
        userId,
        storyId,
        sessionData: initialGameState,
        currentNodeId: startingNode.id,
        startedAt: new Date(),
        lastPlayedAt: new Date()
      },
      update: {
        sessionData: initialGameState,
        currentNodeId: startingNode.id,
        lastPlayedAt: new Date()
      }
    });

    // Get available choices for the starting node
    const availableChoices = await this.getAvailableChoices(
      startingNode.id,
      initialGameState
    );

    // Track analytics
    await this.analyticsService.trackEvent('play_session_started', {
      sessionId,
      storyId,
      userId,
      nodeId: startingNode.id
    });

    return {
      sessionId,
      currentNode: {
        id: startingNode.id,
        title: startingNode.title,
        nodeType: startingNode.nodeType as NodeType,
        content: startingNode.content as NodeContent
      },
      availableChoices,
      gameState: initialGameState,
      progress: {
        nodesVisited: 1,
        totalNodes: await this.getTotalNodeCount(storyId),
        completionPercentage: 0
      }
    };
  }

  async makeChoice(sessionId: string, choiceId: string): Promise<PlaySessionResponse> {
    const playSession = await this.prisma.playSession.findUnique({
      where: { id: sessionId },
      include: {
        story: {
          include: {
            variables: true,
            items: true
          }
        }
      }
    });

    if (!playSession) {
      throw new NotFoundException('Play session not found');
    }

    const choice = await this.prisma.choice.findUnique({
      where: { id: choiceId },
      include: {
        fromNode: true,
        toNode: true
      }
    });

    if (!choice) {
      throw new NotFoundException('Choice not found');
    }

    // Validate choice is available
    const currentGameState = playSession.sessionData as GameState;
    const isChoiceAvailable = this.evaluateConditions(
      choice.conditions as ChoiceConditions,
      currentGameState
    );

    if (!isChoiceAvailable) {
      throw new BadRequestException('Choice is not available');
    }

    // Apply choice effects
    const newGameState = this.applyChoiceEffects(
      choice.effects as ChoiceEffects,
      currentGameState
    );

    // Update play session
    const updatedSession = await this.prisma.playSession.update({
      where: { id: sessionId },
      data: {
        sessionData: newGameState,
        currentNodeId: choice.toNodeId,
        lastPlayedAt: new Date()
      }
    });

    // Track choice analytics
    await this.prisma.choiceAnalytic.create({
      data: {
        id: uuidv4(),
        choiceId,
        userId: playSession.userId,
        sessionId,
        selectedAt: new Date()
      }
    });

    // Get available choices for the new node
    const availableChoices = await this.getAvailableChoices(
      choice.toNodeId,
      newGameState
    );

    // Calculate progress
    const nodesVisited = await this.getNodesVisitedCount(sessionId);
    const totalNodes = await this.getTotalNodeCount(playSession.storyId);
    const completionPercentage = Math.round((nodesVisited / totalNodes) * 100);

    // Check if story is completed
    const isCompleted = choice.toNode.nodeType === 'ending' || availableChoices.length === 0;
    
    if (isCompleted) {
      await this.prisma.playSession.update({
        where: { id: sessionId },
        data: {
          isCompleted: true,
          completedAt: new Date()
        }
      });

      await this.analyticsService.trackEvent('story_completed', {
        sessionId,
        storyId: playSession.storyId,
        userId: playSession.userId,
        completionPercentage
      });
    }

    return {
      sessionId,
      currentNode: {
        id: choice.toNode.id,
        title: choice.toNode.title,
        nodeType: choice.toNode.nodeType as NodeType,
        content: choice.toNode.content as NodeContent
      },
      availableChoices,
      gameState: newGameState,
      effects: this.extractEffectsSummary(choice.effects as ChoiceEffects),
      progress: {
        nodesVisited,
        totalNodes,
        completionPercentage
      },
      isCompleted
    };
  }

  private async getAvailableChoices(nodeId: string, gameState: GameState): Promise<AvailableChoice[]> {
    const choices = await this.prisma.choice.findMany({
      where: { fromNodeId: nodeId },
      orderBy: { choiceOrder: 'asc' }
    });

    return choices
      .filter(choice => this.evaluateConditions(choice.conditions as ChoiceConditions, gameState))
      .map(choice => ({
        id: choice.id,
        choiceText: choice.choiceText,
        choiceOrder: choice.choiceOrder,
        isAvailable: true
      }));
  }

  private evaluateConditions(conditions: ChoiceConditions, gameState: GameState): boolean {
    if (!conditions) return true;

    // Evaluate flag conditions
    if (conditions.flags) {
      for (const [flagName, requiredValue] of Object.entries(conditions.flags)) {
        if (gameState.flags[flagName] !== requiredValue) {
          return false;
        }
      }
    }

    // Evaluate inventory conditions
    if (conditions.items) {
      for (const requiredItem of conditions.items) {
        if (!gameState.inventory.includes(requiredItem)) {
          return false;
        }
      }
    }

    // Evaluate variable conditions
    if (conditions.variables) {
      for (const [varName, condition] of Object.entries(conditions.variables)) {
        const currentValue = gameState.variables[varName];
        if (!this.evaluateVariableCondition(currentValue, condition)) {
          return false;
        }
      }
    }

    return true;
  }

  private evaluateVariableCondition(currentValue: any, condition: VariableCondition): boolean {
    const { operator, value } = condition;
    
    switch (operator) {
      case '==': return currentValue === value;
      case '!=': return currentValue !== value;
      case '>': return currentValue > value;
      case '>=': return currentValue >= value;
      case '<': return currentValue < value;
      case '<=': return currentValue <= value;
      default: return false;
    }
  }

  private applyChoiceEffects(effects: ChoiceEffects, gameState: GameState): GameState {
    const newGameState = JSON.parse(JSON.stringify(gameState));

    // Apply flag effects
    if (effects.flags) {
      Object.assign(newGameState.flags, effects.flags);
    }

    // Apply inventory effects
    if (effects.items) {
      if (effects.items.add) {
        newGameState.inventory.push(...effects.items.add);
      }
      if (effects.items.remove) {
        newGameState.inventory = newGameState.inventory.filter(
          item => !effects.items.remove.includes(item)
        );
      }
    }

    // Apply variable effects
    if (effects.variables) {
      for (const [varName, effect] of Object.entries(effects.variables)) {
        const currentValue = newGameState.variables[varName] || 0;
        newGameState.variables[varName] = this.applyVariableEffect(currentValue, effect);
      }
    }

    return newGameState;
  }

  private applyVariableEffect(currentValue: any, effect: VariableEffect): any {
    const { operator, value } = effect;
    
    switch (operator) {
      case '=': return value;
      case '+=': return currentValue + value;
      case '-=': return currentValue - value;
      case '*=': return currentValue * value;
      case '/=': return currentValue / value;
      default: return currentValue;
    }
  }

  private extractEffectsSummary(effects: ChoiceEffects): EffectsSummary {
    return {
      flagsChanged: effects.flags || {},
      itemsAdded: effects.items?.add || [],
      itemsRemoved: effects.items?.remove || [],
      variablesChanged: Object.keys(effects.variables || {}).reduce((acc, varName) => {
        // This would need to calculate the actual new value
        acc[varName] = 0; // Placeholder
        return acc;
      }, {} as Record<string, any>)
    };
  }

  private async getNodesVisitedCount(sessionId: string): Promise<number> {
    // This would track visited nodes in the session data or separate table
    return 1; // Placeholder implementation
  }

  private async getTotalNodeCount(storyId: string): Promise<number> {
    return this.prisma.node.count({
      where: { storyId }
    });
  }
}
```

## Caching Strategy

The backend implements a comprehensive caching strategy using Redis to improve performance and reduce database load. The caching system includes automatic cache invalidation and intelligent cache warming.

```typescript
@Injectable()
export class CacheService {
  constructor(
    private readonly redis: Redis,
    private readonly logger: Logger
  ) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await this.redis.setex(key, ttl, serialized);
      } else {
        await this.redis.set(key, serialized);
      }
    } catch (error) {
      this.logger.error(`Cache set error for key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.error(`Cache delete error for key ${key}:`, error);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      this.logger.error(`Cache delete pattern error for pattern ${pattern}:`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  async increment(key: string, value: number = 1): Promise<number> {
    try {
      return await this.redis.incrby(key, value);
    } catch (error) {
      this.logger.error(`Cache increment error for key ${key}:`, error);
      return 0;
    }
  }
}
```

## Error Handling and Logging

The backend implements comprehensive error handling and logging to ensure reliability and maintainability. Custom exception filters provide consistent error responses while detailed logging helps with debugging and monitoring.

```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: any[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        errors = (exceptionResponse as any).errors || [];
      } else {
        message = exceptionResponse as string;
      }
    } else if (exception instanceof PrismaClientKnownRequestError) {
      ({ status, message, errors } = this.handlePrismaError(exception));
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse = {
      success: false,
      data: null,
      message,
      errors,
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        version: '1.0.0'
      }
    };

    // Log error details
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : exception
    );

    response.status(status).json(errorResponse);
  }

  private handlePrismaError(error: PrismaClientKnownRequestError): {
    status: number;
    message: string;
    errors: any[];
  } {
    switch (error.code) {
      case 'P2002':
        return {
          status: HttpStatus.CONFLICT,
          message: 'Resource already exists',
          errors: [{
            field: error.meta?.target,
            code: 'UNIQUE_CONSTRAINT',
            message: 'This value already exists'
          }]
        };
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Resource not found',
          errors: []
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database error',
          errors: []
        };
    }
  }
}
```

## Testing Strategy

The backend includes comprehensive testing coverage with unit tests, integration tests, and end-to-end tests. The testing strategy ensures code quality and reliability across all components.

```typescript
describe('StoryService', () => {
  let service: StoryService;
  let prisma: PrismaService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoryService,
        {
          provide: PrismaService,
          useValue: {
            story: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              count: jest.fn()
            },
            executeTransaction: jest.fn()
          }
        },
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
            delPattern: jest.fn()
          }
        },
        {
          provide: AnalyticsService,
          useValue: {
            trackEvent: jest.fn()
          }
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<StoryService>(StoryService);
    prisma = module.get<PrismaService>(PrismaService);
    cacheService = module.get<CacheService>(CacheService);
  });

  describe('createStory', () => {
    it('should create a story successfully', async () => {
      const createStoryDto: CreateStoryDto = {
        title: 'Test Story',
        description: 'Test Description',
        category: 'fantasy',
        contentRating: 'general',
        visibility: 'public'
      };

      const expectedStory = {
        id: 'story-id',
        ...createStoryDto,
        authorId: 'author-id',
        isPublished: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(prisma, 'executeTransaction').mockImplementation(async (callback) => {
        return callback({
          story: {
            create: jest.fn().mockResolvedValue(expectedStory)
          },
          chapter: {
            create: jest.fn().mockResolvedValue({})
          }
        } as any);
      });

      const result = await service.createStory('author-id', createStoryDto);

      expect(result).toEqual(expectedStory);
      expect(cacheService.del).toHaveBeenCalledWith('user:author-id:stories');
      expect(cacheService.delPattern).toHaveBeenCalledWith('stories:*');
    });
  });
});
```

This comprehensive backend architecture provides a robust, scalable, and maintainable foundation for the text-based adventure platform. The modular design, comprehensive error handling, and extensive testing ensure that the system can handle complex story structures while maintaining high performance and reliability.

