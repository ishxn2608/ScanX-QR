# 🔧 Firebase Storage Setup Guide

## Problem
Image upload is failing - images are not being uploaded to Firebase Storage.

## Root Cause
Firebase Storage is either:
1. Not enabled in your Firebase project
2. Not properly configured
3. CORS issues blocking uploads

## Solution: Enable and Configure Firebase Storage

### Step 1: Enable Firebase Storage

1. **Go to Firebase Console**
   - URL: https://console.firebase.google.com
   - Select project: `qr-verification-7fe0c`

2. **Navigate to Storage**
   - Click "Storage" in left sidebar
   - Or go to: https://console.firebase.google.com/project/qr-verification-7fe0c/storage

3. **Enable Storage**
   - If you see "Get Started" button, click it
   - Choose "Start in production mode"
   - Click "Next"
   - Select location (choose closest to your users)
   - Click "Done"

### Step 2: Verify Storage Bucket

1. **Check Storage Bucket Name**
   - In Firebase Console → Storage
   - Look at the top, you should see: `gs://qr-verification-7fe0c.firebasestorage.app`
   - Or: `gs://qr-verification-7fe0c.appspot.com`

2. **Update `.env.local` if needed**
   ```env
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=qr-verification-7fe0c.firebasestorage.app
   ```
   OR
   ```env
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=qr-verification-7fe0c.appspot.com
   ```

### Step 3: Deploy Storage Rules

1. **Using Firebase CLI:**
   ```bash
   firebase deploy --only storage
   ```

2. **Or Manually in Console:**
   - Go to Firebase Console → Storage → Rules
   - Copy content from `storage.rules` file
   - Paste into the editor
   - Click "Publish"

### Step 4: Verify Rules Are Active

In Firebase Console → Storage → Rules, you should see:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /shop-images/{userId}/{fileName} {
      allow write: if request.auth != null && 
                     request.auth.uid == userId &&
                     request.resource.contentType.matches('image/.*') &&
                     request.resource.size < 5 * 1024 * 1024;
      allow read: if true;
    }
  }
}
```

### Step 5: Test Storage Access

1. **Check if Storage is accessible:**
   - Go to Firebase Console → Storage
   - You should see "Files" tab
   - Try uploading a test file manually

2. **Check browser console:**
   - Open your app
   - Open DevTools (F12)
   - Try uploading an image
   - Look for errors in console

## Common Errors and Solutions

### Error: "Firebase Storage is not enabled"

**Solution:**
1. Go to Firebase Console → Storage
2. Click "Get Started"
3. Enable Storage

### Error: "storage/unauthorized" or "permission-denied"

**Solution:**
1. Deploy storage rules: `firebase deploy --only storage`
2. Or update rules manually in Firebase Console
3. Make sure user is logged in

### Error: "storage/unknown" or "storage/retry-limit-exceeded"

**Solution:**
1. Check internet connection
2. Check Firebase project is active
3. Verify storage bucket URL in `.env.local`

### Error: "CORS error" or "Access-Control-Allow-Origin"

**Solution:**
1. CORS is usually pre-configured for Firebase Storage
2. If issue persists, configure CORS:
   ```bash
   gsutil cors set cors.json gs://qr-verification-7fe0c.firebasestorage.app
   ```

3. Create `cors.json`:
   ```json
   [
     {
       "origin": ["*"],
       "method": ["GET", "POST", "PUT", "DELETE"],
       "maxAgeSeconds": 3600
     }
   ]
   ```

## Alternative Solution: Make Image Upload Truly Optional

If Firebase Storage continues to have issues, you can make shops work without images:

### Option 1: Skip Image Upload Entirely (Temporary)

Comment out image upload in `app/vendor/VendorClient.tsx`:

```typescript
// Temporarily disable image upload
const imageUrl = "";

// Skip upload
// if (image) { ... }

await createShop(userId, shopName, upiId, imageUrl);
```

### Option 2: Use External Image Hosting

Use a service like:
- Cloudinary
- Imgur API
- AWS S3
- Vercel Blob Storage

## Quick Test Commands

```bash
# Check Firebase project
firebase projects:list

# Check current project
firebase use

# Deploy storage rules
firebase deploy --only storage

# Check storage bucket
firebase storage:buckets:list

# Restart dev server
npm run dev
```

## Verification Checklist

- [ ] Firebase Storage enabled in console
- [ ] Storage bucket URL correct in `.env.local`
- [ ] Storage rules deployed
- [ ] User is logged in when uploading
- [ ] Image is under 2MB
- [ ] Image is valid format (JPG, PNG)
- [ ] Browser console shows no CORS errors
- [ ] Internet connection is stable

## Testing Steps

1. **Enable Storage in Firebase Console**
2. **Deploy storage rules:**
   ```bash
   firebase deploy --only storage
   ```
3. **Restart dev server:**
   ```bash
   npm run dev
   ```
4. **Test upload:**
   - Login as vendor
   - Create shop
   - Upload small image (< 500KB)
   - Check browser console for errors

## What to Check in Browser Console

### Successful Upload:
```
📤 Starting image upload... { name: "shop.jpg", size: "245.67 KB" }
✅ Image uploaded successfully: https://firebasestorage.googleapis.com/...
```

### Failed Upload:
```
❌ Image upload failed: FirebaseError: storage/unauthorized
```
OR
```
❌ Image upload failed: FirebaseError: Firebase Storage is not configured
```

## If Nothing Works

### Temporary Workaround:
Create shops without images for now:

1. Don't select any image
2. Just fill shop name and UPI ID
3. Click "Create Shop"
4. Shop will be created without image
5. You can add image later when storage is fixed

### Get Help:
Provide these details:
1. Screenshot of Firebase Console → Storage page
2. Screenshot of browser console errors
3. Content of `.env.local` (hide sensitive values)
4. Output of: `firebase projects:list`

## Expected Firebase Console Setup

### Storage Page Should Show:
```
Files
├── shop-images/
│   ├── [userId]/
│   │   ├── [timestamp]_image1.jpg
│   │   └── [timestamp]_image2.png
```

### Rules Tab Should Show:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /shop-images/{userId}/{fileName} {
      allow write: if request.auth != null && ...
      allow read: if true;
    }
  }
}
```

## Status After Setup

✅ Storage enabled in Firebase Console  
✅ Storage rules deployed  
✅ Bucket URL correct in `.env.local`  
✅ Test upload successful  
✅ Images visible in Firebase Console  

---

**Next Steps:**
1. Enable Firebase Storage in console
2. Deploy storage rules
3. Restart dev server
4. Test image upload
5. Check browser console for errors

**If still not working:**
- Create shops without images temporarily
- Contact Firebase support
- Consider alternative image hosting
