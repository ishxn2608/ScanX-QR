#!/bin/bash

# ScanX QR - Firebase Deployment Script
# This script automates the deployment process

echo "🚀 ScanX QR - Firebase Deployment"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check if Firebase CLI is installed
echo "📋 Step 1: Checking Firebase CLI..."
if ! command -v firebase &> /dev/null
then
    echo -e "${RED}❌ Firebase CLI not found${NC}"
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install Firebase CLI${NC}"
        echo "Please install manually: npm install -g firebase-tools"
        exit 1
    fi
fi
echo -e "${GREEN}✅ Firebase CLI installed${NC}"
echo ""

# Step 2: Check if logged in
echo "📋 Step 2: Checking Firebase login..."
firebase projects:list &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Not logged in to Firebase${NC}"
    echo "Opening login..."
    firebase login
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Firebase login failed${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✅ Logged in to Firebase${NC}"
echo ""

# Step 3: Clean previous build
echo "📋 Step 3: Cleaning previous build..."
rm -rf .next out
echo -e "${GREEN}✅ Cleaned${NC}"
echo ""

# Step 4: Build application
echo "📋 Step 4: Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build successful${NC}"
echo ""

# Step 5: Deploy to Firebase
echo "📋 Step 5: Deploying to Firebase..."
firebase deploy
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Deployment successful${NC}"
echo ""

# Success message
echo "=================================="
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo "Your app is live at:"
echo "https://qr-verification-7fe0c.web.app"
echo ""
echo "Admin Login:"
echo "Email: Ishanacharya@gmail.com"
echo "Password: SecureQR@2026"
echo ""
echo "=================================="
