# Vercel Deployment Guide

## ✅ Build Fixed!
Your build is now working successfully. Follow these steps to deploy:

## Step 1: Deploy to Vercel

Run this command in your terminal:

```bash
vercel --prod
```

When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → ishxn2608's projects
- **Link to existing project?** → Yes (select: secure-upi-payment)
- **Want to modify settings?** → No

## Step 2: Add Environment Variables to Vercel

After deployment, you MUST add your environment variables:

### Option A: Via Vercel Dashboard (Recommended)
1. Go to: https://vercel.com/ishxn2608s-projects/secure-upi-payment
2. Click **Settings** → **Environment Variables**
3. Add these variables (one by one):

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDA2MGu7arJFdGj9Kzb3yJv8JEx8gPze7s
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=qr-verification-7fe0c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=qr-verification-7fe0c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=qr-verification-7fe0c.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=140713435971
NEXT_PUBLIC_FIREBASE_APP_ID=1:140713435971:web:f6e2bee4cb5adafbed45f6
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

**IMPORTANT:** Update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL after deployment!

4. Click **Save** for each variable
5. Select **Production**, **Preview**, and **Development** for each

### Option B: Via Command Line
```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# Paste the value when prompted
# Select: Production, Preview, Development
# Repeat for each variable
```

## Step 3: Redeploy After Adding Variables

After adding all environment variables, redeploy:

```bash
vercel --prod
```

## Step 4: Update Firebase Configuration

Once deployed, update your Firebase settings:

1. **Firebase Console** → **Authentication** → **Settings**
2. Add your Vercel domain to **Authorized domains**:
   - `your-app-name.vercel.app`

3. **Firebase Console** → **Authentication** → **Sign-in method**
4. Enable **Phone** authentication if not already enabled

## Step 5: Test Your Deployment

Visit your production URL and test:
- ✅ User registration/login
- ✅ Admin login: `https://your-app.vercel.app/admin-login`
- ✅ Payment flow
- ✅ QR scanning

## Admin Credentials
- **Email:** Ishanacharya@gmail.com
- **Password:** Admin@123456

## Troubleshooting

### If build fails on Vercel:
```bash
# Clean and rebuild locally first
Remove-Item -Recurse -Force .next
npm run build
vercel --prod
```

### If Firebase errors occur:
- Check that all environment variables are added
- Verify Firebase domain authorization
- Ensure Phone Auth is enabled

## Quick Commands

```bash
# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Remove deployment
vercel remove secure-upi-payment
```

## Your Project Links
- **Dashboard:** https://vercel.com/ishxn2608s-projects/secure-upi-payment
- **Production URL:** Will be shown after deployment
- **Inspect URL:** https://vercel.com/ishxn2608s-projects/secure-upi-payment/6yfwnm8RegYYsmsb9Tb6zevV4ZKs

---

## 🚀 Ready to Deploy!

Run: `vercel --prod`
