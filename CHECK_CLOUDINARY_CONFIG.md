# 🔍 Cloudinary Configuration Check

## Abhi Kya Karna Hai

### Step 1: Browser Console Kholo

1. **Browser mein jao** jahan app chal raha hai
2. **F12 press karo** (DevTools khulega)
3. **Console tab** click karo
4. **Console clear karo** (trash icon click karo)

---

### Step 2: Image Upload Try Karo

1. **Shop create karo**
2. **Image select karo**
3. **"Create Shop" click karo**
4. **Console mein dekho** kya error aa raha hai

---

### Step 3: Error Message Dekho

Console mein ye dikhna chahiye:

#### ✅ Agar Sahi Configured Hai:
```
🔧 Cloudinary config: { cloudName: 'dxmqqnpxw', uploadPreset: 'scanx_shops' }
📤 Uploading to Cloudinary...
✅ Cloudinary upload successful: https://...
```

#### ❌ Agar Error Hai:

**Error 1:**
```
❌ Cloudinary error: { error: { message: "Upload preset not found" } }
```
**Fix:** Upload preset `scanx_shops` banao (Unsigned mode mein)

**Error 2:**
```
❌ Cloudinary error: { error: { message: "Upload preset must be unsigned" } }
```
**Fix:** Preset ko "Unsigned" mode mein change karo

**Error 3:**
```
❌ Cloudinary error: { error: { message: "Invalid cloud name" } }
```
**Fix:** Cloud name `dxmqqnpxw` check karo `.env.local` mein

**Error 4:**
```
Cloudinary cloud name not configured
```
**Fix:** `.env.local` mein ye add karo:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxmqqnpxw
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=scanx_shops
```

---

### Step 4: Environment Variables Verify Karo

Terminal mein ye command run karo:

```bash
npm run dev
```

Server start hone ke baad, console mein ye dikhna chahiye:
```
🔧 Cloudinary config: { cloudName: 'dxmqqnpxw', uploadPreset: 'scanx_shops' }
```

Agar `cloudName: 'your-cloud-name'` dikhe toh `.env.local` sahi se configure nahi hai.

---

## 🎯 Quick Fix Commands

### Check if .env.local exists:
```bash
dir .env.local
```

### View .env.local content:
```bash
type .env.local
```

### Add variables (if missing):
```bash
echo NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxmqqnpxw >> .env.local
echo NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=scanx_shops >> .env.local
```

### Restart server:
```bash
# Press Ctrl+C
npm run dev
```

---

## 📋 Checklist

Upload try karne se pehle ye sab check karo:

- [ ] `.env.local` file exists
- [ ] File mein `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxmqqnpxw` hai
- [ ] File mein `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=scanx_shops` hai
- [ ] Server restart kiya
- [ ] Browser console open hai (F12)
- [ ] Upload preset Cloudinary mein "Unsigned" mode mein hai

---

## 🆘 Still Not Working?

Mujhe ye batao:

1. **Browser console mein exact error message kya hai?**
2. **`.env.local` file ka content kya hai?** (Run: `type .env.local`)
3. **Upload preset Cloudinary mein dikhta hai?** (Check: https://cloudinary.com/console/settings/upload)
4. **Preset "Unsigned" mode mein hai?**

---

**Next:** Browser console ka screenshot ya error message share karo
