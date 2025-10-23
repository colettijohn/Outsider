# 🚀 Quick Deploy Guide - Netlify

## 🎯 Quick Steps (5 minutes)

### 1️⃣ Deploy Server (Render.com - FREE)
```
1. Go to https://render.com → Sign up
2. New + → Web Service → Connect GitHub
3. Select your repo
4. Root Directory: server
5. Build Command: npm install
6. Start Command: npm start
7. Click "Create Web Service"
8. ⏱️ Wait 3-5 minutes
9. ✅ Copy your server URL (e.g., https://outsider-abc123.onrender.com)
```

### 2️⃣ Deploy Client (Netlify - FREE)
```
1. Go to https://netlify.com → Sign up
2. "Add new site" → "Import from Git"
3. Connect GitHub → Select your repo
4. Build command: npm run build
5. Publish directory: dist
6. Click "Add environment variable":
   - Key: VITE_SERVER_URL
   - Value: [paste your Render server URL]
7. Click "Deploy site"
8. ⏱️ Wait 2-3 minutes
9. ✅ Your game is live!
```

### 3️⃣ Share & Play!
```
✅ Copy your Netlify URL (e.g., https://cosmic-outsider.netlify.app)
✅ Share with friends
✅ Play together from anywhere! 🌍
```

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure:

- [ ] Code is pushed to GitHub
- [ ] `.env` file is NOT in Git (check `.gitignore`)
- [ ] Server works locally (`cd server && npm start`)
- [ ] Client builds successfully (`npm run build`)
- [ ] Test production build (`npm run preview`)

---

## 🧪 Test Before Deploy

```bash
# Test production build locally
npm run build
npm run preview
# Visit http://localhost:4173

# Or use the helper script
./test-production.bat
```

---

## 🔧 Environment Variables

### Netlify (Client)
Set in: **Site settings → Environment variables**

| Variable | Value | Example |
|----------|-------|---------|
| `VITE_SERVER_URL` | Your Render server URL | `https://outsider-abc123.onrender.com` |

### Render (Server) - Optional
Set in: **Environment → Environment Variables**

| Variable | Value | Example |
|----------|-------|---------|
| `CLIENT_URL` | Your Netlify URL | `https://cosmic-outsider.netlify.app` |
| `NODE_ENV` | production | `production` |

---

## 🎮 Post-Deploy Testing

1. **Open your Netlify URL**
2. **Create a room** (Player 1)
3. **Open in incognito/another device** (Player 2)
4. **Join the room** using the code
5. **Start playing!** 🎉

---

## ⚡ Performance Notes

### Render Free Tier
- ⏰ Server **sleeps after 15 min** of inactivity
- 🌅 **First request wakes it up** (30-60 seconds)
- ⚡ **Subsequent requests are fast**
- 💡 **Tip:** Keep a tab open to prevent sleep

### Netlify Free Tier
- 📊 **100GB bandwidth/month**
- ⚡ **Instant loading** via CDN
- 🌍 **Global edge network**
- ✅ **Perfect for your game!**

---

## 🐛 Common Issues & Fixes

### "Cannot connect to server"
```bash
✅ Check VITE_SERVER_URL is set in Netlify
✅ Verify server URL is correct (visit it in browser)
✅ Check server is running on Render
✅ Wait 60 seconds if server was sleeping
```

### "Site not found" on Netlify
```bash
✅ Check build command: npm run build
✅ Check publish directory: dist
✅ Look at deploy logs for errors
```

### "Module not found" during build
```bash
✅ Clear Netlify cache (Site settings → Build & deploy → Clear cache)
✅ Check all dependencies in package.json
✅ Redeploy
```

---

## 📁 File Checklist

Files needed for deployment:

- ✅ `netlify.toml` - Netlify configuration
- ✅ `package.json` - Dependencies & scripts
- ✅ `vite.config.js` - Build configuration
- ✅ `.gitignore` - Excludes .env files
- ✅ `server/index.js` - Server with PORT support
- ✅ `server/package.json` - Server dependencies

---

## 🎯 Custom Domain (Optional)

### Add Custom Domain to Netlify:
1. **Site settings → Domain management**
2. **Add custom domain**
3. **Follow DNS instructions**
4. **Wait for SSL certificate** (automatic)

### Update Server CORS:
Add your domain to allowed origins in `server/index.js`

---

## 💰 Cost Breakdown

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Netlify** | 100GB/month | $19/month (Pro) |
| **Render** | 750 hours/month | $7/month (always-on) |
| **Total** | **$0/month** ✨ | $7-26/month |

**Your game can handle 100+ concurrent players on free tier!**

---

## 🚀 Next Level (Optional)

Want to eliminate the cold start delay?

### Option 1: Keep-Alive Service (Free)
- Use **UptimeRobot** or **Cron-job.org**
- Ping your server every 10 minutes
- Keeps server warm

### Option 2: Paid Render ($7/month)
- Always-on server
- No cold starts
- Instant connections

---

## 📞 Support

Need help? Check:
1. **Deploy logs** in Netlify/Render dashboard
2. **Browser console** (F12) for client errors
3. **Server logs** in Render dashboard
4. **NETLIFY_DEPLOYMENT.md** for detailed guide

---

## ✅ Success Checklist

After deployment:

- [ ] Server URL responds with status page
- [ ] Client loads without errors
- [ ] Can create a room
- [ ] Can join room from another device
- [ ] Game plays smoothly
- [ ] Share link works

**All checked? You're live! 🎉🎮🚀**

---

## 🎊 You're Ready!

Your game will be accessible from:
- 🌐 **Any device**
- 🌍 **Anywhere in the world**
- 📱 **Mobile & desktop**
- 🎮 **No installation needed**

**Share your game and have fun!** ✨
