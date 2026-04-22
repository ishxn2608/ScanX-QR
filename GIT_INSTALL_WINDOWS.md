# 🪟 Installing Git on Windows - Step by Step

## Quick Install Guide

### Step 1: Download Git

1. Open your browser
2. Go to: **https://git-scm.com/download/win**
3. The download should start automatically
4. If not, click **"Click here to download manually"**
5. Save the file (e.g., `Git-2.44.0-64-bit.exe`)

### Step 2: Run the Installer

1. **Locate** the downloaded file (usually in Downloads folder)
2. **Double-click** to run the installer
3. Click **"Yes"** if Windows asks for permission

### Step 3: Installation Options

Follow these recommended settings:

#### 1. Select Destination Location
- Keep default: `C:\Program Files\Git`
- Click **"Next"**

#### 2. Select Components
✅ Check these options:
- **Windows Explorer integration**
  - ✅ Git Bash Here
  - ✅ Git GUI Here
- **Git LFS (Large File Support)**
- **Associate .git* configuration files with the default text editor**
- **Associate .sh files to be run with Bash**

Click **"Next"**

#### 3. Select Start Menu Folder
- Keep default: `Git`
- Click **"Next"**

#### 4. Choosing the default editor
- Select: **"Use Visual Studio Code as Git's default editor"** (if you have VS Code)
- Or: **"Use Notepad as Git's default editor"** (simple option)
- Click **"Next"**

#### 5. Adjusting your PATH environment
- Select: **"Git from the command line and also from 3rd-party software"** (Recommended)
- Click **"Next"**

#### 6. Choosing HTTPS transport backend
- Select: **"Use the OpenSSL library"** (Recommended)
- Click **"Next"**

#### 7. Configuring the line ending conversions
- Select: **"Checkout Windows-style, commit Unix-style line endings"** (Recommended)
- Click **"Next"**

#### 8. Configuring the terminal emulator
- Select: **"Use MinTTY (the default terminal of MSYS2)"** (Recommended)
- Click **"Next"**

#### 9. Choose the default behavior of `git pull`
- Select: **"Default (fast-forward or merge)"** (Recommended)
- Click **"Next"**

#### 10. Choose a credential helper
- Select: **"Git Credential Manager"** (Recommended)
- Click **"Next"**

#### 11. Configuring extra options
✅ Check:
- **Enable file system caching** (Recommended)
- **Enable symbolic links**

Click **"Next"**

#### 12. Configuring experimental options
- Leave unchecked (unless you want to try experimental features)
- Click **"Install"**

### Step 4: Wait for Installation

- Installation takes 1-2 minutes
- Progress bar will show installation status

### Step 5: Complete Installation

- ✅ Check **"Launch Git Bash"** (optional)
- Click **"Finish"**

## ✅ Verify Installation

### Method 1: Using PowerShell

1. Press `Win + X`
2. Select **"Windows PowerShell"** or **"Terminal"**
3. Type:
```bash
git --version
```
4. You should see something like:
```
git version 2.44.0.windows.1
```

### Method 2: Using Git Bash

1. Right-click on Desktop or any folder
2. Select **"Git Bash Here"**
3. Type:
```bash
git --version
```

## 🔧 Configure Git

After installation, configure your identity:

### Open Git Bash or PowerShell and run:

```bash
# Set your name
git config --global user.name "Ishan Acharya"

# Set your email
git config --global user.email "Ishanacharya@gmail.com"

# Verify configuration
git config --list
```

You should see:
```
user.name=Ishan Acharya
user.email=Ishanacharya@gmail.com
```

## 🎯 Next Steps

Now that Git is installed, you can:

1. **Initialize your project**:
```bash
cd C:\Users\ishan\Documents\secure-upi-payment
git init
```

2. **Follow the GitHub setup guide**: See `GITHUB_SETUP.md`

## 🐛 Troubleshooting

### "Git is not recognized" after installation

**Solution 1: Restart Terminal**
- Close all PowerShell/Command Prompt windows
- Open a new terminal
- Try `git --version` again

**Solution 2: Restart Computer**
- Restart your computer
- Open terminal
- Try `git --version` again

**Solution 3: Add Git to PATH manually**

1. Press `Win + X` → **"System"**
2. Click **"Advanced system settings"**
3. Click **"Environment Variables"**
4. Under **"System variables"**, find **"Path"**
5. Click **"Edit"**
6. Click **"New"**
7. Add: `C:\Program Files\Git\cmd`
8. Click **"OK"** on all windows
9. Restart terminal

### Git Bash doesn't appear in right-click menu

**Solution:**
1. Run the Git installer again
2. Choose **"Repair"** or **"Modify"**
3. Make sure **"Windows Explorer integration"** is checked

### Permission denied errors

**Solution:**
- Run Git Bash or PowerShell as Administrator
- Right-click → **"Run as administrator"**

## 📚 Git Basics

Once installed, here are essential commands:

```bash
# Initialize a repository
git init

# Check status
git status

# Add files
git add .

# Commit changes
git commit -m "Your message"

# View history
git log

# Create branch
git branch branch-name

# Switch branch
git checkout branch-name

# Push to remote
git push origin main
```

## 🎓 Learning Resources

- **Official Git Documentation**: https://git-scm.com/doc
- **Git Cheat Sheet**: https://education.github.com/git-cheat-sheet-education.pdf
- **Interactive Tutorial**: https://learngitbranching.js.org/
- **GitHub Guides**: https://guides.github.com/

## ✅ Installation Complete!

You're now ready to:
- ✅ Use Git for version control
- ✅ Push code to GitHub
- ✅ Collaborate with others
- ✅ Deploy to Vercel

**Next**: Follow `GITHUB_SETUP.md` to create your repository!

---

**Need help?** Contact [Ishan Acharya on LinkedIn](https://www.linkedin.com/in/ishan-acharya-939112295/)
