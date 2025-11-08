# 🔧 Deployment Troubleshooting Guide

Common issues and solutions when deploying to Netlify + Render.

---

## 🚫 Connection Issues

### Problem: "Unable to connect to server" in browser console

**Symptoms:**
- App loads but can't create/join rooms
- Console shows: `WebSocket connection failed`
- Network tab shows failed requests to server

**Solutions:**

1. **Check server is running**
   ```bash
   # Visit your server health endpoint
   https://your-app.onrender.com/
   
   # Should return JSON:
   {
     "status": "ok",
     "service": "Outsider: Cosmic Council Server",
     ...
   }
   ```

2. **Verify environment variable in Netlify**
   - Go to: Site configuration → Environment variables
   - Check: `VITE_SERVER_URL` exists and is correct
   - Should be: `https://your-app.onrender.com` (NO trailing slash)

3. **Rebuild Netlify site**
   - Environment variables only apply to NEW builds
   - Go to: Deploys → Trigger deploy → Deploy site

4. **Check browser console for exact error**
   ```javascript
   // If you see:
   "CORS policy blocked"
   → Go to CORS Issues section below
   
   "ERR_CONNECTION_REFUSED"
   → Server is down, check Render dashboard
   
   "net::ERR_NAME_NOT_RESOLVED"
   → Wrong server URL in environment variable
   ```

---

## 🔐 CORS Issues

### Problem: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Symptoms:**
- Server is running but browser blocks requests
- Console shows CORS error
- Network tab shows failed preflight OPTIONS requests

**Solutions:**

1. **Update CLIENT_URL in Render**
   ```bash
   # In Render dashboard:
   Environment → CLIENT_URL
   
   # Must match EXACTLY (no trailing slash):
   https://your-app.netlify.app
   ```

2. **Check Render logs**
   ```bash
   # In Render dashboard → Logs
   # Look for:
   "CORS blocked origin: https://..."
   
   # If you see this, your CLIENT_URL doesn't match
   ```

3. **Temporary fix for testing**
   ```javascript
   // In server/index.js, line ~20
   // Temporarily allow all origins:
   const allowedOrigins = [
     'http://localhost:3000',
     'http://localhost:3001',
     'http://localhost:5173',
     process.env.CLIENT_URL,
     'https://your-actual-netlify-url.netlify.app' // Add explicitly
   ].filter(Boolean)
   ```

4. **Verify no trailing slashes**
   ```bash
   # ❌ Wrong:
   https://your-app.netlify.app/
   
   # ✅ Correct:
   https://your-app.netlify.app
   ```

---

## ⏱️ Performance Issues

### Problem: Server responds very slowly (30+ seconds)

**Cause:** Render free tier spins down after 15 minutes of inactivity

**Solutions:**

1. **Accept the delay (Free tier limitation)**
   - Add loading message to app
   - First request takes ~30 seconds
   - Subsequent requests are fast

2. **Upgrade to paid tier ($7/month)**
   - Render Starter plan
   - Always-on service
   - Instant response times

3. **Use keep-alive service**
   ```bash
   # Free services that ping your server:
   - UptimeRobot.com (every 5 minutes)
   - cron-job.org (every 1-15 minutes)
   - Better Uptime (monitoring + pings)
   
   # Ping URL: https://your-app.onrender.com/
   ```

4. **Add loading message to app**
   ```jsx
   // In GameContext.jsx
   const [isWakingServer, setIsWakingServer] = useState(false)
   
   // Show message:
   "Waking up server (first load takes ~30s)..."
   ```

---

## 🏗️ Build Failures

### Problem: Netlify build fails

**Check build logs:**
```bash
# In Netlify dashboard → Deploys → Failed deploy → View logs
```

**Common Issues:**

1. **Missing dependencies**
   ```bash
   # Locally test build:
   npm install
   npm run build
   
   # If successful locally but fails on Netlify:
   # - Delete package-lock.json
   # - Run npm install
   # - Commit and push
   ```

2. **Node version mismatch**
   ```toml
   # In netlify.toml:
   [build]
     node_version = "18"
   
   # Verify locally:
   node --version  # Should be 18.x or higher
   ```

3. **Environment variable not set**
   ```bash
   # Build may succeed but app won't work
   # Always set VITE_SERVER_URL before deploying
   ```

4. **Import errors**
   ```javascript
   // Check all imports have correct paths
   // Case-sensitive on Linux (Netlify uses Linux)
   
   // ❌ Wrong:
   import Component from './component'  // File is Component.jsx
   
   // ✅ Correct:
   import Component from './Component'
   ```

### Problem: Render build fails

**Common Issues:**

1. **Wrong root directory**
   ```yaml
   # In Render dashboard:
   Root Directory: server  # Not "server/" or "/server"
   ```

2. **Missing sanitize.js file**
   ```bash
   # Ensure exists:
   server/utils/sanitize.js
   
   # Check imports in server/index.js:
   import { sanitizeNickname, ... } from './utils/sanitize.js'
   ```

3. **Node modules not installing**
   ```bash
   # In Render dashboard → Build Command:
   npm install
   
   # NOT: npm ci (requires package-lock.json)
   ```

---

## 🎮 Gameplay Issues

### Problem: Can create room but can't start game

**Check:**
1. At least 3 players in lobby (or 1 + 2 bots)
2. Questions are selected in customize screen
3. Console for JavaScript errors

### Problem: Players can't see each other

**Check:**
1. Both players joined same room code
2. Both see same room code in UI
3. Network tab shows successful WebSocket connection
4. Server logs show both connections

### Problem: Timer doesn't count down

**Check:**
1. Server is responding (check Render logs)
2. WebSocket connection is active
3. No JavaScript errors in console

### Problem: Chat messages don't appear

**Check:**
1. Messages are being sent (check Network tab)
2. Server processes messages (check Render logs)
3. No sanitization errors (check console)

---

## 📊 Monitoring Tools

### Check Server Health
```bash
# Health endpoint:
https://your-app.onrender.com/

# Stats endpoint:
https://your-app.onrender.com/stats
```

### Browser Console Commands
```javascript
// Check WebSocket connection:
console.log(socketService.socket.connected)  // Should be true

// Check game state:
console.log(gameState)

// Check environment variable:
console.log(import.meta.env.VITE_SERVER_URL)
```

### Render Dashboard
- **Logs**: Real-time server logs
- **Metrics**: CPU, Memory, Response time
- **Events**: Deploys, crashes, restarts

### Netlify Dashboard
- **Deploy logs**: Build output
- **Function logs**: Serverless functions (if used)
- **Analytics**: Traffic, bandwidth

---

## 🔄 Emergency Procedures

### Roll back Netlify deployment
```bash
1. Go to: Deploys tab
2. Find last working deploy
3. Click "..." → "Publish deploy"
4. Site reverts to that version
```

### Roll back Render deployment
```bash
1. Go to service dashboard
2. Click "Manual Deploy" dropdown
3. Select "Clear build cache & deploy"
4. Or redeploy from specific commit
```

### Force refresh environment variables
```bash
# Netlify:
1. Update environment variable
2. Trigger new deploy (required!)

# Render:
1. Update environment variable
2. Service redeploys automatically
```

### Complete reset
```bash
# If everything is broken:

1. Delete both services (Netlify + Render)
2. Create fresh deployments
3. Follow DEPLOYMENT_CHECKLIST.md from start
4. Test thoroughly before sharing
```

---

## 🆘 Getting Help

### Information to provide
When asking for help, include:

1. **URLs**
   - Netlify app URL
   - Render server URL
   - Health endpoint response

2. **Error messages**
   - Browser console errors
   - Netlify build logs
   - Render server logs

3. **Configuration**
   - Environment variables (without sensitive data)
   - Render service settings
   - Netlify build settings

4. **Steps to reproduce**
   - What you did
   - What you expected
   - What actually happened

### Where to get help
- GitHub Issues: Report bugs
- Render Docs: https://render.com/docs
- Netlify Docs: https://docs.netlify.com
- Socket.IO Docs: https://socket.io/docs

---

## ✅ Verification Checklist

After fixing issues, verify:

- [ ] Health endpoint returns JSON
- [ ] Stats endpoint shows 0 active rooms
- [ ] App loads without console errors
- [ ] Can create room and get room code
- [ ] Can join room from second browser
- [ ] Both players see each other
- [ ] Can send chat messages
- [ ] Can start game with 3+ players/bots
- [ ] Timer counts down
- [ ] Can submit answers
- [ ] Can vote for players
- [ ] Scoring works correctly

---

## 🎯 Prevention

Avoid issues by:

1. **Test locally first**
   ```bash
   # Always run before deploying:
   npm run build
   npm run preview
   ```

2. **Use exact URLs**
   - No trailing slashes
   - Use https:// (not http://)
   - Copy-paste to avoid typos

3. **Monitor after deployment**
   - Check health endpoint
   - Test multiplayer immediately
   - Watch logs for errors

4. **Keep logs**
   - Screenshot working configuration
   - Note environment variables
   - Document custom changes

5. **Test before sharing**
   - Create room
   - Join from incognito window
   - Play full round
   - Check all features work

---

**Still stuck?** Create an issue on GitHub with:
- Error messages
- Screenshots
- Configuration details
- Steps you've tried

🚀 Happy deploying!
