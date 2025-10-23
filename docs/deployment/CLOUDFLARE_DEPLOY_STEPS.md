# 🚀 Deploy to Cloudflare Pages - Step by Step

## ✅ Step 1: Build Complete!
Your `dist` folder is ready with the production build.

---

## 📝 Step 2: Create Cloudflare Account & Deploy

### 1️⃣ Go to Cloudflare Pages
Open this link: **https://pages.cloudflare.com**

### 2️⃣ Sign Up (Free)
- Click "Sign up" (or "Log in" if you have an account)
- Use your email (no credit card required!)
- Verify your email

### 3️⃣ Create a Project
- Click **"Create a project"**
- Click **"Connect to Git"**

### 4️⃣ Connect GitHub
- Click **"Connect GitHub"**
- Authorize Cloudflare Pages
- Select your repository: **"Outsider"**
- Click **"Begin setup"**

### 5️⃣ Configure Build Settings

**Project name:** `outsider-game` (or whatever you want)

**Production branch:** `main`

**Framework preset:** Select **"Vite"** from dropdown

**Build command:**
```
npm run build
```

**Build output directory:**
```
dist
```

### 6️⃣ Add Environment Variable
Scroll down to **"Environment variables"**

Click **"Add variable"**

**Variable name:**
```
VITE_SERVER_URL
```

**Value:**
```
https://outsider-server.onrender.com
```

(Replace with your actual Render backend URL!)

### 7️⃣ Deploy!
- Click **"Save and Deploy"**
- Wait 2-3 minutes for the first build
- You'll see build logs in real-time

### 8️⃣ Get Your URL
Once deployed, you'll get a URL like:
```
https://outsider-game.pages.dev
```

---

## 🔧 Step 3: Update Your Backend CORS

Now we need to update your backend to allow the new Cloudflare URL.

### Update server/index.js:

Find the `allowedOrigins` array and add your Cloudflare URL:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://outsider-game.pages.dev',  // ← Add this
  process.env.CLIENT_URL,
]
```

---

## 🎮 Step 4: Test Your Game

1. Visit your Cloudflare URL
2. Enter a nickname
3. Click "Create Room" or "Begin Oracle's Ritual"
4. Test the game!

---

## 🔄 Future Deployments

**Good news!** Every time you push to GitHub, Cloudflare automatically rebuilds and deploys! 🎉

```bash
git add .
git commit -m "Update game"
git push origin main
```

That's it! Cloudflare handles the rest.

---

## 🎨 Custom Domain (Optional)

Want your own domain like `mygame.com`?

1. Go to your Cloudflare Pages project
2. Click **"Custom domains"**
3. Click **"Set up a custom domain"**
4. Follow the instructions (free!)

---

## 📊 What You Get (FREE Forever!)

✅ Unlimited bandwidth
✅ Unlimited builds
✅ Global CDN (super fast worldwide)
✅ Auto-deploy from GitHub
✅ Free SSL certificate
✅ DDoS protection
✅ Web analytics (optional)
✅ No sleep/wake delays
✅ 99.99% uptime

---

## 🆘 Troubleshooting

### Build fails?
- Check that `npm run build` works locally
- Make sure all dependencies are in `package.json`

### "Module not found" error?
- Run `npm install` locally
- Make sure `package-lock.json` is committed to Git

### Backend connection fails?
- Check your `VITE_SERVER_URL` environment variable
- Make sure your Render backend is running
- Update CORS in server/index.js

### Still stuck?
Let me know and I'll help! 🚀

---

## 🎯 Next Steps

After deploying:

1. ✅ Test the game thoroughly
2. ✅ Update backend CORS (Step 3 above)
3. ✅ Set up UptimeRobot to keep backend awake
4. ✅ Share your game with friends!

---

## 📱 Your Game URLs

**Frontend (Cloudflare):**
`https://outsider-game.pages.dev` (or your custom name)

**Backend (Render):**
`https://outsider-server.onrender.com` (your actual URL)

**GitHub Repo:**
`https://github.com/colettijohn/Outsider`

---

## 🎉 You're Done!

Your game is now:
- ⚡ Blazing fast (Cloudflare's global CDN)
- 🌍 Available worldwide
- 🔒 Secure (HTTPS)
- 🆓 100% free forever
- 🤖 Auto-deploys from GitHub

**Enjoy your game!** 🎮✨
