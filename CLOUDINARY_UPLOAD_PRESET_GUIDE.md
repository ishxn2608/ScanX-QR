# 🔧 Cloudinary Upload Preset Setup (Step-by-Step)

## Problem
"Upload failed" error aa raha hai kyunki upload preset sahi se configure nahi hua.

---

## ✅ Solution: Upload Preset Correctly Banao

### Step 1: Cloudinary Dashboard Kholo

```
https://cloudinary.com/console
```

Login karo apne account se.

---

### Step 2: Settings Mein Jao

1. **Left sidebar** mein dekho
2. **"Settings"** (gear icon ⚙️) click karo
3. Ya direct link: https://cloudinary.com/console/settings/upload

---

### Step 3: Upload Tab Kholo

1. Top menu mein **"Upload"** tab click karo
2. **"Upload presets"** section dikhega
3. Neeche **"Add upload preset"** button dikhega

---

### Step 4: Upload Preset Banao

1. **"Add upload preset"** button click karo

2. **Form fill karo EXACTLY aise:**

   **Upload preset name:**
   ```
   scanx_shops
   ```
   
   **Signing Mode:** (Dropdown)
   ```
   Unsigned
   ```
   ⚠️ **IMPORTANT:** "Unsigned" select karna ZAROORI hai!
   
   **Folder:** (Optional but recommended)
   ```
   scanx-shops
   ```

3. **"Save"** button click karo

---

### Step 5: Verify Preset

Upload presets list mein ye dikhna chahiye:

```
Preset Name: scanx_shops
Mode: Unsigned ✅
```

---

### Step 6: Environment Variables Check Karo

`.env.local` file mein ye hona chahiye:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxmqqnpxw
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=scanx_shops
```

⚠️ **Check karo:**
- Spelling sahi hai?
- Extra spaces nahi hain?
- `scanx_shops` exactly same hai?

---

### Step 7: Server Restart Karo

```bash
# Terminal mein:
# Ctrl+C se band karo
# Phir:
npm run dev
```

---

### Step 8: Test Karo

1. Browser console kholo (F12)
2. Shop create karo with image
3. Console mein ye dikhna chahiye:

```
🔧 Cloudinary config: { cloudName: 'dxmqqnpxw', uploadPreset: 'scanx_shops' }
📤 Uploading to Cloudinary...
✅ Cloudinary upload successful: https://...
```

---

## 🔍 Common Mistakes

### ❌ Mistake 1: Preset "Signed" mode mein hai
**Fix:** Preset edit karo, "Unsigned" select karo

### ❌ Mistake 2: Preset name galat hai
**Fix:** Exactly `scanx_shops` hona chahiye (underscore ke saath)

### ❌ Mistake 3: .env.local update nahi kiya
**Fix:** File mein variables add karo aur server restart karo

### ❌ Mistake 4: Server restart nahi kiya
**Fix:** Ctrl+C karke `npm run dev` phir se run karo

---

## 🆘 Agar Abhi Bhi Error Aaye

### Check Browser Console (F12)

Error message dekho:

**Error: "Cloudinary cloud name not configured"**
→ `.env.local` mein cloud name add karo

**Error: "Invalid upload preset"**
→ Preset name check karo, exactly `scanx_shops` hona chahiye

**Error: "Upload preset must be unsigned"**
→ Preset ko "Unsigned" mode mein change karo

**Error: "Invalid cloud name"**
→ Cloud name `dxmqqnpxw` sahi se likha hai check karo

---

## ✅ Quick Verification Commands

### Check Environment Variables:
```bash
# Windows
echo %NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME%
echo %NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET%
```

Output hona chahiye:
```
dxmqqnpxw
scanx_shops
```

---

## 📋 Complete Checklist

- [ ] Cloudinary account logged in
- [ ] Upload preset `scanx_shops` created
- [ ] Preset mode is "Unsigned"
- [ ] `.env.local` has cloud name: `dxmqqnpxw`
- [ ] `.env.local` has preset: `scanx_shops`
- [ ] File saved
- [ ] Server restarted
- [ ] Browser console open (F12)
- [ ] Test upload

---

## 🎯 Direct Links

**Upload Presets Page:**
```
https://cloudinary.com/console/settings/upload
```

**Media Library (to see uploaded images):**
```
https://cloudinary.com/console/media_library
```

---

## 📸 What You Should See

### In Upload Presets List:
```
┌─────────────────────────────────────┐
│ Upload Presets                      │
├─────────────────────────────────────┤
│ scanx_shops                         │
│ Mode: Unsigned                      │
│ Folder: scanx-shops                 │
└─────────────────────────────────────┘
```

### In Browser Console (After Upload):
```
🔧 Cloudinary config: { cloudName: 'dxmqqnpxw', uploadPreset: 'scanx_shops' }
📤 Uploading to Cloudinary...
✅ Cloudinary upload successful: https://res.cloudinary.com/dxmqqnpxw/...
```

---

## 🔄 Alternative: Use Default Preset

Agar custom preset nahi ban raha, toh Cloudinary ka default unsigned preset use karo:

1. Go to: https://cloudinary.com/console/settings/upload
2. Look for any preset with "Unsigned" mode
3. Use that preset name in `.env.local`

---

**Time needed:** 3 minutes  
**Difficulty:** Easy  
**Success rate:** 100% if steps followed correctly ✅
