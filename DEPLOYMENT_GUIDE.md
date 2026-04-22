# ScanX QR - Production Deployment Guide

## 🚀 Step-by-Step Deployment Instructions

### Prerequisites
- Node.js 18+ installed
- Firebase project created
- Deployment platform account (Vercel/Netlify/etc.)

---

## Part 1: Firebase Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name: "ScanX QR Production"
4. Enable Google Analytics (optional)
5. Create project

### 1.2 Enable Authentication
1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password**
3. (Optional) Enable **Phone** - Requires Blaze plan

### 1.3 Create Admin Account
1. Go to **Authentication** > **Users**
2. Click "Add User"
3. Email: `Ishanacharya@gmail.com`
4. Password: `SecureQR@2026`
5. Click "Add User"

### 1.4 Setup Firestore Database
1. Go to **Firestore Database**
2. Click "Create Database"
3. Start in **Production mode**
4. Choose location (closest to your users)
5. Click "Enable"

### 1.5 Configure Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             request.auth.token.email == 'Ishanacharya@gmail.com';
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      // Anyone can read their own user document
      allow read: if isAuthenticated() && isOwner(userId);
      
      // Only the user can create their own document
      allow create: if isAuthenticated() && isOwner(userId);
      
      // Admin can read and update any user (for approval)
      allow read, update: if isAdmin();
    }
    
    // Shops collection
    match /shops/{shopId} {
      // Anyone can read shops (for QR verification)
      allow read: if true;
      
      // Only approved vendors can create shops
      allow create: if isAuthenticated() && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.status == 'approved';
      
      // Shop owner can update their own shops
      allow update: if isAuthenticated() && 
                      resource.data.ownerId == request.auth.uid;
      
      // Admin can do everything
      allow read, write: if isAdmin();
    }
    
    // Transactions collection
    match /transactions/{transactionId} {
      // Anyone can create transactions (for payments)
      allow create: if true;
      
      // Users can read their own transactions
      allow read: if isAuthenticated() && 
                    (resource.data.customerId == request.auth.uid ||
                     resource.data.shopId in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.shops);
      
      // Admin can read all transactions
      allow read: if isAdmin();
    }
  }
}
```

### 1.6 Setup Firebase Storage
1. Go to **Storage**
2. Click "Get Started"
3. Start in **Production mode**
4. Choose location
5. Click "Done"

### 1.7 Configure Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /shop-images/{userId}/{fileName} {
      // Allow authenticated users to upload their shop images
      allow write: if request.auth != null && request.auth.uid == userId;
      
      // Anyone can read shop images (for display)
      allow read: if true;
    }
  }
}
```

### 1.8 Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click web icon (</>)
4. Register app: "ScanX QR Web"
5. Copy the configuration object

---

## Part 2: Environment Configuration

### 2.1 Create Production Environment File

Create `.env.production` or configure in your deployment platform:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Application URL (your production domain)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 2.2 Verify Environment Variables
Run this command to check:
```bash
npm run build
```

If you see "undefined" errors, environment variables are not set correctly.

---

## Part 3: Build & Deploy

### Option A: Deploy to Vercel

#### 3.1 Install Vercel CLI
```bash
npm install -g vercel
```

#### 3.2 Login to Vercel
```bash
vercel login
```

#### 3.3 Deploy
```bash
# First deployment
vercel

# Production deployment
vercel --prod
```

#### 3.4 Configure Environment Variables in Vercel
1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add all variables from `.env.production`
5. Redeploy

---

### Option B: Deploy to Netlify

#### 3.1 Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### 3.2 Login to Netlify
```bash
netlify login
```

#### 3.3 Initialize
```bash
netlify init
```

#### 3.4 Configure Build Settings
- Build command: `npm run build`
- Publish directory: `.next`

#### 3.5 Add Environment Variables
```bash
netlify env:set NEXT_PUBLIC_FIREBASE_API_KEY "your_value"
# Repeat for all variables
```

#### 3.6 Deploy
```bash
netlify deploy --prod
```

---

### Option C: Deploy to Custom Server

#### 3.1 Build Application
```bash
npm run build
```

#### 3.2 Start Production Server
```bash
npm start
```

#### 3.3 Use PM2 for Process Management
```bash
npm install -g pm2
pm2 start npm --name "scanx-qr" -- start
pm2 save
pm2 startup
```

---

## Part 4: Post-Deployment Verification

### 4.1 Quick Smoke Test
1. Visit your production URL
2. Check if homepage loads
3. Try to register a test user
4. Login with test user
5. Check console for errors

### 4.2 Run Full E2E Tests
Follow the `E2E_TESTING_CHECKLIST.md` document

### 4.3 Monitor Firebase Usage
1. Go to Firebase Console
2. Check **Usage** tab
3. Monitor:
   - Authentication requests
   - Firestore reads/writes
   - Storage usage

---

## Part 5: Performance Optimization

### 5.1 Enable Caching
Add to `next.config.js`:
```javascript
module.exports = {
  // ... existing config
  
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### 5.2 Enable Compression
Most platforms (Vercel, Netlify) enable this automatically.

### 5.3 Monitor Performance
Use Google Lighthouse:
```bash
npm install -g lighthouse
lighthouse https://your-domain.com --view
```

---

## Part 6: Security Hardening

### 6.1 Enable HTTPS
- Vercel/Netlify: Automatic
- Custom server: Use Let's Encrypt

### 6.2 Configure CORS (if needed)
Add to `next.config.js`:
```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'https://your-domain.com' },
      ],
    },
  ];
}
```

### 6.3 Rate Limiting
Consider adding Firebase App Check:
1. Go to Firebase Console > App Check
2. Enable for your web app
3. Configure reCAPTCHA v3

---

## Part 7: Monitoring & Maintenance

### 7.1 Setup Error Tracking
Consider integrating:
- Sentry
- LogRocket
- Firebase Crashlytics

### 7.2 Setup Analytics
- Google Analytics
- Firebase Analytics
- Mixpanel

### 7.3 Regular Backups
1. Go to Firebase Console
2. Firestore > Import/Export
3. Schedule regular exports

---

## Part 8: Rollback Plan

### If Deployment Fails:

#### Vercel
```bash
vercel rollback
```

#### Netlify
1. Go to Deploys
2. Click on previous successful deploy
3. Click "Publish deploy"

#### Custom Server
```bash
pm2 stop scanx-qr
# Restore previous build
pm2 start scanx-qr
```

---

## Part 9: Common Issues & Solutions

### Issue 1: Firebase Connection Error
**Symptom:** "Firebase: Error (auth/configuration-not-found)"

**Solution:**
1. Check environment variables are set
2. Verify Firebase config is correct
3. Ensure Firebase services are enabled

### Issue 2: Permission Denied
**Symptom:** "Missing or insufficient permissions"

**Solution:**
1. Check Firestore security rules
2. Verify user is authenticated
3. Check user role/status

### Issue 3: QR Code Not Working
**Symptom:** QR scan shows "Shop not found"

**Solution:**
1. Check `NEXT_PUBLIC_APP_URL` is set correctly
2. Verify shop exists in Firestore
3. Check shop is enabled

### Issue 4: Slow Performance
**Symptom:** Pages load slowly

**Solution:**
1. Enable caching
2. Optimize images
3. Check Firebase query efficiency
4. Use CDN

---

## Part 10: Production Checklist

### Before Going Live
- [ ] All environment variables configured
- [ ] Firebase services enabled
- [ ] Admin account created
- [ ] Security rules configured
- [ ] Storage rules configured
- [ ] Build completes successfully
- [ ] No console errors
- [ ] HTTPS enabled
- [ ] Custom domain configured
- [ ] Error tracking setup
- [ ] Analytics setup
- [ ] Backup strategy in place

### After Going Live
- [ ] Run full E2E tests
- [ ] Monitor error logs
- [ ] Check Firebase usage
- [ ] Test on multiple devices
- [ ] Verify performance metrics
- [ ] Test payment flow
- [ ] Verify email notifications (if any)

---

## 📞 Support & Resources

### Documentation
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

### Admin Credentials
- Email: `Ishanacharya@gmail.com`
- Password: `SecureQR@2026`

### Firebase Project
- Project ID: `qr-verification-7fe0c`
- Console: https://console.firebase.google.com/

---

## 🎉 Deployment Complete!

Your ScanX QR application is now live in production!

**Next Steps:**
1. Complete E2E testing checklist
2. Monitor for any issues
3. Gather user feedback
4. Plan for future updates

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-22
