# Firebase Security Rules

## Firestore Rules

Copy and paste these rules into Firebase Console → Firestore Database → Rules:

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
    
    // Helper function to get user data
    function getUserData(userId) {
      return get(/databases/$(database)/documents/users/$(userId)).data;
    }
    
    // Users collection
    match /users/{userId} {
      // Anyone can read their own user document
      allow read: if isAuthenticated() && isOwner(userId);
      
      // Admin can read all users
      allow read: if isAdmin();
      
      // Users can create their own document during registration
      allow create: if isAuthenticated() && isOwner(userId);
      
      // Users can update their own document (except status, role)
      allow update: if isAuthenticated() && isOwner(userId) &&
                      !request.resource.data.diff(resource.data).affectedKeys().hasAny(['status', 'role', 'approvedAt', 'rejectedAt']);
      
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
                      getUserData(request.auth.uid).role == 'vendor' &&
                      getUserData(request.auth.uid).status == 'approved';
      
      // Shop owners can update their shops (except verified status)
      allow update: if isAuthenticated() && 
                      resource.data.ownerId == request.auth.uid &&
                      !request.resource.data.diff(resource.data).affectedKeys().hasAny(['verified', 'verifiedAt']);
      
      // Admin can update any shop (including verification)
      allow update: if isAdmin();
      
      // Shop owners can delete their shops
      allow delete: if isAuthenticated() && 
                      resource.data.ownerId == request.auth.uid;
      
      // Admin can delete any shop
      allow delete: if isAdmin();
    }
    
    // Transactions collection
    match /transactions/{transactionId} {
      // Anyone can create transactions (for payments)
      allow create: if true;
      
      // Users can read their own transactions
      allow read: if isAuthenticated() && 
                    (resource.data.customerId == request.auth.uid ||
                     getUserData(request.auth.uid).role == 'vendor');
      
      // Admin can read all transactions
      allow read: if isAdmin();
      
      // No one can update or delete transactions
      allow update, delete: if false;
    }
  }
}
```

## Storage Rules (if using Firebase Storage for shop images)

Copy and paste these rules into Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.email == 'Ishanacharya@gmail.com';
    }
    
    // Shop images
    match /shops/{shopId}/{allPaths=**} {
      // Anyone can read shop images
      allow read: if true;
      
      // Authenticated users can upload images
      allow write: if request.auth != null;
      
      // Admin can delete any image
      allow delete: if isAdmin();
    }
    
    // User profile images (if needed in future)
    match /users/{userId}/{allPaths=**} {
      // Anyone can read profile images
      allow read: if true;
      
      // Users can upload their own profile images
      allow write: if request.auth != null && request.auth.uid == userId;
      
      // Admin can delete any image
      allow delete: if isAdmin();
    }
  }
}
```

## How to Apply These Rules

### Firestore Rules:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **qr-verification-7fe0c**
3. Click **Firestore Database** in left sidebar
4. Click **Rules** tab at the top
5. Delete all existing rules
6. Copy and paste the Firestore rules above
7. Click **Publish**

### Storage Rules:
1. In Firebase Console, click **Storage** in left sidebar
2. Click **Rules** tab at the top
3. Delete all existing rules
4. Copy and paste the Storage rules above
5. Click **Publish**

## Testing Rules

After applying rules, test in browser console (F12):

```javascript
// Test 1: Check if you can read users collection as admin
firebase.firestore().collection('users').get()
  .then(snap => console.log('Users:', snap.size))
  .catch(err => console.error('Error:', err));

// Test 2: Check if you can update a vendor status
firebase.firestore().collection('users').doc('VENDOR_ID').update({
  status: 'approved'
})
  .then(() => console.log('Updated!'))
  .catch(err => console.error('Error:', err));
```

## Common Issues

### "Missing or insufficient permissions"
- Make sure you're logged in as admin
- Verify the admin email matches exactly: `Ishanacharya@gmail.com`
- Check that rules are published

### "PERMISSION_DENIED"
- Rules might not be published yet (wait 1-2 minutes)
- Clear browser cache and reload
- Check Firebase Console → Firestore → Usage tab for detailed errors

### Vendor approval not working
- Check browser console for specific error
- Verify admin is logged in
- Make sure vendor document exists in Firestore
- Check that rules allow admin to update users collection
