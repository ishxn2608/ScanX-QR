# 🎉 Vercel Deployment - Complete Setup Process

## ✅ Your App is Deployed!
**Production URL:** https://secure-upi-payment-ngjpi1z6e-ishxn2608s-projects.vercel.app

---

## 🔧 STEP 1: Add Environment Variables to Vercel

### Go to Vercel Dashboard:
👉 https://vercel.com/ishxn2608s-projects/secure-upi-payment/settings/environment-variables

### Add These Variables (Click "Add New" for each):

| Variable Name | Value |
|--------------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyDA2MGu7arJFdGj9Kzb3yJv8JEx8gPze7s` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `qr-verification-7fe0c.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `qr-verification-7fe0c` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `qr-verification-7fe0c.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `140713435971` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:140713435971:web:f6e2bee4cb5adafbed45f6` |
| `NEXT_PUBLIC_APP_URL` | `https://secure-upi-payment-ngjpi1z6e-ishxn2608s-projects.vercel.app` |

**For each variable:**
1. Click **"Add New"**
2. Enter the **Name** (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
3. Enter the **Value** (copy from table above)
4. Select: ✅ **Production**, ✅ **Preview**, ✅ **Development**
5. Click **"Save"**

---

## 🔥 STEP 2: Configure Firebase

### A. Add Vercel Domain to Firebase Authorized Domains

1. Go to **Firebase Console**: https://console.firebase.google.com/project/qr-verification-7fe0c/authentication/settings
2. Scroll to **Authorized domains**
3. Click **"Add domain"**
4. Add: `secure-upi-payment-ngjpi1z6e-ishxn2608s-projects.vercel.app`
5. Click **"Add"**

### B. Enable Phone Authentication

1. Go to: https://console.firebase.google.com/project/qr-verification-7fe0c/authentication/providers
2. Click on **"Phone"** provider
3. Click **"Enable"** toggle
4. Click **"Save"**

### C. Create Admin User (If Not Already Created)

1. Go to: https://console.firebase.google.com/project/qr-verification-7fe0c/authentication/users
2. Click **"Add User"**
3. Enter:
   - **Email:** `Ishanacharya@gmail.com`
   - **Password:** `Admin@123456`
4. Click **"Add User"**

---

## 🚀 STEP 3: Redeploy with Environment Variables

After adding all environment variables, redeploy your app:

```bash
vercel --prod
```

This will rebuild your app with the correct environment variables.

---

## 🧪 STEP 4: Test Your Deployment

### Test These URLs:

1. **Homepage:**
   https://secure-upi-payment-ngjpi1z6e-ishxn2608s-projects.vercel.app

2. **User Login:**
   https://secure-upi-payment-ngjpi1z6e-ishxn2608s-projects.vercel.app/login

3. **User Registration:**
   https://secure-upi-payment-ngjpi1z6e-ishxn2608s-projects.vercel.app/register

4. **Admin Login:**
   https://secure-upi-payment-ngjpi1z6e-ishxn2608s-projects.vercel.app/admin-login
   - Email: `Ishanacharya@gmail.com`
   - Password: `Admin@123456`

5. **Admin Dashboard:**
   https://secure-upi-payment-ngjpi1z6e-ishxn2608s-projects.vercel.app/admin/dashboard

6. **Payment Page:**
   https://secure-upi-payment-ngjpi1z6e-ishxn2608s-projects.vercel.app/pay

7. **QR Scanner:**
   https://secure-upi-payment-ngjpi1z6e-ishxn2608s-projects.vercel.app/scan

---

## 📋 Quick Checklist

- [ ] Add all 7 environment variables to Vercel
- [ ] Add Vercel domain to Firebase Authorized Domains
- [ ] Enable Phone Authentication in Firebase
- [ ] Create admin user in Firebase (if not exists)
- [ ] Run `vercel --prod` to redeploy
- [ ] Test user registration/login
- [ ] Test admin login
- [ ] Test payment flow
- [ ] Test QR scanning

---

## 🔗 Important Links

- **Vercel Dashboard:** https://vercel.com/ishxn2608s-projects/secure-upi-payment
- **Environment Variables:** https://vercel.com/ishxn2608s-projects/secure-upi-payment/settings/environment-variables
- **Firebase Console:** https://console.firebase.google.com/project/qr-verification-7fe0c
- **Firebase Auth Settings:** https://console.firebase.google.com/project/qr-verification-7fe0c/authentication/settings
- **Firebase Auth Providers:** https://console.firebase.google.com/project/qr-verification-7fe0c/authentication/providers

---

## 🆘 Troubleshooting

### If you see "Firebase not configured" error:
- Make sure all environment variables are added in Vercel
- Redeploy after adding variables: `vercel --prod`

### If login doesn't work:
- Check Firebase Authorized Domains includes your Vercel URL
- Verify Phone Auth is enabled in Firebase

### If admin login fails:
- Ensure admin user exists in Firebase Authentication
- Check email/password are correct

---

## 🎯 Next Steps After Setup

1. **Custom Domain (Optional):**
   - Go to Vercel Dashboard → Settings → Domains
   - Add your custom domain

2. **Update App URL:**
   - If you add a custom domain, update `NEXT_PUBLIC_APP_URL` environment variable
   - Redeploy after updating

3. **Monitor Logs:**
   ```bash
   vercel logs
   ```

4. **View Analytics:**
   - Check Vercel Dashboard for deployment analytics

---

## ✅ You're All Set!

Once you complete Steps 1-3, your app will be fully functional on Vercel! 🚀
