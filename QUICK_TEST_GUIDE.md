# ScanX QR - Quick Testing Guide

## 🚀 Fast Track Production Testing

This guide provides a streamlined approach to test your deployed ScanX QR application quickly.

---

## Prerequisites

✅ Application deployed to production  
✅ Firebase services configured  
✅ Admin account created  
✅ Environment variables set  

---

## Step 1: Run Automated Tests (5 minutes)

### 1.1 Pre-Deployment Check
```bash
node scripts/pre-deployment-check.js
```

**Expected:** All checks should pass ✅

### 1.2 Production Tests
```bash
# Set your production URL
export NEXT_PUBLIC_APP_URL=https://your-domain.com

# Run tests
node scripts/test-production.js
```

**Expected:** 90%+ tests should pass ✅

---

## Step 2: Critical Path Testing (15 minutes)

### Test 1: Homepage ⏱️ 1 min
1. Visit your production URL
2. ✅ Page loads without errors
3. ✅ ScanX QR logo visible
4. ✅ "Scan QR Code" and "Register as Vendor" buttons work

**Status:** [ ] Pass [ ] Fail

---

### Test 2: Customer Registration ⏱️ 2 min
1. Go to `/register-simple`
2. Fill form:
   - Name: "Test Customer"
   - Mobile: "9876543210"
   - Email: "customer@test.com"
   - Password: "Test@123"
   - Role: Customer
3. Click "Create Account"

**Expected:**
- ✅ Account created
- ✅ Redirected to homepage
- ✅ Logged in automatically

**Status:** [ ] Pass [ ] Fail

---

### Test 3: Vendor Registration ⏱️ 2 min
1. Logout (if logged in)
2. Go to `/register-simple`
3. Fill form:
   - Name: "Test Vendor"
   - Mobile: "9876543211"
   - Email: "vendor@test.com"
   - Password: "Test@123"
   - Role: Vendor
4. Click "Create Account"

**Expected:**
- ✅ Account created
- ✅ Shows "Approval Pending" screen
- ✅ Cannot create shops yet

**Status:** [ ] Pass [ ] Fail

---

### Test 4: Admin Login ⏱️ 1 min
1. Logout
2. Go to `/admin-login`
3. Login:
   - Email: `Ishanacharya@gmail.com`
   - Password: `SecureQR@2026`

**Expected:**
- ✅ Login successful
- ✅ Redirected to admin dashboard
- ✅ Can see pending vendor

**Status:** [ ] Pass [ ] Fail

---

### Test 5: Vendor Approval ⏱️ 2 min
1. In admin dashboard
2. Go to "Vendors" tab
3. Find "Test Vendor"
4. Click "Approve"

**Expected:**
- ✅ Success message shown
- ✅ Vendor moves to "Approved" tab
- ✅ Real-time update (no refresh)

**Status:** [ ] Pass [ ] Fail

---

### Test 6: Shop Creation ⏱️ 3 min
1. Logout from admin
2. Login as vendor (vendor@test.com)
3. Go to `/vendor`
4. Click "Add New Shop"
5. Fill form:
   - Shop Name: "Test Shop"
   - UPI ID: "testshop@upi"
   - Upload image (optional)
6. Click "Create Shop"

**Expected:**
- ✅ Loading indicator shows
- ✅ Success message
- ✅ Shop appears in list
- ✅ "View QR Code" button visible

**Status:** [ ] Pass [ ] Fail

---

### Test 7: QR Code Generation ⏱️ 2 min
1. Click "View QR Code" on shop
2. QR modal opens

**Expected:**
- ✅ QR code displays
- ✅ Payment URL shown
- ✅ "Download QR" works
- ✅ QR downloads as PNG

**Status:** [ ] Pass [ ] Fail

---

### Test 8: QR Verification ⏱️ 2 min
1. Copy the payment URL from QR modal
2. Open in new tab (or scan with phone)
3. Wait for verification

**Expected:**
- ✅ Shows "Verifying Merchant" (1-2s)
- ✅ Shop details load
- ✅ Shows shop name and UPI ID
- ✅ "Choose Payment App" button visible
- ✅ No errors

**Status:** [ ] Pass [ ] Fail

---

## Step 3: Security Testing (5 minutes)

### Test 9: Unauthorized Access
1. Logout
2. Try to access:
   - `/vendor` → Should redirect to login
   - `/admin/dashboard` → Should redirect to login

**Expected:**
- ✅ Cannot access without login
- ✅ Redirected appropriately

**Status:** [ ] Pass [ ] Fail

---

### Test 10: Role-Based Access
1. Login as customer
2. Try to access `/vendor`
3. Try to access `/admin/dashboard`

**Expected:**
- ✅ Customer cannot access vendor pages
- ✅ Customer cannot access admin pages
- ✅ Proper redirects

**Status:** [ ] Pass [ ] Fail

---

### Test 11: Admin Protection
1. Try to register with admin email
2. Email: "Ishanacharya@gmail.com"

**Expected:**
- ✅ Error: "This email is reserved for admin use only"
- ✅ Registration blocked

**Status:** [ ] Pass [ ] Fail

---

## Step 4: Mobile Testing (5 minutes)

### Test 12: Mobile Responsiveness
1. Open site on mobile device
2. Test all pages:
   - Homepage
   - Login
   - Register
   - Vendor dashboard
   - QR scan

**Expected:**
- ✅ Layout adapts to mobile
- ✅ Buttons are clickable
- ✅ Forms work properly
- ✅ No horizontal scroll

**Status:** [ ] Pass [ ] Fail

---

### Test 13: QR Scanning on Mobile
1. Generate QR code
2. Scan with mobile camera
3. Or use `/scan` page

**Expected:**
- ✅ QR scanner works on mobile
- ✅ Verification is fast
- ✅ Payment apps open correctly

**Status:** [ ] Pass [ ] Fail

---

## Step 5: Performance Check (3 minutes)

### Test 14: Load Speed
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit

**Expected:**
- ✅ Performance score > 80
- ✅ First Contentful Paint < 2s
- ✅ Time to Interactive < 3s

**Status:** [ ] Pass [ ] Fail

---

### Test 15: Button Responsiveness
1. Click various buttons throughout app
2. Test forms and interactions

**Expected:**
- ✅ Buttons respond instantly (<150ms)
- ✅ No lag or delay
- ✅ Smooth animations

**Status:** [ ] Pass [ ] Fail

---

## Step 6: Error Handling (2 minutes)

### Test 16: Invalid Login
1. Try to login with wrong password
2. Try with non-existent email

**Expected:**
- ✅ Shows error message
- ✅ App doesn't crash
- ✅ User-friendly error text

**Status:** [ ] Pass [ ] Fail

---

### Test 17: Network Failure
1. Open DevTools
2. Go to Network tab
3. Set to "Offline"
4. Try to perform actions

**Expected:**
- ✅ Shows error message
- ✅ App doesn't crash
- ✅ Graceful degradation

**Status:** [ ] Pass [ ] Fail

---

## 📊 Quick Test Summary

| Test | Status | Time |
|------|--------|------|
| 1. Homepage | [ ] | 1 min |
| 2. Customer Registration | [ ] | 2 min |
| 3. Vendor Registration | [ ] | 2 min |
| 4. Admin Login | [ ] | 1 min |
| 5. Vendor Approval | [ ] | 2 min |
| 6. Shop Creation | [ ] | 3 min |
| 7. QR Generation | [ ] | 2 min |
| 8. QR Verification | [ ] | 2 min |
| 9. Unauthorized Access | [ ] | 1 min |
| 10. Role-Based Access | [ ] | 1 min |
| 11. Admin Protection | [ ] | 1 min |
| 12. Mobile Responsive | [ ] | 2 min |
| 13. Mobile QR Scan | [ ] | 2 min |
| 14. Load Speed | [ ] | 1 min |
| 15. Button Response | [ ] | 1 min |
| 16. Invalid Login | [ ] | 1 min |
| 17. Network Failure | [ ] | 1 min |

**Total Time:** ~30 minutes  
**Tests Passed:** ___/17  
**Success Rate:** ___%

---

## ✅ Production Readiness Checklist

### Critical (Must Pass)
- [ ] Homepage loads without errors
- [ ] User registration works
- [ ] Login/logout works
- [ ] Admin can approve vendors
- [ ] Vendors can create shops
- [ ] QR codes generate correctly
- [ ] QR verification works
- [ ] No console errors
- [ ] Mobile responsive

### Important (Should Pass)
- [ ] Performance score > 80
- [ ] Button response < 150ms
- [ ] Error messages are clear
- [ ] Security rules enforced
- [ ] HTTPS enabled
- [ ] Real-time updates work

### Nice to Have
- [ ] Animations are smooth
- [ ] Images load quickly
- [ ] Favicon displays
- [ ] SEO meta tags present

---

## 🚨 Common Issues & Quick Fixes

### Issue: "Firebase configuration not found"
**Fix:** Check environment variables are set in deployment platform

### Issue: "Permission denied" errors
**Fix:** Deploy firestore.rules and storage.rules to Firebase

### Issue: QR code shows "Shop not found"
**Fix:** Verify NEXT_PUBLIC_APP_URL is set correctly

### Issue: Admin cannot login
**Fix:** Ensure admin account exists in Firebase Authentication

### Issue: Slow performance
**Fix:** 
1. Check Firebase queries
2. Enable caching
3. Optimize images

---

## 📞 Need Help?

If tests fail:
1. Check browser console for errors
2. Check Firebase Console for permission errors
3. Review `E2E_TESTING_CHECKLIST.md` for detailed tests
4. Check `DEPLOYMENT_GUIDE.md` for configuration help

---

## 🎉 All Tests Passed?

Congratulations! Your ScanX QR application is production-ready!

**Next Steps:**
1. Monitor Firebase usage
2. Set up error tracking (Sentry)
3. Enable analytics
4. Plan for scaling
5. Gather user feedback

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-22
