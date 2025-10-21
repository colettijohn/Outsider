# 🚀 Quick Deployment Checklist

## Before You Start

- [ ] Game running on Vercel ✅
- [ ] Render account created
- [ ] Know your Vercel URL (e.g., `https://your-app.vercel.app`)

---

## Render Setup (Backend)

### 1. Create Web Service
- [ ] Go to https://dashboard.render.com/
- [ ] Click "New +" → "Web Service"
- [ ] Connect your GitHub repo
- [ ] Select `Outsider` repository

### 2. Configure Settings
- [ ] **Name:** `outsider-cosmic-council-server`
- [ ] **Root Directory:** `server` ⚠️ IMPORTANT
- [ ] **Build Command:** `npm install`
- [ ] **Start Command:** `npm start`
- [ ] **Instance Type:** Free or Starter

### 3. Environment Variables
- [ ] Add `CLIENT_URL` = Your Vercel URL (no trailing slash)
- [ ] Add `NODE_ENV` = `production`

### 4. Deploy
- [ ] Click "Create Web Service"
- [ ] Wait 2-3 minutes
- [ ] Copy your Render URL (e.g., `https://xxx.onrender.com`)

---

## Vercel Setup (Frontend)

### 1. Add Environment Variable
- [ ] Go to https://vercel.com/dashboard
- [ ] Select your project
- [ ] Go to Settings → Environment Variables
- [ ] Add `VITE_SERVER_URL` = Your Render URL
- [ ] Select all environments (Production, Preview, Development)
- [ ] Click "Save"

### 2. Redeploy
- [ ] Go to Deployments tab
- [ ] Redeploy latest deployment
- [ ] OR: Push new commit to trigger auto-deploy

---

## Testing

### Backend Health Check
- [ ] Visit `https://your-render-url.onrender.com/`
- [ ] Should see JSON with `"status": "ok"`

### Frontend Connection
- [ ] Visit `https://your-vercel-url.vercel.app/`
- [ ] Open browser console (F12)
- [ ] Should see connection success (no MockSocket)
- [ ] Try creating a room
- [ ] Try joining with second browser/device

---

## Troubleshooting

### CORS Error?
- [ ] Check `CLIENT_URL` on Render matches Vercel URL exactly
- [ ] No trailing slash in URLs
- [ ] Redeploy Render service after changing

### Still Using MockSocket?
- [ ] Check `VITE_SERVER_URL` set on Vercel
- [ ] Redeploy Vercel frontend
- [ ] Hard refresh browser (Ctrl+Shift+R)

### Server Won't Start?
- [ ] Check Render logs
- [ ] Verify Root Directory = `server`
- [ ] Check `server/package.json` has `"type": "module"`

---

## 🎉 Success Criteria

- [x] Backend responds to health check
- [x] Frontend connects to backend
- [x] No CORS errors
- [x] Can create room
- [x] Can join room
- [x] Multiplayer works!

---

## Quick Reference

**Your URLs:**
- Vercel Frontend: `https://_____.vercel.app`
- Render Backend: `https://_____.onrender.com`

**Environment Variables:**
- Render: `CLIENT_URL` = Vercel URL
- Vercel: `VITE_SERVER_URL` = Render URL

**Need detailed help?** See `RENDER_DEPLOYMENT.md`
