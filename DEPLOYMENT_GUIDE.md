# Deployment Guide: Netlify + Render

This guide walks you through deploying **Outsider: Cosmic Council** with:
- **Frontend (Client)**: Netlify
- **Backend (Server)**: Render

---

## 📋 Prerequisites

1. GitHub account with your code pushed to a repository
2. Netlify account (free tier works)
3. Render account (free tier works)
4. Your code should be in a single repository with both `client` and `server` folders

---

## 🚀 Part 1: Deploy Server to Render

### Step 1: Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository: `Outsider`

### Step 2: Configure Service

Fill in the following settings:

| Setting | Value |
|---------|-------|
| **Name** | `outsider-server` (or your preferred name) |
| **Region** | Select closest to your users |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free (or paid if needed) |

### Step 3: Add Environment Variables

Click **"Advanced"** and add these environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `https://your-netlify-app.netlify.app` (add after Netlify setup) |
| `PORT` | `8080` (Render auto-assigns this, but good to set) |

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment to complete (5-10 minutes)
3. Copy your service URL: `https://outsider-server.onrender.com` (or similar)

⚠️ **Important Notes:**
- Free tier spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds to wake up
- Consider upgrading for production use

---

## 🌐 Part 2: Deploy Frontend to Netlify

### Step 1: Create New Site

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select your repository

### Step 2: Configure Build Settings

| Setting | Value |
|---------|-------|
| **Branch to deploy** | `main` |
| **Base directory** | Leave empty (root) |
| **Build command** | `npm run build` |
| **Publish directory** | `dist` |
| **Node version** | `18` (already in netlify.toml) |

### Step 3: Add Environment Variables

Before deploying, add your environment variable:

1. Go to **"Site configuration"** → **"Environment variables"**
2. Click **"Add a variable"**
3. Add:

| Key | Value |
|-----|-------|
| `VITE_SERVER_URL` | `https://outsider-server.onrender.com` (your Render URL) |

### Step 4: Deploy

1. Click **"Deploy site"**
2. Wait for build to complete (2-5 minutes)
3. Your site will be live at: `https://random-name-123.netlify.app`

### Step 5: Custom Domain (Optional)

1. Go to **"Domain settings"**
2. Click **"Options"** → **"Edit site name"**
3. Change to something memorable: `outsider-cosmic-council.netlify.app`

---

## 🔄 Part 3: Update Server CORS

Now that you have your Netlify URL, update the server:

### Option A: Via Render Dashboard (Recommended)

1. Go to your Render service dashboard
2. Click **"Environment"** tab
3. Update `CLIENT_URL` to your Netlify URL: `https://outsider-cosmic-council.netlify.app`
4. Click **"Save Changes"**
5. Service will automatically redeploy

### Option B: Via Code (Alternative)

1. Update `server/index.js` line 12:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://outsider-cosmic-council.netlify.app', // Your Netlify URL
  process.env.CLIENT_URL,
].filter(Boolean)
```

2. Commit and push to GitHub
3. Both services will auto-deploy

---

## ✅ Part 4: Testing Deployment

### Test Server Health

Open: `https://outsider-server.onrender.com/`

You should see:
```json
{
  "status": "ok",
  "service": "Outsider: Cosmic Council Server",
  "version": "1.0.0",
  "activeRooms": 0,
  "timestamp": "2025-11-07T..."
}
```

### Test Frontend

1. Open: `https://outsider-cosmic-council.netlify.app`
2. Click **"Create Room"**
3. Enter a nickname
4. You should see a room code
5. Try creating a game and starting it

### Test Multiplayer

1. Open the app in two browser windows
2. Create room in window 1, note the room code
3. Join room in window 2 with the same code
4. Both players should see each other
5. Start a game and play through

---

## 🐛 Troubleshooting

### Issue: "Unable to connect to server"

**Check:**
1. Server is running: Visit `https://outsider-server.onrender.com/`
2. Environment variable is set: Check Netlify → Environment Variables
3. CORS is configured: Check Render logs for CORS errors

**Fix:**
- Rebuild Netlify site after adding `VITE_SERVER_URL`
- Ensure no trailing slash in URLs
- Check browser console for errors

### Issue: "CORS blocked origin"

**Check:**
1. Render environment variable `CLIENT_URL` matches Netlify URL exactly
2. No trailing slashes in URLs
3. Check Render logs: Dashboard → Logs

**Fix:**
```javascript
// In server/index.js, temporarily allow all origins for testing:
if (process.env.NODE_ENV !== 'production') {
  return callback(null, true)
}
```

### Issue: Server is slow to respond

**Cause:** Render free tier spins down after 15 minutes

**Solutions:**
1. Upgrade to paid tier ($7/month)
2. Use a keep-alive service (e.g., cron-job.org to ping every 10 minutes)
3. Add loading message: "Waking up server, please wait..."

### Issue: Build fails on Netlify

**Check:**
1. Node version: Should be 18+ (set in netlify.toml)
2. Dependencies: Run `npm install` locally to verify
3. Build logs: Check for missing dependencies or TypeScript errors

**Fix:**
- Update package.json with all dependencies
- Run `npm run build` locally first
- Check Netlify build logs for specific errors

---

## 🔒 Security Checklist

- [ ] Environment variables set correctly (never commit .env files)
- [ ] CORS configured with specific origins (not wildcard `*`)
- [ ] Input sanitization enabled (already implemented)
- [ ] HTTPS enabled (automatic on Netlify/Render)
- [ ] Rate limiting considered (upgrade for production)

---

## 💰 Cost Breakdown

### Free Tier (Suitable for testing/personal use)
- **Netlify:** 100GB bandwidth/month, 300 build minutes/month
- **Render:** 750 hours/month (enough for 1 service), sleeps after 15 min
- **Total:** $0/month

### Paid Tier (Recommended for public release)
- **Netlify Pro:** $19/month (1TB bandwidth, better performance)
- **Render Starter:** $7/month (always-on, 512MB RAM)
- **Total:** $26/month

---

## 🔄 Auto-Deployment

Both services support automatic deployment:

1. **Push to GitHub** → Both services detect changes
2. **Render:** Rebuilds server automatically
3. **Netlify:** Rebuilds frontend automatically
4. **Live in 2-5 minutes**

No manual deployment needed after initial setup! 🎉

---

## 📊 Monitoring

### Render Dashboard
- View logs: Dashboard → Logs
- Check metrics: Dashboard → Metrics
- See active connections: `https://your-server.onrender.com/stats`

### Netlify Dashboard
- View deployments: Dashboard → Deploys
- Check analytics: Dashboard → Analytics
- Monitor build time: Dashboard → Deploys → Build logs

---

## 🎯 Quick Reference URLs

After deployment, bookmark these:

- **Live App:** `https://outsider-cosmic-council.netlify.app`
- **Server Health:** `https://outsider-server.onrender.com/`
- **Server Stats:** `https://outsider-server.onrender.com/stats`
- **Netlify Dashboard:** https://app.netlify.com/
- **Render Dashboard:** https://dashboard.render.com/

---

## 🚨 Emergency Rollback

If deployment breaks:

### Netlify
1. Go to **Deploys** tab
2. Find last working deploy
3. Click **"..."** → **"Publish deploy"**

### Render
1. Go to service dashboard
2. Click **"Manual Deploy"** dropdown
3. Select **"Clear build cache & deploy"**

---

## 📝 Environment Variables Summary

### Netlify (.env in Netlify dashboard)
```bash
VITE_SERVER_URL=https://outsider-server.onrender.com
```

### Render (Environment tab in Render dashboard)
```bash
NODE_ENV=production
CLIENT_URL=https://outsider-cosmic-council.netlify.app
PORT=8080
```

---

## ✨ Next Steps

1. [ ] Deploy server to Render
2. [ ] Deploy frontend to Netlify
3. [ ] Update CORS settings
4. [ ] Test multiplayer functionality
5. [ ] Share with friends!
6. [ ] Monitor usage and upgrade if needed

**Need help?** Check the troubleshooting section or open an issue on GitHub.

🎮 Happy gaming! 🌌
