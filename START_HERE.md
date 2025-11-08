# 🎯 START HERE - Deploy Your Game in 3 Steps

**Everything is ready!** Your code is pushed to GitHub. Follow these steps to go live.

---

## 📍 You Are Here

✅ Local development works  
✅ Code pushed to GitHub  
✅ All deployment files created  
✅ Build tested successfully  

**Next:** Deploy to production!

---

## 🚀 Step 1: Deploy Server to Render (10 minutes)

### 1.1 Create Account
Go to: **https://dashboard.render.com/register**
- Sign up with GitHub (recommended)

### 1.2 Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Click **"Connect account"** → Authorize GitHub
3. Select repository: **"Outsider"**
4. Click **"Connect"**

### 1.3 Configure Service
Fill in these fields:

| Field | Value |
|-------|-------|
| **Name** | `outsider-server` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### 1.4 Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these **2 variables**:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `TEMP` (we'll update this after Netlify) |

### 1.5 Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. ⚠️ **IMPORTANT:** Copy your server URL!
   - Look for: `https://outsider-server-xxxx.onrender.com`
   - **Save this URL!** You'll need it for Netlify

### 1.6 Test Server
Visit: `https://your-server-url.onrender.com/`

Should see:
```json
{
  "status": "ok",
  "service": "Outsider: Cosmic Council Server",
  ...
}
```

✅ **Step 1 Complete!** Server is live.

---

## 🌐 Step 2: Deploy Frontend to Netlify (10 minutes)

### 2.1 Create Account
Go to: **https://app.netlify.com/signup**
- Sign up with GitHub (recommended)

### 2.2 Create New Site
1. Click **"Add new site"** → **"Import an existing project"**
2. Click **"Deploy with GitHub"**
3. Select repository: **"Outsider"**
4. Click **"Install"** if prompted

### 2.3 Configure Build
These should auto-fill from `netlify.toml`, verify:

| Field | Value |
|-------|-------|
| **Branch** | `main` |
| **Build command** | `npm run build` |
| **Publish directory** | `dist` |

### 2.4 Add Environment Variable
**BEFORE deploying**, scroll down:

1. Click **"Show advanced"**
2. Click **"New variable"**
3. Add:

| Key | Value |
|-----|-------|
| `VITE_SERVER_URL` | `https://your-render-url.onrender.com` |

⚠️ **Use YOUR Render URL from Step 1!**

### 2.5 Deploy
1. Click **"Deploy site"**
2. Wait 2-5 minutes
3. Site will be live at: `https://random-name-123.netlify.app`
4. **Save this URL!**

### 2.6 Customize Domain (Optional)
1. Click **"Site settings"**
2. Click **"Change site name"**
3. Enter: `outsider-cosmic-council` (or your choice)
4. Your URL becomes: `https://outsider-cosmic-council.netlify.app`

✅ **Step 2 Complete!** Frontend is live.

---

## 🔄 Step 3: Update Server CORS (5 minutes)

Your frontend can't connect yet because server doesn't recognize it.

### 3.1 Update Render Environment Variable
1. Go back to **Render dashboard**
2. Click on your **"outsider-server"** service
3. Click **"Environment"** tab
4. Find **`CLIENT_URL`**
5. Click **"Edit"**
6. Change from `TEMP` to your Netlify URL:
   - `https://outsider-cosmic-council.netlify.app`
   - ⚠️ **No trailing slash!**
7. Click **"Save Changes"**
8. Server will automatically redeploy (~2 minutes)

✅ **Step 3 Complete!** Everything connected.

---

## 🧪 Test Your Deployment (5 minutes)

### Test 1: Server Health
Visit: `https://your-server.onrender.com/`
- ✅ Should return JSON with `"status": "ok"`

### Test 2: Frontend Loads
Visit: `https://your-app.netlify.app`
- ✅ Should see home screen
- ✅ No errors in browser console (F12)

### Test 3: Room Creation
1. Click **"Create Room"**
2. Enter nickname
3. ✅ Should get a 4-letter room code

### Test 4: Multiplayer
1. Copy room code
2. Open app in **incognito/private window**
3. Click **"Join Room"**
4. Enter room code
5. ✅ Both windows should show both players

### Test 5: Full Game
1. Select some question categories
2. Click **"Start Game"** (need 3 players or add bots)
3. ✅ Game should run smoothly
4. ✅ Chat should work
5. ✅ Voting should work

---

## 🎉 Success!

**If all tests pass, you're LIVE!**

Your game is now deployed at:
- 🌐 **Frontend:** `https://your-app.netlify.app`
- 🔧 **Backend:** `https://your-server.onrender.com`

### Share with Friends!
Send them your Netlify URL. They can:
1. Create or join rooms
2. Play together in real-time
3. No installation needed!

---

## ⚠️ Important Notes

### First-Time Load (Free Tier)
- Render free tier **sleeps after 15 minutes**
- First request takes **~30 seconds** to wake up
- This is normal! Subsequent requests are fast
- **Upgrade to $7/month** for always-on

### Monitoring
Check these regularly:
- **Render Logs:** Dashboard → Your Service → Logs
- **Netlify Deploys:** Dashboard → Deploys
- **Server Stats:** `https://your-server.onrender.com/stats`

---

## 🐛 If Something Goes Wrong

### Can't connect to server?
1. Check `VITE_SERVER_URL` in Netlify environment variables
2. Rebuild Netlify site after adding variable
3. Visit server health endpoint to verify it's running

### CORS error?
1. Verify `CLIENT_URL` in Render matches Netlify URL exactly
2. Check Render logs for "CORS blocked" messages
3. Ensure no trailing slashes in URLs

### Build fails?
1. Check Netlify deploy logs for specific error
2. Verify Node version is 18+ (should be in netlify.toml)
3. Run `npm run build` locally to test

**Need more help?**
- 📖 See `DEPLOYMENT_TROUBLESHOOTING.md` for detailed solutions
- 📋 See `DEPLOYMENT_GUIDE.md` for comprehensive instructions

---

## 💰 Cost Summary

**Current Setup (Free Tier):**
- Netlify: $0/month
- Render: $0/month
- **Total: $0/month**

**Limitations:**
- Server sleeps after 15 minutes (30s wake time)
- Limited bandwidth
- Suitable for testing & personal use

**Upgrade When Ready:**
- Netlify Pro: $19/month (more bandwidth)
- Render Starter: $7/month (always-on, no sleep)

---

## ✅ Deployment Checklist

Copy this to track your progress:

```
[ ] Step 1: Deploy server to Render
    [ ] 1.1 Create Render account
    [ ] 1.2 Create web service
    [ ] 1.3 Configure service settings
    [ ] 1.4 Add environment variables
    [ ] 1.5 Deploy and copy server URL
    [ ] 1.6 Test server health endpoint

[ ] Step 2: Deploy frontend to Netlify  
    [ ] 2.1 Create Netlify account
    [ ] 2.2 Create new site
    [ ] 2.3 Configure build settings
    [ ] 2.4 Add VITE_SERVER_URL variable
    [ ] 2.5 Deploy and copy frontend URL
    [ ] 2.6 (Optional) Customize domain

[ ] Step 3: Connect frontend to backend
    [ ] 3.1 Update CLIENT_URL in Render
    [ ] 3.2 Wait for server to redeploy

[ ] Test deployment
    [ ] Server health check works
    [ ] Frontend loads without errors
    [ ] Can create room
    [ ] Can join room from another browser
    [ ] Game plays through completely

[ ] Share with friends! 🎉
```

---

## 🚀 You're Done!

**Total time:** ~30 minutes  
**Cost:** $0 (free tier)  
**Result:** Fully deployed multiplayer game!

Go celebrate! 🎮✨🌌

---

**Questions?** Check the other deployment guides:
- `DEPLOYMENT_GUIDE.md` - Full detailed instructions
- `DEPLOYMENT_TROUBLESHOOTING.md` - Solutions to common issues
- `DEPLOYMENT_QUICK_REFERENCE.md` - Quick command reference
