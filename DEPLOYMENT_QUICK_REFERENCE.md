# 🚀 Deployment Quick Reference

## URLs After Deployment

```
Frontend: https://your-app.netlify.app
Backend:  https://your-app.onrender.com
Health:   https://your-app.onrender.com/
Stats:    https://your-app.onrender.com/stats
```

---

## Environment Variables

### Netlify (Frontend)
```bash
VITE_SERVER_URL=https://your-app.onrender.com
```

### Render (Backend)
```bash
NODE_ENV=production
CLIENT_URL=https://your-app.netlify.app
PORT=8080
```

---

## Build Settings

### Netlify
```
Branch:           main
Build command:    npm run build
Publish directory: dist
Node version:     18
```

### Render
```
Root directory:   server
Build command:    npm install
Start command:    npm start
Instance type:    Free
```

---

## Common Commands

```bash
# Local development
npm run dev                    # Start client
cd server && npm start         # Start server

# Production build
npm run build                  # Build client
npm run preview               # Preview build

# Server testing
curl https://your-app.onrender.com/        # Health check
curl https://your-app.onrender.com/stats   # Stats
```

---

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Can't connect to server | Check VITE_SERVER_URL in Netlify, rebuild site |
| CORS error | Update CLIENT_URL in Render to match Netlify URL |
| Server slow (30s+) | Free tier sleeps; upgrade or use keep-alive |
| Build fails | Check Node version, run `npm install` locally |
| Room creation fails | Verify health endpoint returns JSON |

---

## Testing Checklist

- [ ] Visit frontend URL
- [ ] Check browser console (no errors)
- [ ] Create room (get room code)
- [ ] Join from second browser
- [ ] Both players see each other
- [ ] Start game
- [ ] Chat works
- [ ] Voting works

---

## Important Files

- `DEPLOYMENT_GUIDE.md` - Full deployment instructions
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist
- `DEPLOYMENT_TROUBLESHOOTING.md` - Common issues & fixes
- `netlify.toml` - Netlify configuration
- `render.yaml` - Render blueprint
- `.env.local` - Local environment template

---

## One-Liner Deploy Status Check

```bash
# Check everything at once:
echo "Frontend:" && curl -s https://your-app.netlify.app | grep -q "Outsider" && echo "✅ OK" || echo "❌ Failed"
echo "Backend:" && curl -s https://your-app.onrender.com | grep -q "ok" && echo "✅ OK" || echo "❌ Failed"
```

---

## Support

- 📖 Full Guide: `DEPLOYMENT_GUIDE.md`
- ✅ Checklist: `DEPLOYMENT_CHECKLIST.md`
- 🔧 Troubleshooting: `DEPLOYMENT_TROUBLESHOOTING.md`
- 🐛 Issues: GitHub Issues

**Keep this file handy!** 📌
