# 🎮 Multiplayer Setup Guide

## Quick Start - Play with Friends

### Option 1: Local Network (Same WiFi) - EASIEST ✅

**Step 1: Start the Server**
```bash
cd server
npm start
```
Server will run on `http://localhost:8080`

**Step 2: Start the Client**
```bash
npm run dev
```
Client will run on `http://localhost:3001`

**Step 3: Connect Second Player**

**Player 1 (Host):**
1. Open `http://localhost:3001`
2. Enter nickname and click "Start New Session"
3. Copy the 4-letter room code (e.g., "K3H7")
4. Share the code with Player 2

**Player 2:**
1. Open `http://localhost:3001` (on their device)
2. Enter nickname
3. Click "Join Existing Game"
4. Enter the room code
5. Click "Join Lobby"

✨ **You're now connected!**

---

### Option 2: Over the Internet (Different Networks) 🌐

#### A. Using ngrok (Recommended for testing)

1. **Install ngrok:** https://ngrok.com/download

2. **Start your server:**
```bash
cd server
npm start
```

3. **Expose server with ngrok:**
```bash
ngrok http 8080
```

4. **Update `.env` file:**
```bash
VITE_SERVER_URL=https://abc123.ngrok.io
```
(Use the HTTPS URL that ngrok gives you)

5. **Restart the client:**
```bash
npm run dev
```

6. **Share the client URL with friends**

---

#### B. Deploy to Production Server

**Server Deployment Options:**
- **Heroku** (Easy, free tier available)
- **Railway** (Modern, simple)
- **DigitalOcean** (Full control)
- **AWS EC2** (Scalable)

**Client Deployment Options:**
- **Netlify** (Automatic from GitHub)
- **Vercel** (Fast, optimized for Vite)
- **GitHub Pages** (Free hosting)

---

## Current Mode

The game automatically detects if a server is available:

- **`.env` file exists with `VITE_SERVER_URL`** → Uses real server (multiplayer)
- **No `.env` or empty `VITE_SERVER_URL`** → Uses MockSocket (single player/testing)

---

## Troubleshooting

### "Connection Failed" Error

1. **Check server is running:**
```bash
# In server directory
npm start
```
Should show: "Server listening on port 8080"

2. **Check firewall:** Allow port 8080

3. **Check `.env` file:** Make sure URL is correct

### Player Can't Connect

1. **Same network?** Make sure both devices are on same WiFi
2. **Port forwarding:** If remote, ensure port 8080 is accessible
3. **Server logs:** Check terminal running server for error messages

### "Session Full" Error

- Maximum 12 players per session
- Create a new session for additional players

---

## Network Configuration

### Find Your Local IP (for LAN play)

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., `192.168.1.100`)

**Mac/Linux:**
```bash
ifconfig
```

**Update `.env` for LAN access:**
```bash
VITE_SERVER_URL=http://192.168.1.100:8080
```

Now other devices on your network can connect using your local IP!

---

## Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Player 1      │◄───────►│                 │
│  (Browser)      │   HTTP  │   Game Server   │
└─────────────────┘  WebSoc │   (Node.js)     │
                     ket    │   Port 8080     │
┌─────────────────┐         │                 │
│   Player 2      │◄───────►│                 │
│  (Browser)      │         │                 │
└─────────────────┘         └─────────────────┘
```

**Real-time Communication:**
- Uses Socket.IO for WebSocket connections
- Instant updates when players join/leave
- Live game state synchronization

---

## Testing Locally (Simulate Multiplayer)

**Option 1: Multiple Browser Windows**
1. Open `http://localhost:3001` in one window
2. Open `http://localhost:3001` in another window (or incognito)
3. One creates a room, the other joins

**Option 2: Multiple Devices on Same WiFi**
1. Use your local IP instead of localhost
2. Each device opens the same URL with your IP

---

## Current Status

✅ Server is running on port 8080
✅ Client is configured to connect to server
✅ `.env` file is set up
✅ Ready for multiplayer!

**Next Steps:**
1. Restart your Vite dev server (Ctrl+C, then `npm run dev`)
2. Test with two browser windows
3. Share room code between windows
4. Enjoy multiplayer! 🚀
