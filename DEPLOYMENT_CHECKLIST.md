# 🚀 Quick Deployment Checklist

Use this checklist to deploy Outsider: Cosmic Council to Netlify + Render.

## ✅ Pre-Deployment

- [ ] All code pushed to GitHub
- [ ] Server code is in `server/` folder
- [ ] Client code is in root with `dist/` as build output
- [ ] `netlify.toml` exists in root
- [ ] `server/package.json` has correct start script
- [ ] `.gitignore` excludes `.env` files

## 🔧 Render Setup (Backend)

- [ ] Create account at https://dashboard.render.com/
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Configure service:
  - Name: `outsider-server`
  - Root Directory: `server`
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Instance Type: Free
- [ ] Add environment variables:
  - `NODE_ENV` = `production`
  - `CLIENT_URL` = (add after Netlify setup)
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (~5-10 minutes)
- [ ] Copy your Render URL: `https://______.onrender.com`
- [ ] Test health endpoint: Visit `https://______.onrender.com/`

## 🌐 Netlify Setup (Frontend)

- [ ] Create account at https://app.netlify.com/
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Connect GitHub repository
- [ ] Configure build:
  - Branch: `main`
  - Build command: `npm run build`
  - Publish directory: `dist`
- [ ] Add environment variable:
  - Go to Site configuration → Environment variables
  - Key: `VITE_SERVER_URL`
  - Value: `https://______.onrender.com` (your Render URL)
- [ ] Click "Deploy site"
- [ ] Wait for build (~2-5 minutes)
- [ ] Copy your Netlify URL: `https://______.netlify.app`
- [ ] (Optional) Customize site name

## 🔄 Final Configuration

- [ ] Go back to Render dashboard
- [ ] Update `CLIENT_URL` environment variable:
  - Value: `https://______.netlify.app` (your Netlify URL)
- [ ] Wait for Render to redeploy (~2 minutes)
- [ ] Test connection between services

## 🧪 Testing

- [ ] Visit your Netlify app
- [ ] Create a room (enters nickname, gets room code)
- [ ] Open app in second browser/tab
- [ ] Join room with code
- [ ] Both players see each other
- [ ] Start game and play through one round
- [ ] Check chat functionality
- [ ] Check voting and scoring

## 🎯 Post-Deployment

- [ ] Bookmark your live URLs:
  - App: `https://______.netlify.app`
  - Server: `https://______.onrender.com`
  - Stats: `https://______.onrender.com/stats`
- [ ] Share with friends and test multiplayer
- [ ] Monitor Render logs for errors
- [ ] Monitor Netlify deploy logs

## 🐛 If Issues Occur

### Can't connect to server
1. Check server is running: Visit server health endpoint
2. Check environment variable in Netlify
3. Rebuild Netlify site

### CORS errors
1. Verify CLIENT_URL in Render matches Netlify URL exactly
2. Check Render logs for CORS messages
3. Ensure no trailing slashes in URLs

### Slow server response
- Render free tier sleeps after 15 minutes
- First request takes ~30 seconds to wake
- Consider upgrade or keep-alive service

## 📊 Monitoring

Check these regularly:

- [ ] Render dashboard → Metrics (server health)
- [ ] Render dashboard → Logs (error messages)
- [ ] Netlify dashboard → Analytics (traffic)
- [ ] Server stats endpoint for active rooms

## 🎉 Success!

When everything works:
- ✅ App loads on Netlify
- ✅ Room creation works
- ✅ Multiplayer join works
- ✅ Game plays smoothly
- ✅ No console errors

**Your game is live! 🌌**

---

**Need detailed help?** See `DEPLOYMENT_GUIDE.md`
