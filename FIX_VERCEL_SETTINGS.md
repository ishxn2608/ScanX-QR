# Fix Vercel Output Directory Error

## The Problem
Vercel is looking for an "out" directory, but Next.js doesn't create that. The setting is saved in your Vercel project configuration.

## Solution: Update Vercel Project Settings

### Step 1: Go to Project Settings
👉 **https://vercel.com/ishxn2608s-projects/secure-upi-payment/settings**

### Step 2: Update Build & Development Settings
1. Click on **"Build & Development Settings"** in the left sidebar
2. Find **"Output Directory"** setting
3. **CLEAR/DELETE** the "out" value (leave it empty or set to `.next`)
4. Click **"Save"**

### Step 3: Verify Other Settings
Make sure these are correct:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (or leave as default)
- **Output Directory:** *(leave empty)* or `.next`
- **Install Command:** `npm install` (or leave as default)

### Step 4: Redeploy
After saving the settings, run:

```bash
vercel --prod
```

---

## Alternative: Delete and Recreate Project

If the above doesn't work, you can start fresh:

### Option A: Via Command Line
```bash
# Remove the link to the old project
Remove-Item -Recurse -Force .vercel

# Deploy again (this will create a new project)
vercel --prod
```

When prompted:
- **Link to existing project?** → No
- **What's your project's name?** → secure-upi-payment-v2
- **Want to modify settings?** → No

### Option B: Via Dashboard
1. Go to: https://vercel.com/ishxn2608s-projects/secure-upi-payment/settings/advanced
2. Scroll to **"Delete Project"**
3. Delete the project
4. Run `vercel --prod` to create a new one

---

## After Successful Deployment

Don't forget to:
1. ✅ Add all environment variables (see VERCEL_SETUP_COMPLETE.md)
2. ✅ Add Vercel domain to Firebase Authorized Domains
3. ✅ Update `NEXT_PUBLIC_APP_URL` with your new URL
4. ✅ Redeploy: `vercel --prod`

---

## Quick Fix Command

Try this first:
```bash
Remove-Item -Recurse -Force .vercel
vercel --prod
```

This will unlink the old project and let you start fresh.
