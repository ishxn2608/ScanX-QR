# ScanX QR - End-to-End Testing Checklist

## 🎯 Production Deployment Testing Guide

This document provides a comprehensive testing checklist for verifying all features of the ScanX QR application in production.

---

## Pre-Deployment Checklist

### ✅ Environment Configuration

- [ ] Firebase configuration variables are set in production
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
  - `NEXT_PUBLIC_APP_URL` (production URL)

- [ ] Admin credentials are configured
  - Email: `Ishanacharya@gmail.com`
  - Password: `SecureQR@2026`
  - Admin account created in Firebase Console

- [ ] Firebase services enabled
  - [ ] Authentication (Email/Password)
  - [ ] Firestore Database
  - [ ] Storage (for shop images)
  - [ ] Phone Authentication (optional - requires Blaze plan)

---

## 1. 🔐 AUTHENTICATION SYSTEM TESTING

### Test Case 1.1: Customer Registration
**Steps:**
1. Navigate to `/register-simple`
2. Fill in the form:
   - Full Name: "Test Customer"
   - Mobile: "9876543210"
   - Email: "testcustomer@example.com"
   - Password: "Test@123"
   - Select: Customer
3. Click "Create Account"

**Expected Results:**
- ✅ Account created successfully
- ✅ Redirected to home page
- ✅ User logged in automatically
- ✅ No errors in console

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 1.2: Vendor Registration
**Steps:**
1. Navigate to `/register-simple`
2. Fill in the form:
   - Full Name: "Test Vendor"
   - Mobile: "9876543211"
   - Email: "testvendor@example.com"
   - Password: "Test@123"
   - Select: Vendor
3. Click "Create Account"

**Expected Results:**
- ✅ Account created successfully
- ✅ Redirected to `/vendor`
- ✅ Shows "Approval Pending" message
- ✅ Toast notification: "Your account is pending admin approval"

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 1.3: User Login
**Steps:**
1. Navigate to `/login`
2. Enter credentials:
   - Email: "testcustomer@example.com"
   - Password: "Test@123"
3. Click "Sign In"

**Expected Results:**
- ✅ Login successful
- ✅ Redirected to appropriate dashboard
- ✅ Session persists after page refresh

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 1.4: Invalid Login
**Steps:**
1. Navigate to `/login`
2. Enter wrong credentials
3. Click "Sign In"

**Expected Results:**
- ✅ Error message displayed
- ✅ User remains on login page
- ✅ No console errors

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 1.5: Admin Login
**Steps:**
1. Navigate to `/admin-login`
2. Enter admin credentials:
   - Email: "Ishanacharya@gmail.com"
   - Password: "SecureQR@2026"
3. Click "Sign In"

**Expected Results:**
- ✅ Login successful
- ✅ Redirected to `/admin/dashboard`
- ✅ Admin panel loads correctly

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 1.6: Prevent Admin Registration
**Steps:**
1. Try to register with admin email
2. Email: "Ishanacharya@gmail.com"

**Expected Results:**
- ✅ Error: "This email is reserved for admin use only"
- ✅ Registration blocked

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

## 2. 👤 ROLE-BASED ACCESS CONTROL

### Test Case 2.1: Customer Access
**Steps:**
1. Login as customer
2. Try to access:
   - `/vendor`
   - `/admin/dashboard`

**Expected Results:**
- ✅ Customer can access home page
- ✅ Redirected away from vendor/admin pages
- ✅ No unauthorized access

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 2.2: Vendor Access (Pending)
**Steps:**
1. Login as pending vendor
2. Navigate to `/vendor`

**Expected Results:**
- ✅ Shows "Approval Pending" screen
- ✅ Cannot create shops
- ✅ Message explains approval needed

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 2.3: Vendor Access (Approved)
**Steps:**
1. Admin approves vendor
2. Vendor logs in
3. Navigate to `/vendor`

**Expected Results:**
- ✅ Shows vendor dashboard
- ✅ Can create shops
- ✅ "Add New Shop" button visible

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 2.4: Admin Access
**Steps:**
1. Login as admin
2. Access `/admin/dashboard`

**Expected Results:**
- ✅ Admin dashboard loads
- ✅ Shows vendor requests
- ✅ Shows shops and transactions
- ✅ Real-time updates work

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

## 3. 🏪 VENDOR APPROVAL WORKFLOW

### Test Case 3.1: Vendor Request Appears in Admin Panel
**Steps:**
1. Register new vendor
2. Login as admin
3. Check admin dashboard

**Expected Results:**
- ✅ Vendor appears in "Pending" tab
- ✅ Shows vendor details (name, email, mobile)
- ✅ Shows registration date
- ✅ Approve/Reject buttons visible

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 3.2: Approve Vendor
**Steps:**
1. Admin clicks "Approve" on pending vendor
2. Confirm approval

**Expected Results:**
- ✅ Success toast: "Vendor approved successfully"
- ✅ Vendor moves to "Approved" tab
- ✅ Vendor can now create shops
- ✅ Real-time update (no refresh needed)

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 3.3: Reject Vendor
**Steps:**
1. Admin clicks "Reject" on pending vendor
2. Confirm rejection

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ Success toast: "Vendor rejected"
- ✅ Vendor moves to "Rejected" tab
- ✅ Vendor sees rejection message on login

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

## 4. 🔳 QR CODE SYSTEM

### Test Case 4.1: Create Shop
**Steps:**
1. Login as approved vendor
2. Click "Add New Shop"
3. Fill in:
   - Shop Name: "Test Shop"
   - UPI ID: "testshop@upi"
   - Upload image (optional)
4. Click "Create Shop"

**Expected Results:**
- ✅ Loading indicator shows
- ✅ Success toast: "Shop created successfully"
- ✅ Shop appears in vendor dashboard
- ✅ QR code generated
- ✅ Shop saved to Firestore

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 4.2: Generate QR Code
**Steps:**
1. Click "View QR Code" on shop
2. QR modal opens

**Expected Results:**
- ✅ QR code displays correctly
- ✅ Shows payment URL
- ✅ "Download QR" button works
- ✅ QR downloads as PNG

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 4.3: Scan QR Code
**Steps:**
1. Navigate to `/scan`
2. Scan the generated QR code
3. Or manually visit payment URL

**Expected Results:**
- ✅ Verifying screen shows (1-2 seconds)
- ✅ Shop details load correctly
- ✅ Shows shop name, UPI ID
- ✅ Shows verification status
- ✅ "Choose Payment App" button visible

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 4.4: Payment App Selection
**Steps:**
1. After scanning QR
2. Click "Choose Payment App"
3. Select a UPI app

**Expected Results:**
- ✅ Modal shows UPI apps
- ✅ Shows: Google Pay, PhonePe, Paytm, BHIM, Amazon Pay
- ✅ Clicking app opens UPI deep link
- ✅ UPI app opens with pre-filled details

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 4.5: Invalid QR Code
**Steps:**
1. Visit `/pay?token=invalid-token`

**Expected Results:**
- ✅ Shows "Verification Failed" screen
- ✅ Error message: "Shop not found or QR code is invalid"
- ✅ Security warning displayed
- ✅ No payment option shown

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 4.6: Disabled Shop
**Steps:**
1. Vendor disables shop
2. Try to scan QR code

**Expected Results:**
- ✅ Error: "This shop is currently disabled by the admin"
- ✅ Cannot proceed with payment

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

## 5. 📊 ADMIN PANEL FEATURES

### Test Case 5.1: Vendor Management
**Steps:**
1. Login as admin
2. Navigate to "Vendors" tab
3. Test filters: All, Pending, Approved, Rejected

**Expected Results:**
- ✅ All vendors load correctly
- ✅ Filters work properly
- ✅ Shows correct counts
- ✅ Real-time updates work

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 5.2: Shop Verification
**Steps:**
1. Navigate to "Shops" tab
2. Click "Verify" on a shop

**Expected Results:**
- ✅ Success toast: "Shop verified successfully"
- ✅ Shop shows "Verified" badge
- ✅ Changes reflect immediately

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 5.3: Transaction Monitoring
**Steps:**
1. Navigate to "Transactions" tab
2. Check transaction list

**Expected Results:**
- ✅ Shows recent transactions
- ✅ Displays shop name, amount, timestamp
- ✅ Shows transaction status

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 5.4: Real-Time Updates
**Steps:**
1. Keep admin panel open
2. Register new vendor in another tab
3. Check if it appears without refresh

**Expected Results:**
- ✅ New vendor appears automatically
- ✅ No page refresh needed
- ✅ Real-time listener working

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

## 6. 🗄️ FIREBASE DATABASE OPERATIONS

### Test Case 6.1: Firestore Write Operations
**Steps:**
1. Create user, shop, transaction
2. Check Firebase Console

**Expected Results:**
- ✅ Data appears in Firestore
- ✅ Correct collection structure
- ✅ All fields saved properly
- ✅ Timestamps are correct

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 6.2: Firestore Read Operations
**Steps:**
1. Load vendor dashboard
2. Load admin panel
3. Check data loading

**Expected Results:**
- ✅ Data loads correctly
- ✅ No permission errors
- ✅ Fast query response
- ✅ No console errors

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 6.3: Firebase Storage
**Steps:**
1. Upload shop image
2. Check Firebase Storage

**Expected Results:**
- ✅ Image uploaded successfully
- ✅ Image URL generated
- ✅ Image displays in shop card
- ✅ Proper folder structure

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 6.4: Security Rules
**Steps:**
1. Try to access data without authentication
2. Try to modify other user's data

**Expected Results:**
- ✅ Unauthorized access blocked
- ✅ Permission denied errors
- ✅ Users can only access their own data
- ✅ Admin has full access

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

## 7. 🌐 DEPLOYMENT & ENVIRONMENT

### Test Case 7.1: Environment Variables
**Steps:**
1. Check browser console
2. Verify Firebase connection

**Expected Results:**
- ✅ No "undefined" config errors
- ✅ Firebase initialized correctly
- ✅ All env variables loaded

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 7.2: Production Build
**Steps:**
1. Run `npm run build`
2. Check for errors

**Expected Results:**
- ✅ Build completes successfully
- ✅ No TypeScript errors
- ✅ No linting errors
- ✅ All pages generated

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 7.3: Mobile Responsiveness
**Steps:**
1. Test on mobile device
2. Test all pages

**Expected Results:**
- ✅ Layout adapts to mobile
- ✅ Buttons are clickable
- ✅ Forms work properly
- ✅ QR scanner works on mobile

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 7.4: Browser Compatibility
**Steps:**
1. Test on Chrome, Firefox, Safari, Edge

**Expected Results:**
- ✅ Works on all browsers
- ✅ No browser-specific errors
- ✅ Consistent UI across browsers

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

## 8. 🎨 UI & BRANDING

### Test Case 8.1: Logo Display
**Steps:**
1. Check all pages for ScanX QR logo

**Expected Results:**
- ✅ Logo on navbar
- ✅ Logo on landing page
- ✅ Logo on auth pages
- ✅ Favicon in browser tab

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 8.2: Consistent Styling
**Steps:**
1. Navigate through all pages
2. Check design consistency

**Expected Results:**
- ✅ Consistent color scheme
- ✅ Proper spacing and alignment
- ✅ Glass-morphism effects work
- ✅ Animations are smooth

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

## 9. ⚠️ ERROR HANDLING

### Test Case 9.1: Network Failure
**Steps:**
1. Disable internet
2. Try to perform actions

**Expected Results:**
- ✅ Shows error message
- ✅ App doesn't crash
- ✅ User-friendly error text

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 9.2: Invalid Input
**Steps:**
1. Submit forms with invalid data
2. Test validation

**Expected Results:**
- ✅ Validation errors shown
- ✅ Prevents submission
- ✅ Clear error messages

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

## 10. 📈 PERFORMANCE

### Test Case 10.1: Page Load Speed
**Steps:**
1. Use Lighthouse in Chrome DevTools
2. Test performance score

**Expected Results:**
- ✅ Performance score > 80
- ✅ First Contentful Paint < 2s
- ✅ Time to Interactive < 3s

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

### Test Case 10.2: Button Responsiveness
**Steps:**
1. Click buttons throughout app
2. Measure response time

**Expected Results:**
- ✅ Buttons respond < 150ms
- ✅ No lag or delay
- ✅ Smooth interactions

**Status:** [ ] Pass [ ] Fail [ ] Not Tested

---

## 🔒 SECURITY CHECKLIST

- [ ] Admin email is hardcoded and cannot be registered
- [ ] Firebase security rules are properly configured
- [ ] Users cannot access other users' data
- [ ] Admin routes are protected
- [ ] Sensitive data is not exposed in client
- [ ] API keys are properly configured
- [ ] HTTPS is enabled in production

---

## 📝 TESTING SUMMARY

### Overall Status
- **Total Test Cases:** 42
- **Passed:** ___
- **Failed:** ___
- **Not Tested:** ___

### Critical Issues Found
1. 
2. 
3. 

### Minor Issues Found
1. 
2. 
3. 

### Recommendations
1. 
2. 
3. 

---

## 🚀 DEPLOYMENT READINESS

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Firebase services enabled
- [ ] Admin account created
- [ ] Build completes successfully
- [ ] No console errors

### Post-Deployment
- [ ] All authentication flows work
- [ ] Database operations successful
- [ ] QR system functional
- [ ] Admin panel operational
- [ ] Mobile responsive
- [ ] Performance acceptable

### Sign-Off
- [ ] Development Team: _______________
- [ ] QA Team: _______________
- [ ] Product Owner: _______________

**Date:** _______________

---

## 📞 SUPPORT CONTACTS

**Admin Email:** Ishanacharya@gmail.com  
**Admin Password:** SecureQR@2026  
**Firebase Project:** qr-verification-7fe0c

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-22
