@echo off
REM ScanX QR - Firebase Deployment Script for Windows
REM This script automates the deployment process

echo ========================================
echo   ScanX QR - Firebase Deployment
echo ========================================
echo.

REM Step 1: Check if Firebase CLI is installed
echo [Step 1] Checking Firebase CLI...
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Firebase CLI not found
    echo Installing Firebase CLI...
    call npm install -g firebase-tools
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install Firebase CLI
        echo Please install manually: npm install -g firebase-tools
        pause
        exit /b 1
    )
)
echo [OK] Firebase CLI installed
echo.

REM Step 2: Check if logged in
echo [Step 2] Checking Firebase login...
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Not logged in to Firebase
    echo Opening login...
    call firebase login
    if %errorlevel% neq 0 (
        echo [ERROR] Firebase login failed
        pause
        exit /b 1
    )
)
echo [OK] Logged in to Firebase
echo.

REM Step 3: Clean previous build
echo [Step 3] Cleaning previous build...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
echo [OK] Cleaned
echo.

REM Step 4: Build application
echo [Step 4] Building application...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)
echo [OK] Build successful
echo.

REM Step 5: Deploy to Firebase
echo [Step 5] Deploying to Firebase...
call firebase deploy
if %errorlevel% neq 0 (
    echo [ERROR] Deployment failed
    pause
    exit /b 1
)
echo [OK] Deployment successful
echo.

REM Success message
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Your app is live at:
echo https://qr-verification-7fe0c.web.app
echo.
echo Admin Login:
echo Email: Ishanacharya@gmail.com
echo Password: SecureQR@2026
echo.
echo ========================================
echo.
pause
