# ⚡ Quick Start Guide - ScanX QR

Get your ScanX QR application from code to production in 15 minutes!

## 🎯 What You'll Accomplish

- ✅ Install Git
- ✅ Push code to GitHub
- ✅ Deploy to Vercel
- ✅ Configure Firebase
- ✅ Test in production

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] Node.js installed (check: `node --version`)
- [ ] npm installed (check: `npm --version`)
- [ ] Firebase project created
- [ ] GitHub account
- [ ] Vercel account (free)

## 🚀 Step-by-Step (15 Minutes)

### Step 1: Install Git (3 minutes)

**Windows:**
1. Download: https://git-scm.com/download/win
2. Run installer with default settings
3. Restart terminal

**Verify:**
```bash
git --version
```

📖 **Detailed guide**: See `GIT_INSTALL_WINDOWS.md`

### Step 2: Configure Git (1 minute)

```bash
git config --global user.name "Ishan Acharya"
git config --global user.email "Ishanacharya@gmail.com"
```

### Step 3: Create GitHub Repository (2 minutes)

1. Go to: https://github.com/new
2. Repository name: `scanx-qr`
3. Description: `🔐 Secure QR Payment Verification System`
4. Visibility: **Public**
5. **DO NOT** check any initialization options
6. Click **"Create repository"**

### Step 4: Push Code to GitHub (3 minutes)

```bash
# Navigate to project
cd C:\Users\ishan\Documents\secure-upi-payment

# Initialize Git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: ScanX QR Payment Verification System"

# Set main branch
git branch -M main

# Add remote (REPLACE YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/scanx-qr.git

# Push to GitHub
git push -u origin main
```

**Authentication:**
- Username: Your GitHub username
- Password: Personal Access Token (create at https://github.com/settings/tokens)

📖 **Detailed guide**: See `GITHUB_SETUP.md`

### Step 5: Deploy to Vercel (4 minutes)

1. **Go to**: https://vercel.com
2. **Sign in** with GitHub
3. **Click**: "Add New..." → "Project"
4. **Select**: `scanx-qr` repository
5. **Configure**:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `out`

6. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=qr-verification-7fe0c.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=qr-verification-7fe0c
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=qr-verification-7fe0c.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

7. **Click**: "Deploy"

📖 **Detailed guide**: See `DEPLOY_TO_VERCEL_NOW.md`

### Step 6: Configure Firebase (2 minutes)

1. **Go to**: https://console.firebase.google.com
2. **Select**: `qr-verification-7fe0c`
3. **Go to**: Authentication → Settings → Authorized domains
4. **Add**: Your Vercel domain (e.g., `scanx-qr.vercel.app`)

### Step 7: Update App URL (1 minute)

1. **Go to**: Vercel Dashboard → Your Project → Settings → Environment Variables
2. **Edit**: `NEXT_PUBLIC_APP_URL`
3. **Set to**: `https://scanx-qr.vercel.app` (your actual domain)
4. **Redeploy**: Deployments → Latest → "Redeploy"

### Step 8: Test Your App (2 minutes)

Visit your deployed URL and test:

- [ ] Landing page loads
- [ ] Login page works
- [ ] Register page works
- [ ] Admin login (Ishanacharya@gmail.com / SecureQR@2026)
- [ ] Vendor registration
- [ ] QR code generation
- [ ] Mobile responsive

## ✅ Success!

Your ScanX QR application is now:
- ✅ Live on the internet
- ✅ Accessible from anywhere
- ✅ Automatically deployed on every push
- ✅ Secure and production-ready

## 🔗 Your URLs

- **GitHub**: `https://github.com/YOUR_USERNAME/scanx-qr`
- **Production**: `https://scanx-qr.vercel.app` (or your custom domain)
- **Vercel Dashboard**: `https://vercel.com/dashboard`

## 📱 Share Your App

Share your production URL with:
- Potential users
- Employers (for portfolio)
- Team members
- Clients

## 🔄 Making Updates

After making changes to your code:

```bash
# Add changes
git add .

# Commit
git commit -m "Description of changes"

# Push to GitHub
git push
```

Vercel will automatically deploy your changes in 2-3 minutes!

## 🐛 Common Issues

### Git not recognized
- **Solution**: Restart terminal after installing Git

### Authentication failed
- **Solution**: Use Personal Access Token, not password

### Build failed on Vercel
- **Solution**: Check environment variables are set correctly

### Firebase auth not working
- **Solution**: Add Vercel domain to Firebase authorized domains

## 📚 Next Steps

Now that your app is live, you can:

1. **Custom Domain**: Add your own domain in Vercel settings
2. **Analytics**: Add Google Analytics or Vercel Analytics
3. **Monitoring**: Set up error tracking with Sentry
4. **SEO**: Add meta tags and sitemap
5. **Features**: Add new features and push to GitHub

## 📖 Documentation

- **Full Setup**: `GITHUB_SETUP.md`
- **Git Installation**: `GIT_INSTALL_WINDOWS.md`
- **Deployment**: `DEPLOY_TO_VERCEL_NOW.md`
- **Testing**: `E2E_TESTING_CHECKLIST.md`
- **Features**: `FEATURES.md`

## 🎓 Learning Resources

- **Git**: https://git-scm.com/doc
- **GitHub**: https://guides.github.com
- **Vercel**: https://vercel.com/docs
- **Next.js**: https://nextjs.org/docs
- **Firebase**: https://firebase.google.com/docs

## 💡 Tips

- **Commit often**: Small, frequent commits are better
- **Write good commit messages**: Describe what and why
- **Test before pushing**: Run `npm run build` locally
- **Monitor deployments**: Check Vercel dashboard for errors
- **Keep secrets safe**: Never commit `.env.local`

## 🎉 Congratulations!

You've successfully deployed a production-ready web application!

**Built with ❤️ by Ishan Acharya**

---

## 📞 Need Help?

- **GitHub Issues**: Open an issue in your repository
- **Vercel Support**: https://vercel.com/support
- **Developer**: [Ishan Acharya on LinkedIn](https://www.linkedin.com/in/ishan-acharya-939112295/)

---

**Time to celebrate! 🎊 Your app is live!**
