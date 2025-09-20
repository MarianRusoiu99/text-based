#!/usr/bin/env node

/**
 * Quick endpoint validation script
 * Tests basic connectivity and response format for key endpoints
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testUser = {
  username: 'validation_user',
  email: 'validation@example.com',
  password: 'password123',
  displayName: 'Validation User'
};

let authToken = '';
let userId = '';

async function makeRequest(method, endpoint, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsedBody = body ? JSON.parse(body) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: parsedBody
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body,
            error: 'Failed to parse JSON'
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

function log(message, data = null) {
  console.log(`[${new Date().toISOString()}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logError(message, error = null) {
  console.log(`❌ ${message}`);
  if (error) {
    console.log(`   Error: ${error}`);
  }
}

function logWarning(message) {
  console.log(`⚠️  ${message}`);
}

async function testEndpoint(name, method, endpoint, expectedStatus = 200, data = null, useAuth = false) {
  try {
    const headers = useAuth && authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
    const response = await makeRequest(method, endpoint, data, headers);
    
    if (response.status === expectedStatus) {
      logSuccess(`${name}: ${method} ${endpoint} - Status ${response.status}`);
      return response;
    } else {
      logError(`${name}: Expected ${expectedStatus}, got ${response.status}`, response.body?.message);
      return response;
    }
  } catch (error) {
    logError(`${name}: Request failed`, error.message);
    return null;
  }
}

async function validateEndpoints() {
  log('🚀 Starting endpoint validation...');
  log(`📍 Base URL: ${BASE_URL}`);
  
  try {
    // Test 1: Health check (if available)
    log('\n📋 Testing basic connectivity...');
    const healthResponse = await makeRequest('GET', '/health').catch(() => null);
    if (healthResponse && healthResponse.status === 200) {
      logSuccess('Health check endpoint available');
    } else {
      logWarning('Health check endpoint not available (this is optional)');
    }

    // Test 2: User Registration
    log('\n📋 Testing Authentication endpoints...');
    const registerResponse = await testEndpoint(
      'Register User', 
      'POST', 
      '/auth/register', 
      201, 
      testUser
    );

    if (registerResponse && registerResponse.body.success) {
      authToken = registerResponse.body.data.accessToken;
      userId = registerResponse.body.data.user.id;
      logSuccess(`Authentication token obtained: ${authToken.substring(0, 20)}...`);
    } else {
      // Try login instead (user might already exist)
      log('Registration failed, trying login...');
      const loginResponse = await testEndpoint(
        'Login User',
        'POST',
        '/auth/login',
        200,
        { email: testUser.email, password: testUser.password }
      );

      if (loginResponse && loginResponse.body.success) {
        authToken = loginResponse.body.data.accessToken;
        userId = loginResponse.body.data.user.id;
        logSuccess(`Login successful, token obtained: ${authToken.substring(0, 20)}...`);
      } else {
        logError('Both registration and login failed');
        return;
      }
    }

    // Test 3: Get User Profile (authenticated)
    await testEndpoint(
      'Get User Profile',
      'GET',
      '/users/profile',
      200,
      null,
      true
    );

    // Test 4: Get Public User Profile
    await testEndpoint(
      'Get Public Profile',
      'GET',
      `/users/${userId}`,
      200
    );

    // Test 5: Get All Stories (public endpoint)
    log('\n📋 Testing Story endpoints...');
    await testEndpoint(
      'Get All Stories',
      'GET',
      '/stories',
      200
    );

    // Test 6: Create a Story (authenticated)
    const storyData = {
      title: 'Validation Test Story',
      description: 'A story created for endpoint validation',
      visibility: 'public',
      category: 'Test',
      tags: ['validation', 'test']
    };
    
    const createStoryResponse = await testEndpoint(
      'Create Story',
      'POST',
      '/stories',
      201,
      storyData,
      true
    );

    let storyId = null;
    if (createStoryResponse && createStoryResponse.body.success) {
      storyId = createStoryResponse.body.data.id;
      logSuccess(`Story created with ID: ${storyId}`);
    }

    // Test 7: Get RPG Templates
    log('\n📋 Testing RPG Template endpoints...');
    await testEndpoint(
      'Get RPG Templates',
      'GET',
      '/rpg-templates',
      200
    );

    // Test 8: Get Achievements
    log('\n📋 Testing Achievement endpoints...');
    await testEndpoint(
      'Get All Achievements',
      'GET',
      '/achievements',
      200
    );

    // Test 9: Get User Achievements (authenticated)
    await testEndpoint(
      'Get User Achievements',
      'GET',
      '/achievements/user',
      200,
      null,
      true
    );

    // Test 10: Discovery endpoints
    log('\n📋 Testing Discovery endpoints...');
    await testEndpoint(
      'Get Featured Stories',
      'GET',
      '/discovery/featured',
      200
    );

    await testEndpoint(
      'Get Categories',
      'GET',
      '/discovery/categories',
      200
    );

    // Test 11: Social endpoints (if story was created)
    if (storyId) {
      log('\n📋 Testing Social endpoints...');
      await testEndpoint(
        'Get Story Ratings',
        'GET',
        `/social/stories/${storyId}/ratings`,
        200
      );

      await testEndpoint(
        'Get Story Comments',
        'GET',
        `/social/stories/${storyId}/comments`,
        200
      );
    }

    // Test error scenarios
    log('\n📋 Testing error handling...');
    await testEndpoint(
      'Invalid Login',
      'POST',
      '/auth/login',
      401,
      { email: 'invalid@example.com', password: 'wrongpassword' }
    );

    await testEndpoint(
      'Unauthorized Access',
      'GET',
      '/users/profile',
      401,
      null,
      false // No auth token
    );

    await testEndpoint(
      'Non-existent Resource',
      'GET',
      '/stories/00000000-0000-0000-0000-000000000000',
      404,
      null,
      true
    );

    log('\n🎉 Endpoint validation completed!');
    log('📊 Check the results above to see which endpoints are working correctly.');
    
  } catch (error) {
    logError('Validation failed with error:', error.message);
  }
}

// Check if server is running
async function checkServerHealth() {
  try {
    const response = await makeRequest('GET', '/').catch(() => null);
    if (response) {
      logSuccess('Server is running and accessible');
      return true;
    } else {
      logError('Server is not accessible');
      return false;
    }
  } catch (error) {
    logError('Failed to connect to server', error.message);
    return false;
  }
}

async function main() {
  console.log('🔍 Text-Based Adventure Platform - Endpoint Validation');
  console.log('==================================================');
  
  const serverRunning = await checkServerHealth();
  if (!serverRunning) {
    console.log('\n💡 Make sure the backend server is running:');
    console.log('   cd backend && npm run start:dev');
    console.log('\n💡 And that Docker services are running:');
    console.log('   cd docker && docker compose up -d');
    process.exit(1);
  }

  await validateEndpoints();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { validateEndpoints, makeRequest };