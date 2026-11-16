# Vendor Request Not Showing - Debug Guide

## Issue
Pending vendor requests are not appearing in the admin dashboard.

## Changes Made

### 1. Enhanced Logging in `lib/firestore.ts`
Added detailed console logging to the `onVendorsChange()` function to track:
- When the listener is set up
- Snapshot data received
- Each vendor document found
- Any errors that occur

### 2. Fixed Firestore Security Rules
Updated `firestore.rules` to ensure admin has priority access:
- Admin rules are now checked FIRST (before other rules)
- This ensures `Ishanacharya@gmail.com` can read all users

### 3. Debugging Steps

#### Step 1: Check Browser Console
1. Open the admin dashboard at `/admin/dashboard`
2. Open browser DevTools (F12)
3. Go to Console tab
4. Look for these log messages:
   - `🔍 Setting up vendors listener...`
   - `📊 Vendors snapshot received:`
   - `👤 Vendor found:` (for each vendor)
   - `✅ Total vendors to display:`

#### Step 2: Check for Errors
Look for any of these error messages:
- `❌ Vendors listener error:`
- `permission-denied` - Firestore rules blocking access
- `not-found` - Collection doesn't exist
- `unauthenticated` - User not logged in

#### Step 3: Verify Admin Authentication
Check the console for:
- `Auth user found: Ishanacharya@gmail.com`
- `Admin check result: true`
- `Admin verified, loading dashboard`

If you see `User is not admin`, the admin check is failing.

#### Step 4: Check Firestore Database
1. Go to Firebase Console: https://console.firebase.google.com
2. Select project: `qr-verification-7fe0c`
3. Go to Firestore Database
4. Check if `users` collection exists
5. Look for documents with:
   - `role: "vendor"`
   - `status: "pending"`

#### Step 5: Test Creating a New Vendor
1. Open a new incognito window
2. Go to `/register-simple`
3. Create a new vendor account with:
   - Name: Test Vendor
   - Mobile: 9999999999
   - Email: testvendor@test.com
   - Password: test123
   - Role: Vendor
4. Check if this vendor appears in admin dashboard
5. Check browser console for logs

### 4. Common Issues and Solutions

#### Issue: "permission-denied" Error
**Solution:** Deploy updated Firestore rules
```bash
firebase deploy --only firestore:rules
```

#### Issue: No vendors in database
**Solution:** Create a test vendor account using registration page

#### Issue: Admin check failing
**Solution:** Verify you're logged in with `Ishanacharya@gmail.com`

#### Issue: Listener not triggering
**Solution:** Check if Firebase is initialized properly
- Look for Firebase initialization errors in console
- Verify `.env.local` has correct Firebase config

### 5. Manual Firestore Rules Deployment

If automatic deployment doesn't work:

1. Go to Firebase Console
2. Navigate to Firestore Database → Rules
3. Copy the content from `firestore.rules`
4. Paste into the Rules editor
5. Click "Publish"

### 6. Verify Environment Variables

Check `.env.local` has these variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=qr-verification-7fe0c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=qr-verification-7fe0c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=qr-verification-7fe0c.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 7. Next Steps

After checking the console logs, you'll see one of these scenarios:

**Scenario A: No logs at all**
- Firebase not initialized
- Check `.env.local` configuration
- Restart development server

**Scenario B: Logs show "0 vendors found"**
- No vendors in database
- Create a test vendor account
- Check Firestore Database in Firebase Console

**Scenario C: "permission-denied" error**
- Firestore rules blocking access
- Deploy updated rules: `firebase deploy --only firestore:rules`
- Or manually update rules in Firebase Console

**Scenario D: Vendors found but not displayed**
- Check filter settings (should be on "pending")
- Check if vendors have correct `status` field
- Verify `filteredVendors` array in React DevTools

## Quick Test Commands

```bash
# Restart development server
npm run dev

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Check Firebase project
firebase projects:list

# Check current project
firebase use
```

## Contact Points

If issue persists, provide:
1. Screenshot of browser console logs
2. Screenshot of Firestore Database (users collection)
3. Screenshot of admin dashboard showing "No vendors found"
4. Any error messages from console
