# Deployment Guide

Complete guide for deploying Outsider: Cosmic Council to production.

---

## 📦 Build Information

**Bundle Size:**
- CSS: 12.85 kB (3.19 kB gzipped)
- JavaScript: 226.99 kB (68.79 kB gzipped)
- Total: ~240 kB (~72 kB gzipped)

**Build Time:** ~864ms

**Build Output:**
- `dist/index.html` - Entry HTML file
- `dist/assets/` - Bundled CSS and JS files

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Steps:**
1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. Deploy from your project directory:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Set up and deploy: `Y`
   - Scope: Choose your account
   - Link to existing project: `N` (first time)
   - Project name: `outsider-cosmic-council`
   - Directory: `./`
   - Override settings: `N`

4. For production deployment:
   ```bash
   vercel --prod
   ```

**Configuration:**
Vercel auto-detects Vite projects. No additional config needed.

**Features:**
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Instant cache invalidation
- ✅ Zero-config deployment
- ✅ Free tier available

---

### Option 2: Netlify

**Steps:**

#### Via CLI:
1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy:
   ```bash
   netlify deploy --prod --dir=dist
   ```

#### Via Web UI:
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click "Deploy site"

**Features:**
- ✅ Automatic HTTPS
- ✅ Continuous deployment from Git
- ✅ Instant rollbacks
- ✅ Free tier available

---

### Option 3: GitHub Pages

**Steps:**

1. Install `gh-pages` package:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Update `package.json`:
   ```json
   {
     "homepage": "https://<username>.github.io/<repo-name>",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Update `vite.config.js` to set base path:
   ```javascript
   export default defineConfig({
     base: '/<repo-name>/',
     // ... rest of config
   });
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

5. Enable GitHub Pages in repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`

**Features:**
- ✅ Free hosting
- ✅ Integrates with GitHub
- ✅ HTTPS included

**Limitations:**
- ⚠️ Requires repository to be public (or GitHub Pro for private)
- ⚠️ Manual deployment process

---

### Option 4: Railway

**Steps:**

1. Create `railway.json`:
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm run preview",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

2. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

3. Login and deploy:
   ```bash
   railway login
   railway init
   railway up
   ```

**Features:**
- ✅ Easy deployment
- ✅ Auto-scaling
- ✅ Monitoring included
- ✅ Free tier ($5 credit/month)

---

### Option 5: Custom Server (VPS/Cloud)

**Requirements:**
- Node.js 18+ installed
- Nginx or Apache (optional, for reverse proxy)

**Steps:**

1. **Transfer files to server:**
   ```bash
   scp -r dist/ user@your-server.com:/var/www/outsider
   ```

2. **Serve with Node.js:**
   ```bash
   # Install serve globally
   npm i -g serve
   
   # Run on port 5000
   serve -s dist -l 5000
   ```

3. **Or serve with Python:**
   ```bash
   cd dist
   python3 -m http.server 5000
   ```

4. **Setup Nginx reverse proxy (recommended):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Enable HTTPS with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

6. **Keep process running with PM2:**
   ```bash
   npm i -g pm2
   pm2 start "serve -s dist -l 5000" --name outsider
   pm2 save
   pm2 startup
   ```

---

## 🔧 Pre-Deployment Checklist

- [x] ✅ Run `npm run build` successfully
- [x] ✅ Test production build with `npm run preview`
- [ ] ✅ Verify all features work in production mode
- [ ] ✅ Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] ✅ Test on mobile devices (iOS, Android)
- [ ] ✅ Check console for errors
- [ ] ✅ Verify all assets load (images, fonts, icons)
- [ ] ✅ Test all game flows (create → lobby → game → results)
- [ ] ✅ Verify easter eggs work (Cosmic Scribbler, Konami)
- [ ] ✅ Confirm chat system works
- [ ] ✅ Test admin panel functionality

---

## 🌐 Environment Variables

Currently, this project doesn't use environment variables. If you need to add them:

1. Create `.env` file (already in .gitignore):
   ```env
   VITE_API_URL=https://api.example.com
   VITE_SOCKET_URL=wss://socket.example.com
   ```

2. Access in code:
   ```javascript
   const apiUrl = import.meta.env.VITE_API_URL;
   ```

3. For production, set environment variables in your hosting platform:
   - **Vercel:** Settings → Environment Variables
   - **Netlify:** Site settings → Build & deploy → Environment
   - **Railway:** Variables tab in dashboard

---

## 🔍 Post-Deployment Testing

After deployment, verify:

1. **Basic Functionality:**
   - [ ] Homepage loads
   - [ ] Can create a room
   - [ ] Can join a room
   - [ ] Room code works
   - [ ] Nickname persists

2. **Game Flow:**
   - [ ] Constellation selection works
   - [ ] Lobby displays players correctly
   - [ ] Game starts successfully
   - [ ] Questions display properly
   - [ ] Answer submission works
   - [ ] Voting works
   - [ ] Scoring calculates correctly
   - [ ] Play again works

3. **UI/UX:**
   - [ ] Animations smooth
   - [ ] Responsive on mobile
   - [ ] Background renders correctly
   - [ ] Buttons clickable
   - [ ] Modals open/close
   - [ ] Chat scrolls properly

4. **Performance:**
   - [ ] Page loads in < 3 seconds
   - [ ] No lag during gameplay
   - [ ] Animations don't stutter
   - [ ] No memory leaks

5. **Cross-Browser:**
   - [ ] Chrome/Edge
   - [ ] Firefox
   - [ ] Safari
   - [ ] Mobile browsers

---

## 📊 Performance Optimization

### Completed Optimizations:
- ✅ Code splitting with Vite
- ✅ Minification and tree-shaking
- ✅ Gzip compression
- ✅ Optimized image assets
- ✅ CSS purging via Tailwind

### Future Optimizations:
- [ ] Lazy load components (React.lazy)
- [ ] Add service worker for offline support
- [ ] Implement image CDN for avatars
- [ ] Add analytics (Google Analytics, Plausible, etc.)
- [ ] Set up error tracking (Sentry, Rollbar, etc.)

---

## 🐛 Troubleshooting

### Build fails with "out of memory"
**Solution:** Increase Node.js memory:
```bash
node --max-old-space-size=4096 node_modules/vite/bin/vite.js build
```

### White screen after deployment
**Causes:**
1. Incorrect base path (for GitHub Pages)
2. Missing trailing slash in routes
3. Console errors

**Solution:**
1. Check browser console for errors
2. Verify `base` in `vite.config.js` matches deployment path
3. Clear browser cache

### Assets not loading (404 errors)
**Solution:**
1. Check `base` path in `vite.config.js`
2. Ensure all imports use relative paths
3. Verify build output includes all assets

### Game doesn't work but dev works
**Solution:**
1. Test with `npm run preview` locally
2. Check for environment-specific code
3. Verify all dependencies are in `dependencies` (not `devDependencies`)

---

## 📈 Monitoring & Analytics

### Recommended Tools:

**Analytics:**
- [Google Analytics](https://analytics.google.com) - Free, comprehensive
- [Plausible](https://plausible.io) - Privacy-focused, lightweight
- [Fathom](https://usefathom.com) - GDPR compliant

**Error Tracking:**
- [Sentry](https://sentry.io) - Industry standard, free tier
- [LogRocket](https://logrocket.com) - Session replay included
- [Rollbar](https://rollbar.com) - Simple setup

**Performance:**
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - Automated audits
- [WebPageTest](https://www.webpagetest.org) - Detailed performance analysis

---

## 🔒 Security Considerations

### Current Status:
- ✅ No sensitive data stored
- ✅ Client-side only (no backend)
- ✅ No authentication required
- ✅ HTML sanitization in nicknames

### If Adding Backend:
- [ ] Implement HTTPS
- [ ] Add rate limiting
- [ ] Sanitize all inputs
- [ ] Use WebSocket secure (wss://)
- [ ] Implement CORS properly
- [ ] Add content security policy (CSP)

---

## 📝 Deployment Checklist Summary

1. **Pre-Deploy:**
   - [x] Build succeeds (`npm run build`)
   - [x] Preview works (`npm run preview`)
   - [ ] All tests pass
   - [ ] Documentation complete

2. **Deploy:**
   - [ ] Choose hosting platform
   - [ ] Configure build settings
   - [ ] Deploy to production
   - [ ] Verify deployment URL

3. **Post-Deploy:**
   - [ ] Test all features
   - [ ] Check console for errors
   - [ ] Test on multiple devices
   - [ ] Monitor performance
   - [ ] Set up analytics (optional)

4. **Maintenance:**
   - [ ] Monitor error rates
   - [ ] Update dependencies regularly
   - [ ] Respond to user feedback
   - [ ] Plan new features

---

## 🎉 You're Ready to Deploy!

Your Outsider: Cosmic Council game is production-ready. Choose your preferred hosting platform and deploy with confidence!

**Recommended Quick Start:**
```bash
# For fastest deployment (Vercel)
npm i -g vercel
vercel --prod

# Access your live site!
```

**Support:** For issues, refer to CONTRIBUTING.md or open an issue in your repository.

---

**Last Updated:** October 17, 2025
