# Admin Account Setup Instructions

## Current Issue
You're logged in as admin (email shows in navbar) but the dashboard is asking to create an account. This means:
- ✅ Admin account exists in Firebase Authentication
- ❌ Admin account might not have proper permissions or Firestore document

## Solution: Manual Admin Setup in Firebase Console

### Step 1: Verify Admin Account in Firebase Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **qr-verification-7fe0c**
3. Click **Authentication** in the left sidebar
4. Click **Users** tab
5. Look for: **Ishanacharya@gmail.com**

### Step 2: If Admin Account Doesn't Exist
If you don't see the admin email, create it:
1. Click **Add User** button
2. Enter:
   - Email: `Ishanacharya@gmail.com`
   - Password: `SecureQR@2026`
3. Click **Add User**

### Step 3: Get Admin UID
1. Find the admin user in the list
2. Click on the user
3. Copy the **User UID** (it looks like: `abc123xyz456...`)

### Step 4: Create Admin Document in Firestore
1. Go to **Firestore Database** in the left sidebar
2. Click on the **users** collection (create it if it doesn't exist)
3. Click **Add Document**
4. Set **Document ID** to the Admin UID you copied
5. Add these fields:

```
Field Name       | Type      | Value
-----------------|-----------|---------------------------
email            | string    | Ishanacharya@gmail.com
name             | string    | Admin
role             | string    | admin
status           | string    | approved
createdAt        | timestamp | (click "Set to current time")
approvedAt       | timestamp | (click "Set to current time")
rejectedAt       | timestamp | null
mobileNumber     | string    | (leave empty or add number)
```

6. Click **Save**

### Step 5: Set Up Firestore Security Rules
1. Go to **Firestore Database** → **Rules** tab
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.email == 'Ishanacharya@gmail.com';
    }
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      // Anyone can read their own user document
      allow read: if isAuthenticated() && isOwner(userId);
      
      // Admin can read all users
      allow read: if isAdmin();
      
      // Users can create their own document during registration
      allow create: if isAuthenticated() && isOwner(userId);
      
      // Users can update their own document
      allow update: if isAuthenticated() && isOwner(userId);
      
      // Admin can update any user (for approval/rejection)
      allow update: if isAdmin();
      
      // No one can delete users
      allow delete: if false;
    }
    
    // Shops collection
    match /shops/{shopId} {
      // Anyone can read shops (for QR verification)
      allow read: if true;
      
      // Only approved vendors can create shops
      allow create: if isAuthenticated() && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'vendor' &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.status == 'approved';
      
      // Shop owners can update their shops
      allow update: if isAuthenticated() && 
                      resource.data.ownerId == request.auth.uid;
      
      // Admin can update any shop (for verification)
      allow update: if isAdmin();
      
      // Shop owners can delete their shops
      allow delete: if isAuthenticated() && 
                      resource.data.ownerId == request.auth.uid;
    }
    
    // Transactions collection
    match /transactions/{transactionId} {
      // Anyone can create transactions (for payments)
      allow create: if true;
      
      // Users can read their own transactions
      allow read: if isAuthenticated();
      
      // Admin can read all transactions
      allow read: if isAdmin();
      
      // No one can update or delete transactions
      allow update, delete: if false;
    }
  }
}
```

3. Click **Publish**

### Step 6: Test Admin Login
1. Logout from the app
2. Go to `/admin-login`
3. Login with:
   - Email: `Ishanacharya@gmail.com`
   - Password: `SecureQR@2026`
4. You should now see the admin dashboard with vendor requests

## Troubleshooting

### Issue: "Admin account not found"
- The admin email doesn't exist in Firebase Authentication
- Follow Step 2 to create it

### Issue: "Unauthorized access"
- The admin document doesn't exist in Firestore
- Follow Step 4 to create it

### Issue: "Permission denied" errors
- Firestore security rules are too restrictive
- Follow Step 5 to update them

### Issue: Vendor approval not working
- Check browser console for errors
- Verify Firestore rules allow admin to update users
- Make sure you're logged in as admin

## Quick Test Commands

After setup, test these in browser console (F12):

```javascript
// Check current user
firebase.auth().currentUser.email

// Check if admin
firebase.auth().currentUser.email === 'Ishanacharya@gmail.com'
```

## Need Help?

If you're still having issues:
1. Check browser console (F12) for error messages
2. Check Firebase Console → Firestore → Usage tab for permission errors
3. Verify all steps above were completed correctly
