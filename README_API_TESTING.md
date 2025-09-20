# Backend API Testing - Complete Setup Guide

This document provides a comprehensive guide for testing all backend API endpoints in the Text-Based Adventure Platform.

## 🚀 Quick Start

### 1. One-Command Setup
```bash
# Install root dependencies and set up development environment
npm install
npm run setup:dev

# Start backend server
npm run start:backend

# In another terminal, validate endpoints
npm run validate-endpoints

# Run comprehensive test suite
npm run test:comprehensive
```

### 2. Manual Setup (if quick start fails)

```bash
# 1. Start Docker services
cd docker && docker compose up -d

# 2. Set up backend
cd ../backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev

# 3. In another terminal, run tests
cd ../tests
npm install
npm run test:api

# 4. Or run endpoint validation
cd ..
node validate-endpoints.js
```

## 📋 What's Included

### 1. API Documentation (`API_DOCUMENTATION.md`)
Complete documentation for all 80+ endpoints including:
- Request/response formats
- Authentication requirements
- Rate limiting information
- Usage examples

### 2. Comprehensive Test Suite (`tests/api/comprehensive-api.test.ts`)
100+ test cases covering:
- ✅ Authentication flow (registration, login, token refresh)
- ✅ User management (profiles, public data)
- ✅ Story management (CRUD operations, chapters, variables, items)
- ✅ RPG template system (flexible game mechanics)
- ✅ Node and choice management (story flow)
- ✅ Player gameplay (sessions, choices, save/load)
- ✅ Social features (following, ratings, comments, bookmarks)
- ✅ Achievement system (tracking, statistics)
- ✅ Discovery system (search, featured content)

### 3. Frontend API Client Updates (`frontend/src/lib/api/`)
- Updated endpoint definitions (`endpoints.ts`)
- Comprehensive TypeScript types (`types.ts`)
- Aligned with backend implementation

### 4. Quick Validation Script (`validate-endpoints.js`)
Lightweight script to test basic endpoint connectivity and response formats.

## 🔍 Testing Options

### Option 1: Quick Validation (Recommended First)
```bash
# Test basic connectivity and key endpoints
npm run validate-endpoints
```

Expected output:
```
✅ Register User: POST /auth/register - Status 201
✅ Get User Profile: GET /users/profile - Status 200
✅ Get All Stories: GET /stories - Status 200
✅ Create Story: POST /stories - Status 201
... (more endpoints)
```

### Option 2: Comprehensive Test Suite
```bash
# Run all 100+ test cases
npm run test:comprehensive
```

Expected output:
```
✓ 1.1. POST /auth/register - should register a new user
✓ 1.2. POST /auth/register - should not register user with existing email
✓ 1.3. POST /auth/login - should login with valid credentials
... (100+ test cases)

50+ passed (X.Xs)
```

### Option 3: Specific Test Categories
```bash
cd tests

# Test authentication only
npx playwright test -g "Authentication Endpoints" --project=api

# Test story management
npx playwright test -g "Story Management" --project=api

# Test social features
npx playwright test -g "Social Features" --project=api
```

## 🛠 Troubleshooting

### Common Issues

1. **"Connection refused" or "ECONNREFUSED"**
   ```bash
   # Make sure backend server is running
   cd backend && npm run start:dev
   
   # Check if server is accessible
   curl http://localhost:3000/api
   ```

2. **"Database connection error"**
   ```bash
   # Restart Docker services
   cd docker && docker compose restart
   
   # Reset database
   cd ../backend && npx prisma migrate reset --force
   npx prisma db seed
   ```

3. **"Rate limit exceeded"**
   ```bash
   # Run tests with reduced concurrency
   cd tests && npx playwright test --workers=1 --project=api
   ```

4. **"Prisma client not generated"**
   ```bash
   cd backend && npx prisma generate
   ```

### Debug Mode

```bash
# Run validation with detailed output
DEBUG=1 node validate-endpoints.js

# Run tests with verbose output
cd tests && npx playwright test --project=api --reporter=verbose
```

## 📊 Expected Results

### Validation Script Success
When the validation script runs successfully, you should see:
- ✅ 10+ endpoints tested successfully
- ✅ Authentication flow working
- ✅ CRUD operations functional
- ✅ Error handling working correctly

### Comprehensive Test Suite Success
When all tests pass, you should see:
- ✅ 50+ test cases passed
- ✅ All endpoint categories covered
- ✅ Complete user workflows validated
- ✅ Error scenarios handled

## 🔧 Development Workflow

### For Development
1. Start services: `npm run setup:dev`
2. Start backend: `npm run start:backend`
3. Run quick validation: `npm run validate-endpoints` 
4. Make changes to backend
5. Re-run validation to verify changes work

### For CI/CD
1. Set up environment variables
2. Start Docker services
3. Run database migrations
4. Run comprehensive test suite: `npm run test:comprehensive`

## 📚 Additional Resources

- **Full API Documentation**: See `API_DOCUMENTATION.md`
- **Testing Guide**: See `TESTING_GUIDE.md`
- **Backend Code**: See `backend/src/` for controller implementations
- **Frontend Integration**: See `frontend/src/lib/api/` for client-side API integration

## 🎯 Success Criteria

✅ **All endpoints accessible and returning expected response formats**
✅ **Authentication and authorization working correctly**
✅ **CRUD operations functional for all resource types**
✅ **Error handling and validation working**
✅ **Frontend-backend API contract aligned**
✅ **Rate limiting and security measures in place**
✅ **Social features and gameplay mechanics operational**

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the detailed testing guide (`TESTING_GUIDE.md`)
3. Check the API documentation (`API_DOCUMENTATION.md`)
4. Review backend controller implementations in `backend/src/`

The comprehensive test suite validates that all backend endpoints are working correctly and aligned with the frontend client expectations.