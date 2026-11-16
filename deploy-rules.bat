@echo off
echo ========================================
echo Deploying Firestore Rules
echo ========================================
echo.

echo Checking Firebase CLI...
firebase --version
if errorlevel 1 (
    echo ERROR: Firebase CLI not installed
    echo Install it with: npm install -g firebase-tools
    pause
    exit /b 1
)

echo.
echo Current Firebase project:
firebase use

echo.
echo Deploying Firestore rules...
firebase deploy --only firestore:rules

if errorlevel 1 (
    echo.
    echo ERROR: Failed to deploy rules
    echo.
    echo Troubleshooting:
    echo 1. Make sure you're logged in: firebase login
    echo 2. Check if project is set: firebase use qr-verification-7fe0c
    echo 3. Verify firestore.rules file exists
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ Firestore rules deployed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Go to /admin/debug to test the connection
echo 2. Check browser console for any errors
echo 3. Try creating a test vendor account
echo.
pause
