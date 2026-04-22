#!/bin/bash

echo "========================================"
echo "  PUSH SCANX QR TO GITHUB"
echo "========================================"
echo ""

# Check if Git is available
if ! command -v git &> /dev/null; then
    echo "ERROR: Git is not installed"
    echo "Please install Git and try again"
    exit 1
fi

echo "Git found! Proceeding..."
echo ""

# Prompt for GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "ERROR: GitHub username cannot be empty"
    exit 1
fi

echo ""
echo "========================================"
echo "  CONFIGURATION"
echo "========================================"
echo "Repository: scanx-qr"
echo "Username: $GITHUB_USERNAME"
echo "Remote URL: https://github.com/$GITHUB_USERNAME/scanx-qr.git"
echo ""

# Check if remote already exists
if git remote get-url origin &> /dev/null; then
    echo "Remote 'origin' already exists. Removing..."
    git remote remove origin
fi

# Add remote
echo "Adding remote repository..."
git remote add origin "https://github.com/$GITHUB_USERNAME/scanx-qr.git"

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to add remote repository"
    exit 1
fi

echo "Remote added successfully!"
echo ""

# Verify remote
echo "Verifying remote..."
git remote -v
echo ""

# Push to GitHub
echo "========================================"
echo "  PUSHING TO GITHUB"
echo "========================================"
echo ""
echo "You will be prompted for credentials:"
echo "  Username: $GITHUB_USERNAME"
echo "  Password: Use your Personal Access Token (NOT your password)"
echo ""
echo "If you don't have a token, create one at:"
echo "https://github.com/settings/tokens"
echo ""
read -p "Press Enter to continue..."

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "  SUCCESS!"
    echo "========================================"
    echo ""
    echo "Your code has been pushed to GitHub!"
    echo ""
    echo "View your repository at:"
    echo "https://github.com/$GITHUB_USERNAME/scanx-qr"
    echo ""
    echo "Next steps:"
    echo "1. Verify files on GitHub"
    echo "2. Deploy to Vercel"
    echo "3. Configure Firebase"
    echo ""
else
    echo ""
    echo "========================================"
    echo "  PUSH FAILED"
    echo "========================================"
    echo ""
    echo "Common issues:"
    echo "1. Wrong username or token"
    echo "2. Repository doesn't exist on GitHub"
    echo "3. Network connection issues"
    echo ""
    echo "Please check and try again."
    echo ""
fi
