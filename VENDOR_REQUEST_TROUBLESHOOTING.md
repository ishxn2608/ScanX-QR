# Vendor Request Not Showing - Complete Troubleshooting Guide

## Quick Diagnosis

Run through this checklist to identify the issue:

### ✅ Step 1: Verify You're Logged In as Admin
- [ ] Go to http://localhost:3000/login
- [ ] Login with: `Ishanacharya@gmail.com` / `SecureQR@2026`
- [ ] Should redirect to `/admin/dashboard`
- [ ] If login fails, see [Admin Account Setup](#admin-account-setup)

### ✅ Step 2: Check Debug Page
- [ ] Go to http://localhost:3000/admin/debug
- [ ] Check "Admin Check Result" shows ✅ IS ADMIN
- [ ] Check "Vendors" section shows vendor count
- [ ] Check "Errors" section is empty
- [ ] If errors appear, see [Common Errors](#common-errors)

### ✅ Step 3: Check Browser Console
- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Look for: `🔍 Setting up vendors listener...`
- [ ] Look for: `📊 Vendors snapshot received:`
- [ ] Look for: `✅ Total vendors to display:`
- [ ] If errors appear, see [Console Errors](#console-errors)

### ✅ Step 4: Check Firestore Database
- [ ] Go to Firebase Console: https://console.firebase.google.com
- [ ] Select project: `qr-verification-7fe0c`
- [ ] Go to Firestore Database
- [ ] Check if `users` collection exists
- [ ] Check if any documents have `role: "vendor"`
- [ ] If no vendors, see [Create Test Vendor](#create-test-vendor)

### ✅ Step 5: Deploy Firestore Rules
- [ ] Run: `./deploy-rules.bat`
- [ ] Or run: `firebase deploy --only firestore:rules`
- [ ] Wait for deployment to complete
- [ ] Refresh admin dashboard
- [ ] Check if vendors appear now

---

## Common Errors

### Error: "permission-denied"

**Symptoms:**
- Console shows: `permission-denied` error
- Debug page shows error in "Errors" section
- Vendors list is empty

**Cause:**
Firestore security rules are blocking admin access to users collection.

**Solution:**
1. Deploy updated Firestore rules:
   ```bash
   ./deploy-rules.bat
   ```
   Or manually:
   ```bash
   firebase deploy --only firestore:rules
   ```

2. Verify rules in Firebase Console:
   - Go to Firestore Database → Rules
   - Check if admin rules are at the top:
   ```javascript
   match /users/{userId} {
     allow read, write: if isAdmin();
     // ... other rules
   }
   ```

3. Refresh the admin dashboard

---

### Error: "No vendors found"

**Symptoms:**
- Admin dashboard shows "No vendors found"
- Debug page shows `vendors: []`
- Console shows: `✅ Total vendors to display: 0`

**Cause:**
No vendor accounts exist in the database yet.

**Solution:**
Create a test vendor account:

1. Open new incognito window (to avoid admin session)
2. Go to: http://localhost:3000/register-simple
3. Fill in the form:
   - Name: Test Vendor
   - Mobile: 9999999999
   - Email: testvendor@test.com
   - Password: test123
   - Role: **Vendor** (important!)
4. Click "Create Account"
5. Go back to admin dashboard
6. Refresh page
7. Test vendor should appear in "Pending" tab

---

### Error: "Not logged in" or "Unauthorized access"

**Symptoms:**
- Redirected to login page
- Console shows: "No auth user, redirecting to login"
- Or: "User is not admin"

**Cause:**
Either not logged in, or logged in with non-admin account.

**Solution:**
1. Make sure you're logged in with admin email: `Ishanacharya@gmail.com`
2. If you're logged in with different account:
   - Logout from current account
   - Login with admin credentials
3. If admin account doesn't exist:
   - See [Admin Account Setup](#admin-account-setup)

---

### Error: "Firebase not initialized"

**Symptoms:**
- Console shows Firebase initialization errors
- App doesn't load properly
- White screen or loading forever

**Cause:**
Missing or incorrect Firebase configuration in environment variables.

**Solution:**
1. Check `.env.local` file exists in project root
2. Verify it contains all required variables:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=qr-verification-7fe0c.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=qr-verification-7fe0c
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=qr-verification-7fe0c.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
3. Get correct values from Firebase Console:
   - Go to Project Settings → General
   - Scroll to "Your apps" section
   - Copy Firebase configuration
4. Restart development server:
   ```bash
   npm run dev
   ```

---

## Console Errors

### "Vendors listener error: Missing or insufficient permissions"

**Cause:** Firestore rules blocking access  
**Solution:** Deploy updated rules (see above)

### "Failed to get document because the client is offline"

**Cause:** No internet connection or Firebase unreachable  
**Solution:** Check internet connection, verify Firebase project is active

### "Error: Cannot find module for page"

**Cause:** Build error or missing page file  
**Solution:** Restart development server: `npm run dev`

---

## Admin Account Setup

If admin account doesn't exist in Firebase Authentication:

### Create Admin Account in Firebase Console

1. Go to: https://console.firebase.google.com
2. Select project: `qr-verification-7fe0c`
3. Go to **Authentication** → **Users**
4. Click **Add User**
5. Enter:
   - Email: `Ishanacharya@gmail.com`
   - Password: `SecureQR@2026`
6. Click **Add User**
7. Copy the UID (you'll need it for next step)

### Create Admin Document in Firestore (Optional)

1. Go to **Firestore Database**
2. Click on `users` collection (create if doesn't exist)
3. Click **Add Document**
4. Set Document ID to the UID from previous step
5. Add fields:
   ```
   email: "Ishanacharya@gmail.com"
   name: "Admin"
   role: "admin"
   status: "approved"
   mobileNumber: "0000000000"
   createdAt: [Click "Add field" → Type: timestamp → Click "Set to current time"]
   approvedAt: [Click "Add field" → Type: timestamp → Click "Set to current time"]
   rejectedAt: null
   ```
6. Click **Save**

### Test Admin Login

1. Go to: http://localhost:3000/login
2. Enter:
   - Email: `Ishanacharya@gmail.com`
   - Password: `SecureQR@2026`
3. Should redirect to admin dashboard
4. Check debug page to verify everything works

---

## Create Test Vendor

To test if vendor requests appear:

### Method 1: Using Registration Page

1. Open **incognito/private window** (important!)
2. Go to: http://localhost:3000/register-simple
3. Fill form:
   - Name: `Test Vendor`
   - Mobile: `9999999999`
   - Email: `testvendor@test.com`
   - Password: `test123`
   - Role: **Vendor** ← Make sure this is selected!
4. Click "Create Account"
5. Close incognito window
6. Go back to admin dashboard
7. Refresh page
8. Check "Pending" tab

### Method 2: Using Firebase Console

1. Go to Firebase Console → Authentication
2. Create new user:
   - Email: `testvendor@test.com`
   - Password: `test123`
3. Copy the UID
4. Go to Firestore Database → `users` collection
5. Add document with ID = UID:
   ```
   email: "testvendor@test.com"
   name: "Test Vendor"
   role: "vendor"
   status: "pending"
   mobileNumber: "9999999999"
   createdAt: [current timestamp]
   approvedAt: null
   rejectedAt: null
   ```
6. Refresh admin dashboard

---

## Verification Checklist

After applying fixes, verify everything works:

### Admin Dashboard
- [ ] Can login as admin
- [ ] Dashboard loads without errors
- [ ] Stats show correct numbers
- [ ] Tabs switch correctly (Vendors, Shops, Transactions)

### Vendors Tab
- [ ] Filter buttons work (Pending, Approved, Rejected, All)
- [ ] Pending vendors appear in list
- [ ] Vendor cards show all information
- [ ] Approve button works
- [ ] Reject button works
- [ ] Real-time updates work (no refresh needed)

### Browser Console
- [ ] No red errors
- [ ] Shows: `🔍 Setting up vendors listener...`
- [ ] Shows: `📊 Vendors snapshot received:`
- [ ] Shows: `👤 Vendor found:` for each vendor
- [ ] Shows: `✅ Total vendors to display: X`

### Debug Page
- [ ] Shows admin email
- [ ] Admin Check = TRUE
- [ ] User Role = "admin"
- [ ] Vendors list populated
- [ ] No errors shown

---

## Quick Commands Reference

```bash
# Start development server
npm run dev

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Or use the script
./deploy-rules.bat

# Check Firebase login status
firebase login:list

# Login to Firebase
firebase login

# Check current project
firebase use

# Switch to correct project
firebase use qr-verification-7fe0c

# Build for production
npm run build

# Check for TypeScript errors
npm run type-check
```

---

## URLs Reference

- **Login:** http://localhost:3000/login
- **Register:** http://localhost:3000/register-simple
- **Admin Dashboard:** http://localhost:3000/admin/dashboard
- **Debug Page:** http://localhost:3000/admin/debug
- **Firebase Console:** https://console.firebase.google.com/project/qr-verification-7fe0c

---

## Files to Check

If you need to manually verify or edit:

- `lib/firestore.ts` - Firestore functions and listeners
- `lib/auth.ts` - Authentication and admin check
- `firestore.rules` - Security rules
- `.env.local` - Firebase configuration
- `app/admin/dashboard/AdminClient.tsx` - Admin dashboard component

---

## Still Not Working?

If you've tried everything and vendors still don't appear:

### Collect Debug Information

1. **Screenshot of Debug Page** (`/admin/debug`)
2. **Screenshot of Browser Console** (F12 → Console tab)
3. **Screenshot of Firestore Database** (Firebase Console → Firestore → users collection)
4. **Screenshot of Admin Dashboard** showing "No vendors found"

### Check These Specific Things

1. **Exact error message** from console
2. **Admin email** you're logged in with
3. **Number of documents** in `users` collection
4. **Any documents** with `role: "vendor"`
5. **Firestore rules** deployment status
6. **Firebase project ID** matches `qr-verification-7fe0c`

### Last Resort Solutions

1. **Clear all browser data** (cache, cookies, local storage)
2. **Restart development server** completely
3. **Reinstall dependencies**: `rm -rf node_modules && npm install`
4. **Check Firebase project status** in Firebase Console
5. **Verify billing** is enabled (if using Firestore)
6. **Create new test vendor** using Firebase Console directly

---

## Success Indicators

You'll know it's working when:

✅ Login as admin succeeds  
✅ Admin dashboard loads  
✅ Debug page shows "IS ADMIN = TRUE"  
✅ Console shows vendor listener logs  
✅ Vendors appear in dashboard  
✅ Can approve/reject vendors  
✅ Real-time updates work  
✅ No errors in console  

---

**Last Updated:** 2026-04-23  
**Status:** Complete troubleshooting guide ready
