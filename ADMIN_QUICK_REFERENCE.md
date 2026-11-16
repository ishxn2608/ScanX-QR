# 🎯 Admin Dashboard - Quick Reference

## 🔐 Login
```
URL: http://localhost:3000/login
Email: Ishanacharya@gmail.com
Password: SecureQR@2026
```

---

## 📊 Dashboard Overview

### Stats (Top Row)
| Stat | What It Means | Action Needed |
|------|---------------|---------------|
| **Total Vendors** | All registered vendors | None |
| **Pending Vendors** | Vendors awaiting approval | Go to Vendors tab → Approve |
| **Total Shops** | All created shops | None |
| **Pending Shops** | Shops awaiting QR verification | Go to Shops tab → Verify |

---

## 📑 Tabs

### 1️⃣ Vendors Tab
**Purpose:** Approve/reject vendor accounts

**Filters:**
- **Pending** (default) - Vendors awaiting approval
- **Approved** - Active vendors
- **Rejected** - Denied vendors
- **All** - All vendors

**Actions:**
- ✓ **Approve** - Allow vendor to create shops
- ✕ **Reject** - Deny vendor access

---

### 2️⃣ Shops Tab
**Purpose:** Verify shop QR codes

**Filters:**
- **Pending Verification** (default) - Shops awaiting QR approval
- **Verified** - Approved shops
- **All Shops** - All shops

**Visual Indicators:**
- 🟡 **Yellow border** = Pending verification
- ⚠️ **Warning banner** = Action required
- ⏳ **Pending badge** = Not verified yet
- ✓ **Verified badge** = Approved

**Actions:**
- ✓ **Verify Shop** - Approve QR code for use
- ✕ **Unverify** - Revoke verification

---

### 3️⃣ Transactions Tab
**Purpose:** View payment history

**Shows:**
- Shop name
- Amount paid
- Timestamp
- Status

---

## 🔄 Workflow

### Vendor Approval Workflow
```
1. Vendor registers → Status: Pending
2. Admin sees in "Vendors" tab (Pending filter)
3. Admin clicks "✓ Approve"
4. Vendor can now create shops
```

### Shop Verification Workflow
```
1. Vendor creates shop → verified: false
2. Admin sees in "Shops" tab (Pending Verification filter)
3. Shop has yellow highlight + warning banner
4. Admin clicks "✓ Verify Shop"
5. Shop is now active → verified: true
6. Vendor can use QR code
```

---

## 🎨 Visual Guide

### Pending Vendor Card
```
┌─────────────────────────────────────────┐
│ John Doe                    ⏳ Pending  │
│ 📧 john@example.com                     │
│ 📱 +91 9876543210                       │
│ 📅 Registered: 2026-04-23               │
│                                         │
│     [✓ Approve]    [✕ Reject]          │
└─────────────────────────────────────────┘
```

### Pending Shop Card
```
┌─────────────────────────────────────────────┐
│ ⚠️ Pending QR Verification - Action Required│ ← Yellow banner
├─────────────────────────────────────────────┤
│ [Image]  My Shop            ⏳ Pending      │
│          📱 UPI: myshop@upi                 │
│          🔑 Token: abc123...                │
│          📅 Created: 2026-04-23             │
│          ⚡ Status: Active                  │
│                                             │
│                      ┌──────────────────┐   │
│                      │ ✓ Verify Shop    │   │
│                      └──────────────────┘   │
│                      Click to approve QR    │
└─────────────────────────────────────────────┘
   ↑ Yellow border
```

### Verified Shop Card
```
┌─────────────────────────────────────────────┐
│ [Image]  My Shop            ✓ Verified      │
│          📱 UPI: myshop@upi                 │
│          🔑 Token: abc123...                │
│          📅 Created: 2026-04-23             │
│          ⚡ Status: Active                  │
│                                             │
│                      ┌──────────────────┐   │
│                      │ ✕ Unverify       │   │
│                      └──────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## ⚡ Quick Actions

### Approve Vendor
1. Go to **Vendors** tab
2. Click **Pending** filter
3. Find vendor
4. Click **✓ Approve**
5. ✅ Done

### Verify Shop QR
1. Go to **Shops** tab
2. Click **Pending Verification** filter (default)
3. Find shop with yellow highlight
4. Click **✓ Verify Shop**
5. ✅ Done

### View Transactions
1. Go to **Transactions** tab
2. Scroll through recent payments
3. Check amounts and timestamps

---

## 🔍 What to Look For

### ✅ Good Signs
- Stats show correct counts
- Pending items have visual highlights
- Buttons work without errors
- Success messages appear
- Real-time updates work (no manual refresh needed)

### ⚠️ Warning Signs
- No pending items showing (might be none created yet)
- Stats show 0 (might be correct if nothing pending)
- Filters not working (check browser console)

### ❌ Error Signs
- "Permission denied" errors → Deploy Firestore rules
- "Not admin" message → Check login credentials
- Items not loading → Check Firebase connection
- Buttons not working → Check browser console

---

## 🐛 Troubleshooting

### Issue: Can't login
**Solution:** Verify credentials
```
Email: Ishanacharya@gmail.com (case-sensitive)
Password: SecureQR@2026
```

### Issue: No pending vendors/shops
**Solution:** Create test accounts
- Vendors: Register at `/register-simple` with role "Vendor"
- Shops: Login as vendor → Create shop

### Issue: Can't approve/verify
**Solution:** Deploy Firestore rules
```bash
./deploy-rules.bat
```

### Issue: Items not refreshing
**Solution:** 
- Wait 5 seconds (auto-refresh)
- Or manually refresh page (F5)
- Check browser console for errors

---

## 📱 URLs

| Page | URL |
|------|-----|
| **Admin Login** | http://localhost:3000/login |
| **Admin Dashboard** | http://localhost:3000/admin/dashboard |
| **Debug Page** | http://localhost:3000/admin/debug |
| **Register Vendor** | http://localhost:3000/register-simple |

---

## 🔧 Console Commands

```bash
# Start development server
npm run dev

# Deploy Firestore rules
./deploy-rules.bat

# Check Firebase project
firebase use

# Login to Firebase
firebase login
```

---

## 📊 Stats Meaning

| Color | Meaning | Priority |
|-------|---------|----------|
| 🔵 Blue | Informational | Low |
| 🟡 Yellow | Needs attention | Medium |
| 🟣 Purple | Informational | Low |
| 🟠 Orange | Action required | High |
| 🟢 Green | Success/Active | Low |
| 🔴 Red | Error/Rejected | Medium |

---

## ⏱️ Auto-Refresh

- **Vendors:** Real-time updates (instant)
- **Shops:** Refresh every 5 seconds
- **Transactions:** Refresh every 5 seconds

No need to manually refresh the page!

---

## 🎯 Daily Tasks

### Morning Check
1. Login to admin dashboard
2. Check "Pending Vendors" stat
3. Check "Pending Shops" stat
4. Approve any pending vendors
5. Verify any pending shops

### Throughout Day
- Dashboard auto-refreshes
- New requests appear automatically
- Approve/verify as they come in

### End of Day
1. Check "Transactions" tab
2. Review payment activity
3. Verify all pending items processed

---

## 📞 Need Help?

1. **Check Debug Page:** http://localhost:3000/admin/debug
2. **Check Browser Console:** Press F12
3. **Read Documentation:**
   - `QUICK_START_SHOP_VERIFICATION.md` - Testing guide
   - `SHOP_VERIFICATION_FIX.md` - Technical details
   - `ISSUE_RESOLVED_SUMMARY.md` - What was fixed

---

**Last Updated:** 2026-04-23  
**Version:** 1.0  
**Status:** ✅ Active
