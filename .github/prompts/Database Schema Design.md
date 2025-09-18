# Database Schema Design

## Overview

The database schema is designed to support a comprehensive text-based adventure platform with story creation, social features, and analytics. The schema uses PostgreSQL as the primary database with Prisma as the ORM for type-safe database operations.

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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);
```

The users table includes essential fields for authentication and profile management. The `is_verified` field supports email verification workflows, while `is_active` allows for account deactivation without data loss. The `display_name` field provides flexibility for users to have a different public name than their username.

### Story Management

Stories are the core content of the platform. The story management system supports hierarchical organization with chapters and nodes, enabling complex narrative structures.

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
    estimated_duration INTEGER, -- Estimated reading time in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE
);
```

The stories table supports comprehensive metadata including content ratings, visibility controls, and categorization through both categories and tags. The `estimated_duration` field helps users understand the time commitment required.

**Chapters Table**
```sql
CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    chapter_order INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(story_id, chapter_order)
);
```

Chapters provide organizational structure within stories, allowing for better content management and reader navigation. The `chapter_order` field with a unique constraint ensures proper sequencing.

### Node-Based Story Structure

The node-based system is the heart of the interactive story engine, supporting complex branching narratives with conditional logic.

**Nodes Table**
```sql
CREATE TABLE nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    title VARCHAR(255),
    node_type VARCHAR(20) DEFAULT 'story' CHECK (node_type IN ('story', 'choice', 'condition', 'ending')),
    content JSONB NOT NULL, -- Flexible content structure
    position JSONB, -- {x, y} coordinates for editor layout
    metadata JSONB, -- Additional node-specific data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

The nodes table uses JSONB fields for flexible content storage. The `content` field structure varies by node type:

For story nodes:
```json
{
  "paragraphs": ["Text paragraph 1", "Text paragraph 2"],
  "background": "url_to_background_image",
  "characters": [
    {
      "name": "character_name",
      "position": "left|center|right",
      "expression": "happy|sad|neutral",
      "sprite_url": "url_to_character_sprite"
    }
  ],
  "audio": {
    "background_music": "url_to_music",
    "sound_effects": ["url_to_sfx1", "url_to_sfx2"]
  }
}
```

**Choices Table**
```sql
CREATE TABLE choices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    to_node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    choice_text VARCHAR(500) NOT NULL,
    choice_order INTEGER NOT NULL,
    conditions JSONB, -- Conditions that must be met for this choice to appear
    effects JSONB, -- Effects that occur when this choice is selected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

The choices table manages the connections between nodes and the interactive elements that drive the story forward. The `conditions` and `effects` fields support complex game mechanics.

### Game Mechanics

The game mechanics system supports inventory management, flag tracking, and conditional logic that makes stories truly interactive.

**Story Variables Table**
```sql
CREATE TABLE story_variables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    variable_name VARCHAR(100) NOT NULL,
    variable_type VARCHAR(20) NOT NULL CHECK (variable_type IN ('boolean', 'integer', 'string', 'float')),
    default_value JSONB,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(story_id, variable_name)
);
```

**Items Table**
```sql
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    item_name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    item_type VARCHAR(50), -- weapon, consumable, key_item, etc.
    properties JSONB, -- Flexible item properties
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(story_id, item_name)
);
```

### Player Progress and Analytics

The analytics system tracks detailed player behavior and story performance, providing valuable insights for creators.

**Play Sessions Table**
```sql
CREATE TABLE play_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    session_data JSONB NOT NULL, -- Current game state
    current_node_id UUID REFERENCES nodes(id) ON DELETE SET NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_played_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT FALSE
);
```

**Choice Analytics Table**
```sql
CREATE TABLE choice_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    choice_id UUID NOT NULL REFERENCES choices(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id UUID NOT NULL REFERENCES play_sessions(id) ON DELETE CASCADE,
    selected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Social Features

The social system enables community interaction through ratings, comments, and following relationships.

**Ratings Table**
```sql
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(story_id, user_id)
);
```

**Comments Table**
```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
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

**Story Bookmarks Table**
```sql
CREATE TABLE story_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, story_id)
);
```

### Content Management

The content management system handles file uploads, moderation, and content organization.

**Assets Table**
```sql
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploader_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_url TEXT NOT NULL,
    asset_type VARCHAR(50) NOT NULL CHECK (asset_type IN ('image', 'audio', 'video', 'document')),
    is_public BOOLEAN DEFAULT FALSE,
    metadata JSONB, -- Image dimensions, audio duration, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes and Performance Optimization

To ensure optimal performance, the following indexes are recommended:

```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Story indexes
CREATE INDEX idx_stories_author_id ON stories(author_id);
CREATE INDEX idx_stories_category ON stories(category);
CREATE INDEX idx_stories_is_published ON stories(is_published);
CREATE INDEX idx_stories_created_at ON stories(created_at);
CREATE INDEX idx_stories_tags ON stories USING GIN(tags);

-- Node indexes
CREATE INDEX idx_nodes_story_id ON nodes(story_id);
CREATE INDEX idx_nodes_chapter_id ON nodes(chapter_id);
CREATE INDEX idx_nodes_node_type ON nodes(node_type);

-- Choice indexes
CREATE INDEX idx_choices_from_node_id ON choices(from_node_id);
CREATE INDEX idx_choices_to_node_id ON choices(to_node_id);

-- Analytics indexes
CREATE INDEX idx_play_sessions_user_id ON play_sessions(user_id);
CREATE INDEX idx_play_sessions_story_id ON play_sessions(story_id);
CREATE INDEX idx_choice_analytics_choice_id ON choice_analytics(choice_id);
CREATE INDEX idx_choice_analytics_selected_at ON choice_analytics(selected_at);

-- Social indexes
CREATE INDEX idx_ratings_story_id ON ratings(story_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_comments_story_id ON comments(story_id);
CREATE INDEX idx_comments_parent_comment_id ON comments(parent_comment_id);
```

This comprehensive database schema provides a solid foundation for the text-based adventure platform, supporting all the required features while maintaining flexibility for future enhancements and optimizations.

