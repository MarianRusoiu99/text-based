#!/bin/bash

# Text-Based Adventure Platform Test Runner
# This script sets up the environment and runs the test suite

set -e

echo "🚀 Setting up Text-Based Adventure Platform Test Environment"

# Check if we're in the right directory
if [ ! -d "tests" ]; then
    echo "❌ Error: tests directory not found. Please run from the project root."
    exit 1
fi

# Check if backend and frontend directories exist
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: backend or frontend directory not found."
    exit 1
fi

echo "📦 Installing test dependencies..."
cd tests
npm install
npm run install-playwright
cd ..

echo "🔧 Setting up environment..."

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env not found. Please ensure database is configured."
fi

echo "🗄️  Please ensure PostgreSQL is running and database is set up."
echo "📝 Default test user will be created automatically: test@example.com / password123"

echo ""
echo "🎯 To run tests:"
echo "1. Start backend: cd backend && npm run start:dev"
echo "2. Start frontend: cd frontend && npm run dev"
echo "3. Run tests: cd tests && npm test"
echo ""
echo "📊 Individual test commands:"
echo "- API tests only: cd tests && npm run test:api"
echo "- E2E tests only: cd tests && npm run test:e2e"
echo "- E2E with UI: cd tests && npm run test:e2e:ui"

echo ""
echo "✅ Setup complete! Ready to run tests."
