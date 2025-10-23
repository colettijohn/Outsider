# 🔧 Bug Diagnosis Checklist

## Please answer these questions to help me fix the issues:

### 1️⃣ What exactly is broken?
- [ ] Home screen doesn't load
- [ ] Can't enter nickname
- [ ] Admin panel doesn't open
- [ ] Quick Ritual doesn't load
- [ ] Full Customize doesn't load
- [ ] Card Browser doesn't load
- [ ] Game screens don't work
- [ ] Other: _______________

### 2️⃣ What happens when you try?
- [ ] Blank white screen
- [ ] Screen shows but nothing works
- [ ] Buttons don't respond
- [ ] Gets stuck loading
- [ ] Error message appears
- [ ] Something else: _______________

### 3️⃣ Browser Console Errors?
Press F12 → Console tab → Copy any red errors here:
```
(paste errors here)
```

### 4️⃣ Which screens have you tested?
- [ ] Home screen
- [ ] Admin panel (Shift + A)
- [ ] Quick Ritual
- [ ] Full Customize
- [ ] Card Browser
- [ ] Lobby
- [ ] Game

---

## 🚀 Quick Fixes to Try:

### Fix 1: Hard Refresh
1. Press `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac)
2. This clears cache and reloads

### Fix 2: Clear Browser Cache
1. Press `F12`
2. Right-click the refresh button
3. Click "Empty Cache and Hard Reload"

### Fix 3: Restart Dev Server
Stop the terminal (Ctrl + C) and run:
```bash
npm run dev
```

### Fix 4: Check if files are saved
Make sure all files in VS Code are saved (no white dots on tabs)

### Fix 5: Reinstall Dependencies
```bash
npm install
npm run dev
```

---

## 🔍 Common Issues & Solutions

### Issue: "Admin panel opens but buttons do nothing"
**Status:** FIXED in last commit
**Solution:** Hard refresh (Ctrl + Shift + R)

### Issue: "Quick Ritual shows blank screen"
**Possible causes:**
- Feature flags disabled
- OracleAI service not loading
- Component import issue

**Check:** Open src/config/features.js and verify all flags are `true`

### Issue: "Everything shows 'Loading...'"
**Possible cause:** Screen name mismatch
**Solution:** Check browser console for errors

### Issue: "Can't see new screens"
**Solution:** Make sure you're using Admin Panel to navigate, not regular buttons

---

## 🛠️ Debug Commands

### Check if build works:
```bash
npm run build
```

### Check for syntax errors:
```bash
npm run dev
```
(Look for red errors in terminal)

### Test specific component:
Open browser console and type:
```javascript
console.log(window.location.href)
```

---

## 📊 Current Status Check

Let me verify what's working:

1. **Is the dev server running?**
   - Look for: `Local: http://localhost:3001/`
   - If not running, start it: `npm run dev`

2. **Can you access the home screen?**
   - Go to: http://localhost:3001
   - Should see the Outsider logo

3. **Can you open admin panel?**
   - Press `Shift + A`
   - Enter password: `0`
   - Should see navigation buttons

4. **What happens when you click "⚡ Quick Ritual"?**
   - Does the screen change?
   - Do you see the Oracle?
   - Any errors?

---

## 🎯 Tell Me Specifically:

**Please describe in detail:**

1. What you're trying to do:
   ```
   (example: "I click Quick Ritual button in Admin Panel")
   ```

2. What actually happens:
   ```
   (example: "Nothing happens, screen stays the same")
   ```

3. Any error messages you see:
   ```
   (copy exact error messages from console)
   ```

4. What browser are you using:
   ```
   (Chrome, Firefox, Edge, Safari, etc.)
   ```

---

Once you give me these details, I can fix it immediately! 🚀
