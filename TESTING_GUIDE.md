# Testing Guide for Text-Based Adventure Platform

This guide provides instructions for running and validating all backend API endpoints using the comprehensive test suite.

## Prerequisites

### 1. Environment Setup

Ensure you have the following installed:
- Node.js 18+ 
- Docker and Docker Compose
- PostgreSQL client (optional, for direct database access)

### 2. Start Required Services

```bash
# 1. Start PostgreSQL and Redis services
cd docker && docker compose up -d

# 2. Install backend dependencies
cd ../backend && npm install

# 3. Set up environment variables
cp .env.example .env  # Or create .env with required variables

# 4. Run database migrations and seed data
npx prisma migrate dev
npx prisma db seed

# 5. Start the backend server
npm run start:dev
```

### 3. Install Test Dependencies

```bash
# Install test dependencies
cd ../tests && npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

### Comprehensive API Test Suite

The comprehensive test suite (`tests/api/comprehensive-api.test.ts`) covers all 80+ endpoints across 10 categories:

```bash
# Run the comprehensive API test suite
cd tests && npm run test:api

# Run with verbose output
npx playwright test --config playwright.config.ts --project=api --reporter=verbose

# Run specific test groups
npx playwright test --config playwright.config.ts --project=api -g "Authentication Endpoints"
npx playwright test --config playwright.config.ts --project=api -g "Story Management"
npx playwright test --config playwright.config.ts --project=api -g "Social Features"
```

### Individual Test Categories

You can also run tests for specific endpoint categories:

```bash
# Authentication tests
npx playwright test --config playwright.config.ts --project=api -g "1. Authentication Endpoints"

# User management tests  
npx playwright test --config playwright.config.ts --project=api -g "2. User Management Endpoints"

# RPG template tests
npx playwright test --config playwright.config.ts --project=api -g "3. RPG Template Endpoints"

# Story management tests
npx playwright test --config playwright.config.ts --project=api -g "4. Story Management Endpoints"

# Gameplay tests
npx playwright test --config playwright.config.ts --project=api -g "7. Player/Gameplay Endpoints"

# Social features tests
npx playwright test --config playwright.config.ts --project=api -g "8. Social Features Endpoints"
```

### Legacy Test Suites

Run existing individual test files:

```bash
# Run existing auth tests
npx playwright test api/auth/auth.test.ts --project=api

# Run existing story tests
npx playwright test api/stories/stories.test.ts --project=api

# Run all existing tests
npm run test:api
```

## Test Coverage

The comprehensive test suite covers:

### 1. Authentication Endpoints (9 tests)
- ✅ User registration and validation
- ✅ Login with valid/invalid credentials  
- ✅ Token refresh mechanism
- ✅ Email verification (including test endpoint)
- ✅ Password change functionality
- ✅ Logout and token invalidation

### 2. User Management Endpoints (3 tests)
- ✅ Get authenticated user profile
- ✅ Update user profile information
- ✅ Get public profile data

### 3. RPG Template System (3 tests)
- ✅ Create RPG templates with custom stats/skills
- ✅ List public RPG templates
- ✅ Get specific RPG template details

### 4. Story Management (10 tests)
- ✅ Create stories with RPG template integration
- ✅ Get all stories with filtering
- ✅ Get specific story with full details
- ✅ Update story information
- ✅ Chapter management (create, list)
- ✅ Story variables for dynamic content
- ✅ Story items for RPG mechanics

### 5. Node and Choice Management (4 tests)
- ✅ Create story nodes with positioning
- ✅ List and retrieve story nodes
- ✅ Create choices between nodes
- ✅ Update choice properties and effects

### 6. Player/Gameplay System (8 tests)
- ✅ Start gameplay sessions
- ✅ Get current game state
- ✅ Make choices and progress story
- ✅ Update game state (stats, inventory)
- ✅ Save game functionality
- ✅ List saved games
- ✅ List play sessions

### 7. Social Features (10 tests)
- ✅ User following system
- ✅ Story rating and reviews
- ✅ Comment system with replies
- ✅ Story bookmarking
- ✅ Social status checking (following, bookmarked)

### 8. Achievement System (3 tests)
- ✅ List all available achievements
- ✅ Get user-specific achievements
- ✅ Achievement statistics and progress

### 9. Discovery System (6 tests)
- ✅ Story discovery with filtering
- ✅ Featured stories
- ✅ Trending stories
- ✅ Personalized recommendations
- ✅ Categories and tags

### 10. Complete Workflows (2 tests)
- ✅ Full user registration to story creation workflow
- ✅ Authentication flow validation and cleanup

## Expected Test Results

When all tests pass, you should see:

```
✓ 1.1. POST /auth/register - should register a new user
✓ 1.2. POST /auth/register - should not register user with existing email  
✓ 1.3. POST /auth/login - should login with valid credentials
✓ 1.4. POST /auth/login - should not login with invalid credentials
✓ 1.5. POST /auth/refresh - should refresh access token
... (50+ more test cases)

50+ passed (X.Xs)
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Restart Docker services
   cd docker && docker compose restart
   
   # Check service status
   docker compose ps
   ```

2. **Backend Server Not Running**
   ```bash
   # Ensure backend is running on port 3000
   cd backend && npm run start:dev
   
   # Check server status
   curl http://localhost:3000/api
   ```

3. **Test Database Conflicts**
   ```bash
   # Reset test database
   cd backend && npx prisma migrate reset --force
   npx prisma db seed
   ```

4. **Rate Limiting Issues**
   ```bash
   # Tests may fail due to rate limiting - add delays or reduce parallel execution
   npx playwright test --workers=1 --project=api
   ```

### Debug Mode

Run tests with debug information:

```bash
# Run with debug output
DEBUG=pw:api npx playwright test --project=api

# Run single test with detailed logging
npx playwright test -g "should register a new user" --project=api --reporter=line
```

## API Testing Tools

### Manual Testing with curl

Test individual endpoints manually:

```bash
# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login and get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Use token for authenticated requests
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman/Insomnia

Import the API documentation to create a collection:

1. Use the base URL: `http://localhost:3000/api`
2. Import endpoints from `API_DOCUMENTATION.md`
3. Set up authentication with Bearer tokens
4. Test individual endpoints and workflows

## Test Data Management

The comprehensive test suite:

- ✅ Creates isolated test data for each test run
- ✅ Cleans up all test data after completion
- ✅ Uses unique identifiers to avoid conflicts
- ✅ Tests both success and error scenarios
- ✅ Validates response structure and data integrity

## Performance Testing

For performance testing of the API:

```bash
# Run tests with timing information
npx playwright test --project=api --reporter=json > test-results.json

# Analyze response times and identify slow endpoints
node -e "
const results = require('./test-results.json');
const tests = results.tests.map(t => ({
  title: t.title,
  duration: t.results[0]?.duration || 0
})).sort((a,b) => b.duration - a.duration);
console.table(tests.slice(0, 10));
"
```

This comprehensive testing approach ensures that all backend endpoints are thoroughly validated and working correctly with the frontend client.