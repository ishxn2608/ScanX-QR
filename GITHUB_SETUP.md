# 🚀 GitHub Repository Setup Guide

Complete guide to create a GitHub repository and push your ScanX QR code.

## ⚠️ Git Not Installed

Git is not currently installed on your system. Follow the steps below to install and set up.

## 📋 Step-by-Step Setup

### Step 1: Install Git

**For Windows:**

1. Download Git from: https://git-scm.com/download/win
2. Run the installer
3. Use default settings (recommended)
4. **Important**: Select "Git Bash Here" option during installation
5. Restart your terminal/PowerShell after installation

**Verify Installation:**
```bash
git --version
```

### Step 2: Configure Git

Open Git Bash or PowerShell and configure your identity:

```bash
git config --global user.name "Ishan Acharya"
git config --global user.email "Ishanacharya@gmail.com"
```

Verify configuration:
```bash
git config --list
```

### Step 3: Create GitHub Repository

1. **Go to GitHub**: https://github.com
2. **Sign in** to your account (or create one)
3. **Click** the "+" icon (top right) → "New repository"
4. **Fill in details**:
   ```
   Repository name: scanx-qr
   Description: 🔐 Secure QR Payment Verification System - Next.js 15 + Firebase
   Visibility: Public (recommended) or Private
   ```
5. **IMPORTANT**: 
   - ❌ DO NOT check "Add a README file"
   - ❌ DO NOT add .gitignore
   - ❌ DO NOT choose a license
   
   (We already have these files in the project)

6. **Click** "Create repository"

### Step 4: Initialize Git in Your Project

Open **Git Bash** or **PowerShell** in your project directory:

```bash
cd C:\Users\ishan\Documents\secure-upi-payment
```

Then run these commands:

```bash
# Initialize git repository
git init

# Add all files to staging area
git add .

# Create your first commit
git commit -m "Initial commit: ScanX QR Payment Verification System

- Next.js 15 with App Router
- Firebase Authentication & Firestore
- Admin dashboard with vendor approval
- QR code generation and scanning
- Performance optimized (60% faster)
- Mobile responsive design"

# Rename branch to main
git branch -M main
```

### Step 5: Connect to GitHub

**Replace `YOUR_USERNAME` with your actual GitHub username:**

```bash
git remote add origin https://github.com/YOUR_USERNAME/scanx-qr.git
```

Example:
```bash
git remote add origin https://github.com/ishanacharya/scanx-qr.git
```

Verify remote:
```bash
git remote -v
```

### Step 6: Push to GitHub

```bash
git push -u origin main
```

**Authentication Required:**

GitHub will prompt for credentials. You need a **Personal Access Token** (PAT):

#### Creating Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Fill in:
   ```
   Note: ScanX QR Deployment
   Expiration: 90 days (or your preference)
   Scopes: ✅ repo (full control)
   ```
4. Click **"Generate token"**
5. **COPY THE TOKEN** (you won't see it again!)
6. Use this token as your password when pushing

**Push Command:**
```bash
git push -u origin main
```
- Username: `your-github-username`
- Password: `paste-your-token-here`

### Step 7: Verify Upload

1. Go to your repository: `https://github.com/YOUR_USERNAME/scanx-qr`
2. Refresh the page
3. ✅ You should see all files uploaded
4. ✅ README.md should display with project information

## 🎯 Next Steps: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to**: https://vercel.com
2. **Sign in** with GitHub
3. **Click** "Add New..." → "Project"
4. **Import** your `scanx-qr` repository
5. **Configure**:
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: out
   Install Command: npm install
   ```
6. **Add Environment Variables** (click "Environment Variables"):
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=qr-verification-7fe0c.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=qr-verification-7fe0c
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=qr-verification-7fe0c.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```
7. **Click** "Deploy"
8. **Wait** 2-3 minutes for deployment
9. **Get your URL**: `https://scanx-qr.vercel.app` (or similar)

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## 🔧 Post-Deployment Setup

### 1. Update Firebase Authorized Domains

1. Go to: https://console.firebase.google.com
2. Select your project: `qr-verification-7fe0c`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **"Add domain"**
5. Add your Vercel domain: `scanx-qr.vercel.app`

### 2. Update Environment Variable

Update `NEXT_PUBLIC_APP_URL` in Vercel:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Edit `NEXT_PUBLIC_APP_URL`
3. Set to: `https://scanx-qr.vercel.app` (your actual domain)
4. Redeploy: Deployments → Latest → "Redeploy"

### 3. Test Your Deployment

Visit your deployed URL and test:
- ✅ Landing page loads
- ✅ Login/Register works
- ✅ Admin login (Ishanacharya@gmail.com)
- ✅ Vendor registration and approval
- ✅ QR code generation
- ✅ Mobile responsiveness

## 🐛 Troubleshooting

### Git Not Recognized
```bash
# Close and reopen terminal after installing Git
# Or add Git to PATH manually
```

### Remote Already Exists
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/scanx-qr.git
```

### Push Rejected
```bash
git pull origin main --rebase
git push -u origin main
```

### Large Files Warning
```bash
# If node_modules was accidentally added
git rm -r --cached node_modules
git rm -r --cached .next
git commit -m "Remove build artifacts"
git push
```

### Authentication Failed
- Make sure you're using a **Personal Access Token**, not your password
- Token must have `repo` scope
- Copy token carefully (no extra spaces)

## 📚 Useful Git Commands

```bash
# Check repository status
git status

# View commit history
git log --oneline

# View remote repositories
git remote -v

# Create a new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Pull latest changes
git pull

# Push changes
git push

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard HEAD
```

## 🔐 Security Checklist

Before pushing to GitHub, verify:

- ✅ `.env.local` is in `.gitignore` (already done)
- ✅ `node_modules/` is in `.gitignore` (already done)
- ✅ `.next/` is in `.gitignore` (already done)
- ✅ No API keys in code
- ✅ No passwords in code
- ✅ Firebase config uses environment variables

## 📖 Additional Resources

- **Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com
- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment

## ✅ Success Checklist

- [ ] Git installed and configured
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] README.md visible on GitHub
- [ ] Deployed to Vercel
- [ ] Firebase authorized domains updated
- [ ] Environment variables configured
- [ ] Application tested in production

## 🎉 Congratulations!

Your ScanX QR application is now:
- ✅ Version controlled with Git
- ✅ Hosted on GitHub
- ✅ Deployed to production
- ✅ Ready for users

## 📞 Need Help?

- **GitHub Issues**: Open an issue in your repository
- **Vercel Support**: https://vercel.com/support
- **Developer**: [Ishan Acharya on LinkedIn](https://www.linkedin.com/in/ishan-acharya-939112295/)

---

**Built with ❤️ by Ishan Acharya**
