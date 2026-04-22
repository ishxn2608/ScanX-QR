# 🔴 URGENT: Fix Firebase Permissions NOW

## Your Current Errors:
1. ❌ "Missing or insufficient permissions"
2. ❌ "The query requires an index"

## Quick Fix (5 minutes)

### Step 1: Update Firestore Rules (MOST IMPORTANT)

1. Go to: https://console.firebase.google.com/project/qr-verification-7fe0c/firestore/rules

2. **DELETE ALL EXISTING RULES** and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // TEMPORARY: Allow all reads and writes for testing
    // TODO: Restrict this after testing
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **PUBLISH**

4. Wait 30 seconds for rules to propagate

### Step 2: Create Required Firestore Index

The error message in your console has a link like:
```
https://console.firebase.google.com/v1/r/project/qr-verification-7fe0c/firestore/indexes?create_composite=...
```

1. **Click that link** in your browser console
2. Firebase will auto-create the index
3. Wait 2-3 minutes for "Building" to change to "Enabled"

### Step 3: Test the Fix

1. Go to: http://localhost:3001/admin/debug
2. You should see:
   - ✅ Auth User: Ishanacharya@gmail.com
   - ✅ Admin Check: TRUE
   - ✅ Vendors: List of vendors (or empty array)
   - ✅ No errors

3. Then go to: http://localhost:3001/admin/dashboard
4. Should work now!

## Why This Happened

Your Firestore has **default security rules** that block all access. The temporary rules above allow everything so you can test. After testing works, we'll add proper security rules.

## After Testing Works

Once everything works with the temporary rules, update to secure rules:

1. Go back to Firestore Rules
2. Replace with these **SECURE RULES**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper: Check if user is admin
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.email == 'Ishanacharya@gmail.com';
    }
    
    // Users collection
    match /users/{userId} {
      // Users can read their own data
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Admin can read all users
      allow read: if isAdmin();
      
      // Users can create their own document
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Admin can update any user (for approval)
      allow update: if isAdmin();
    }
    
    // Shops collection
    match /shops/{shopId} {
      // Anyone can read shops (for QR verification)
      allow read: if true;
      
      // Authenticated users can create shops
      allow create: if request.auth != null;
      
      // Shop owners and admin can update
      allow update: if request.auth != null && 
                      (resource.data.ownerId == request.auth.uid || isAdmin());
    }
    
    // Transactions collection
    match /transactions/{transactionId} {
      // Anyone can create transactions
      allow create: if true;
      
      // Authenticated users can read
      allow read: if request.auth != null;
      
      // Admin can read all
      allow read: if isAdmin();
    }
  }
}
```

3. Click **PUBLISH**

## Troubleshooting

### If you still get "permission denied":
- Clear browser cache (Ctrl + Shift + Delete)
- Logout and login again
- Wait 1-2 minutes for rules to propagate

### If you get "index required":
- Click the link in the error message
- Let Firebase create the index automatically
- Wait for index to finish building (2-3 minutes)

### If admin dashboard still doesn't work:
1. Open browser console (F12)
2. Look for red error messages
3. Share the exact error message

## Current Server Info

Your app is running at:
- **Local:** http://localhost:3001
- **Debug Page:** http://localhost:3001/admin/debug
- **Admin Dashboard:** http://localhost:3001/admin/dashboard
- **Admin Login:** http://localhost:3001/admin-login

## Quick Test Checklist

- [ ] Updated Firestore rules to allow all (temporary)
- [ ] Clicked index creation link from error
- [ ] Waited for index to build
- [ ] Visited /admin/debug - no errors
- [ ] Visited /admin/dashboard - can see vendors
- [ ] Tested vendor approval - works!
- [ ] Updated to secure rules (after testing)

## Need Help?

If still not working:
1. Take screenshot of browser console (F12)
2. Take screenshot of /admin/debug page
3. Share both screenshots
