# 🔐 Your Environment Variables for Vercel

When deploying to Vercel, you'll need to add these environment variables.

## 📋 Copy These Exact Values

When you deploy to Vercel, add these environment variables in the Vercel dashboard:

### Environment Variables for Vercel

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDA2MGu7arJFdGj9Kzb3yJv8JEx8gPze7s
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=qr-verification-7fe0c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=qr-verification-7fe0c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=qr-verification-7fe0c.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=140713435971
NEXT_PUBLIC_FIREBASE_APP_ID=1:140713435971:web:f6e2bee4cb5adafbed45f6
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## ⚠️ Important Notes

### NEXT_PUBLIC_APP_URL
- **During deployment**: Set to `https://your-app.vercel.app` (placeholder)
- **After deployment**: Update with your actual Vercel URL
- **Example**: If your app deploys to `https://scanx-qr-abc123.vercel.app`, update this variable

### How to Add Environment Variables in Vercel

1. **Go to**: Vercel Dashboard → Your Project → Settings → Environment Variables
2. **Add each variable**:
   - Name: `NEXT_PUBLIC_FIREBASE_API_KEY`
   - Value: `AIzaSyDA2MGu7arJFdGj9Kzb3yJv8JEx8gPze7s`
   - Environment: All (Production, Preview, Development)
3. **Repeat** for all variables above
4. **Save** changes

### After Adding Variables

1. **Redeploy** your app: Deployments → Latest → "Redeploy"
2. **Update** `NEXT_PUBLIC_APP_URL` with your actual domain
3. **Redeploy** again

## 🔧 Firebase Configuration Required

### Admin Account Setup

After deployment, create the admin account in Firebase:

1. **Go to**: https://console.firebase.google.com
2. **Select**: `qr-verification-7fe0c` project
3. **Go to**: Authentication → Users
4. **Click**: "Add User"
5. **Enter**:
   - Email: `Ishanacharya@gmail.com`
   - Password: `SecureQR@2026`
6. **Save**

### Authorized Domains

Add your Vercel domain to Firebase:

1. **Go to**: Authentication → Settings → Authorized domains
2. **Click**: "Add domain"
3. **Enter**: Your Vercel domain (e.g., `scanx-qr-abc123.vercel.app`)
4. **Save**

## 🧪 Testing Your Environment Variables

After deployment, test these features:

- [ ] Landing page loads
- [ ] Login/Register works
- [ ] Admin login works (Ishanacharya@gmail.com)
- [ ] Firebase connection works
- [ ] QR code generation works
- [ ] Database operations work

## 🔒 Security Notes

### These Variables Are Safe to Share
- All variables start with `NEXT_PUBLIC_` which means they're client-side
- They're meant to be visible in the browser
- Firebase has built-in security rules to protect your data

### What's Protected
- Your `.env.local` file (never committed to Git)
- Firebase security rules (control data access)
- Admin email verification (only specific email can access admin)

## 🐛 Troubleshooting

### "Firebase not initialized" Error
- **Solution**: Check all environment variables are set correctly in Vercel
- **Verify**: Variable names match exactly (case-sensitive)

### "Auth domain not authorized" Error
- **Solution**: Add your Vercel domain to Firebase authorized domains
- **Check**: Domain matches exactly (no https:// prefix)

### Admin Login Not Working
- **Solution**: Create admin user in Firebase Authentication console
- **Verify**: Email is exactly `Ishanacharya@gmail.com`

### QR Codes Not Working
- **Solution**: Check Firestore rules are deployed
- **Command**: `firebase deploy --only firestore:rules`

## 📝 Quick Copy-Paste for Vercel

When adding environment variables in Vercel, copy-paste these one by one:

**Variable 1:**
```
Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: AIzaSyDA2MGu7arJFdGj9Kzb3yJv8JEx8gPze7s
```

**Variable 2:**
```
Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: qr-verification-7fe0c.firebaseapp.com
```

**Variable 3:**
```
Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: qr-verification-7fe0c
```

**Variable 4:**
```
Name: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: qr-verification-7fe0c.firebasestorage.app
```

**Variable 5:**
```
Name: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: 140713435971
```

**Variable 6:**
```
Name: NEXT_PUBLIC_FIREBASE_APP_ID
Value: 1:140713435971:web:f6e2bee4cb5adafbed45f6
```

**Variable 7:**
```
Name: NEXT_PUBLIC_APP_URL
Value: https://your-app.vercel.app
```

## ✅ Verification Checklist

After adding all variables:

- [ ] All 7 environment variables added to Vercel
- [ ] App redeployed after adding variables
- [ ] `NEXT_PUBLIC_APP_URL` updated with actual domain
- [ ] Admin user created in Firebase
- [ ] Vercel domain added to Firebase authorized domains
- [ ] App tested and working in production

## 🎯 Next Steps

1. **Add these variables** to Vercel during deployment
2. **Deploy** your app
3. **Update** `NEXT_PUBLIC_APP_URL` with actual domain
4. **Create** admin user in Firebase
5. **Add** domain to Firebase authorized domains
6. **Test** your live app!

---

**Your Firebase Project**: `qr-verification-7fe0c`
**Admin Email**: `Ishanacharya@gmail.com`
**Admin Password**: `SecureQR@2026`

**Built with ❤️ by Ishan Acharya**