@echo off
echo ========================================
echo   PUSH SCANX QR TO GITHUB
echo ========================================
echo.

REM Check if Git is available
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git is not found in PATH
    echo Please restart your terminal and try again
    pause
    exit /b 1
)

echo Git found! Proceeding...
echo.

REM Prompt for GitHub username
set /p GITHUB_USERNAME="Enter your GitHub username: "

if "%GITHUB_USERNAME%"=="" (
    echo ERROR: GitHub username cannot be empty
    pause
    exit /b 1
)

echo.
echo ========================================
echo   CONFIGURATION
echo ========================================
echo Repository: scanx-qr
echo Username: %GITHUB_USERNAME%
echo Remote URL: https://github.com/%GITHUB_USERNAME%/scanx-qr.git
echo.

REM Check if remote already exists
git remote get-url origin >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Remote 'origin' already exists. Removing...
    git remote remove origin
)

REM Add remote
echo Adding remote repository...
git remote add origin https://github.com/%GITHUB_USERNAME%/scanx-qr.git

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to add remote repository
    pause
    exit /b 1
)

echo Remote added successfully!
echo.

REM Verify remote
echo Verifying remote...
git remote -v
echo.

REM Push to GitHub
echo ========================================
echo   PUSHING TO GITHUB
echo ========================================
echo.
echo You will be prompted for credentials:
echo   Username: %GITHUB_USERNAME%
echo   Password: Use your Personal Access Token (NOT your password)
echo.
echo If you don't have a token, create one at:
echo https://github.com/settings/tokens
echo.
pause

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS!
    echo ========================================
    echo.
    echo Your code has been pushed to GitHub!
    echo.
    echo View your repository at:
    echo https://github.com/%GITHUB_USERNAME%/scanx-qr
    echo.
    echo Next steps:
    echo 1. Verify files on GitHub
    echo 2. Deploy to Vercel
    echo 3. Configure Firebase
    echo.
) else (
    echo.
    echo ========================================
    echo   PUSH FAILED
    echo ========================================
    echo.
    echo Common issues:
    echo 1. Wrong username or token
    echo 2. Repository doesn't exist on GitHub
    echo 3. Network connection issues
    echo.
    echo Please check and try again.
    echo.
)

pause
