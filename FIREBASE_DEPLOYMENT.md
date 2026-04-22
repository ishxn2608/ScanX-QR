# 🚀 Firebase Deployment Guide for ScanX QR

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ Node.js installed (v18 or higher)
- ✅ Firebase project created (qr-verification-7fe0c)
- ✅ Admin account created in Firebase Authentication
- ✅ Firestore and Storage enabled

---

## 🔧 Step 1: Install Firebase CLI

### Option 1: Using npm (Recommended)
```bash
npm install -g firebase-tools
```

### Option 2: Using Standalone Binary (if npm fails)
Download from: https://firebase.google.com/docs/cli#install-cli-windows

### Verify Installation
```bash
firebase --version
```

**Expected Output:** `13.x.x` or higher

---

## 🔐 Step 2: Login to Firebase

```bash
firebase login
```

This will:
1. Open your browser
2. Ask you to sign in with Google
3. Grant Firebase CLI access
4. Return to terminal with success message

**Troubleshooting:**
If browser doesn't open, use:
```bash
firebase login --no-localhost
```

---

## 🎯 Step 3: Verify Project Configuration

Check if project is linked:
```bash
firebase projects:list
```

You should see `qr-verification-7fe0c` in the list.

---

## 🔥 Step 4: Deploy Firebase Security Rules

### Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

**Expected Output:**
```
✔ Deploy complete!
```

### Deploy Storage Rules
```bash
firebase deploy --only storage:rules
```

**Expected Output:**
```
✔ Deploy complete!
```

---

## 🏗️ Step 5: Build Your Application

### Clean Previous Build
```bash
# Windows PowerShell
Remove-Item -Recurse -Force .next, out -ErrorAction SilentlyContinue

# Or manually delete .next and out folders
```

### Build for Production
```bash
npm run build
```

**Expected Output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (13/13)
✓ Finalizing page optimization
```

**Important:** This creates an `out` folder with static files.

---

## 🚀 Step 6: Deploy to Firebase Hosting

### Deploy Everything
```bash
firebase deploy
```

This deploys:
- Hosting (your website)
- Firestore rules
- Storage rules

### Deploy Only Hosting (Faster)
```bash
firebase deploy --only hosting
```

**Expected Output:**
```
=== Deploying to 'qr-verification-7fe0c'...

i  deploying hosting
i  hosting[qr-verification-7fe0c]: beginning deploy...
i  hosting[qr-verification-7fe0c]: found 100 files in out
✔  hosting[qr-verification-7fe0c]: file upload complete
i  hosting[qr-verification-7fe0c]: finalizing version...
✔  hosting[qr-verification-7fe0c]: version finalized
i  hosting[qr-verification-7fe0c]: releasing new version...
✔  hosting[qr-verification-7fe0c]: release complete

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/qr-verification-7fe0c/overview
Hosting URL: https://qr-verification-7fe0c.web.app
```

---

## 🌐 Step 7: Access Your Deployed Application

Your app will be available at:
- **Primary URL:** https://qr-verification-7fe0c.web.app
- **Alternative URL:** https://qr-verification-7fe0c.firebaseapp.com

---

## ✅ Step 8: Verify Deployment

### 1. Check Homepage
Visit: https://qr-verification-7fe0c.web.app

**Expected:**
- ✅ Page loads without errors
- ✅ ScanX QR logo visible
- ✅ All buttons work

### 2. Test Login
Visit: https://qr-verification-7fe0c.web.app/login

**Test Admin Login:**
- Email: `Ishanacharya@gmail.com`
- Password: `SecureQR@2026`
- **Expected:** Redirects to admin dashboard

### 3. Test Registration
Visit: https://qr-verification-7fe0c.web.app/register-simple

**Expected:**
- ✅ Form works
- ✅ Can create account
- ✅ Firebase Authentication works

### 4. Check Console
Open browser console (F12)

**Expected:**
- ✅ No errors
- ✅ Firebase initialized
- ✅ No "undefined" errors

---

## 🔄 Step 9: Update Environment Variables (Important!)

After deployment, update your `.env.local`:

```env
NEXT_PUBLIC_APP_URL=https://qr-verification-7fe0c.web.app
```

Then rebuild and redeploy:
```bash
npm run build
firebase deploy --only hosting
```

**Why?** QR codes need the correct production URL.

---

## 📊 Step 10: Monitor Your Deployment

### Firebase Console
Visit: https://console.firebase.google.com/project/qr-verification-7fe0c

Check:
- **Hosting:** Deployment history
- **Authentication:** User registrations
- **Firestore:** Data being saved
- **Storage:** Images being uploaded
- **Usage:** Monitor quotas

---

## 🔧 Common Issues & Solutions

### Issue 1: "Firebase command not found"
**Solution:**
```bash
# Reinstall Firebase CLI
npm install -g firebase-tools

# Or use npx
npx firebase-tools deploy
```

### Issue 2: "No space left on device"
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Clear temp files
# Delete C:\Users\ishan\AppData\Local\Temp\*

# Free up disk space
```

### Issue 3: "Build fails with export error"
**Solution:**
Check `next.config.js` has:
```javascript
output: 'export',
images: { unoptimized: true }
```

### Issue 4: "404 on page refresh"
**Solution:**
Already configured in `firebase.json`:
```json
"rewrites": [
  {
    "source": "**",
    "destination": "/index.html"
  }
]
```

### Issue 5: "Firebase rules deployment fails"
**Solution:**
```bash
# Deploy rules separately
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### Issue 6: "Images not loading"
**Solution:**
1. Check Firebase Storage rules are deployed
2. Verify images are uploaded to correct path
3. Check browser console for CORS errors

---

## 🎯 Quick Deployment Commands

### Full Deployment (First Time)
```bash
# 1. Login
firebase login

# 2. Build
npm run build

# 3. Deploy everything
firebase deploy
```

### Quick Update (After Changes)
```bash
# 1. Build
npm run build

# 2. Deploy hosting only
firebase deploy --only hosting
```

### Deploy Rules Only
```bash
firebase deploy --only firestore:rules,storage:rules
```

---

## 📱 Custom Domain Setup (Optional)

### Add Custom Domain
1. Go to Firebase Console
2. Hosting → Add custom domain
3. Enter your domain (e.g., scanxqr.com)
4. Follow DNS configuration steps
5. Wait for SSL certificate (can take 24 hours)

### Update Environment Variable
```env
NEXT_PUBLIC_APP_URL=https://scanxqr.com
```

Then rebuild and redeploy.

---

## 🔒 Security Checklist

After deployment, verify:

- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Admin account created
- [ ] HTTPS enabled (automatic)
- [ ] Security headers configured
- [ ] No API keys exposed in client
- [ ] Environment variables set correctly

---

## 📈 Performance Optimization

### Enable Caching
Already configured in `firebase.json`:
```json
"headers": [
  {
    "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|ico)",
    "headers": [
      {
        "key": "Cache-Control",
        "value": "public, max-age=31536000, immutable"
      }
    ]
  }
]
```

### Monitor Performance
1. Go to Firebase Console
2. Performance → Web
3. View metrics:
   - Page load time
   - First contentful paint
   - Time to interactive

---

## 🔄 Continuous Deployment

### Option 1: GitHub Actions
Create `.github/workflows/firebase-deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: qr-verification-7fe0c
```

### Option 2: Manual Deployment
Use the commands in "Quick Deployment Commands" section.

---

## 📊 Deployment Checklist

### Before Deployment
- [ ] Run `npm run build` successfully
- [ ] No TypeScript errors
- [ ] No console errors in dev
- [ ] Environment variables set
- [ ] Firebase rules created
- [ ] Admin account created

### During Deployment
- [ ] Firebase CLI installed
- [ ] Logged into Firebase
- [ ] Project linked correctly
- [ ] Build completes successfully
- [ ] Deploy completes successfully

### After Deployment
- [ ] Homepage loads
- [ ] Login works
- [ ] Registration works
- [ ] Admin login works
- [ ] QR generation works
- [ ] QR scanning works
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Performance acceptable

---

## 🎉 Success!

Your ScanX QR application is now deployed to Firebase!

**Your URLs:**
- **Production:** https://qr-verification-7fe0c.web.app
- **Console:** https://console.firebase.google.com/project/qr-verification-7fe0c

**Admin Access:**
- **URL:** https://qr-verification-7fe0c.web.app/login
- **Email:** Ishanacharya@gmail.com
- **Password:** SecureQR@2026

---

## 📞 Support

### Firebase Documentation
- **Hosting:** https://firebase.google.com/docs/hosting
- **CLI:** https://firebase.google.com/docs/cli
- **Troubleshooting:** https://firebase.google.com/support

### Project Information
- **Project ID:** qr-verification-7fe0c
- **Region:** Default (us-central1)
- **Plan:** Spark (Free) or Blaze (Pay-as-you-go)

---

## 🔄 Rollback (If Needed)

### View Deployment History
```bash
firebase hosting:channel:list
```

### Rollback to Previous Version
1. Go to Firebase Console
2. Hosting → Release history
3. Click on previous version
4. Click "Rollback"

---

**Last Updated:** 2026-04-22  
**Version:** 1.0  
**Status:** Ready for Deployment 🚀
