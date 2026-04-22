# 🔧 Fix Phone Authentication Error

## Error Message
```
Firebase: Error (auth/operation-not-allowed)
```

This error means **Phone Authentication is not enabled** in your Firebase project.

## ✅ Solution: Enable Phone Authentication

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com)
2. Select your project: **qr-verification-7fe0c**

### Step 2: Enable Phone Authentication
1. Click **Authentication** in the left sidebar
2. Click **Sign-in method** tab
3. Find **Phone** in the list of providers
4. Click on **Phone**
5. Toggle the **Enable** switch to ON
6. Click **Save**

### Step 3: Restart Dev Server
```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## 🎯 Test Phone Authentication

After enabling:

1. Go to http://localhost:3000/register
2. Fill in the registration form
3. Enter a valid 10-digit mobile number
4. Click "Send OTP"
5. You should receive an OTP on your phone

## ⚠️ Important Notes

### Test Phone Numbers (Development)
For testing without using real phone numbers:

1. Go to **Firebase Console > Authentication > Sign-in method**
2. Scroll down to **Phone numbers for testing**
3. Add test phone numbers:
   - Phone: `+91 9999999999`
   - Code: `123456`
4. Use these in development

### Production Setup
For production, you need to:
1. ✅ Enable Phone Authentication
2. ✅ Set up billing (Firebase requires Blaze plan for Phone Auth)
3. ✅ Configure reCAPTCHA for your domain
4. ✅ Add your domain to authorized domains

## 🔐 Updated Admin Credentials

The admin email has been changed to:

**Email**: `Ishanacharya@gmail.com`
**Password**: `Admin@123456`

### Create Admin Account

1. Go to **Firebase Console > Authentication > Users**
2. Click **Add User**
3. Enter:
   - Email: `Ishanacharya@gmail.com`
   - Password: `Admin@123456`
4. Click **Add User**

### Admin Login

Go to: http://localhost:3000/admin-login

## 🐛 Other Common Issues

### Issue: "reCAPTCHA has already been rendered"

**Solution**: This is now fixed in the code. The reCAPTCHA container is cleared before each initialization.

### Issue: "Invalid phone number"

**Solution**: 
- Use 10-digit format: `9876543210`
- Don't include +91 or country code
- The system automatically adds +91

### Issue: "Too many requests"

**Solution**:
- Firebase has rate limits for OTP
- Wait a few minutes before trying again
- Use test phone numbers for development

### Issue: OTP not received

**Solution**:
1. Check phone number is correct
2. Check you have mobile signal
3. Wait up to 60 seconds
4. Check spam/blocked messages
5. Try a different phone number

## 📱 Phone Authentication Limits

### Free Tier (Spark Plan)
- ❌ Phone Authentication NOT available
- Need to upgrade to Blaze plan

### Blaze Plan (Pay as you go)
- ✅ Phone Authentication available
- First 10K verifications/month: Free
- After that: $0.06 per verification

### Upgrade to Blaze Plan

1. Go to **Firebase Console**
2. Click **Upgrade** button (top right)
3. Select **Blaze Plan**
4. Add payment method
5. Confirm upgrade

**Note**: You won't be charged unless you exceed free tier limits.

## 🧪 Testing Without Phone Auth

If you don't want to enable Phone Auth yet, you can:

### Option 1: Skip OTP for Development

Update `app/(auth)/register/page.tsx`:

```typescript
// Temporarily skip OTP verification
const handleSendOTP = async (e: React.FormEvent) => {
  e.preventDefault();
  // ... validation code ...
  
  // TEMPORARY: Skip OTP for development
  setStep(2);
  setOtp("123456"); // Auto-fill OTP
};

const handleVerifyOTP = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // TEMPORARY: Skip verification
  await registerUser(email, password, name, mobileNumber, role);
  // ... rest of code ...
};
```

### Option 2: Use Email-Only Registration

Create a simpler registration without OTP (not recommended for production).

## ✅ Verification Checklist

After setup, verify:

- [ ] Phone Authentication enabled in Firebase
- [ ] Admin account created (Ishanacharya@gmail.com)
- [ ] Dev server restarted
- [ ] Can access registration page
- [ ] Can send OTP
- [ ] Can receive OTP
- [ ] Can complete registration
- [ ] Can login as admin

## 🎉 All Fixed!

Once Phone Authentication is enabled:
1. ✅ OTP will be sent successfully
2. ✅ Users can register with mobile verification
3. ✅ No more "operation-not-allowed" error
4. ✅ reCAPTCHA works properly

## 📞 Need Help?

If you still face issues:
1. Check Firebase Console logs
2. Check browser console (F12)
3. Verify Firebase configuration in `.env.local`
4. Make sure you're on Blaze plan
5. Check Firebase quota limits
