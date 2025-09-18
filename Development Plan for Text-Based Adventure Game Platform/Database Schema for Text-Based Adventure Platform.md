# Database Schema for Text-Based Adventure Platform

## Overview

The database schema is designed to support a comprehensive text-based adventure platform with story creation, social features, analytics, and flexible RPG mechanics that can be defined by story creators. The schema uses PostgreSQL as the primary database with Prisma as the ORM for type-safe database operations. The design emphasizes flexibility to accommodate various RPG mechanics without hardcoding specific game systems.

## Core Entities and Relationships

### User Management

The user management system forms the foundation of the platform, supporting authentication, profiles, and social interactions. Users are the central entity that connects to all other aspects of the platform.

**Users Table**
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

The users table includes essential fields for authentication and profile management. The `is_verified` field supports email verification workflows, while `is_active` allows for account deactivation without data loss. The `display_name` field provides flexibility for users to have a different public name than their username.

### Story Management

Stories are the core content of the platform. The story management system supports hierarchical organization with nodes, enabling complex narrative structures with flexible RPG mechanics.

**Stories Table**
```sql
CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    category VARCHAR(50),
    tags TEXT[], -- Array of tags for categorization
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted', 'private')),
    content_rating VARCHAR(10) DEFAULT 'general' CHECK (content_rating IN ('general', 'teen', 'mature', 'adult')),
    rpg_template_id UUID REFERENCES rpg_templates(id),
    estimated_duration INTEGER, -- In minutes
    total_nodes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

The stories table links to an RPG template that defines the mechanics for that story, providing flexibility for different game systems while maintaining consistency within each story.

**Story Nodes Table**
```sql
CREATE TABLE story_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    node_type VARCHAR(50) NOT NULL, -- 'start', 'story', 'choice', 'check', 'end', 'custom'
    title VARCHAR(255),
    content JSONB NOT NULL, -- Flexible content structure
    position JSONB, -- {x, y} coordinates for editor
    metadata JSONB, -- Additional node-specific data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

The story nodes use JSONB for flexible content storage, allowing different node types to have varying structures without schema changes. The content field can contain text, character information, background details, and any custom data needed for the story.

**Node Connections Table**
```sql
CREATE TABLE node_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    from_node_id UUID NOT NULL REFERENCES story_nodes(id) ON DELETE CASCADE,
    to_node_id UUID NOT NULL REFERENCES story_nodes(id) ON DELETE CASCADE,
    choice_text TEXT,
    conditions JSONB, -- Flexible conditions for branching
    metadata JSONB, -- Additional connection data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

Node connections define the story flow with flexible conditions stored in JSONB format, allowing for complex branching logic based on character stats, inventory, flags, or any custom criteria defined by the story creator.

### RPG Mechanics Framework

The RPG mechanics system is designed to be completely flexible, allowing story creators to define their own stats, checks, and game logic without being constrained to specific implementations.

**RPG Templates Table**
```sql
CREATE TABLE rpg_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    configuration JSONB NOT NULL, -- Complete RPG system definition
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

RPG templates contain the complete definition of an RPG system in JSONB format, including stat definitions, proficiency systems, item types, and any custom mechanics. This allows for unlimited flexibility in defining game systems.

**Character Stats Table**
```sql
CREATE TABLE character_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    stat_name VARCHAR(100) NOT NULL,
    stat_value JSONB NOT NULL, -- Flexible value storage (number, string, boolean, object)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(character_id, stat_name)
);
```

Character stats use JSONB for flexible value storage, allowing stats to be numbers, strings, booleans, or complex objects as defined by the RPG template.

### Character and Session Management

**Characters Table**
```sql
CREATE TABLE characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    play_session_id UUID NOT NULL REFERENCES play_sessions(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    rpg_template_id UUID NOT NULL REFERENCES rpg_templates(id),
    character_data JSONB NOT NULL, -- All character information
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

Characters store all their data in JSONB format, allowing for complete flexibility in character structure based on the RPG template being used.

**Play Sessions Table**
```sql
CREATE TABLE play_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    session_name VARCHAR(255),
    current_node_id UUID REFERENCES story_nodes(id),
    session_data JSONB NOT NULL, -- Game state, flags, inventory, etc.
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

Play sessions maintain all game state in JSONB format, providing flexibility for different types of data that might need to be tracked based on the story's RPG mechanics.

### Social Features

**Story Ratings Table**
```sql
CREATE TABLE story_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, story_id)
);
```

**Story Comments Table**
```sql
CREATE TABLE story_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES story_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**User Follows Table**
```sql
CREATE TABLE user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);
```

### Analytics and Logging

**Story Analytics Table**
```sql
CREATE TABLE story_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL, -- 'view', 'start', 'complete', 'choice', 'check'
    event_data JSONB, -- Flexible event data
    session_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Choice Analytics Table**
```sql
CREATE TABLE choice_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    node_id UUID NOT NULL REFERENCES story_nodes(id) ON DELETE CASCADE,
    connection_id UUID NOT NULL REFERENCES node_connections(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    choice_data JSONB, -- Choice details and outcomes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes and Performance Optimization

```sql
-- User indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Story indexes
CREATE INDEX idx_stories_author_id ON stories(author_id);
CREATE INDEX idx_stories_is_published ON stories(is_published);
CREATE INDEX idx_stories_category ON stories(category);
CREATE INDEX idx_stories_visibility ON stories(visibility);
CREATE INDEX idx_stories_created_at ON stories(created_at);

-- Story node indexes
CREATE INDEX idx_story_nodes_story_id ON story_nodes(story_id);
CREATE INDEX idx_story_nodes_node_type ON story_nodes(node_type);

-- Connection indexes
CREATE INDEX idx_node_connections_story_id ON node_connections(story_id);
CREATE INDEX idx_node_connections_from_node ON node_connections(from_node_id);
CREATE INDEX idx_node_connections_to_node ON node_connections(to_node_id);

-- Character and session indexes
CREATE INDEX idx_characters_play_session_id ON characters(play_session_id);
CREATE INDEX idx_characters_rpg_template_id ON characters(rpg_template_id);
CREATE INDEX idx_play_sessions_user_id ON play_sessions(user_id);
CREATE INDEX idx_play_sessions_story_id ON play_sessions(story_id);

-- Analytics indexes
CREATE INDEX idx_story_analytics_story_id ON story_analytics(story_id);
CREATE INDEX idx_story_analytics_event_type ON story_analytics(event_type);
CREATE INDEX idx_story_analytics_created_at ON story_analytics(created_at);
CREATE INDEX idx_choice_analytics_story_id ON choice_analytics(story_id);
CREATE INDEX idx_choice_analytics_node_id ON choice_analytics(node_id);
```

## Prisma Schema Configuration

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  username     String   @unique @db.VarChar(50)
  email        String   @unique @db.VarChar(255)
  passwordHash String   @map("password_hash") @db.VarChar(255)
  displayName  String?  @map("display_name") @db.VarChar(100)
  bio          String?
  avatarUrl    String?  @map("avatar_url")
  isVerified   Boolean  @default(false) @map("is_verified")
  isActive     Boolean  @default(true) @map("is_active")
  role         String   @default("user") @db.VarChar(20)
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt    DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  lastLogin    DateTime? @map("last_login") @db.Timestamptz

  // Relations
  stories       Story[]
  playSessions  PlaySession[]
  ratings       StoryRating[]
  comments      StoryComment[]
  rpgTemplates  RpgTemplate[]
  
  // Self-referential relations for following
  followers     UserFollow[] @relation("UserFollowing")
  following     UserFollow[] @relation("UserFollower")

  @@map("users")
}

model Story {
  id                String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  authorId          String   @map("author_id") @db.Uuid
  title             String   @db.VarChar(255)
  description       String?
  coverImageUrl     String?  @map("cover_image_url")
  category          String?  @db.VarChar(50)
  tags              String[]
  isPublished       Boolean  @default(false) @map("is_published")
  isFeatured        Boolean  @default(false) @map("is_featured")
  visibility        String   @default("public") @db.VarChar(20)
  contentRating     String   @default("general") @map("content_rating") @db.VarChar(10)
  rpgTemplateId     String?  @map("rpg_template_id") @db.Uuid
  estimatedDuration Int?     @map("estimated_duration")
  totalNodes        Int      @default(0) @map("total_nodes")
  createdAt         DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  author        User           @relation(fields: [authorId], references: [id], onDelete: Cascade)
  rpgTemplate   RpgTemplate?   @relation(fields: [rpgTemplateId], references: [id])
  nodes         StoryNode[]
  connections   NodeConnection[]
  playSessions  PlaySession[]
  ratings       StoryRating[]
  comments      StoryComment[]
  analytics     StoryAnalytics[]
  choiceAnalytics ChoiceAnalytics[]

  @@map("stories")
}

model RpgTemplate {
  id            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  creatorId     String   @map("creator_id") @db.Uuid
  name          String   @db.VarChar(255)
  description   String?
  isPublic      Boolean  @default(false) @map("is_public")
  configuration Json     @db.JsonB
  version       Int      @default(1)
  createdAt     DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt     DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  creator    User        @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  stories    Story[]
  characters Character[]

  @@map("rpg_templates")
}

model StoryNode {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  storyId   String   @map("story_id") @db.Uuid
  nodeType  String   @map("node_type") @db.VarChar(50)
  title     String?  @db.VarChar(255)
  content   Json     @db.JsonB
  position  Json?    @db.JsonB
  metadata  Json?    @db.JsonB
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  story           Story            @relation(fields: [storyId], references: [id], onDelete: Cascade)
  connectionsFrom NodeConnection[] @relation("FromNode")
  connectionsTo   NodeConnection[] @relation("ToNode")
  playSessions    PlaySession[]
  choiceAnalytics ChoiceAnalytics[]

  @@map("story_nodes")
}

model NodeConnection {
  id         String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  storyId    String   @map("story_id") @db.Uuid
  fromNodeId String   @map("from_node_id") @db.Uuid
  toNodeId   String   @map("to_node_id") @db.Uuid
  choiceText String?  @map("choice_text")
  conditions Json?    @db.JsonB
  metadata   Json?    @db.JsonB
  createdAt  DateTime @default(now()) @map("created_at") @db.Timestamptz

  // Relations
  story       Story             @relation(fields: [storyId], references: [id], onDelete: Cascade)
  fromNode    StoryNode         @relation("FromNode", fields: [fromNodeId], references: [id], onDelete: Cascade)
  toNode      StoryNode         @relation("ToNode", fields: [toNodeId], references: [id], onDelete: Cascade)
  choiceAnalytics ChoiceAnalytics[]

  @@map("node_connections")
}

model PlaySession {
  id            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId        String   @map("user_id") @db.Uuid
  storyId       String   @map("story_id") @db.Uuid
  sessionName   String?  @map("session_name") @db.VarChar(255)
  currentNodeId String?  @map("current_node_id") @db.Uuid
  sessionData   Json     @map("session_data") @db.JsonB
  isCompleted   Boolean  @default(false) @map("is_completed")
  createdAt     DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt     DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  story       Story       @relation(fields: [storyId], references: [id], onDelete: Cascade)
  currentNode StoryNode?  @relation(fields: [currentNodeId], references: [id])
  characters  Character[]

  @@map("play_sessions")
}

model Character {
  id              String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  playSessionId   String   @map("play_session_id") @db.Uuid
  name            String   @db.VarChar(100)
  rpgTemplateId   String   @map("rpg_template_id") @db.Uuid
  characterData   Json     @map("character_data") @db.JsonB
  createdAt       DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  playSession  PlaySession  @relation(fields: [playSessionId], references: [id], onDelete: Cascade)
  rpgTemplate  RpgTemplate  @relation(fields: [rpgTemplateId], references: [id])
  stats        CharacterStat[]

  @@map("characters")
}

model CharacterStat {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  characterId String   @map("character_id") @db.Uuid
  statName    String   @map("stat_name") @db.VarChar(100)
  statValue   Json     @map("stat_value") @db.JsonB
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  character Character @relation(fields: [characterId], references: [id], onDelete: Cascade)

  @@unique([characterId, statName])
  @@map("character_stats")
}

model StoryRating {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId    String   @map("user_id") @db.Uuid
  storyId   String   @map("story_id") @db.Uuid
  rating    Int
  review    String?
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  story Story @relation(fields: [storyId], references: [id], onDelete: Cascade)

  @@unique([userId, storyId])
  @@map("story_ratings")
}

model StoryComment {
  id              String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId          String   @map("user_id") @db.Uuid
  storyId         String   @map("story_id") @db.Uuid
  parentCommentId String?  @map("parent_comment_id") @db.Uuid
  content         String
  isEdited        Boolean  @default(false) @map("is_edited")
  createdAt       DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  user          User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  story         Story          @relation(fields: [storyId], references: [id], onDelete: Cascade)
  parentComment StoryComment?  @relation("CommentReplies", fields: [parentCommentId], references: [id], onDelete: Cascade)
  replies       StoryComment[] @relation("CommentReplies")

  @@map("story_comments")
}

model UserFollow {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  followerId  String   @map("follower_id") @db.Uuid
  followingId String   @map("following_id") @db.Uuid
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz

  // Relations
  follower  User @relation("UserFollower", fields: [followerId], references: [id], onDelete: Cascade)
  following User @relation("UserFollowing", fields: [followingId], references: [id], onDelete: Cascade)

  @@unique([followerId, followingId])
  @@map("user_follows")
}

model StoryAnalytics {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  storyId   String   @map("story_id") @db.Uuid
  userId    String?  @map("user_id") @db.Uuid
  eventType String   @map("event_type") @db.VarChar(50)
  eventData Json?    @map("event_data") @db.JsonB
  sessionId String?  @map("session_id")
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz

  // Relations
  story Story @relation(fields: [storyId], references: [id], onDelete: Cascade)
  user  User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@map("story_analytics")
}

model ChoiceAnalytics {
  id           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  storyId      String   @map("story_id") @db.Uuid
  nodeId       String   @map("node_id") @db.Uuid
  connectionId String   @map("connection_id") @db.Uuid
  userId       String?  @map("user_id") @db.Uuid
  choiceData   Json?    @map("choice_data") @db.JsonB
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamptz

  // Relations
  story      Story          @relation(fields: [storyId], references: [id], onDelete: Cascade)
  node       StoryNode      @relation(fields: [nodeId], references: [id], onDelete: Cascade)
  connection NodeConnection @relation(fields: [connectionId], references: [id], onDelete: Cascade)
  user       User?          @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@map("choice_analytics")
}
```

## Data Migration Strategy

The schema is designed to support evolutionary changes through Prisma migrations. The extensive use of JSONB fields allows for schema flexibility without requiring frequent migrations for new RPG mechanics or story features.

Key migration considerations:
- JSONB fields can be extended without schema changes
- New node types can be added without altering the core structure
- RPG templates can evolve independently of the core schema
- Analytics data can accommodate new event types dynamically

This flexible schema design ensures the platform can adapt to changing requirements while maintaining data integrity and performance.

