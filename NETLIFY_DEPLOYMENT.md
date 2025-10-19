# 🚀 Deploying to Netlify - Complete Guide

## Overview

We'll deploy:
- **Client (Frontend)** → Netlify
- **Server (Backend)** → Render.com (free tier)

---

## Part 1: Deploy the Server (Backend)

### Option A: Using Render.com (Recommended - Free)

1. **Create a Render account:** https://render.com

2. **Create a new Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository (or use manual deploy)
   - **Root Directory:** `server`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

3. **Configure Port:**
   - Render automatically provides a `PORT` environment variable
   - Update `server/index.js` to use it (I'll do this below)

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (3-5 minutes)
   - Copy your server URL (e.g., `https://outsider-server.onrender.com`)

### Option B: Using Railway.app (Also Free)

1. **Create Railway account:** https://railway.app
2. **New Project → Deploy from GitHub**
3. **Select your repo**
4. **Add environment variables if needed**
5. **Railway auto-detects Node.js and deploys**
6. **Copy your server URL**

---

## Part 2: Deploy the Client (Frontend) to Netlify

### Step 1: Prepare the Repository

Make sure you have a `.gitignore` file that excludes:
```
node_modules
dist
.env
.env.local
```

### Step 2: Deploy to Netlify

#### Option A: Deploy from GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and select your repository
   - **Build settings:**
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Base directory: (leave empty)

3. **Configure Environment Variable:**
   - Go to "Site settings" → "Environment variables"
   - Add new variable:
     - **Key:** `VITE_SERVER_URL`
     - **Value:** Your server URL (e.g., `https://outsider-server.onrender.com`)

4. **Deploy:**
   - Click "Deploy site"
   - Wait 2-3 minutes
   - Your site is live! (e.g., `https://cosmic-outsider.netlify.app`)

#### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Build your project:**
   ```bash
   npm run build
   ```

4. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

5. **Follow prompts:**
   - Create & configure new site
   - Publish directory: `dist`

#### Option C: Manual Deploy (Drag & Drop)

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Go to Netlify:**
   - https://app.netlify.com
   - Drag the `dist` folder to the deploy area

3. **Configure environment variables in UI**

---

## Part 3: Configure Server for Production

The server needs to be updated to:
1. Use environment port
2. Enable CORS for your Netlify domain
3. Handle production URLs

I'll update the server code now...

---

## Part 4: Custom Domain (Optional)

### On Netlify:
1. **Site settings** → **Domain management**
2. **Add custom domain**
3. Follow DNS configuration instructions

### Update Server CORS:
Add your custom domain to allowed origins in `server/index.js`

---

## Post-Deployment Checklist

✅ Server is running (check the URL in browser, should see a response)
✅ Client is deployed (site loads at Netlify URL)
✅ Environment variable `VITE_SERVER_URL` is set
✅ Test: Create a room and join from different devices
✅ Check browser console for any connection errors

---

## Troubleshooting

### "Failed to connect to server"
- Check server URL is correct in Netlify environment variables
- Verify server is running (visit server URL)
- Check CORS settings in server code

### "502 Bad Gateway" on server
- Server may be sleeping (Render free tier)
- First request may take 30-60 seconds to wake up
- Subsequent requests will be fast

### "Module not found" errors
- Clear Netlify cache and redeploy
- Check all dependencies are in `package.json`

### Game works locally but not in production
- Check browser console for errors
- Verify environment variables are set
- Ensure server URL uses HTTPS (not HTTP)

---

## Costs

**Netlify (Client):**
- Free tier: 100GB bandwidth/month
- More than enough for hundreds of players

**Render (Server):**
- Free tier: 750 hours/month
- Server sleeps after 15 minutes of inactivity
- Wakes up on first request (30-60 second delay)

**Total Cost: $0** ✨

---

## Next Steps

1. Deploy server to Render/Railway
2. Copy server URL
3. Deploy client to Netlify with server URL as env variable
4. Test with friends!
5. Share your game link! 🎮🚀
