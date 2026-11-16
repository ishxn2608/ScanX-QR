# Admin Account Setup Guide

## Important: Admin Account in Firestore

The admin account (`Ishanacharya@gmail.com`) needs to exist in **TWO** places:

1. **Firebase Authentication** - For login
2. **Firestore Database** - For role verification (optional but recommended)

## Current Setup

### Authentication Only (Current)
The app currently checks if the email matches `Ishanacharya@gmail.com` directly in the code. This means:
- ✅ Admin can login with email/password
- ✅ Admin is recognized by email check
- ⚠️ Admin may not have a document in Firestore `users` collection

### Why This Might Cause Issues

The Firestore security rules check if a user document exists:
```javascript
function isAdmin() {
  return isAuthenticated() && 
         request.auth.token.email == 'Ishanacharya@gmail.com';
}
```

This should work even without a Firestore document, but having the document ensures consistency.

## How to Create Admin Account

### Option 1: Using Firebase Console (Recommended)

#### Step 1: Create Authentication User
1. Go to Firebase Console: https://console.firebase.google.com
2. Select project: `qr-verification-7fe0c`
3. Go to **Authentication** → **Users**
4. Click **Add User**
5. Enter:
   - Email: `Ishanacharya@gmail.com`
   - Password: `SecureQR@2026`
6. Click **Add User**

#### Step 2: Create Firestore Document (Optional but Recommended)
1. Go to **Firestore Database**
2. Navigate to `users` collection (create if doesn't exist)
3. Click **Add Document**
4. Set Document ID to the UID from Authentication (copy from Auth Users list)
5. Add these fields:
   ```
   email: "Ishanacharya@gmail.com"
   name: "Admin"
   role: "admin"
   status: "approved"
   mobileNumber: "0000000000"
   createdAt: [Current timestamp]
   approvedAt: [Current timestamp]
   rejectedAt: null
   ```
6. Click **Save**

### Option 2: Using Registration Page (Not Recommended)

The registration page blocks admin email registration to prevent unauthorized admin creation. You must use Firebase Console.

### Option 3: Using Firebase CLI

```bash
# Install Firebase CLI if not installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Use your project
firebase use qr-verification-7fe0c

# Create admin user (requires Firebase Admin SDK script)
# This is more complex and requires a Node.js script
```

## Verify Admin Account

### Check Authentication
1. Go to Firebase Console → Authentication → Users
2. Look for `Ishanacharya@gmail.com`
3. Note the UID

### Check Firestore (if you created the document)
1. Go to Firebase Console → Firestore Database
2. Go to `users` collection
3. Look for document with ID matching the UID
4. Verify it has `role: "admin"`

### Test Login
1. Go to your app: http://localhost:3000/login
2. Enter:
   - Email: `Ishanacharya@gmail.com`
   - Password: `SecureQR@2026`
3. Should redirect to `/admin/dashboard`

### Test Debug Page
1. After logging in, go to: http://localhost:3000/admin/debug
2. Check:
   - ✅ Auth User shows your email
   - ✅ Admin Check shows TRUE
   - ✅ User Role shows "admin"
   - ✅ Firestore User shows your document (if created)

## Troubleshooting

### "User not found" Error
**Problem:** Admin account doesn't exist in Firebase Authentication  
**Solution:** Create it using Firebase Console (Option 1, Step 1)

### "Wrong password" Error
**Problem:** Password is incorrect  
**Solution:** Reset password in Firebase Console or use correct password: `SecureQR@2026`

### "Not admin" Error
**Problem:** Email doesn't match exactly  
**Solution:** Ensure email is exactly `Ishanacharya@gmail.com` (case-sensitive)

### "Permission denied" in Firestore
**Problem:** Firestore rules blocking access  
**Solution:** Deploy updated rules using `./deploy-rules.bat`

### Admin Check Returns FALSE
**Problem:** Email check failing  
**Solution:** 
1. Check `lib/auth.ts` has correct admin email
2. Verify you're logged in with exact email
3. Check browser console for auth state

## Current Admin Credentials

**Email:** Ishanacharya@gmail.com  
**Password:** SecureQR@2026

⚠️ **Important:** These credentials are hardcoded in `lib/auth.ts`. If you change them, update the file.

## Security Notes

1. **Never commit credentials** to version control
2. **Change default password** in production
3. **Use environment variables** for sensitive data
4. **Enable 2FA** in Firebase Console for admin account
5. **Regularly audit** admin access logs

## Files to Check

- `lib/auth.ts` - Contains admin email constant
- `firestore.rules` - Contains admin permission rules
- `.env.local` - Contains Firebase configuration

## Quick Test Script

After setting up admin account, test with these steps:

```bash
# 1. Start dev server
npm run dev

# 2. Open browser to login page
# http://localhost:3000/login

# 3. Login with admin credentials
# Email: Ishanacharya@gmail.com
# Password: SecureQR@2026

# 4. Should redirect to admin dashboard
# http://localhost:3000/admin/dashboard

# 5. Check debug page
# http://localhost:3000/admin/debug

# 6. Open browser console (F12)
# Look for: "Admin verified, loading dashboard"
```

## Expected Console Logs

When admin logs in successfully:
```
Auth user found: Ishanacharya@gmail.com
Admin check result: true
Admin verified, loading dashboard
🔍 Setting up vendors listener...
📊 Vendors snapshot received: { size: X, ... }
```

## If Everything Fails

1. **Delete and recreate** admin account in Firebase Console
2. **Clear browser cache** and cookies
3. **Restart development server**
4. **Check Firebase project** is correct: `qr-verification-7fe0c`
5. **Verify environment variables** in `.env.local`
6. **Check Firestore rules** are deployed correctly

---

**Last Updated:** 2026-04-23  
**Status:** Ready for setup
