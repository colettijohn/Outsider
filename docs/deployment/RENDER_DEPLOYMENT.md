# 🚀 Deploying to Render - Backend Server Setup

## Overview
This guide will help you deploy the Outsider: Cosmic Council backend server to Render and connect it to your Vercel frontend.

---

## 📋 Prerequisites

- ✅ Frontend deployed on Vercel
- ✅ Render account (sign up at https://render.com)
- ✅ Your game's GitHub repository

---

## 🎯 Step-by-Step Deployment

### Step 1: Prepare Your Repository

Your server code is already in the `server/` directory. Make sure these files are committed:

```
server/
├── index.js          ✅ Main server file
├── package.json      ✅ Dependencies
├── utils/
│   └── sanitize.js   ✅ Utility functions
└── README.md         ✅ Documentation
```

**Check files are committed:**
```bash
git status
git add server/
git commit -m "Prepare server for Render deployment"
git push origin main
```

---

### Step 2: Create New Web Service on Render

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com/

2. **Click "New +" → "Web Service"**

3. **Connect Your Repository**
   - Select "Connect a repository"
   - Choose your GitHub account
   - Select your `Outsider` repository
   - Click "Connect"

---

### Step 3: Configure Your Web Service

Fill in these settings:

**Basic Settings:**
- **Name:** `outsider-cosmic-council-server` (or any name you prefer)
- **Region:** Choose closest to your users (e.g., Oregon, Frankfurt)
- **Branch:** `main`
- **Root Directory:** `server`
  - ⚠️ **IMPORTANT:** Type `server` in this field
  - This tells Render to look in the server folder
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Instance Type:**
- Select **Free** (for testing) or **Starter** ($7/month for always-on)
- ⚠️ Free tier sleeps after 15 min of inactivity (30s wake-up time)

---

### Step 4: Add Environment Variables

Click "Advanced" → "Add Environment Variable"

Add this variable:

| Key | Value | Description |
|-----|-------|-------------|
| `CLIENT_URL` | `https://your-vercel-app.vercel.app` | Your Vercel frontend URL |
| `NODE_ENV` | `production` | Production mode |
| `PORT` | `10000` | Render default port (auto-set) |

**Example:**
```
CLIENT_URL=https://outsider-cosmic-council.vercel.app
NODE_ENV=production
```

⚠️ **Replace with your actual Vercel URL!**

---

### Step 5: Deploy!

1. Click **"Create Web Service"**
2. Render will:
   - Clone your repo
   - Install dependencies (`npm install`)
   - Start your server (`npm start`)
3. Wait 2-3 minutes for deployment
4. You'll see a URL like: `https://outsider-cosmic-council-server.onrender.com`

---

## 🔗 Step 6: Connect Vercel Frontend to Render Backend

### Option A: Using Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard

2. **Select Your Project**
   - Click on your "Outsider" project

3. **Go to Settings → Environment Variables**

4. **Add Environment Variable:**
   - **Name:** `VITE_SERVER_URL`
   - **Value:** `https://your-render-url.onrender.com`
   - **Environments:** Check all (Production, Preview, Development)
   - Click "Save"

**Example:**
```
VITE_SERVER_URL=https://outsider-cosmic-council-server.onrender.com
```

5. **Redeploy Your Frontend**
   - Go to "Deployments" tab
   - Click "..." on latest deployment
   - Click "Redeploy"
   - OR: Just push a new commit to trigger auto-deploy

---

### Option B: Using .env File (Local Development)

Create `.env` file in project root:

```env
VITE_SERVER_URL=https://your-render-url.onrender.com
```

⚠️ **Don't commit this file!** It's in `.gitignore`

---

## ✅ Step 7: Verify Connection

### Test Backend Server

1. **Visit your Render URL in browser:**
   ```
   https://your-render-url.onrender.com
   ```

2. **You should see:**
   ```json
   {
     "status": "ok",
     "service": "Outsider: Cosmic Council Server",
     "version": "1.0.0",
     "activeRooms": 0,
     "timestamp": "2025-10-21T..."
   }
   ```

3. **Check stats endpoint:**
   ```
   https://your-render-url.onrender.com/stats
   ```

### Test Frontend Connection

1. **Visit your Vercel URL**
   ```
   https://your-vercel-app.vercel.app
   ```

2. **Open Browser Console (F12)**
   - Should see: `Connected to real server!`
   - Should NOT see: `Using MockSocket for local testing`

3. **Create a Room**
   - Enter nickname
   - Click "Begin Oracle's Ritual" or "Start New Session"
   - If it works, you're connected! 🎉

---

## 🐛 Troubleshooting

### Issue 1: "CORS Error" in Browser Console

**Problem:** Backend rejects frontend requests

**Solution:** Update `CLIENT_URL` on Render
1. Go to Render Dashboard → Your Service
2. Go to "Environment" tab
3. Update `CLIENT_URL` to your **exact** Vercel URL
4. Click "Save Changes"
5. Wait for auto-redeploy (~1 min)

**Common mistakes:**
- ❌ `https://your-app.vercel.app/` (trailing slash)
- ✅ `https://your-app.vercel.app` (no trailing slash)

---

### Issue 2: Frontend Still Using MockSocket

**Problem:** Console shows "Using MockSocket"

**Solution:** Make sure `VITE_SERVER_URL` is set
1. Check Vercel Dashboard → Settings → Environment Variables
2. Verify `VITE_SERVER_URL` exists and is correct
3. Redeploy frontend
4. Hard refresh browser (Ctrl+Shift+R)

---

### Issue 3: Render Service Won't Start

**Problem:** Build fails or crashes

**Solution 1: Check Logs**
1. Render Dashboard → Your Service
2. Click "Logs" tab
3. Look for errors

**Solution 2: Verify Root Directory**
1. Render Dashboard → Your Service → Settings
2. Check "Root Directory" is set to `server`
3. Save and redeploy

**Solution 3: Check package.json**
Make sure `server/package.json` has:
```json
{
  "type": "module",
  "scripts": {
    "start": "node index.js"
  }
}
```

---

### Issue 4: Connection Timeout

**Problem:** Frontend can't reach backend

**Solution:** Check firewall/network
- Render URL should be HTTPS
- Test backend URL directly in browser
- Check browser console for errors

---

### Issue 5: Free Tier Sleep

**Problem:** First request takes 30+ seconds

**Explanation:** Render free tier sleeps after 15 min inactivity

**Solutions:**
- **Upgrade to Starter ($7/mo)** - Always on
- **Accept the delay** - Subsequent requests are instant
- **Ping service** - Keep it awake with external monitoring

---

## 🔄 Update Backend Code

When you need to update server code:

```bash
# Make changes to server/index.js or other files
git add server/
git commit -m "Update server logic"
git push origin main
```

Render will **automatically redeploy** when you push to `main`!

---

## 📊 Monitoring Your Server

### Render Dashboard

**Metrics Tab:**
- CPU usage
- Memory usage
- Request count
- Response times

**Logs Tab:**
- Real-time logs
- Error tracking
- Socket connections

**Events Tab:**
- Deployment history
- Build logs
- Restarts

---

## 💰 Pricing

### Free Tier
- ✅ Good for testing
- ✅ 750 hours/month free
- ❌ Sleeps after 15 min inactivity
- ❌ 30s cold start

### Starter ($7/month)
- ✅ Always on
- ✅ No cold starts
- ✅ More resources
- ✅ Better for production

---

## 🔐 Security Best Practices

### 1. Environment Variables
- ✅ Use `CLIENT_URL` to whitelist your frontend
- ✅ Never commit sensitive data
- ✅ Use Render's environment variable feature

### 2. CORS Configuration
Your server is already configured correctly:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.CLIENT_URL, // Render will use this
]
```

### 3. Input Sanitization
Your server already sanitizes inputs:
- Nicknames
- Chat messages
- Answers

---

## 🎯 Quick Reference

### Important URLs

| What | Where |
|------|-------|
| Render Dashboard | https://dashboard.render.com |
| Vercel Dashboard | https://vercel.com/dashboard |
| Your Backend | https://your-service.onrender.com |
| Your Frontend | https://your-app.vercel.app |
| Server Health | https://your-service.onrender.com/ |
| Server Stats | https://your-service.onrender.com/stats |

### Environment Variables

| Service | Variable | Value |
|---------|----------|-------|
| Render | `CLIENT_URL` | Your Vercel URL |
| Render | `NODE_ENV` | `production` |
| Vercel | `VITE_SERVER_URL` | Your Render URL |

### Key Commands

```bash
# Check git status
git status

# Commit server changes
git add server/
git commit -m "Update server"
git push origin main

# Test backend locally
cd server
npm install
npm start
# Visit http://localhost:3000
```

---

## ✅ Final Checklist

Before going live:

- [ ] Server deployed to Render
- [ ] `CLIENT_URL` set on Render
- [ ] `VITE_SERVER_URL` set on Vercel
- [ ] Frontend redeployed
- [ ] Backend health check returns 200 OK
- [ ] Frontend connects to backend (check console)
- [ ] Can create room successfully
- [ ] Can join room successfully
- [ ] Multiplayer features work
- [ ] No CORS errors in console

---

## 🎉 Success!

Once everything is working:

1. **Share your game URL:** `https://your-app.vercel.app`
2. **Players can join from anywhere!**
3. **Real multiplayer with Socket.IO!**
4. **No more MockSocket!**

---

## 📞 Need Help?

**Render Documentation:**
- https://render.com/docs
- https://render.com/docs/web-services

**Socket.IO Documentation:**
- https://socket.io/docs/v4/

**Common Issues:**
- Check Render logs for backend errors
- Check browser console for frontend errors
- Verify environment variables are correct
- Test backend URL directly in browser

---

**Last Updated:** October 21, 2025
**Status:** Ready for Deployment 🚀
