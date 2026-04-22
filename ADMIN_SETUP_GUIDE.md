# 🔐 Admin Setup Guide

## Admin Credentials

**Email**: `Ishanacharya@gmail.com`  
**Password**: `SecureQR@2026`

## Step 1: Create Admin Account in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/project/qr-verification-7fe0c/authentication/users)
2. Click **"Add User"** button
3. Enter the following:
   - **Email**: `Ishanacharya@gmail.com`
   - **Password**: `SecureQR@2026`
4. Click **"Add User"**

## Step 2: Verify Admin Account

1. Go to http://localhost:3000/admin-login
2. Enter:
   - Email: `Ishanacharya@gmail.com`
   - Password: `SecureQR@2026`
3. Click **"Admin Sign In"**
4. You should see the Admin Dashboard ✅

## Common Issues

### Issue: "Invalid admin credentials"

**Cause**: Admin account doesn't exist in Firebase Authentication

**Solution**:
1. Go to Firebase Console > Authentication > Users
2. Check if `Ishanacharya@gmail.com` exists
3. If not, create it using Step 1 above
4. Make sure the password is exactly: `SecureQR@2026`

### Issue: "Admin account not found"

**Solution**: The account needs to be created in Firebase Console first (see Step 1)

### Issue: "Invalid password"

**Solution**: 
- Password is case-sensitive: `SecureQR@2026`
- Make sure there are no extra spaces
- Try resetting the password in Firebase Console

## Reset Admin Password

If you need to change the password:

1. Go to Firebase Console > Authentication > Users
2. Find `Ishanacharya@gmail.com`
3. Click the three dots (⋮) menu
4. Select **"Reset password"**
5. Enter new password
6. Update the password in `lib/auth.ts` (line 4)

## 📱 Phone Authentication Issue

Phone Authentication requires Firebase **Blaze Plan** (paid).

### Current Solution: Simple Registration

We've created a simplified registration without OTP:
- URL: http://localhost:3000/register-simple
- No phone verification required
- Mobile number is stored for future use
- All other features work normally

### To Enable Phone Auth (Optional)

1. Upgrade to Firebase Blaze Plan
2. Enable Phone Authentication in Firebase Console
3. Users can then use: http://localhost:3000/register (with OTP)

## Testing the System

### 1. Test Admin Login
```
URL: http://localhost:3000/admin-login
Email: Ishanacharya@gmail.com
Password: SecureQR@2026
```

### 2. Test Customer Registration
```
URL: http://localhost:3000/register-simple
Role: Customer
Fill in details and register
```

### 3. Test Vendor Registration
```
URL: http://localhost:3000/register-simple
Role: Vendor
Fill in details and register
Status: Will be "Pending" - needs admin approval
```

### 4. Test Vendor Approval
```
1. Login as admin
2. Go to Vendors tab
3. See pending vendor
4. Click "Approve"
5. Vendor can now create shops
```

## Security Notes

- ✅ Admin email is hardcoded in the system
- ✅ Only `Ishanacharya@gmail.com` can access admin panel
- ✅ Regular users cannot register as admin
- ✅ Admin account must exist in Firebase Authentication
- ✅ Password is validated through Firebase

## Quick Commands

```bash
# Start dev server
npm run dev

# Access points
http://localhost:3000                    # Landing page
http://localhost:3000/admin-login        # Admin login
http://localhost:3000/register-simple    # Registration (no OTP)
http://localhost:3000/login              # User login
```

## ✅ Checklist

Before using the system:

- [ ] Admin account created in Firebase Console
- [ ] Email: Ishanacharya@gmail.com
- [ ] Password: SecureQR@2026
- [ ] Can login to admin panel
- [ ] Can see admin dashboard
- [ ] Firestore security rules updated
- [ ] Storage security rules updated

## 🎉 You're All Set!

Once the admin account is created in Firebase Console, you can:
- ✅ Login to admin panel
- ✅ Approve/reject vendors
- ✅ Manage shops
- ✅ View transactions
- ✅ Full system control
