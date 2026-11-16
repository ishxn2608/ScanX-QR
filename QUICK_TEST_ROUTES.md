# Quick Route Testing Guide

## 🔗 Test These URLs Directly

### Public Pages (No Login Required)
1. **Home Page**
   - URL: https://qr-verification-7fe0c.web.app/
   - Expected: Landing page with "Scan QR Code" button

2. **Scan QR Page**
   - URL: https://qr-verification-7fe0c.web.app/scan
   - Expected: QR scanner with Camera/Upload options

3. **Login Page**
   - URL: https://qr-verification-7fe0c.web.app/login
   - Expected: Login form

4. **Register Page**
   - URL: https://qr-verification-7fe0c.web.app/register-simple
   - Expected: Registration form

### Protected Pages (Login Required)

5. **Vendor Dashboard**
   - URL: https://qr-verification-7fe0c.web.app/vendor
   - Login: test1@gmail.com
   - Expected: Vendor dashboard with shops and QR codes
   - If not logged in: Should redirect to /login

6. **Admin Dashboard**
   - URL: https://qr-verification-7fe0c.web.app/admin/dashboard
   - Login: admin@scanxqr.com
   - Expected: Admin panel with vendor approvals
   - If not logged in: Should redirect to /admin-login

## 🧪 Test Scenarios

### Scenario 1: Vendor Login Flow
1. Go to: https://qr-verification-7fe0c.web.app/login
2. Login with: test1@gmail.com
3. Click "Dashboard" in navbar
4. ✅ Should see vendor dashboard at `/vendor`
5. ✅ Should see your shops and QR codes

### Scenario 2: Direct URL Access (Not Logged In)
1. Open new incognito window
2. Go directly to: https://qr-verification-7fe0c.web.app/vendor
3. ✅ Should redirect to /login
4. After login: ✅ Should show vendor dashboard

### Scenario 3: Scan QR Page
1. Go to: https://qr-verification-7fe0c.web.app/scan
2. ✅ Should see two buttons: "Camera" and "Upload"
3. Click "Camera"
4. ✅ Should see camera feed with switch button (top-right)
5. ✅ Should see "Stop Camera" and "Upload Image" buttons

### Scenario 4: Navigation Between Pages
1. Login as vendor
2. Click "Home" → ✅ Should go to home page
3. Click "Scan QR" → ✅ Should go to scan page
4. Click "Dashboard" → ✅ Should go to vendor dashboard
5. All URLs should be correct (not showing home page)

## 🐛 If Issues Persist

### Clear Browser Cache
1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh the page

### Hard Refresh
- Windows: `Ctrl + F5` or `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### Check Browser Console
1. Press `F12` to open DevTools
2. Go to "Console" tab
3. Look for any errors (red text)
4. Share errors if found

### Test in Different Browser
- Try Chrome, Firefox, or Edge
- Try incognito/private mode

## 📱 Mobile Testing

### Test on Mobile Device
1. Open: https://qr-verification-7fe0c.web.app/vendor
2. Login with vendor credentials
3. ✅ Should see vendor dashboard (not home page)
4. Test camera switch button on scan page
5. Test upload from gallery

## ✅ Expected Results

### All Routes Should Work:
- ✅ `/` - Home page
- ✅ `/scan` - QR scanner with camera switch
- ✅ `/vendor` - Vendor dashboard (when logged in)
- ✅ `/admin/dashboard` - Admin panel (when logged in as admin)
- ✅ `/login` - Login page
- ✅ `/register-simple` - Registration page

### Navigation Should Work:
- ✅ Navbar links work correctly
- ✅ Direct URL access works
- ✅ Browser back/forward buttons work
- ✅ Page refresh maintains correct page

## 🆘 Still Having Issues?

If the vendor dashboard still shows the home page:
1. Wait 2-3 minutes for Firebase CDN to update
2. Clear browser cache completely
3. Try incognito mode
4. Try different browser
5. Check if you're logged in (email should show in navbar)

---

**Last Updated**: April 24, 2026
**Deployment**: https://qr-verification-7fe0c.web.app
