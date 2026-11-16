@echo off
echo ========================================
echo Firebase Storage Setup Helper
echo ========================================
echo.

echo Step 1: Checking Firebase CLI...
firebase --version
if errorlevel 1 (
    echo ERROR: Firebase CLI not installed
    echo Install it with: npm install -g firebase-tools
    pause
    exit /b 1
)

echo.
echo Step 2: Checking current project...
firebase use

echo.
echo Step 3: Deploying Storage Rules...
firebase deploy --only storage

if errorlevel 1 (
    echo.
    echo ERROR: Failed to deploy storage rules
    echo.
    echo Please do this manually:
    echo 1. Go to: https://console.firebase.google.com/project/qr-verification-7fe0c/storage/rules
    echo 2. Copy content from storage.rules file
    echo 3. Paste and publish
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ Storage rules deployed!
echo ========================================
echo.
echo Next steps:
echo 1. Go to Firebase Console: https://console.firebase.google.com/project/qr-verification-7fe0c/storage
echo 2. Make sure Storage is enabled (click "Get Started" if needed)
echo 3. Restart dev server: npm run dev
echo 4. Test image upload
echo.
pause
