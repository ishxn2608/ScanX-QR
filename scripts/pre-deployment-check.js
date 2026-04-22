#!/usr/bin/env node

/**
 * ScanX QR - Pre-Deployment Verification Script
 * 
 * This script checks if the application is ready for production deployment
 * by verifying environment variables, build configuration, and dependencies.
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 ScanX QR - Pre-Deployment Verification\n');
console.log('='.repeat(50));

let errors = [];
let warnings = [];
let passed = 0;

// Color codes for terminal output
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

function checkPassed(message) {
  log(`✅ ${message}`, 'green');
  passed++;
}

function checkFailed(message) {
  log(`❌ ${message}`, 'red');
  errors.push(message);
}

function checkWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
  warnings.push(message);
}

// Check 1: Environment Variables
log('\n📋 Checking Environment Variables...', 'cyan');

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_APP_URL',
];

// Try to load .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  requiredEnvVars.forEach(varName => {
    if (envContent.includes(varName)) {
      checkPassed(`${varName} is configured`);
    } else {
      checkFailed(`${varName} is missing`);
    }
  });
} else {
  checkWarning('.env.local file not found - ensure environment variables are set in deployment platform');
}

// Check 2: Firebase Configuration
log('\n🔥 Checking Firebase Configuration...', 'cyan');

const firebaseConfigPath = path.join(process.cwd(), 'lib', 'firebase.ts');
if (fs.existsSync(firebaseConfigPath)) {
  const firebaseConfig = fs.readFileSync(firebaseConfigPath, 'utf8');
  
  if (firebaseConfig.includes('process.env.NEXT_PUBLIC_FIREBASE_API_KEY')) {
    checkPassed('Firebase config uses environment variables');
  } else {
    checkWarning('Firebase config might have hardcoded values');
  }
  
  if (firebaseConfig.includes('getAuth') && firebaseConfig.includes('getFirestore') && firebaseConfig.includes('getStorage')) {
    checkPassed('All Firebase services initialized');
  } else {
    checkFailed('Some Firebase services are not initialized');
  }
} else {
  checkFailed('Firebase configuration file not found');
}

// Check 3: Admin Credentials
log('\n👤 Checking Admin Configuration...', 'cyan');

const authPath = path.join(process.cwd(), 'lib', 'auth.ts');
if (fs.existsSync(authPath)) {
  const authContent = fs.readFileSync(authPath, 'utf8');
  
  if (authContent.includes('Ishanacharya@gmail.com')) {
    checkPassed('Admin email is configured');
  } else {
    checkFailed('Admin email not found in auth.ts');
  }
  
  if (authContent.includes('SecureQR@2026')) {
    checkPassed('Admin password is configured');
  } else {
    checkWarning('Admin password not found - ensure it\'s set in Firebase Console');
  }
} else {
  checkFailed('Auth configuration file not found');
}

// Check 4: Required Files
log('\n📁 Checking Required Files...', 'cyan');

const requiredFiles = [
  'package.json',
  'next.config.js',
  'tsconfig.json',
  'tailwind.config.ts',
  'app/layout.tsx',
  'app/page.tsx',
  'lib/firebase.ts',
  'lib/auth.ts',
  'lib/firestore.ts',
  'lib/types.ts',
];

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    checkPassed(`${file} exists`);
  } else {
    checkFailed(`${file} is missing`);
  }
});

// Check 5: Dependencies
log('\n📦 Checking Dependencies...', 'cyan');

const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const requiredDeps = [
    'next',
    'react',
    'react-dom',
    'firebase',
    'framer-motion',
    'qrcode.react',
    'react-hot-toast',
    'uuid',
  ];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      checkPassed(`${dep} is installed`);
    } else {
      checkFailed(`${dep} is missing from dependencies`);
    }
  });
  
  // Check scripts
  if (packageJson.scripts && packageJson.scripts.build) {
    checkPassed('Build script is configured');
  } else {
    checkFailed('Build script is missing');
  }
} else {
  checkFailed('package.json not found');
}

// Check 6: TypeScript Configuration
log('\n📘 Checking TypeScript Configuration...', 'cyan');

const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
  try {
    const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
    // Remove comments from JSON (simple approach)
    const cleanedContent = tsconfigContent.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
    const tsconfig = JSON.parse(cleanedContent);
    
    if (tsconfig.compilerOptions && tsconfig.compilerOptions.strict) {
      checkPassed('Strict mode is enabled');
    } else {
      checkWarning('TypeScript strict mode is not enabled');
    }
    
    checkPassed('tsconfig.json is valid');
  } catch (error) {
    checkWarning('Could not parse tsconfig.json (might have comments)');
    checkPassed('tsconfig.json exists');
  }
} else {
  checkFailed('tsconfig.json not found');
}

// Check 7: Build Test
log('\n🔨 Checking Build Configuration...', 'cyan');

const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  checkPassed('next.config.js exists');
  
  const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  if (nextConfig.includes('reactStrictMode')) {
    checkPassed('React Strict Mode is configured');
  } else {
    checkWarning('React Strict Mode is not enabled');
  }
} else {
  checkFailed('next.config.js not found');
}

// Check 8: Security
log('\n🔒 Checking Security Configuration...', 'cyan');

const firestorePath = path.join(process.cwd(), 'lib', 'firestore.ts');
if (fs.existsSync(firestorePath)) {
  const firestoreContent = fs.readFileSync(firestorePath, 'utf8');
  
  if (firestoreContent.includes('isAdminEmail')) {
    checkPassed('Admin email validation is implemented');
  } else {
    checkWarning('Admin email validation might be missing');
  }
  
  if (firestoreContent.includes('Only approved vendors can create shops')) {
    checkPassed('Vendor approval check is implemented');
  } else {
    checkWarning('Vendor approval check might be missing');
  }
}

// Check 9: Route Structure
log('\n🛣️  Checking Route Structure...', 'cyan');

const routes = [
  'app/page.tsx',
  'app/(auth)/login/page.tsx',
  'app/(auth)/register-simple/page.tsx',
  'app/(auth)/admin-login/page.tsx',
  'app/vendor/page.tsx',
  'app/admin/dashboard/page.tsx',
  'app/scan/page.tsx',
  'app/pay/page.tsx',
];

routes.forEach(route => {
  const routePath = path.join(process.cwd(), route);
  if (fs.existsSync(routePath)) {
    checkPassed(`Route ${route} exists`);
  } else {
    checkFailed(`Route ${route} is missing`);
  }
});

// Check 10: Components
log('\n🧩 Checking Components...', 'cyan');

const components = [
  'components/Navbar.tsx',
  'components/ScanXLogo.tsx',
];

components.forEach(component => {
  const componentPath = path.join(process.cwd(), component);
  if (fs.existsSync(componentPath)) {
    checkPassed(`Component ${component} exists`);
  } else {
    checkWarning(`Component ${component} is missing`);
  }
});

// Summary
log('\n' + '='.repeat(50), 'cyan');
log('\n📊 Verification Summary\n', 'cyan');

log(`✅ Passed: ${passed}`, 'green');
log(`⚠️  Warnings: ${warnings.length}`, 'yellow');
log(`❌ Errors: ${errors.length}`, 'red');

if (errors.length > 0) {
  log('\n❌ Critical Issues Found:', 'red');
  errors.forEach((error, index) => {
    log(`   ${index + 1}. ${error}`, 'red');
  });
}

if (warnings.length > 0) {
  log('\n⚠️  Warnings:', 'yellow');
  warnings.forEach((warning, index) => {
    log(`   ${index + 1}. ${warning}`, 'yellow');
  });
}

log('\n' + '='.repeat(50), 'cyan');

if (errors.length === 0) {
  log('\n✅ Pre-deployment checks passed!', 'green');
  log('Your application is ready for deployment.\n', 'green');
  process.exit(0);
} else {
  log('\n❌ Pre-deployment checks failed!', 'red');
  log('Please fix the errors above before deploying.\n', 'red');
  process.exit(1);
}
