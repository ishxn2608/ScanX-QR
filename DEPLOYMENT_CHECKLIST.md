# ✅ Deployment Checklist - ScanX QR

Use this checklist to ensure successful deployment.

## 🔧 Pre-Deployment Setup

### Git Installation
- [ ] Git downloaded from https://git-scm.com/download/win
- [ ] Git installer run with default settings
- [ ] Terminal restarted after installation
- [ ] Git version verified: `git --version`
- [ ] Git configured with name: `git config --global user.name "Ishan Acharya"`
- [ ] Git configured with email: `git config --global user.email "Ishanacharya@gmail.com"`

### GitHub Account
- [ ] GitHub account created/logged in at https://github.com
- [ ] Personal Access Token created at https://github.com/settings/tokens
- [ ] Token copied and saved securely

## 📦 Repository Creation

### GitHub Repository
- [ ] New repository created at https://github.com/new
- [ ] Repository name: `scanx-qr`
- [ ] Description: `🔐 Secure QR Payment Verification System - Next.js 15 + Firebase`
- [ ] Visibility: Public (recommended)
- [ ] **NOT** initialized with README, .gitignore, or license
- [ ] Repository URL copied

### Local Git Setup
- [ ] Navigated to project directory: `cd C:\Users\ishan\Documents\secure-upi-payment`
- [ ] Git initialized: `git init`
- [ ] Files added: `git add .`
- [ ] First commit created: `git commit -m "Initial commit: ScanX QR Payment Verification System"`
- [ ] Main branch set: `git branch -M main`
- [ ] Remote added: `git remote add origin https://github.com/YOUR_USERNAME/scanx-qr.git`
- [ ] Code pushed: `git push -u origin main`
- [ ] Repository visible on GitHub with all files

## 🚀 Vercel Deployment

### Vercel Account Setup
- [ ] Vercel account created at https://vercel.com
- [ ] Signed in with GitHub account
- [ ] GitHub integration authorized

### Project Import
- [ ] "Add New..." → "Project" clicked
- [ ] `scanx-qr` repository selected
- [ ] Import confirmed

### Build Configuration
- [ ] Framework Preset: Next.js (auto-detected)
- [ ] Root Directory: `./` (default)
- [ ] Build Command: `npm run build` (default)
- [ ] Output Directory: `out` (configured in next.config.js)
- [ ] Install Command: `npm install` (default)

### Environment Variables
Copy from your `.env.local` file:

- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY` = `AIzaSyBvL_example_key`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = `qr-verification-7fe0c.firebaseapp.com`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = `qr-verification-7fe0c`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = `qr-verification-7fe0c.firebasestorage.app`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = `your_sender_id`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID` = `your_app_id`
- [ ] `NEXT_PUBLIC_APP_URL` = `https://your-app.vercel.app` (update after deployment)

### Deployment
- [ ] "Deploy" button clicked
- [ ] Build process completed successfully (2-3 minutes)
- [ ] Deployment URL received (e.g., `https://scanx-qr.vercel.app`)
- [ ] Site accessible at deployment URL

## 🔧 Post-Deployment Configuration

### Firebase Setup
- [ ] Firebase Console opened: https://console.firebase.google.com
- [ ] Project `qr-verification-7fe0c` selected
- [ ] Authentication → Settings → Authorized domains opened
- [ ] Vercel domain added (e.g., `scanx-qr.vercel.app`)
- [ ] Changes saved

### Environment Variable Update
- [ ] Vercel Dashboard → Project → Settings → Environment Variables opened
- [ ] `NEXT_PUBLIC_APP_URL` updated to actual deployment URL
- [ ] Changes saved
- [ ] Redeploy triggered: Deployments → Latest → "Redeploy"

### Admin Account Setup
- [ ] Firebase Console → Authentication → Users opened
- [ ] Admin user created:
  - Email: `Ishanacharya@gmail.com`
  - Password: `SecureQR@2026`
- [ ] User verified in Firebase

## 🧪 Production Testing

### Basic Functionality
- [ ] Landing page loads correctly
- [ ] Logo "ScanX QR" visible
- [ ] Navigation works
- [ ] Responsive design on mobile

### Authentication
- [ ] Register page accessible
- [ ] User registration works
- [ ] Login page accessible
- [ ] User login works
- [ ] Admin login works (Ishanacharya@gmail.com)
- [ ] Admin redirected to admin dashboard
- [ ] Logout works

### Vendor Flow
- [ ] Vendor registration works
- [ ] Vendor status shows "pending"
- [ ] Admin can see vendor request
- [ ] Admin can approve vendor
- [ ] Approved vendor can create shops
- [ ] QR code generation works
- [ ] QR codes display correctly

### Customer Flow
- [ ] Customer registration works
- [ ] QR code scanning works
- [ ] Vendor details display correctly
- [ ] Verification status shows

### Performance
- [ ] Page load times acceptable (<3 seconds)
- [ ] No console errors in browser
- [ ] Mobile performance good
- [ ] Images load correctly

## 🔒 Security Verification

### Environment Variables
- [ ] No sensitive data in GitHub repository
- [ ] `.env.local` not committed to Git
- [ ] All Firebase config in environment variables
- [ ] No API keys visible in source code

### Firebase Security
- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Admin access restricted to correct email
- [ ] Unauthorized access blocked

### HTTPS
- [ ] Site served over HTTPS
- [ ] No mixed content warnings
- [ ] SSL certificate valid

## 📊 Monitoring Setup

### Vercel Analytics (Optional)
- [ ] Vercel Analytics enabled in dashboard
- [ ] Analytics script added to site

### Error Tracking (Optional)
- [ ] Error tracking service configured (Sentry, etc.)
- [ ] Error notifications set up

## 📱 Final Checks

### Cross-Browser Testing
- [ ] Chrome: Works correctly
- [ ] Firefox: Works correctly
- [ ] Safari: Works correctly
- [ ] Edge: Works correctly

### Device Testing
- [ ] Desktop: Works correctly
- [ ] Tablet: Works correctly
- [ ] Mobile: Works correctly

### Feature Completeness
- [ ] All features from development working in production
- [ ] No broken links
- [ ] All images loading
- [ ] All forms working
- [ ] Database operations working

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Site is live and accessible
- ✅ All authentication flows work
- ✅ Admin can approve vendors
- ✅ Vendors can create QR codes
- ✅ Customers can scan QR codes
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Fast loading times
- ✅ Secure (HTTPS, no exposed secrets)

## 📝 Post-Deployment Tasks

### Documentation
- [ ] Update README.md with live demo URL
- [ ] Add deployment URL to GitHub repository description
- [ ] Update any documentation with production URLs

### Sharing
- [ ] Share on LinkedIn
- [ ] Add to portfolio
- [ ] Share with team/clients
- [ ] Add to resume/CV

### Maintenance
- [ ] Set up monitoring alerts
- [ ] Plan regular updates
- [ ] Monitor usage analytics
- [ ] Plan feature additions

## 🐛 Troubleshooting

### Common Issues

**Build Fails on Vercel**
- Check environment variables are set correctly
- Verify no TypeScript errors locally
- Check build logs in Vercel dashboard

**Authentication Not Working**
- Verify Firebase authorized domains include Vercel domain
- Check environment variables match Firebase config
- Verify admin user exists in Firebase

**QR Codes Not Working**
- Check Firestore rules are deployed
- Verify database operations work in Firebase console
- Check browser console for errors

**Site Not Loading**
- Check deployment status in Vercel
- Verify DNS settings if using custom domain
- Check for any blocking errors in logs

## 📞 Support

If you encounter issues:

1. **Check this checklist** - Most issues are covered here
2. **Review error logs** - Vercel dashboard → Functions → View logs
3. **Check Firebase logs** - Firebase console → Functions → Logs
4. **GitHub Issues** - Open an issue in your repository
5. **Vercel Support** - https://vercel.com/support
6. **Developer** - [Ishan Acharya on LinkedIn](https://www.linkedin.com/in/ishan-acharya-939112295/)

## ⏱️ Time Estimates

- **Git Setup**: 5 minutes
- **GitHub Repository**: 3 minutes
- **Vercel Deployment**: 5 minutes
- **Firebase Configuration**: 3 minutes
- **Testing**: 10 minutes
- **Total**: ~25 minutes

## 🎯 Next Steps After Deployment

1. **Custom Domain** (Optional): Add your own domain in Vercel
2. **Analytics**: Set up Google Analytics or Vercel Analytics
3. **SEO**: Add meta tags and sitemap
4. **Features**: Plan and add new features
5. **Marketing**: Share your app with users

---

**Congratulations on your deployment! 🎊**

**Built with ❤️ by Ishan Acharya**