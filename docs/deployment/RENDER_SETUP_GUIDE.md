# 🚀 Deploy Backend to Render - Complete Guide

## Step 1: Go to Render
👉 **https://dashboard.render.com**

---

## Step 2: Sign Up / Log In
- Click **"Get Started"** or **"Sign In"**
- Use **GitHub** to sign in (easiest!)
- Free tier, no credit card required ✅

---

## Step 3: Create New Web Service

1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Build and deploy from a Git repository"**
4. Click **"Next"**

---

## Step 4: Connect GitHub Repository

1. If not connected, click **"Connect GitHub"**
2. Authorize Render to access your repositories
3. Find and select **"Outsider"** repository
4. Click **"Connect"**

---

## Step 5: Configure Your Web Service

### ⚙️ Basic Settings:

| Field | Value |
|-------|-------|
| **Name** | `outsider-server` (or any name you want) |
| **Region** | Choose closest to you (e.g., Oregon USA) |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

---

## Step 6: Choose Plan

- Select **"Free"** plan ✅
- Free tier includes:
  - ✅ 750 hours/month (enough for 24/7)
  - ✅ Auto-deploy from GitHub
  - ⚠️ Sleeps after 15 min inactivity
  - ⚠️ Takes ~30s to wake up

---

## Step 7: Add Environment Variables

Click **"Add Environment Variable"** and add:

### Variable 1:
```
Key:   NODE_ENV
Value: production
```

### Variable 2:
```
Key:   CLIENT_URL
Value: https://your-cloudflare-url.pages.dev
```

**Replace with your actual Cloudflare URL!** (e.g., `https://outsider-game.pages.dev`)

### Variable 3 (Optional - for custom port):
```
Key:   PORT
Value: 3001
```

---

## Step 8: Deploy!

1. Review all settings
2. Click **"Create Web Service"**
3. Wait 2-5 minutes for first deploy
4. Watch the build logs in real-time

---

## Step 9: Get Your Backend URL

Once deployed, you'll see:
```
Your service is live at https://outsider-server.onrender.com
```

**Copy this URL!** You'll need it for:
1. Updating Cloudflare environment variables
2. Testing your game

---

## Step 10: Update Cloudflare with Backend URL

Now go back to **Cloudflare Pages**:

1. Go to your project settings
2. Click **"Environment variables"**
3. Edit `VITE_SERVER_URL`
4. Set value to: `https://outsider-server.onrender.com` (your Render URL)
5. Click **"Save"**
6. Redeploy: Go to **"Deployments"** → **"Retry deployment"**

---

## Step 11: Update Backend CORS

Your backend needs to allow requests from Cloudflare. Let me do this for you!

---

## 🎮 Test Your Game

1. Visit your Cloudflare URL: `https://outsider-game.pages.dev`
2. Enter a nickname
3. Click "Create Room"
4. If it works, you're done! 🎉

---

## 🔧 Troubleshooting

### Backend shows "Service Unavailable"?
- Check build logs in Render dashboard
- Make sure `server/package.json` exists
- Verify `npm start` works locally

### CORS errors in browser console?
- Make sure you added `CLIENT_URL` environment variable
- Check the URL matches exactly (no trailing slash)
- Redeploy backend after changing env vars

### Backend sleeps/wakes slowly?
- This is normal on free tier
- First player waits 30s for backend to wake
- Solution: Use UptimeRobot to ping every 10 min (keeps it awake)

---

## 🆓 Keep Backend Awake (Optional)

### Use UptimeRobot (Free):

1. Go to **https://uptimerobot.com**
2. Sign up (free)
3. Click **"Add New Monitor"**
4. Configure:
   ```
   Monitor Type: HTTPS
   Friendly Name: Outsider Backend
   URL: https://outsider-server.onrender.com
   Monitoring Interval: 5 minutes
   ```
5. Click **"Create Monitor"**

Now your backend never sleeps! 🎉

---

## 📊 What You Get (Free Forever)

✅ 750 hours/month (24/7 uptime)
✅ Auto-deploy from GitHub
✅ Free SSL certificate
✅ Custom domains supported
✅ Build logs and monitoring
✅ Zero configuration needed
⚠️ Sleeps after 15 min (unless using UptimeRobot)

---

## 🔄 Future Updates

Every time you push to GitHub:
```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render automatically rebuilds and deploys! 🚀

---

## 📱 Your Complete Setup

**Frontend (Cloudflare):**
`https://outsider-game.pages.dev`

**Backend (Render):**
`https://outsider-server.onrender.com`

**GitHub:**
`https://github.com/colettijohn/Outsider`

---

## 🎉 You're All Set!

Your multiplayer game is now:
- 🌍 Live globally
- ⚡ Fast (Cloudflare CDN)
- 🔒 Secure (HTTPS)
- 🆓 100% free
- 🤖 Auto-deploys

**Time to play!** 🎮✨
