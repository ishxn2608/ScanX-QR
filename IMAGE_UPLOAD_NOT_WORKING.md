# ❌ Image Upload Not Working - What To Do

## Problem
Images are not uploading. You get an error and images don't save.

## Most Likely Cause
**Firebase Storage is not enabled** in your Firebase project.

## Quick Fix (3 Steps)

### Step 1: Enable Firebase Storage

1. Go to: https://console.firebase.google.com/project/qr-verification-7fe0c/storage
2. If you see "Get Started" button, **click it**
3. Choose "Start in production mode"
4. Click "Next" → Select location → Click "Done"

### Step 2: Deploy Storage Rules

Run this command:
```bash
./fix-storage.bat
```

OR manually:
```bash
firebase deploy --only storage
```

OR in Firebase Console:
1. Go to: https://console.firebase.google.com/project/qr-verification-7fe0c/storage/rules
2. Copy content from `storage.rules` file
3. Paste into editor
4. Click "Publish"

### Step 3: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

## Test It

1. Login as vendor
2. Click "Add New Shop"
3. Select a small image (< 500KB)
4. Click "Create Shop"
5. ✅ Should work now!

## Still Not Working?

### Check Browser Console (F12)

Look for error messages:

**Error: "Firebase Storage is not enabled"**
→ Go to Firebase Console and enable Storage (Step 1)

**Error: "storage/unauthorized" or "permission-denied"**
→ Deploy storage rules (Step 2)

**Error: "storage/unknown"**
→ Check internet connection

## Temporary Workaround

If you need to create shops NOW and can't fix storage:

1. **Don't select any image**
2. Just fill shop name and UPI ID
3. Click "Create Shop"
4. ✅ Shop created without image
5. You can add image later when storage is fixed

## What You Need To Do

### Priority 1: Enable Storage
Go to Firebase Console → Storage → Click "Get Started"

### Priority 2: Deploy Rules
Run: `./fix-storage.bat` or `firebase deploy --only storage`

### Priority 3: Test
Try uploading a small image

## Expected Result

### Before Fix:
```
❌ Image upload failed: FirebaseError: Firebase Storage is not configured
```

### After Fix:
```
✅ Image uploaded successfully
✅ Shop created with image
```

## Quick Links

- **Firebase Console Storage:** https://console.firebase.google.com/project/qr-verification-7fe0c/storage
- **Storage Rules:** https://console.firebase.google.com/project/qr-verification-7fe0c/storage/rules
- **Full Guide:** See `FIREBASE_STORAGE_SETUP_GUIDE.md`

## Summary

1. ✅ Enable Firebase Storage in console
2. ✅ Deploy storage rules
3. ✅ Restart dev server
4. ✅ Test upload

**Time needed:** 2-3 minutes

---

**Status:** Waiting for you to enable Firebase Storage  
**Next:** Follow Step 1 above
