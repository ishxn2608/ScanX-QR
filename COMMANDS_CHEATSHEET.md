# 📋 Git & GitHub Commands Cheatsheet

Quick reference for all commands you'll need.

## 🔧 Initial Setup (One Time Only)

### Install Git
```bash
# Download from: https://git-scm.com/download/win
# Then verify:
git --version
```

### Configure Git
```bash
git config --global user.name "Ishan Acharya"
git config --global user.email "Ishanacharya@gmail.com"

# Verify:
git config --list
```

## 🚀 First Time Push to GitHub

### Step 1: Initialize Repository
```bash
# Navigate to project
cd C:\Users\ishan\Documents\secure-upi-payment

# Initialize Git
git init

# Check status
git status
```

### Step 2: Add Files
```bash
# Add all files
git add .

# Or add specific files
git add README.md
git add app/
```

### Step 3: Create First Commit
```bash
git commit -m "Initial commit: ScanX QR Payment Verification System"
```

### Step 4: Set Main Branch
```bash
git branch -M main
```

### Step 5: Add Remote Repository
```bash
# REPLACE YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/scanx-qr.git

# Verify remote
git remote -v
```

### Step 6: Push to GitHub
```bash
git push -u origin main
```

**Authentication:**
- Username: Your GitHub username
- Password: Personal Access Token (NOT your GitHub password)

## 🔄 Regular Updates (After Initial Setup)

### Check Status
```bash
git status
```

### Add Changes
```bash
# Add all changes
git add .

# Add specific file
git add filename.tsx
```

### Commit Changes
```bash
git commit -m "Description of what you changed"
```

### Push to GitHub
```bash
git push
```

**That's it!** Vercel will automatically deploy your changes.

## 📝 Good Commit Messages

### Format
```
<type>: <short description>

<optional longer description>
```

### Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance

### Examples
```bash
git commit -m "feat: add QR code expiration feature"
git commit -m "fix: resolve admin login redirect issue"
git commit -m "docs: update deployment instructions"
git commit -m "style: format code with prettier"
git commit -m "refactor: simplify authentication logic"
```

## 🌿 Working with Branches

### Create New Branch
```bash
git checkout -b feature/new-feature
```

### Switch Branches
```bash
git checkout main
git checkout feature/new-feature
```

### List Branches
```bash
git branch
```

### Merge Branch
```bash
# Switch to main
git checkout main

# Merge feature branch
git merge feature/new-feature
```

### Delete Branch
```bash
git branch -d feature/new-feature
```

## 📊 Viewing History

### View Commits
```bash
# Short format
git log --oneline

# Detailed format
git log

# Last 5 commits
git log -5

# With graph
git log --graph --oneline
```

### View Changes
```bash
# Changes not staged
git diff

# Changes staged
git diff --staged

# Changes in specific file
git diff filename.tsx
```

## ↩️ Undoing Changes

### Undo Unstaged Changes
```bash
# Discard changes in specific file
git checkout -- filename.tsx

# Discard all changes
git checkout -- .
```

### Unstage Files
```bash
# Unstage specific file
git reset HEAD filename.tsx

# Unstage all files
git reset HEAD
```

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Undo Last Commit (Discard Changes)
```bash
git reset --hard HEAD~1
```

### Amend Last Commit
```bash
# Change commit message
git commit --amend -m "New commit message"

# Add forgotten files to last commit
git add forgotten-file.tsx
git commit --amend --no-edit
```

## 🔄 Syncing with GitHub

### Pull Latest Changes
```bash
git pull
```

### Pull with Rebase
```bash
git pull --rebase
```

### Fetch Changes (Don't Merge)
```bash
git fetch
```

## 🔍 Checking Information

### Check Remote URL
```bash
git remote -v
```

### Check Current Branch
```bash
git branch
```

### Check Git Status
```bash
git status
```

### Check Configuration
```bash
git config --list
```

## 🆘 Troubleshooting Commands

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

### Accidentally Added Large Files
```bash
git rm -r --cached node_modules
git rm -r --cached .next
git commit -m "Remove build artifacts"
git push
```

### Reset to Remote State
```bash
git fetch origin
git reset --hard origin/main
```

## 🔐 Personal Access Token

### Create Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: "ScanX QR Deployment"
4. Scopes: ✅ repo (all)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)

### Use Token
- Username: Your GitHub username
- Password: Paste your token

### Store Token (Optional)
```bash
# Cache credentials for 1 hour
git config --global credential.helper cache

# Cache credentials for 24 hours
git config --global credential.helper 'cache --timeout=86400'
```

## 📦 Common Workflows

### Daily Development Workflow
```bash
# 1. Pull latest changes
git pull

# 2. Make your changes in code editor

# 3. Check what changed
git status

# 4. Add changes
git add .

# 5. Commit changes
git commit -m "feat: add new feature"

# 6. Push to GitHub
git push
```

### Feature Branch Workflow
```bash
# 1. Create feature branch
git checkout -b feature/amazing-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add amazing feature"

# 3. Push feature branch
git push -u origin feature/amazing-feature

# 4. Create Pull Request on GitHub

# 5. After merge, switch back to main
git checkout main
git pull

# 6. Delete feature branch
git branch -d feature/amazing-feature
```

### Hotfix Workflow
```bash
# 1. Create hotfix branch from main
git checkout main
git checkout -b hotfix/critical-bug

# 2. Fix the bug
git add .
git commit -m "fix: resolve critical bug"

# 3. Push and merge
git push -u origin hotfix/critical-bug

# 4. After merge, pull latest
git checkout main
git pull
```

## 🎯 Quick Reference

### Most Used Commands
```bash
git status              # Check status
git add .               # Add all changes
git commit -m "msg"     # Commit with message
git push                # Push to GitHub
git pull                # Pull from GitHub
git log --oneline       # View history
git branch              # List branches
git checkout -b name    # Create branch
```

### Emergency Commands
```bash
git reset --hard HEAD   # Discard all changes
git clean -fd           # Remove untracked files
git stash               # Temporarily save changes
git stash pop           # Restore stashed changes
```

## 📚 Learn More

- **Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com
- **Interactive Tutorial**: https://learngitbranching.js.org/
- **Git Cheat Sheet**: https://education.github.com/git-cheat-sheet-education.pdf

## 💡 Pro Tips

1. **Commit often**: Small, frequent commits are better
2. **Write clear messages**: Future you will thank you
3. **Pull before push**: Avoid conflicts
4. **Use branches**: Keep main branch stable
5. **Review before commit**: Use `git status` and `git diff`

---

**Keep this cheatsheet handy!** 📌

**Built with ❤️ by Ishan Acharya**
