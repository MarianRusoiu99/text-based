# Text-Based Adventure Platform - API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication using JWT tokens passed in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully",
  "meta": {
    "timestamp": "2025-01-20T12:00:00Z",
    "version": "1.0.0"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "BadRequest",
  "message": "Validation failed",
  "statusCode": 400,
  "errors": [...]
}
```

## Rate Limiting
The API implements rate limiting with different limits for different endpoint categories:
- **Short**: 3 requests per minute (for sensitive operations like registration)
- **Medium**: 10 requests per minute (for standard operations)
- **Long**: 100 requests per hour (for frequent operations)

---

## 1. Authentication Endpoints

### 1.1. Register User
**POST** `/auth/register`

Creates a new user account.

**Rate Limit**: Short (3/min)

**Request Body**:
```json
{
  "username": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars)",
  "displayName": "string (optional)"
}
```

**Success Response (201)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "displayName": "string",
      "isVerified": false,
      "createdAt": "ISO8601"
    },
    "accessToken": "jwt-token",
    "refreshToken": "jwt-token"
  },
  "message": "User registered successfully"
}
```

**Error Responses**:
- `409 Conflict`: User with email/username already exists
- `400 Bad Request`: Validation errors

### 1.2. Login User
**POST** `/auth/login`

Authenticates a user and returns tokens.

**Rate Limit**: Short (5/min)

**Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "displayName": "string",
      "isVerified": boolean,
      "lastLogin": "ISO8601"
    },
    "accessToken": "jwt-token",
    "refreshToken": "jwt-token"
  },
  "message": "Login successful"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid credentials
- `400 Bad Request`: Validation errors

### 1.3. Refresh Token
**POST** `/auth/refresh`

Refreshes an access token using a refresh token.

**Rate Limit**: Long (100/hour)

**Request Body**:
```json
{
  "refreshToken": "string (required)"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt-token",
    "refreshToken": "jwt-token"
  },
  "message": "Token refreshed successfully"
}
```

### 1.4. Verify Email
**POST** `/auth/verify-email`

Verifies a user's email address using a verification token.

**Rate Limit**: Medium (10/min)

**Request Body**:
```json
{
  "token": "string (required)",
  "email": "string (required)"
}
```

### 1.5. Verify Email (Test)
**POST** `/auth/verify-email-test`

Test endpoint to auto-verify a user's email (development only).

**Request Body**:
```json
{
  "email": "string (required)"
}
```

### 1.6. Forgot Password
**POST** `/auth/forgot-password`

Initiates password reset process.

**Rate Limit**: Medium (10/min)

**Request Body**:
```json
{
  "email": "string (required)"
}
```

### 1.7. Reset Password
**POST** `/auth/reset-password`

Resets password using a reset token.

**Rate Limit**: Medium (10/min)

**Request Body**:
```json
{
  "token": "string (required)",
  "newPassword": "string (required, min 8 chars)",
  "confirmPassword": "string (required)"
}
```

### 1.8. Change Password
**POST** `/auth/change-password`

Changes password for authenticated user.

**Authentication**: Required

**Rate Limit**: Medium (20/min)

**Request Body**:
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required, min 8 chars)",
  "confirmPassword": "string (required)"
}
```

### 1.9. Logout
**POST** `/auth/logout`

Logs out user and invalidates refresh token.

**Authentication**: Required

**Rate Limit**: Long (100/hour)

**Request Body**:
```json
{
  "refreshToken": "string (required)"
}
```

---

## 2. User Management Endpoints

### 2.1. Get User Profile
**GET** `/users/profile`

Gets the authenticated user's profile information.

**Authentication**: Required

**Success Response (200)**:
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
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
}
```

### 2.2. Update User Profile
**PUT** `/users/profile`

Updates the authenticated user's profile.

**Authentication**: Required

**Request Body**:
```json
{
  "displayName": "string (optional)",
  "bio": "string (optional)",
  "avatarUrl": "string (optional, valid URL)"
}
```

### 2.3. Get Public Profile
**GET** `/users/{userId}`

Gets public profile information for any user.

**Parameters**:
- `userId` (path): UUID of the user

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "string",
    "displayName": "string",
    "bio": "string",
    "avatarUrl": "string",
    "createdAt": "ISO8601",
    "storiesCount": number,
    "followersCount": number,
    "followingCount": number
  }
}
```

---

## Summary of All Endpoints

This platform provides over 80 endpoints across the following categories:

### 1. Authentication (9 endpoints)
- Register, Login, Refresh Token, Logout
- Email verification and password reset workflows

### 2. User Management (3 endpoints)
- Profile management and public user information

### 3. Story Management (15+ endpoints)
- Full CRUD operations for stories
- Chapter, variable, and item management
- Publishing and visibility controls

### 4. Node & Choice Management (10 endpoints)
- Story node creation and management
- Choice creation and management for branching narratives

### 5. RPG Templates (5 endpoints)
- Create and manage flexible RPG systems
- Support for custom stats, skills, and dice systems

### 6. Player/Gameplay (10 endpoints)
- Start and manage gameplay sessions
- Save/load game functionality
- Choice execution and state management

### 7. Social Features (18 endpoints)
- User following system
- Story ratings and reviews
- Comments and bookmarking
- Social discovery features

### 8. Achievements (3 endpoints)
- Achievement system with progress tracking

### 9. Discovery (6 endpoints)
- Story discovery with filtering and search
- Featured, trending, and recommended content

### 10. Additional Features
- Real-time rate limiting across all endpoints
- Comprehensive error handling and validation
- Consistent response formatting
- JWT-based authentication with refresh tokens

All endpoints support proper HTTP status codes, comprehensive error messages, and follow RESTful conventions. The API is designed to support a complete text-based adventure platform with flexible RPG mechanics.
