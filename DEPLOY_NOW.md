# 🚀 Deploy ScanX QR to Firebase NOW!

## Quick 5-Step Deployment

### Step 1: Free Up Disk Space (Important!)
```powershell
# Clear npm cache
npm cache clean --force

# Clear temp files (Windows)
# Go to C:\Users\ishan\AppData\Local\Temp
# Delete old files to free up space
```

### Step 2: Install Firebase CLI
```powershell
npm install -g firebase-tools
```

**If this fails due to disk space:**
- Download standalone installer: https://firebase.google.com/docs/cli#install-cli-windows
- Or use: `npx firebase-tools` instead of `firebase` in all commands

### Step 3: Login to Firebase
```powershell
firebase login
```

This opens your browser to login with Google.

### Step 4: Build Your App
```powershell
npm run build
```

### Step 5: Deploy!
```powershell
firebase deploy
```

---

## 🎯 Alternative: Use Deployment Script

### Windows (Recommended)
```powershell
.\deploy.bat
```

This script does everything automatically!

### Linux/Mac
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## ⚡ Quick Commands Reference

```powershell
# Full deployment (first time)
npm run deploy

# Deploy hosting only (faster updates)
npm run deploy:hosting

# Deploy security rules only
npm run deploy:rules

# Check before deploying
npm run deploy:check
```

---

## 🌐 Your Live URLs

After deployment, your app will be at:
- **Primary:** https://qr-verification-7fe0c.web.app
- **Alternative:** https://qr-verification-7fe0c.firebaseapp.com

---

## 🔐 Admin Access

**Login URL:** https://qr-verification-7fe0c.web.app/login

**Credentials:**
- Email: `Ishanacharya@gmail.com`
- Password: `SecureQR@2026`

---

## ✅ Verify Deployment

1. Visit: https://qr-verification-7fe0c.web.app
2. Check homepage loads
3. Test login with admin credentials
4. Try creating a vendor account
5. Test QR generation

---

## 🚨 Troubleshooting

### "Firebase command not found"
```powershell
# Use npx instead
npx firebase-tools login
npx firebase-tools deploy
```

### "No space left on device"
1. Clear npm cache: `npm cache clean --force`
2. Delete `.next` and `out` folders
3. Clear Windows temp files
4. Free up at least 500MB disk space

### "Build fails"
```powershell
# Clean and rebuild
Remove-Item -Recurse -Force .next, out
npm run build
```

### "Deployment fails"
```powershell
# Check if logged in
firebase login

# Check project
firebase projects:list

# Try deploying hosting only
firebase deploy --only hosting
```

---

## 📊 Deployment Status

After running `firebase deploy`, you should see:

```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/qr-verification-7fe0c
Hosting URL: https://qr-verification-7fe0c.web.app
```

---

## 🎉 Success Checklist

- [ ] Firebase CLI installed
- [ ] Logged into Firebase
- [ ] Build completed successfully
- [ ] Deployment completed successfully
- [ ] Can access live URL
- [ ] Homepage loads without errors
- [ ] Admin login works
- [ ] QR generation works

---

## 📞 Need Help?

1. **Read full guide:** [FIREBASE_DEPLOYMENT.md](./FIREBASE_DEPLOYMENT.md)
2. **Check Firebase Console:** https://console.firebase.google.com/project/qr-verification-7fe0c
3. **View deployment logs:** `firebase hosting:channel:list`

---

**Ready to deploy? Run:**
```powershell
.\deploy.bat
```

**Or manually:**
```powershell
npm run build
firebase deploy
```

🚀 **Let's go!**
