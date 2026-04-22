# 🚀 Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- Firebase account
- Firebase project created

## 1️⃣ Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd secure-upi-payment

# Install dependencies
npm install
```

## 2️⃣ Firebase Setup

### A. Enable Authentication

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `qr-verification-7fe0c`
3. Go to **Authentication** → **Sign-in method**
4. Enable:
   - ✅ **Email/Password**
   - ✅ **Phone** (for OTP verification)

### B. Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode**
4. Select your region
5. Click **Enable**

### C. Set Security Rules

Copy rules from `FIREBASE_RULES.md` and paste in:
- **Firestore Database** → **Rules**
- **Storage** → **Rules**

### D. Enable Storage

1. Go to **Storage**
2. Click **Get started**
3. Use default security rules (we'll update them)
4. Click **Done**

### E. Create Admin Account

1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter:
   - Email: `admin@secureqr.com`
   - Password: `Admin@123456`
4. Click **Add User**

## 3️⃣ Environment Configuration

Your `.env.local` is already configured with Firebase credentials.

**Important**: The admin credentials are:
- Email: `admin@secureqr.com`
- Password: `Admin@123456`

## 4️⃣ Run the Application

```bash
# Development mode
npm run dev

# Open browser
http://localhost:3000
```

## 5️⃣ Test the System

### Test Customer Registration

1. Go to http://localhost:3000/register
2. Select **Customer** role
3. Enter details:
   - Name: Test Customer
   - Mobile: 9876543210
   - Email: customer@test.com
   - Password: test123
4. Click **Send OTP**
5. Enter OTP from your phone
6. Account created! ✅

### Test Vendor Registration

1. Go to http://localhost:3000/register
2. Select **Vendor** role
3. Enter details:
   - Name: Test Vendor
   - Mobile: 9876543211
   - Email: vendor@test.com
   - Password: test123
4. Complete OTP verification
5. You'll see "Approval Pending" message ⏳

### Test Admin Login

1. Go to http://localhost:3000/admin-login
2. Enter:
   - Email: `admin@secureqr.com`
   - Password: `Admin@123456`
3. You'll see Admin Dashboard 👑

### Test Vendor Approval

1. As admin, go to **Vendors** tab
2. You'll see "Test Vendor" with **Pending** status
3. Click **Approve** ✅
4. Vendor can now create shops!

### Test Shop Creation

1. Logout from admin
2. Login as vendor (vendor@test.com)
3. Click **Add New Shop**
4. Enter:
   - Shop Name: My Store
   - UPI ID: mystore@upi
   - Upload shop image
5. Click **Create Shop**
6. Shop created! Generate QR code 🎉

### Test QR Verification

1. Click **View QR Code** on your shop
2. Copy the payment URL
3. Open in new tab or go to http://localhost:3000/scan
4. Paste the URL
5. You'll see merchant verification page ✅

## 6️⃣ User Roles & Access

### Customer
- ✅ Can register immediately (no approval needed)
- ✅ Can scan QR codes
- ✅ Can make payments
- ❌ Cannot create shops

### Vendor
- ⏳ Registration requires admin approval
- ✅ Can create shops (after approval)
- ✅ Can generate QR codes
- ✅ Can manage shops
- ❌ Cannot access admin panel

### Admin
- 👑 Hardcoded account (cannot register)
- ✅ Approve/reject vendors
- ✅ Verify shops
- ✅ View all transactions
- ✅ Full system access

## 7️⃣ Key Features

### 🔐 Security Features
- OTP verification for all registrations
- Admin-only access (hardcoded)
- Vendor approval system
- Real-time verification
- Fraud prevention

### 📱 OTP Verification
- Firebase Phone Authentication
- 6-digit OTP
- Prevents fake accounts
- Mobile number verification

### 🏪 Vendor Management
- Pending/Approved/Rejected status
- Real-time updates
- Admin approval required
- Shop creation after approval

### 🔳 QR Code System
- Dynamic QR generation
- Token-based verification
- Fast scanning
- Real-time merchant verification

### 🎨 UI/UX
- Dark theme with glassmorphism
- Smooth animations (Framer Motion)
- Responsive design
- Toast notifications
- Loading states

## 8️⃣ Common Issues

### OTP Not Received

**Solution**:
- Check phone number format (+91XXXXXXXXXX)
- Verify Phone Authentication is enabled
- Check Firebase quota limits
- Try different phone number

### Admin Login Failed

**Solution**:
- Verify admin account exists in Firebase
- Check email: `admin@secureqr.com`
- Check password: `Admin@123456`
- Use admin login page: `/admin-login`

### Vendor Can't Create Shop

**Solution**:
- Check vendor status (must be "approved")
- Admin must approve vendor first
- Refresh page after approval

### QR Code Not Verifying

**Solution**:
- Check shop is enabled
- Verify token is correct
- Check Firestore security rules
- Ensure shop exists in database

## 9️⃣ Development Tips

### Hot Reload
Changes auto-reload in development mode

### Clear Cache
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Check Logs
- Browser Console (F12)
- Terminal output
- Firebase Console → Logs

### Debug Mode
Add to `.env.local`:
```
NEXT_PUBLIC_DEBUG=true
```

## 🔟 Production Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Environment Variables for Production

Update in Vercel/hosting platform:
```
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Post-Deployment

1. ✅ Update Firebase authorized domains
2. ✅ Change admin password
3. ✅ Enable App Check
4. ✅ Set up monitoring
5. ✅ Test all features

## 📞 Support

For issues:
1. Check Firebase Console logs
2. Check browser console
3. Review security rules
4. Verify environment variables

## 🎉 You're Ready!

Your secure QR payment verification system is now running!

**Next Steps**:
- Customize branding
- Add more features
- Set up analytics
- Deploy to production
