#!/usr/bin/env node

/**
 * ScanX QR - Production Testing Script
 * 
 * This script performs automated checks on the deployed application
 * to verify all features are working correctly in production.
 */

const https = require('https');
const http = require('http');

// Configuration
const PRODUCTION_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const TEST_TIMEOUT = 10000; // 10 seconds

console.log('\n🧪 ScanX QR - Production Testing Suite\n');
console.log('='.repeat(60));
console.log(`Testing URL: ${PRODUCTION_URL}`);
console.log('='.repeat(60));

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function testPassed(testName) {
  log(`✅ ${testName}`, 'green');
  passedTests++;
  totalTests++;
}

function testFailed(testName, error) {
  log(`❌ ${testName}`, 'red');
  if (error) {
    log(`   Error: ${error}`, 'red');
  }
  failedTests++;
  totalTests++;
}

function testSkipped(testName, reason) {
  log(`⏭️  ${testName} - ${reason}`, 'yellow');
  totalTests++;
}

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const timeout = setTimeout(() => {
      reject(new Error('Request timeout'));
    }, TEST_TIMEOUT);

    protocol.get(url, options, (res) => {
      clearTimeout(timeout);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data, headers: res.headers }));
    }).on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

// Test Suite
async function runTests() {
  
  // Test 1: Homepage Accessibility
  log('\n📋 Test Suite 1: Basic Accessibility', 'cyan');
  try {
    const response = await makeRequest(PRODUCTION_URL);
    if (response.statusCode === 200) {
      testPassed('Homepage is accessible');
      
      // Check for ScanX QR branding
      if (response.data.includes('ScanX QR') || response.data.includes('ScanX')) {
        testPassed('ScanX QR branding is present');
      } else {
        testFailed('ScanX QR branding not found');
      }
      
      // Check for essential meta tags
      if (response.data.includes('<meta') && response.data.includes('viewport')) {
        testPassed('Essential meta tags present');
      } else {
        testFailed('Missing essential meta tags');
      }
    } else {
      testFailed(`Homepage returned status ${response.statusCode}`);
    }
  } catch (error) {
    testFailed('Homepage is not accessible', error.message);
  }

  // Test 2: Critical Routes
  log('\n📋 Test Suite 2: Critical Routes', 'cyan');
  const routes = [
    '/login',
    '/register-simple',
    '/admin-login',
    '/scan',
    '/vendor',
    '/admin/dashboard',
  ];

  for (const route of routes) {
    try {
      const response = await makeRequest(`${PRODUCTION_URL}${route}`);
      if (response.statusCode === 200 || response.statusCode === 302 || response.statusCode === 307) {
        testPassed(`Route ${route} is accessible`);
      } else {
        testFailed(`Route ${route} returned status ${response.statusCode}`);
      }
    } catch (error) {
      testFailed(`Route ${route} failed`, error.message);
    }
  }

  // Test 3: Static Assets
  log('\n📋 Test Suite 3: Static Assets', 'cyan');
  const assets = [
    '/favicon.svg',
  ];

  for (const asset of assets) {
    try {
      const response = await makeRequest(`${PRODUCTION_URL}${asset}`);
      if (response.statusCode === 200) {
        testPassed(`Asset ${asset} is accessible`);
      } else {
        testFailed(`Asset ${asset} returned status ${response.statusCode}`);
      }
    } catch (error) {
      testFailed(`Asset ${asset} failed`, error.message);
    }
  }

  // Test 4: Security Headers
  log('\n📋 Test Suite 4: Security Headers', 'cyan');
  try {
    const response = await makeRequest(PRODUCTION_URL);
    
    // Check for security headers
    const securityHeaders = {
      'x-frame-options': 'X-Frame-Options',
      'x-content-type-options': 'X-Content-Type-Options',
      'strict-transport-security': 'Strict-Transport-Security (HTTPS only)',
    };

    for (const [header, name] of Object.entries(securityHeaders)) {
      if (response.headers[header]) {
        testPassed(`${name} header is set`);
      } else {
        if (header === 'strict-transport-security' && !PRODUCTION_URL.startsWith('https')) {
          testSkipped(`${name} header`, 'Not applicable for HTTP');
        } else {
          testFailed(`${name} header is missing`);
        }
      }
    }
  } catch (error) {
    testFailed('Security headers check failed', error.message);
  }

  // Test 5: Performance Check
  log('\n📋 Test Suite 5: Performance', 'cyan');
  try {
    const startTime = Date.now();
    await makeRequest(PRODUCTION_URL);
    const loadTime = Date.now() - startTime;
    
    if (loadTime < 3000) {
      testPassed(`Homepage loads in ${loadTime}ms (< 3s)`);
    } else if (loadTime < 5000) {
      log(`⚠️  Homepage loads in ${loadTime}ms (acceptable but could be faster)`, 'yellow');
      passedTests++;
      totalTests++;
    } else {
      testFailed(`Homepage loads in ${loadTime}ms (too slow)`);
    }
  } catch (error) {
    testFailed('Performance check failed', error.message);
  }

  // Test 6: HTTPS Check
  log('\n📋 Test Suite 6: HTTPS Configuration', 'cyan');
  if (PRODUCTION_URL.startsWith('https://')) {
    testPassed('Application is served over HTTPS');
  } else if (PRODUCTION_URL.includes('localhost')) {
    testSkipped('HTTPS check', 'Testing on localhost');
  } else {
    testFailed('Application is not served over HTTPS');
  }

  // Test 7: Environment Variables Check
  log('\n📋 Test Suite 7: Environment Configuration', 'cyan');
  try {
    const response = await makeRequest(PRODUCTION_URL);
    
    // Check if Firebase is likely configured (look for Firebase SDK in HTML)
    if (response.data.includes('firebase') || response.data.includes('firebaseapp')) {
      testPassed('Firebase SDK appears to be loaded');
    } else {
      log('⚠️  Cannot verify Firebase SDK from HTML', 'yellow');
    }
    
    // Check for common configuration errors
    if (response.data.includes('undefined') && response.data.includes('firebase')) {
      testFailed('Possible undefined Firebase configuration detected');
    } else {
      testPassed('No obvious configuration errors detected');
    }
  } catch (error) {
    testFailed('Environment configuration check failed', error.message);
  }

  // Summary
  log('\n' + '='.repeat(60), 'cyan');
  log('\n📊 Test Summary\n', 'cyan');
  log(`Total Tests: ${totalTests}`, 'blue');
  log(`✅ Passed: ${passedTests}`, 'green');
  log(`❌ Failed: ${failedTests}`, 'red');
  log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`, 'blue');
  
  log('\n' + '='.repeat(60), 'cyan');
  
  if (failedTests === 0) {
    log('\n✅ All automated tests passed!', 'green');
    log('Proceed with manual E2E testing using E2E_TESTING_CHECKLIST.md\n', 'green');
    return 0;
  } else {
    log('\n❌ Some tests failed!', 'red');
    log('Please fix the issues before proceeding with manual testing.\n', 'red');
    return 1;
  }
}

// Manual Testing Instructions
function printManualTestingInstructions() {
  log('\n📝 Next Steps: Manual Testing', 'cyan');
  log('='.repeat(60), 'cyan');
  log('\nAutomated tests complete. Now perform manual testing:', 'yellow');
  log('\n1. Open E2E_TESTING_CHECKLIST.md', 'yellow');
  log('2. Follow each test case systematically', 'yellow');
  log('3. Mark each test as Pass/Fail', 'yellow');
  log('4. Document any issues found', 'yellow');
  log('\nKey areas to test manually:', 'yellow');
  log('  • User registration and login', 'yellow');
  log('  • Vendor approval workflow', 'yellow');
  log('  • Shop creation and QR generation', 'yellow');
  log('  • QR code scanning and verification', 'yellow');
  log('  • Admin panel functionality', 'yellow');
  log('  • Mobile responsiveness', 'yellow');
  log('  • Payment flow', 'yellow');
  log('\n' + '='.repeat(60), 'cyan');
}

// Run the tests
runTests()
  .then((exitCode) => {
    printManualTestingInstructions();
    process.exit(exitCode);
  })
  .catch((error) => {
    log('\n❌ Test suite crashed!', 'red');
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  });
