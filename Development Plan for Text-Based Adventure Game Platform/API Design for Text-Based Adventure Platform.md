# API Design for Text-Based Adventure Platform

## Overview

The API follows RESTful principles and is designed to support all functionality of the text-based adventure platform, including flexible RPG mechanics that can be defined by story creators. All endpoints return JSON responses and use standard HTTP status codes. Authentication is handled through JWT tokens, and the API supports CORS for frontend integration. The API is designed with provider-agnostic patterns to ensure flexibility in deployment and integration.

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

Token expiration is configurable through environment variables, with recommended defaults of 24 hours for access tokens and 30 days for refresh tokens.

## Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "errors": [],
  "meta": {
    "timestamp": "2025-09-18T00:00:00Z",
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
      "field": "field_name",
      "code": "VALIDATION_ERROR",
      "message": "Detailed error message"
    }
  ],
  "meta": {
    "timestamp": "2025-09-18T00:00:00Z",
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
  "username": "string",
  "email": "string",
  "password": "string",
  "displayName": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Registration successful. Please verify your email."
  }
}
```

### POST /auth/login
Authenticate user and return JWT tokens.

**Request Body:**
```json
{
  "usernameOrEmail": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "displayName": "string",
      "role": "string"
    }
  }
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

### POST /auth/logout
Invalidate current session tokens.

### POST /auth/verify-email
Verify user email address.

**Request Body:**
```json
{
  "token": "string"
}
```

### POST /auth/forgot-password
Request password reset email.

**Request Body:**
```json
{
  "email": "string"
}
```

### POST /auth/reset-password
Reset password using reset token.

**Request Body:**
```json
{
  "token": "string",
  "newPassword": "string"
}
```

## User Management Endpoints

### GET /users/profile
Get current user profile information.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "username": "string",
    "email": "string",
    "displayName": "string",
    "bio": "string",
    "avatarUrl": "string",
    "createdAt": "string",
    "stats": {
      "storiesCreated": "number",
      "storiesPlayed": "number",
      "totalReads": "number"
    }
  }
}
```

### PUT /users/profile
Update current user profile.

**Request Body:**
```json
{
  "displayName": "string",
  "bio": "string",
  "avatarUrl": "string"
}
```

### GET /users/:userId
Get public user profile.

### POST /users/:userId/follow
Follow a user.

### DELETE /users/:userId/follow
Unfollow a user.

### GET /users/:userId/followers
Get user's followers list.

### GET /users/:userId/following
Get users that this user follows.

## Story Management Endpoints

### GET /stories
Get list of stories with filtering and pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `category`: Filter by category
- `tags`: Filter by tags (comma-separated)
- `author`: Filter by author ID
- `search`: Search in title and description
- `sort`: Sort by (created, updated, rating, reads)
- `order`: Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "stories": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "coverImageUrl": "string",
        "category": "string",
        "tags": ["string"],
        "author": {
          "id": "string",
          "username": "string",
          "displayName": "string"
        },
        "isPublished": "boolean",
        "visibility": "string",
        "contentRating": "string",
        "estimatedDuration": "number",
        "totalNodes": "number",
        "stats": {
          "reads": "number",
          "rating": "number",
          "completions": "number"
        },
        "createdAt": "string",
        "updatedAt": "string"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number"
    }
  }
}
```

### POST /stories
Create a new story.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "tags": ["string"],
  "visibility": "string",
  "contentRating": "string",
  "rpgTemplateId": "string"
}
```

### GET /stories/:storyId
Get story details.

### PUT /stories/:storyId
Update story metadata.

### DELETE /stories/:storyId
Delete a story.

### POST /stories/:storyId/publish
Publish a story.

### POST /stories/:storyId/unpublish
Unpublish a story.

## Story Editor Endpoints

### GET /stories/:storyId/nodes
Get all nodes for a story.

**Response:**
```json
{
  "success": true,
  "data": {
    "nodes": [
      {
        "id": "string",
        "nodeType": "string",
        "title": "string",
        "content": {},
        "position": {"x": "number", "y": "number"},
        "metadata": {},
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  }
}
```

### POST /stories/:storyId/nodes
Create a new story node.

**Request Body:**
```json
{
  "nodeType": "string",
  "title": "string",
  "content": {},
  "position": {"x": "number", "y": "number"},
  "metadata": {}
}
```

### PUT /stories/:storyId/nodes/:nodeId
Update a story node.

### DELETE /stories/:storyId/nodes/:nodeId
Delete a story node.

### GET /stories/:storyId/connections
Get all connections for a story.

**Response:**
```json
{
  "success": true,
  "data": {
    "connections": [
      {
        "id": "string",
        "fromNodeId": "string",
        "toNodeId": "string",
        "choiceText": "string",
        "conditions": {},
        "metadata": {},
        "createdAt": "string"
      }
    ]
  }
}
```

### POST /stories/:storyId/connections
Create a new node connection.

**Request Body:**
```json
{
  "fromNodeId": "string",
  "toNodeId": "string",
  "choiceText": "string",
  "conditions": {},
  "metadata": {}
}
```

### PUT /stories/:storyId/connections/:connectionId
Update a node connection.

### DELETE /stories/:storyId/connections/:connectionId
Delete a node connection.

### POST /stories/:storyId/preview
Preview story from a specific node.

**Request Body:**
```json
{
  "startNodeId": "string",
  "characterData": {}
}
```

## RPG Template Endpoints

### GET /rpg-templates
Get list of available RPG templates.

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `public`: Filter by public templates only
- `creator`: Filter by creator ID
- `search`: Search in name and description

**Response:**
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "isPublic": "boolean",
        "creator": {
          "id": "string",
          "username": "string",
          "displayName": "string"
        },
        "configuration": {},
        "version": "number",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ],
    "pagination": {}
  }
}
```

### POST /rpg-templates
Create a new RPG template.

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "isPublic": "boolean",
  "configuration": {}
}
```

### GET /rpg-templates/:templateId
Get RPG template details.

### PUT /rpg-templates/:templateId
Update RPG template.

### DELETE /rpg-templates/:templateId
Delete RPG template.

### POST /rpg-templates/:templateId/duplicate
Create a copy of an RPG template.

## Gameplay Endpoints

### POST /gameplay/sessions
Start a new play session.

**Request Body:**
```json
{
  "storyId": "string",
  "sessionName": "string",
  "characterData": {}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "string",
    "currentNode": {},
    "character": {},
    "availableChoices": [],
    "sessionData": {}
  }
}
```

### GET /gameplay/sessions
Get user's play sessions.

### GET /gameplay/sessions/:sessionId
Get play session details.

### PUT /gameplay/sessions/:sessionId
Update play session.

### DELETE /gameplay/sessions/:sessionId
Delete play session.

### POST /gameplay/sessions/:sessionId/choices
Make a choice in the story.

**Request Body:**
```json
{
  "connectionId": "string",
  "choiceData": {}
}
```

### POST /gameplay/sessions/:sessionId/checks
Perform a stat check.

**Request Body:**
```json
{
  "checkType": "string",
  "checkData": {},
  "targetDifficulty": "number"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "checkResult": {
      "success": "boolean",
      "roll": "number",
      "modifier": "number",
      "total": "number",
      "difficulty": "number"
    },
    "nextNode": {},
    "updatedCharacter": {}
  }
}
```

### PUT /gameplay/sessions/:sessionId/character
Update character data.

**Request Body:**
```json
{
  "characterData": {}
}
```

### POST /gameplay/sessions/:sessionId/save
Save current game state.

**Request Body:**
```json
{
  "saveName": "string"
}
```

### POST /gameplay/sessions/:sessionId/load
Load saved game state.

**Request Body:**
```json
{
  "saveId": "string"
}
```

## Social Features Endpoints

### POST /stories/:storyId/ratings
Rate a story.

**Request Body:**
```json
{
  "rating": "number",
  "review": "string"
}
```

### GET /stories/:storyId/ratings
Get story ratings.

### PUT /stories/:storyId/ratings/:ratingId
Update story rating.

### DELETE /stories/:storyId/ratings/:ratingId
Delete story rating.

### POST /stories/:storyId/comments
Add comment to story.

**Request Body:**
```json
{
  "content": "string",
  "parentCommentId": "string"
}
```

### GET /stories/:storyId/comments
Get story comments.

### PUT /stories/:storyId/comments/:commentId
Update comment.

### DELETE /stories/:storyId/comments/:commentId
Delete comment.

## Analytics Endpoints

### GET /analytics/stories/:storyId
Get story analytics (creator only).

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalReads": "number",
      "uniqueReaders": "number",
      "completionRate": "number",
      "averageRating": "number",
      "totalRatings": "number"
    },
    "choiceAnalytics": [
      {
        "nodeId": "string",
        "connectionId": "string",
        "choiceText": "string",
        "selectionCount": "number",
        "selectionRate": "number"
      }
    ],
    "checkAnalytics": [
      {
        "checkType": "string",
        "difficulty": "number",
        "successRate": "number",
        "attemptCount": "number"
      }
    ]
  }
}
```

### GET /analytics/stories/:storyId/export
Export story analytics data.

**Query Parameters:**
- `format`: Export format (csv, json)
- `dateFrom`: Start date filter
- `dateTo`: End date filter

### GET /analytics/dashboard
Get creator dashboard analytics.

## File Upload Endpoints

### POST /upload/images
Upload image file.

**Request:** Multipart form data with image file

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "string",
    "filename": "string",
    "size": "number",
    "mimeType": "string"
  }
}
```

### POST /upload/audio
Upload audio file.

### DELETE /upload/:fileId
Delete uploaded file.

## Search Endpoints

### GET /search
Global search across stories and users.

**Query Parameters:**
- `q`: Search query
- `type`: Search type (stories, users, all)
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "results": {
      "stories": [],
      "users": []
    },
    "pagination": {},
    "suggestions": ["string"]
  }
}
```

## Admin Endpoints

### GET /admin/users
Get users list (admin only).

### PUT /admin/users/:userId/status
Update user status (admin only).

### GET /admin/stories
Get all stories (admin only).

### PUT /admin/stories/:storyId/featured
Set story as featured (admin only).

### GET /admin/analytics
Get platform analytics (admin only).

## Error Handling

The API uses standard HTTP status codes:

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate username)
- `422 Unprocessable Entity`: Validation errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- Authentication endpoints: 5 requests per minute per IP
- General endpoints: 100 requests per minute per user
- Upload endpoints: 10 requests per minute per user
- Search endpoints: 30 requests per minute per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination with consistent parameters:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response Format:**
```json
{
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## WebSocket Events

Real-time features use WebSocket connections for live updates:

### Connection
```
wss://api.textadventure.com/ws?token=<jwt_token>
```

### Events

**story_updated**
```json
{
  "event": "story_updated",
  "data": {
    "storyId": "string",
    "changes": {}
  }
}
```

**collaboration_cursor**
```json
{
  "event": "collaboration_cursor",
  "data": {
    "userId": "string",
    "position": {"x": "number", "y": "number"},
    "storyId": "string"
  }
}
```

**gameplay_update**
```json
{
  "event": "gameplay_update",
  "data": {
    "sessionId": "string",
    "updates": {}
  }
}
```

## Provider-Agnostic Design

The API is designed with provider-agnostic patterns for external services:

### Storage Provider Interface
- File upload/download operations
- URL generation for public access
- Configurable storage backends (AWS S3, Google Cloud Storage, local filesystem)

### Email Provider Interface
- Transactional email sending
- Template-based emails
- Configurable email backends (SendGrid, AWS SES, SMTP)

### Logging Provider Interface
- Structured logging
- Error tracking
- Configurable logging backends (Winston, Bunyan, cloud logging services)

### Cache Provider Interface
- Key-value caching
- Session storage
- Configurable cache backends (Redis, Memcached, in-memory)

This provider-agnostic design ensures the API can be deployed in various environments and integrated with different service providers based on specific requirements and constraints.

