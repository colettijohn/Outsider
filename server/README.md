# Outsider: Cosmic Council - Realtime Server

Node.js + Socket.IO server for multiplayer gameplay.

## Run locally

- Requirements: Node 18+

```powershell
# from the server folder
npm install
npm start
```

Server listens on http://localhost:8080 by default.

## Events

The server mirrors the client MockSocket events:
- createRoom { nickname }
- confirmCustomization { customQuestions, gameSettings }
- joinRoom { nickname, roomCode }
- startGame { roomCode, forcedRole? }
- submitAnswer { roomCode, answer }
- readyForVote
- vote { roomCode, votedPlayerId|null }
- nextRound { roomCode }
- playAgain { roomCode }
- addBot
- kickPlayer { playerId }
- sendMessage { message }

Broadcasts:
- updateGameState (full room state)
- kicked (to a player being removed)

## Deploy

- Render/Railway: create a new Node app, auto-detects `npm start`.
- Set environment PORT (optional). The server uses `process.env.PORT || 8080`.
- Note the public URL (e.g., https://your-app.onrender.com).

Then set that URL in your frontend as VITE_SERVER_URL and rebuild.

## Scale notes

This server stores state in memory. To scale horizontally, use the Socket.IO Redis adapter and move room state to Redis or a database.