# API Design Specification

## Overview

The API follows RESTful principles and is designed to support all functionality of the text-based adventure platform. All endpoints return JSON responses and use standard HTTP status codes. Authentication is handled through JWT tokens, and the API supports CORS for frontend integration.

## Base URL and Versioning

```
Base URL: https://api.textadventure.com/v1
```

All API endpoints are versioned to ensure backward compatibility. The current version is v1.

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Tokens are included in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

Token expiration is set to 24 hours for access tokens and 30 days for refresh tokens.

## Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "errors": [],
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0.0"
  }
}
```

Error responses include detailed error information:

```json
{
  "success": false,
  "data": null,
  "message": "Error occurred",
  "errors": [
    {
      "field": "email",
      "code": "VALIDATION_ERROR",
      "message": "Invalid email format"
    }
  ],
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0.0"
  }
}
```

## Authentication Endpoints

### POST /auth/register

Register a new user account.

**Request Body:**
```json
{
  "username": "string (3-50 chars, alphanumeric + underscore)",
  "email": "string (valid email)",
  "password": "string (min 8 chars)",
  "displayName": "string (optional, max 100 chars)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "displayName": "string",
      "avatarUrl": "string",
      "isVerified": false,
      "createdAt": "timestamp"
    },
    "tokens": {
      "accessToken": "jwt_string",
      "refreshToken": "jwt_string",
      "expiresIn": 86400
    }
  },
  "message": "User registered successfully"
}
```

### POST /auth/login

Authenticate user and receive access tokens.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "displayName": "string",
      "avatarUrl": "string",
      "isVerified": boolean,
      "lastLogin": "timestamp"
    },
    "tokens": {
      "accessToken": "jwt_string",
      "refreshToken": "jwt_string",
      "expiresIn": 86400
    }
  },
  "message": "Login successful"
}
```

### POST /auth/refresh

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt_string",
    "expiresIn": 86400
  },
  "message": "Token refreshed successfully"
}
```

### POST /auth/logout

Invalidate current session tokens.

**Headers:** Authorization: Bearer <access_token>

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Logged out successfully"
}
```

## User Management Endpoints

### GET /users/profile

Get current user's profile information.

**Headers:** Authorization: Bearer <access_token>

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "displayName": "string",
    "bio": "string",
    "avatarUrl": "string",
    "isVerified": boolean,
    "createdAt": "timestamp",
    "stats": {
      "storiesCreated": 5,
      "storiesPlayed": 23,
      "totalReads": 1250,
      "averageRating": 4.2,
      "followers": 45,
      "following": 12
    }
  }
}
```

### PUT /users/profile

Update current user's profile.

**Headers:** Authorization: Bearer <access_token>

**Request Body:**
```json
{
  "displayName": "string (optional)",
  "bio": "string (optional, max 500 chars)",
  "avatarUrl": "string (optional, valid URL)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "string",
    "displayName": "string",
    "bio": "string",
    "avatarUrl": "string",
    "updatedAt": "timestamp"
  },
  "message": "Profile updated successfully"
}
```

### GET /users/:userId

Get public profile of a specific user.

**Parameters:**
- `userId`: UUID of the user

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "string",
    "displayName": "string",
    "bio": "string",
    "avatarUrl": "string",
    "createdAt": "timestamp",
    "stats": {
      "storiesCreated": 5,
      "totalReads": 1250,
      "averageRating": 4.2,
      "followers": 45
    },
    "stories": [
      {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "coverImageUrl": "string",
        "category": "string",
        "rating": 4.5,
        "reads": 250,
        "createdAt": "timestamp"
      }
    ]
  }
}
```

## Story Management Endpoints

### GET /stories

Get paginated list of published stories with filtering and sorting options.

**Query Parameters:**
- `page`: integer (default: 1)
- `limit`: integer (default: 20, max: 100)
- `category`: string (optional)
- `tags`: string (comma-separated, optional)
- `sortBy`: string (created_at, updated_at, rating, reads) (default: created_at)
- `sortOrder`: string (asc, desc) (default: desc)
- `search`: string (search in title and description, optional)
- `contentRating`: string (general, teen, mature, adult) (optional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "stories": [
      {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "coverImageUrl": "string",
        "category": "string",
        "tags": ["string"],
        "contentRating": "string",
        "estimatedDuration": 30,
        "author": {
          "id": "uuid",
          "username": "string",
          "displayName": "string",
          "avatarUrl": "string"
        },
        "stats": {
          "rating": 4.5,
          "totalRatings": 123,
          "reads": 1250,
          "comments": 45
        },
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 200,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### POST /stories

Create a new story.

**Headers:** Authorization: Bearer <access_token>

**Request Body:**
```json
{
  "title": "string (max 255 chars)",
  "description": "string (optional)",
  "category": "string (optional)",
  "tags": ["string"] (optional),
  "contentRating": "string (general|teen|mature|adult)",
  "visibility": "string (public|unlisted|private)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "category": "string",
    "tags": ["string"],
    "contentRating": "string",
    "visibility": "string",
    "isPublished": false,
    "author": {
      "id": "uuid",
      "username": "string",
      "displayName": "string"
    },
    "createdAt": "timestamp"
  },
  "message": "Story created successfully"
}
```

### GET /stories/:storyId

Get detailed information about a specific story.

**Parameters:**
- `storyId`: UUID of the story

**Headers:** Authorization: Bearer <access_token> (optional, required for private stories)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "coverImageUrl": "string",
    "category": "string",
    "tags": ["string"],
    "contentRating": "string",
    "visibility": "string",
    "isPublished": boolean,
    "estimatedDuration": 30,
    "author": {
      "id": "uuid",
      "username": "string",
      "displayName": "string",
      "avatarUrl": "string"
    },
    "stats": {
      "rating": 4.5,
      "totalRatings": 123,
      "reads": 1250,
      "comments": 45,
      "bookmarks": 78
    },
    "chapters": [
      {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "chapterOrder": 1,
        "isPublished": boolean
      }
    ],
    "userInteraction": {
      "hasRated": boolean,
      "userRating": 4,
      "hasBookmarked": boolean,
      "hasPlayed": boolean,
      "playProgress": 0.75
    },
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

### PUT /stories/:storyId

Update story information.

**Parameters:**
- `storyId`: UUID of the story

**Headers:** Authorization: Bearer <access_token>

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "coverImageUrl": "string (optional)",
  "category": "string (optional)",
  "tags": ["string"] (optional),
  "contentRating": "string (optional)",
  "visibility": "string (optional)",
  "estimatedDuration": 30 (optional)
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "coverImageUrl": "string",
    "category": "string",
    "tags": ["string"],
    "contentRating": "string",
    "visibility": "string",
    "estimatedDuration": 30,
    "updatedAt": "timestamp"
  },
  "message": "Story updated successfully"
}
```

### DELETE /stories/:storyId

Delete a story and all associated data.

**Parameters:**
- `storyId`: UUID of the story

**Headers:** Authorization: Bearer <access_token>

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Story deleted successfully"
}
```

### POST /stories/:storyId/publish

Publish or unpublish a story.

**Parameters:**
- `storyId`: UUID of the story

**Headers:** Authorization: Bearer <access_token>

**Request Body:**
```json
{
  "isPublished": boolean
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "isPublished": boolean,
    "publishedAt": "timestamp"
  },
  "message": "Story publication status updated"
}
```

## Node and Chapter Management Endpoints

### GET /stories/:storyId/chapters

Get all chapters for a story.

**Parameters:**
- `storyId`: UUID of the story

**Headers:** Authorization: Bearer <access_token>

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "chapters": [
      {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "chapterOrder": 1,
        "isPublished": boolean,
        "nodeCount": 15,
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    ]
  }
}
```

### POST /stories/:storyId/chapters

Create a new chapter in a story.

**Parameters:**
- `storyId`: UUID of the story

**Headers:** Authorization: Bearer <access_token>

**Request Body:**
```json
{
  "title": "string",
  "description": "string (optional)",
  "chapterOrder": 1
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "chapterOrder": 1,
    "isPublished": false,
    "createdAt": "timestamp"
  },
  "message": "Chapter created successfully"
}
```

### GET /stories/:storyId/nodes

Get all nodes for a story with optional chapter filtering.

**Parameters:**
- `storyId`: UUID of the story

**Query Parameters:**
- `chapterId`: UUID (optional, filter by chapter)

**Headers:** Authorization: Bearer <access_token>

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "nodes": [
      {
        "id": "uuid",
        "title": "string",
        "nodeType": "story",
        "content": {},
        "position": {"x": 100, "y": 200},
        "metadata": {},
        "chapterId": "uuid",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    ],
    "choices": [
      {
        "id": "uuid",
        "fromNodeId": "uuid",
        "toNodeId": "uuid",
        "choiceText": "string",
        "choiceOrder": 1,
        "conditions": {},
        "effects": {}
      }
    ]
  }
}
```

### POST /stories/:storyId/nodes

Create a new node in a story.

**Parameters:**
- `storyId`: UUID of the story

**Headers:** Authorization: Bearer <access_token>

**Request Body:**
```json
{
  "title": "string",
  "nodeType": "story",
  "content": {
    "paragraphs": ["string"],
    "background": "string",
    "characters": [
      {
        "name": "string",
        "position": "center",
        "expression": "neutral",
        "spriteUrl": "string"
      }
    ]
  },
  "position": {"x": 100, "y": 200},
  "chapterId": "uuid (optional)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "string",
    "nodeType": "story",
    "content": {},
    "position": {"x": 100, "y": 200},
    "chapterId": "uuid",
    "createdAt": "timestamp"
  },
  "message": "Node created successfully"
}
```

### PUT /stories/:storyId/nodes/:nodeId

Update a node.

**Parameters:**
- `storyId`: UUID of the story
- `nodeId`: UUID of the node

**Headers:** Authorization: Bearer <access_token>

**Request Body:**
```json
{
  "title": "string (optional)",
  "content": {} (optional),
  "position": {"x": 100, "y": 200} (optional),
  "metadata": {} (optional)
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "string",
    "content": {},
    "position": {"x": 100, "y": 200},
    "updatedAt": "timestamp"
  },
  "message": "Node updated successfully"
}
```

### DELETE /stories/:storyId/nodes/:nodeId

Delete a node and all associated choices.

**Parameters:**
- `storyId`: UUID of the story
- `nodeId`: UUID of the node

**Headers:** Authorization: Bearer <access_token>

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Node deleted successfully"
}
```

## Choice Management Endpoints

### POST /stories/:storyId/choices

Create a new choice connection between nodes.

**Parameters:**
- `storyId`: UUID of the story

**Headers:** Authorization: Bearer <access_token>

**Request Body:**
```json
{
  "fromNodeId": "uuid",
  "toNodeId": "uuid",
  "choiceText": "string",
  "choiceOrder": 1,
  "conditions": {
    "flags": {"flag_name": true},
    "items": ["item_name"],
    "variables": {"var_name": {"operator": ">=", "value": 5}}
  },
  "effects": {
    "flags": {"flag_name": true},
    "items": {"add": ["item_name"], "remove": ["other_item"]},
    "variables": {"var_name": {"operator": "+=", "value": 1}}
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fromNodeId": "uuid",
    "toNodeId": "uuid",
    "choiceText": "string",
    "choiceOrder": 1,
    "conditions": {},
    "effects": {},
    "createdAt": "timestamp"
  },
  "message": "Choice created successfully"
}
```

### PUT /stories/:storyId/choices/:choiceId

Update a choice.

**Parameters:**
- `storyId`: UUID of the story
- `choiceId`: UUID of the choice

**Headers:** Authorization: Bearer <access_token>

**Request Body:**
```json
{
  "choiceText": "string (optional)",
  "choiceOrder": 1 (optional),
  "conditions": {} (optional),
  "effects": {} (optional)
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "choiceText": "string",
    "choiceOrder": 1,
    "conditions": {},
    "effects": {},
    "updatedAt": "timestamp"
  },
  "message": "Choice updated successfully"
}
```

### DELETE /stories/:storyId/choices/:choiceId

Delete a choice.

**Parameters:**
- `storyId`: UUID of the story
- `choiceId`: UUID of the choice

**Headers:** Authorization: Bearer <access_token>

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Choice deleted successfully"
}
```

## Game Mechanics Endpoints

### GET /stories/:storyId/variables

Get all variables defined for a story.

**Parameters:**
- `storyId`: UUID of the story

**Headers:** Authorization: Bearer <access_token>

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "variables": [
      {
        "id": "uuid",
        "variableName": "string",
        "variableType": "boolean",
        "defaultValue": true,
        "description": "string"
      }
    ]
  }
}
```

### POST /stories/:storyId/variables

Create a new story variable.

**Parameters:**
- `storyId`: UUID of the story

**Headers:** Authorization: Bearer <access_token>

**Request Body:**
```json
{
  "variableName": "string",
  "variableType": "boolean|integer|string|float",
  "defaultValue": "any",
  "description": "string (optional)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "variableName": "string",
    "variableType": "boolean",
    "defaultValue": true,
    "description": "string",
    "createdAt": "timestamp"
  },
  "message": "Variable created successfully"
}
```

### GET /stories/:storyId/items

Get all items defined for a story.

**Parameters:**
- `storyId`: UUID of the story

**Headers:** Authorization: Bearer <access_token>

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "itemName": "string",
        "description": "string",
        "imageUrl": "string",
        "itemType": "string",
        "properties": {}
      }
    ]
  }
}
```

### POST /stories/:storyId/items

Create a new story item.

**Parameters:**
- `storyId`: UUID of the story

**Headers:** Authorization: Bearer <access_token>

**Request Body:**
```json
{
  "itemName": "string",
  "description": "string (optional)",
  "imageUrl": "string (optional)",
  "itemType": "string (optional)",
  "properties": {} (optional)
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "itemName": "string",
    "description": "string",
    "imageUrl": "string",
    "itemType": "string",
    "properties": {},
    "createdAt": "timestamp"
  },
  "message": "Item created successfully"
}
```

## Gameplay Endpoints

### POST /stories/:storyId/play

Start a new play session or resume existing session.

**Parameters:**
- `storyId`: UUID of the story

**Headers:** Authorization: Bearer <access_token> (optional for guest play)

**Request Body:**
```json
{
  "resumeSession": boolean (optional, default: true)
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "currentNode": {
      "id": "uuid",
      "title": "string",
      "nodeType": "story",
      "content": {
        "paragraphs": ["string"],
        "background": "string",
        "characters": [
          {
            "name": "string",
            "position": "center",
            "expression": "neutral",
            "spriteUrl": "string"
          }
        ]
      }
    },
    "availableChoices": [
      {
        "id": "uuid",
        "choiceText": "string",
        "choiceOrder": 1,
        "isAvailable": true
      }
    ],
    "gameState": {
      "flags": {},
      "inventory": [],
      "variables": {}
    },
    "progress": {
      "nodesVisited": 5,
      "totalNodes": 20,
      "completionPercentage": 25
    }
  }
}
```

### POST /stories/:storyId/play/choice

Make a choice in the current play session.

**Parameters:**
- `storyId`: UUID of the story

**Headers:** Authorization: Bearer <access_token> (optional for guest play)

**Request Body:**
```json
{
  "sessionId": "uuid",
  "choiceId": "uuid"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "currentNode": {
      "id": "uuid",
      "title": "string",
      "nodeType": "story",
      "content": {}
    },
    "availableChoices": [
      {
        "id": "uuid",
        "choiceText": "string",
        "choiceOrder": 1,
        "isAvailable": true
      }
    ],
    "gameState": {
      "flags": {},
      "inventory": [],
      "variables": {}
    },
    "effects": {
      "flagsChanged": {"flag_name": true},
      "itemsAdded": ["item_name"],
      "itemsRemoved": [],
      "variablesChanged": {"var_name": 5}
    },
    "progress": {
      "nodesVisited": 6,
      "totalNodes": 20,
      "completionPercentage": 30
    },
    "isCompleted": false
  }
}
```

### GET /stories/:storyId/play/save

Get current save state for a play session.

**Parameters:**
- `storyId`: UUID of the story

**Headers:** Authorization: Bearer <access_token>

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "currentNodeId": "uuid",
    "gameState": {
      "flags": {},
      "inventory": [],
      "variables": {}
    },
    "progress": {
      "nodesVisited": 6,
      "totalNodes": 20,
      "completionPercentage": 30
    },
    "lastPlayedAt": "timestamp",
    "isCompleted": false
  }
}
```

## Social Features Endpoints

### POST /stories/:storyId/rating

Rate a story.

**Parameters:**
- `storyId`: UUID of the story

**Headers:** Authorization: Bearer <access_token>

**Request Body:**
```json
{
  "rating": 4,
  "reviewText": "string (optional, max 1000 chars)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "rating": 4,
    "reviewText": "string",
    "createdAt": "timestamp"
  },
  "message": "Rating submitted successfully"
}
```

### GET /stories/:storyId/ratings

Get ratings and reviews for a story.

**Parameters:**
- `storyId`: UUID of the story

**Query Parameters:**
- `page`: integer (default: 1)
- `limit`: integer (default: 20, max: 100)
- `sortBy`: string (created_at, rating) (default: created_at)
- `sortOrder`: string (asc, desc) (default: desc)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "ratings": [
      {
        "id": "uuid",
        "rating": 4,
        "reviewText": "string",
        "user": {
          "id": "uuid",
          "username": "string",
          "displayName": "string",
          "avatarUrl": "string"
        },
        "createdAt": "timestamp",
        "isEdited": false
      }
    ],
    "summary": {
      "averageRating": 4.2,
      "totalRatings": 123,
      "ratingDistribution": {
        "1": 2,
        "2": 5,
        "3": 15,
        "4": 45,
        "5": 56
      }
    },
    "pagination": {
      "currentPage": 1,
      "totalPages": 7,
      "totalItems": 123,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### POST /stories/:storyId/bookmark

Bookmark or unbookmark a story.

**Parameters:**
- `storyId`: UUID of the story

**Headers:** Authorization: Bearer <access_token>

**Request Body:**
```json
{
  "bookmarked": boolean
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "bookmarked": boolean,
    "bookmarkCount": 78
  },
  "message": "Bookmark status updated"
}
```

### GET /stories/:storyId/comments

Get comments for a story.

**Parameters:**
- `storyId`: UUID of the story

**Query Parameters:**
- `page`: integer (default: 1)
- `limit`: integer (default: 20, max: 100)
- `sortBy`: string (created_at) (default: created_at)
- `sortOrder`: string (asc, desc) (default: desc)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "uuid",
        "content": "string",
        "user": {
          "id": "uuid",
          "username": "string",
          "displayName": "string",
          "avatarUrl": "string"
        },
        "replies": [
          {
            "id": "uuid",
            "content": "string",
            "user": {
              "id": "uuid",
              "username": "string",
              "displayName": "string",
              "avatarUrl": "string"
            },
            "createdAt": "timestamp",
            "isEdited": false
          }
        ],
        "createdAt": "timestamp",
        "isEdited": false
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 45,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### POST /stories/:storyId/comments

Add a comment to a story.

**Parameters:**
- `storyId`: UUID of the story

**Headers:** Authorization: Bearer <access_token>

**Request Body:**
```json
{
  "content": "string (max 1000 chars)",
  "parentCommentId": "uuid (optional, for replies)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "content": "string",
    "parentCommentId": "uuid",
    "createdAt": "timestamp"
  },
  "message": "Comment added successfully"
}
```

## Analytics Endpoints

### GET /stories/:storyId/analytics

Get comprehensive analytics for a story (author only).

**Parameters:**
- `storyId`: UUID of the story

**Headers:** Authorization: Bearer <access_token>

**Query Parameters:**
- `timeRange`: string (7d, 30d, 90d, 1y, all) (default: 30d)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalReads": 1250,
      "uniqueReaders": 890,
      "averageRating": 4.2,
      "totalRatings": 123,
      "completionRate": 0.68,
      "averagePlayTime": 25,
      "bookmarks": 78,
      "comments": 45
    },
    "readsTrend": [
      {
        "date": "2024-01-01",
        "reads": 45,
        "uniqueReaders": 32
      }
    ],
    "choiceAnalytics": [
      {
        "choiceId": "uuid",
        "choiceText": "string",
        "nodeTitle": "string",
        "timesSelected": 234,
        "selectionRate": 0.65
      }
    ],
    "nodeAnalytics": [
      {
        "nodeId": "uuid",
        "nodeTitle": "string",
        "visits": 456,
        "exitRate": 0.12,
        "averageTimeSpent": 15
      }
    ],
    "demographicData": {
      "topCountries": [
        {"country": "US", "percentage": 45},
        {"country": "UK", "percentage": 23}
      ],
      "deviceTypes": {
        "desktop": 0.45,
        "mobile": 0.55
      }
    }
  }
}
```

### GET /users/analytics

Get analytics for current user's stories.

**Headers:** Authorization: Bearer <access_token>

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalStories": 5,
      "publishedStories": 3,
      "totalReads": 5670,
      "totalRatings": 234,
      "averageRating": 4.3,
      "totalFollowers": 45,
      "totalBookmarks": 189
    },
    "topStories": [
      {
        "id": "uuid",
        "title": "string",
        "reads": 2340,
        "rating": 4.5,
        "completionRate": 0.72
      }
    ],
    "recentActivity": [
      {
        "type": "new_rating",
        "storyId": "uuid",
        "storyTitle": "string",
        "data": {"rating": 5},
        "timestamp": "timestamp"
      }
    ]
  }
}
```

## Asset Management Endpoints

### POST /assets/upload

Upload an asset file (image, audio, etc.).

**Headers:** 
- Authorization: Bearer <access_token>
- Content-Type: multipart/form-data

**Request Body:**
```
file: File (max 10MB for images, 50MB for audio)
assetType: string (image|audio|video|document)
isPublic: boolean (optional, default: false)
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "filename": "string",
    "originalFilename": "string",
    "fileSize": 1048576,
    "mimeType": "image/png",
    "fileUrl": "string",
    "assetType": "image",
    "isPublic": false,
    "metadata": {
      "width": 1920,
      "height": 1080
    },
    "createdAt": "timestamp"
  },
  "message": "Asset uploaded successfully"
}
```

### GET /assets/:assetId

Get asset information and download URL.

**Parameters:**
- `assetId`: UUID of the asset

**Headers:** Authorization: Bearer <access_token> (required for private assets)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "filename": "string",
    "originalFilename": "string",
    "fileSize": 1048576,
    "mimeType": "image/png",
    "fileUrl": "string",
    "assetType": "image",
    "isPublic": false,
    "metadata": {
      "width": 1920,
      "height": 1080
    },
    "downloadUrl": "string (signed URL with expiration)",
    "createdAt": "timestamp"
  }
}
```

## Error Handling

The API uses standard HTTP status codes and provides detailed error information:

- **400 Bad Request**: Invalid request data or parameters
- **401 Unauthorized**: Authentication required or invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists or conflict with current state
- **422 Unprocessable Entity**: Validation errors
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

Error responses include specific error codes and messages to help with debugging and user feedback.

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 10 requests per minute per IP
- **Read operations**: 1000 requests per hour per user
- **Write operations**: 100 requests per hour per user
- **Asset uploads**: 50 requests per hour per user

Rate limit headers are included in all responses:
- `X-RateLimit-Limit`: Request limit per time window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the rate limit resets

This comprehensive API design provides all the necessary endpoints to support the full functionality of the text-based adventure platform while maintaining security, performance, and usability standards.

