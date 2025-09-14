# Text-Based Adventure Platform - Test Suite

This directory contains comprehensive end-to-end (E2E) and API tests for the Text-Based Adventure Platform.

## Test Structure

```
tests/
├── package.json          # Test dependencies and scripts
├── playwright.config.ts  # Playwright E2E test configuration
├── api/                  # API tests
│   ├── jest.config.js    # Jest configuration for API tests
│   ├── setup.ts          # Test setup and teardown
│   ├── auth.test.ts      # Authentication API tests
│   ├── stories.test.ts   # Stories API tests
│   └── nodes.test.ts     # Nodes API tests
└── e2e/                  # End-to-end tests
    ├── auth.spec.ts      # Authentication E2E tests
    └── story-management.spec.ts # Story creation/editing E2E tests
```

## Prerequisites

Before running tests, ensure you have:

1. **Database**: PostgreSQL running with the application database
2. **Backend**: Running on `http://localhost:3000`
3. **Frontend**: Running on `http://localhost:5173`
4. **Default Test User**: Automatically created on backend startup (`test@example.com` / `password123`)

## Setup

1. Install dependencies:
```bash
cd tests
npm install
npm run install-playwright
```

2. Ensure the backend and frontend are running:
```bash
# Terminal 1 - Backend
cd ../backend
npm run start:dev

# Terminal 2 - Frontend
cd ../frontend
npm run dev
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run API Tests Only
```bash
npm run test:api
```

### Run E2E Tests Only
```bash
npm run test:e2e
```

### Run E2E Tests with UI
```bash
npm run test:e2e:ui
```

### Run E2E Tests in Headed Mode
```bash
npm run test:e2e:headed
```

## Test Coverage

### API Tests (`tests/api/`)

#### Authentication (`auth.test.ts`)
- ✅ User registration
- ✅ User login with valid credentials
- ✅ Login rejection with invalid credentials
- ✅ Duplicate email registration prevention

#### Stories (`stories.test.ts`)
- ✅ Story creation
- ✅ Story listing (public stories)
- ✅ Story retrieval by ID
- ✅ Story updating
- ✅ Story publishing
- ✅ Authentication requirements

#### Nodes (`nodes.test.ts`)
- ✅ Node creation with content, character, and background
- ✅ Node listing by story
- ✅ Node retrieval by ID
- ✅ Node updating
- ✅ Story ownership validation

### E2E Tests (`tests/e2e/`)

#### Authentication Flow (`auth.spec.ts`)
- ✅ User registration through UI
- ✅ User login through UI
- ✅ Error handling for invalid credentials

#### Story Management (`story-management.spec.ts`)
- ✅ Story creation through editor
- ✅ Node creation and editing
- ✅ Choice creation between nodes
- ✅ Story publishing
- ✅ Story playing in player interface

## Test Data

The tests use a default user account that is automatically created when the backend starts:

- **Email**: `test@example.com`
- **Password**: `password123`
- **Username**: `testuser`
- **Display Name**: `Test User`

## Configuration

### Playwright Configuration (`playwright.config.ts`)
- Runs tests in parallel across multiple browsers
- Automatically starts backend and frontend servers
- Configured for Chromium, Firefox, and WebKit
- Generates HTML reports

### Jest Configuration (`api/jest.config.js`)
- Uses TypeScript with `ts-jest`
- Runs API tests with proper setup/teardown
- Includes coverage reporting

## Browser Support

Tests run on:
- **Chromium** (Chrome/Edge)
- **Firefox**
- **WebKit** (Safari)

## CI/CD Integration

The test suite is designed to work in CI/CD pipelines:

1. Start database service
2. Run backend migrations
3. Start backend server
4. Start frontend server
5. Run test suite
6. Generate reports

## Troubleshooting

### Database Connection Issues
Ensure PostgreSQL is running and the `DATABASE_URL` environment variable is set correctly.

### CORS Issues
The backend is configured to allow requests from `http://localhost:5173` (Vite dev server).

### Browser Dependencies
If you encounter browser dependency issues, ensure your system has the required libraries or use the Docker setup.

### Test Timeouts
E2E tests may take longer on slower systems. Adjust timeouts in `playwright.config.ts` if needed.

## Contributing

When adding new tests:

1. Follow the existing naming conventions
2. Include proper setup and teardown
3. Add descriptive test names
4. Test both success and error scenarios
5. Update this README if adding new test categories
