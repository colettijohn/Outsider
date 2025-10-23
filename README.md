# 🌌 Outsider: Cosmic Council

A cosmic-themed social deduction game built with React. Find The Anomaly among the Entities through philosophical questions and clever deduction!

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)
![Vite](https://img.shields.io/badge/vite-5.0-646cff.svg)

> 📚 **[View Full Documentation](./docs/)** - Detailed guides, deployment instructions, and feature documentation

---

## 🎮 About

**Outsider: Cosmic Council** is a social deduction game where 3-12 players identify "The Anomaly" - a secret outsider who receives different questions than everyone else.

### Features
- 🌟 Interactive constellation-based question selection
- 🎭 Role-based gameplay (Entity vs Anomaly)
- 💬 Real-time chat system
- 🤖 AI bot players
- 🎨 Beautiful cosmic-themed UI with parallax effects
- 📱 Fully responsive (desktop, tablet, mobile)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16.x or higher
- npm 7.x or higher

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Visit `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
Outsider/
├── public/                 # Static assets
│   └── imgs/              # Avatars, icons
├── src/
│   ├── components/        # 35 React components
│   ├── contexts/          # GameContext (state management)
│   ├── data/              # questions.json, constellationLayouts.js
│   ├── services/          # MockSocket (game logic)
│   ├── styles/            # main.css (all styles)
│   ├── utils/             # Helper functions
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── Outsider.html          # Original monolithic file (backup)
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.js         # Vite config
└── README.md              # This file
```

---

## 🎯 How to Play

1. **Create/Join Session** - Enter nickname, create or join room
2. **Customize Game** - Select question categories via constellation map
3. **Lobby** - Wait for 3-12 players, add bots if needed
4. **Game Rounds** - Answer questions, debate, vote for The Anomaly
5. **Victory** - First to 5 points or Best of 3 rounds wins

### Roles
- **Entities** (Most players): Identify The Anomaly, see real questions
- **The Anomaly** (1 player): Stay hidden, sees different questions

### Scoring
- **Anomaly Found**: Correct voters get +2, Anomaly gets 0
- **Anomaly Hidden**: Anomaly gets +2, Entities get +1

---

## 🎨 Special Features

### Admin Panel
- URL: `http://localhost:3000?admin=true`
- Password: `0`
- Navigate screens, force roles, reveal anomaly

### Easter Eggs
- **Konami Code**: Type "COSMIC" → click logo → console art
- **Cosmic Scribbler**: Click logo 5 times → particle canvas

### Parallax Background
- Desktop: Follows mouse
- Mobile: Responds to device tilt

---

## 🛠️ Tech Stack

- **Frontend**: React 18.2 + Vite 5.0
- **Styling**: Tailwind CSS (CDN)
- **Icons**: Lucide Icons (CDN)
- **State**: React Context API
- **Game Logic**: MockSocket (client-side)
  - To enable online multiplayer, run the Socket.IO server in `server/` and set `VITE_SERVER_URL`.

---

## 🔧 Development

### Adding Questions
Edit `src/data/questions.json`:
```json
{
  "Category": [
    {
      "crew": "Question for Entities",
      "impostor": "Question for Anomaly"
    }
  ]
}
```

### Adding Components
1. Create in `src/components/`
2. Use JSDoc for props documentation
3. Export as default
4. Import where needed

---

## 🐛 Troubleshooting

**Port in use?** Change port in `vite.config.js`

**PowerShell errors?** (Windows)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Module errors?**
```bash
rm -rf node_modules
npm install
```

---

## 🚢 Deployment

Works with: Netlify, Vercel, GitHub Pages, or any static host

```bash
npm run build  # Creates dist/ folder
```

---

## 🌐 Multiplayer (Online)

This app ships with a local simulator (MockSocket). To play across the internet, run the real-time server.

1) Start the server locally (or deploy):
  - See `server/README.md` for instructions.

2) Configure the frontend:
  - Create a `.env` in the project root with:
    - `VITE_SERVER_URL=https://your-server.example.com`
  - Rebuild and redeploy the frontend.

3) Netlify setup:
  - In Site settings → Build & deploy → Environment → add `VITE_SERVER_URL`.
  - Trigger a new deploy.

With `VITE_SERVER_URL` set, the app automatically uses the live Socket.IO server instead of MockSocket.

---

## 👤 Author

**John Coletti**
- Game Design & Development
- © 2025 All rights reserved

---

## 📄 License

MIT License

---

## 🌟 Acknowledgments

- React, Vite, Tailwind CSS, Lucide Icons teams
- Google Fonts (Rajdhani, Roboto)

---

**Built with ❤️ and ✨ cosmic energy**
