import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import { sanitizeNickname, sanitizeChatMessage, sanitizeAnswer } from './utils/sanitize.js'

const app = express()

// Configure CORS for production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173', // Vite default
  process.env.CLIENT_URL, // Set this in Render (e.g., https://your-app.vercel.app)
].filter(Boolean) // Remove undefined values

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true)
    
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true)
    }
    
    // In production, check against whitelist
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.warn(`CORS blocked origin: ${origin}`)
      callback(new Error(`Not allowed by CORS. Origin: ${origin} not in whitelist.`))
    }
  },
  credentials: true
}))

const server = http.createServer(app)
const io = new Server(server, {
  cors: { 
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
})

// In-memory state. For production, consider Redis for scale and persistence.
const rooms = new Map() // roomCode -> { players: [], gameSettings, questions, screen, ... }

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Outsider: Cosmic Council Server',
    version: '1.0.0',
    activeRooms: rooms.size,
    timestamp: new Date().toISOString()
  })
})

// Server stats endpoint
app.get('/stats', (req, res) => {
  const totalPlayers = Array.from(rooms.values()).reduce((sum, room) => sum + (room.players?.length || 0), 0)
  res.json({
    activeRooms: rooms.size,
    totalPlayers: totalPlayers,
    rooms: Array.from(rooms.keys())
  })
})

function generateRoomCode() {
  // Use a more readable character set (exclude confusing characters like 0/O, 1/I/L)
  const chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ' // 32 characters (excludes 0,1,I,L,O)
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)] }

function getPlayer(ioSocket) {
  return { id: ioSocket.id, nickname: ioSocket.data.nickname || 'Player', isHost: false, score: 0, avatarIndex: Math.floor(Math.random() * 12) }
}

function emitState(roomCode) {
  const room = rooms.get(roomCode)
  if (!room) return
  io.to(roomCode).emit('updateGameState', sanitizeRoomState(room))
}

function sanitizeRoomState(room) {
  // Do not leak impostor prompts to clients; only per-player prompt text is shown in UI.
  return JSON.parse(JSON.stringify(room))
}

io.on('connection', (socket) => {
  // Basic identity
  socket.emit('connected', { id: socket.id })

  socket.on('createRoom', ({ nickname }) => {
    const sanitizedNickname = sanitizeNickname(nickname)
    if (!sanitizedNickname) {
      return socket.emit('error', 'Invalid nickname.')
    }
    
    socket.data.nickname = sanitizedNickname
    let roomCode = generateRoomCode()
    let attempts = 0
    while (rooms.has(roomCode) && attempts < 100) {
      roomCode = generateRoomCode()
      attempts++
    }
    
    if (attempts >= 100) {
      return socket.emit('error', 'Unable to create room. Please try again.')
    }

    const player = getPlayer(socket)
    player.isHost = true

    const roomState = {
      roomCode,
      screen: 'customizeGame',
      players: [player],
      gameSettings: { winCondition: 'score', winValue: 5, customTimers: { answer: 60, debate: 60, vote: 45 } },
      usedAvatarIndices: [player.avatarIndex],
      chatMessages: [],
      questions: []
    }
    rooms.set(roomCode, roomState)
    socket.join(roomCode)
    socket.data.roomCode = roomCode
    emitState(roomCode)
  })

  socket.on('confirmCustomization', ({ customQuestions, gameSettings }) => {
    const roomCode = socket.data.roomCode
    const room = rooms.get(roomCode)
    if (!room) return
    room.questions = customQuestions || []
    room.gameSettings = gameSettings || room.gameSettings
    room.screen = 'lobby'
    emitState(roomCode)
  })

  socket.on('joinRoom', ({ nickname, roomCode }) => {
    const sanitizedNickname = sanitizeNickname(nickname)
    if (!sanitizedNickname) {
      return socket.emit('error', 'Invalid nickname.')
    }
    
    socket.data.nickname = sanitizedNickname
    const room = rooms.get(roomCode)
    if (!room) {
      return socket.emit('error', 'Invalid session code.')
    }
    if (room.screen !== 'lobby' && room.screen !== 'customizeGame') {
      return socket.emit('error', 'Game already in progress. Please wait for it to finish.')
    }
    if ((room.players || []).length >= 12) {
      return socket.emit('error', 'Session is full.')
    }
    const player = getPlayer(socket)
    room.players.push(player)
    socket.join(roomCode)
    socket.data.roomCode = roomCode
    emitState(roomCode)
  })

  socket.on('startGame', ({ roomCode, forcedRole }) => {
    const room = rooms.get(roomCode)
    if (!room) return
    const players = room.players
    if (!players || players.length < 3) return

    let anomalyId
    if (forcedRole === 'The Anomaly') anomalyId = socket.id
    else anomalyId = pickRandom(players).id

    const answerTime = room.gameSettings?.customTimers?.answer || 60
    
    // Clear any existing grace period timeout
    if (room.gracePeriodTimeout) {
      clearInterval(room.gracePeriodTimeout)
      room.gracePeriodTimeout = null
    }
    
    room.round = 1
    room.timer = answerTime
    room.screen = 'game'
    room.question = pickRandom(room.questions.length ? room.questions : [{ crew: 'No decrees available', impostor: 'No decrees available' }])
    room.players = players.map(p => ({ ...p, role: p.id === anomalyId ? 'The Anomaly' : 'Entity', score: p.score || 0 }))
    room.answers = []
    room.votes = []
    room.readyPlayerIds = []
    room.gracePeriodActive = false
    room.gracePeriodTimeLeft = null
    emitState(roomCode)
  })

  socket.on('submitAnswer', ({ roomCode, answer }) => {
    const room = rooms.get(roomCode)
    if (!room) return
    
    const sanitizedAnswer = sanitizeAnswer(answer)
    if (!sanitizedAnswer) {
      return socket.emit('error', 'Invalid answer.')
    }
    
    // Ensure answers array exists
    if (!Array.isArray(room.answers)) {
      room.answers = []
    }
    
    // Add or update player's answer
    const existing = room.answers.find(a => a.playerId === socket.id)
    if (existing) {
      existing.answer = sanitizedAnswer
    } else {
      room.answers.push({ playerId: socket.id, answer: sanitizedAnswer })
    }
    
    // Update the room in the Map
    rooms.set(roomCode, room)
    
    // Emit state to all players
    emitState(roomCode)

    // Check submission progress
    const humanPlayers = room.players.filter(p => !p.isBot)
    const answeredCount = humanPlayers.filter(p => room.answers.some(a => a.playerId === p.id)).length
    const totalHumans = humanPlayers.length
    const percentageAnswered = totalHumans > 0 ? (answeredCount / totalHumans) : 0
    
    // Check if all human players have answered
    const allAnswered = answeredCount === totalHumans
    
    if (allAnswered) {
      // Clear any existing grace period timeout
      if (room.gracePeriodTimeout) {
        clearTimeout(room.gracePeriodTimeout)
        room.gracePeriodTimeout = null
      }
      
      // Immediately advance to debate when all humans have answered
      const debateTime = room.gameSettings?.customTimers?.debate || 60
      room.screen = 'debate'
      room.timer = debateTime
      room.readyPlayerIds = []
      room.gracePeriodActive = false
      room.gracePeriodTimeLeft = null
      emitState(roomCode)
    } else if (percentageAnswered >= 0.5 && !room.gracePeriodActive) {
      // 50% threshold reached - start 10 second grace period
      room.gracePeriodActive = true
      room.gracePeriodTimeLeft = 10
      
      // Clear any existing timeout
      if (room.gracePeriodTimeout) {
        clearTimeout(room.gracePeriodTimeout)
      }
      
      // Emit initial state with grace period
      emitState(roomCode)
      
      // Start countdown interval (1 second ticks)
      const countdownInterval = setInterval(() => {
        const currentRoom = rooms.get(roomCode)
        if (!currentRoom || currentRoom.screen !== 'game') {
          clearInterval(countdownInterval)
          return
        }
        
        currentRoom.gracePeriodTimeLeft = (currentRoom.gracePeriodTimeLeft || 0) - 1
        
        if (currentRoom.gracePeriodTimeLeft <= 0) {
          clearInterval(countdownInterval)
          
          // Grace period expired - advance to debate
          const debateTime = currentRoom.gameSettings?.customTimers?.debate || 60
          currentRoom.screen = 'debate'
          currentRoom.timer = debateTime
          currentRoom.readyPlayerIds = []
          currentRoom.gracePeriodActive = false
          currentRoom.gracePeriodTimeLeft = null
          emitState(roomCode)
        } else {
          // Update countdown
          emitState(roomCode)
        }
      }, 1000)
      
      // Store interval reference for cleanup
      room.gracePeriodTimeout = countdownInterval
    }
  })

  socket.on('readyForVote', () => {
    const roomCode = socket.data.roomCode
    const room = rooms.get(roomCode)
    if (!room) return
    room.readyPlayerIds = room.readyPlayerIds || []
    if (!room.readyPlayerIds.includes(socket.id)) room.readyPlayerIds.push(socket.id)
    const humans = room.players.filter(p => !p.isBot)
    const allReady = humans.every(p => room.readyPlayerIds.includes(p.id))
    if (allReady) {
      const voteTime = room.gameSettings?.customTimers?.vote || 45
      room.screen = 'voting'
      room.timer = voteTime
    }
    emitState(roomCode)
  })

  socket.on('vote', ({ roomCode, votedPlayerId }) => {
    const room = rooms.get(roomCode)
    if (!room) return
    room.votes = room.votes || []
    const existing = room.votes.find(v => v.voterId === socket.id)
    if (existing) existing.votedPlayerId = votedPlayerId
    else room.votes.push({ voterId: socket.id, votedPlayerId })
    emitState(roomCode)

    // Check if all human players have voted
    const humanPlayers = room.players.filter(p => !p.isBot)
    const allVoted = humanPlayers.every(p => room.votes.some(v => v.voterId === p.id))
    
    if (allVoted) {
      // Clear any existing tally timeout to prevent race condition
      if (room.tallyTimeout) {
        clearTimeout(room.tallyTimeout)
      }
      
      // Schedule vote tallying
      room.tallyTimeout = setTimeout(() => {
        tallyVotesAndScore(roomCode)
        room.tallyTimeout = null
      }, 1500)
    }
  })

  socket.on('nextRound', ({ roomCode }) => {
    const room = rooms.get(roomCode)
    if (!room) return
    const players = room.players || []
    const anomalyId = pickRandom(players).id
    const answerTime = room.gameSettings?.customTimers?.answer || 60
    
    // Clear any existing grace period timeout
    if (room.gracePeriodTimeout) {
      clearInterval(room.gracePeriodTimeout)
      room.gracePeriodTimeout = null
    }
    
    room.round = (room.round || 1) + 1
    room.timer = answerTime
    room.screen = 'game'
    room.question = pickRandom(room.questions.length ? room.questions : [{ crew: 'No decrees available', impostor: 'No decrees available' }])
    room.players = players.map(p => ({ ...p, role: p.id === anomalyId ? 'The Anomaly' : 'Entity' }))
    room.answers = []
    room.votes = []
    room.readyPlayerIds = []
    room.gracePeriodActive = false
    room.gracePeriodTimeLeft = null
    emitState(roomCode)
  })

  socket.on('playAgain', ({ roomCode }) => {
    const room = rooms.get(roomCode)
    if (!room) return
    // Reset to customize screen preserving players and avatars, host remains
    room.screen = 'customizeGame'
    room.round = 0
    room.answers = []
    room.votes = []
    room.readyPlayerIds = []
    room.winner = null
    emitState(roomCode)
  })

  socket.on('addBot', () => {
    const roomCode = socket.data.roomCode
    const room = rooms.get(roomCode)
    if (!room) return
    room.players = room.players || []
    if (room.players.length >= 12) return
    const botNames = ['Alpha','Beta','Gamma','Delta','Epsilon','Zeta','Eta','Theta','Iota','Kappa','Lambda','Mu']
    const existing = room.players.filter(p => p.isBot).map(p => p.nickname.split(' ')[1])
    const next = botNames.find(n => !existing.includes(n)) || 'Omega'
    const bot = { id: `bot-${Math.random().toString(36).slice(2,10)}`, nickname: `Bot ${next}`, isHost: false, score: 0, isBot: true, avatarIndex: (room.players.length)%12 }
    room.players.push(bot)
    emitState(roomCode)
  })

  socket.on('kickPlayer', ({ playerId }) => {
    const roomCode = socket.data.roomCode
    const room = rooms.get(roomCode)
    if (!room) return
    const kicked = room.players.find(p => p.id === playerId)
    if (!kicked) return
    room.players = room.players.filter(p => p.id !== playerId)
    // Transfer host if needed
    if (kicked.isHost && room.players.length) {
      const newHost = room.players.find(p => !p.isBot) || room.players[0]
      if (newHost) newHost.isHost = true
    }
    emitState(roomCode)
    // Notify client if connected here
    io.to(playerId).emit('kicked')
  })

  socket.on('sendMessage', ({ message }) => {
    const roomCode = socket.data.roomCode
    if (!roomCode) return
    
    const room = rooms.get(roomCode)
    if (!room) return
    
    const sanitizedMessage = sanitizeChatMessage(message)
    if (!sanitizedMessage) return // Ignore empty messages
    
    // Ensure chatMessages array exists
    if (!Array.isArray(room.chatMessages)) {
      room.chatMessages = []
    }
    
    // Create new message object
    const newMessage = { 
      playerId: socket.id, 
      nickname: socket.data.nickname, 
      text: sanitizedMessage, 
      timestamp: new Date().toISOString() 
    }
    
    // Add message to array (this mutates the room object which is in the Map)
    room.chatMessages.push(newMessage)
    
    // Limit chat history to last 100 messages to prevent memory issues
    if (room.chatMessages.length > 100) {
      room.chatMessages = room.chatMessages.slice(-100)
    }
    
    // Update the room in the Map (even though we're mutating, this ensures consistency)
    rooms.set(roomCode, room)
    
    // Broadcast updated state to all players in room
    emitState(roomCode)
  })

  socket.on('disconnect', () => {
    const roomCode = socket.data.roomCode
    if (!roomCode) return
    const room = rooms.get(roomCode)
    if (!room) return
    const idx = (room.players || []).findIndex(p => p.id === socket.id)
    if (idx >= 0) {
      const wasHost = room.players[idx].isHost
      room.players.splice(idx, 1)
      if (wasHost && room.players.length) {
        const newHost = room.players.find(p => !p.isBot) || room.players[0]
        if (newHost) newHost.isHost = true
      }
      // If room empty, clean up and delete
      if (room.players.length === 0) {
        // Clean up any active timers
        if (room.gracePeriodTimeout) {
          clearInterval(room.gracePeriodTimeout)
        }
        if (room.tallyTimeout) {
          clearTimeout(room.tallyTimeout)
        }
        rooms.delete(roomCode)
      }
      else emitState(roomCode)
    }
  })
})

function tallyVotesAndScore(roomCode) {
  const room = rooms.get(roomCode)
  if (!room) return
  const votes = room.votes || []
  
  // Filter out null/undefined votes
  const validVotes = votes.filter(v => v.votedPlayerId)
  
  const counts = validVotes.reduce((acc, v) => {
    acc[v.votedPlayerId] = (acc[v.votedPlayerId] || 0) + 1
    return acc
  }, {})
  
  let eliminatedPlayerId = null
  let max = 0
  let ties = []
  for (const pid in counts) {
    if (counts[pid] > max) { max = counts[pid]; ties = [pid] }
    else if (counts[pid] === max) ties.push(pid)
  }
  if (ties.length === 1) eliminatedPlayerId = ties[0]
  else if (ties.length > 1) eliminatedPlayerId = pickRandom(ties)

  const anomaly = (room.players || []).find(p => p.role === 'The Anomaly')
  if (!anomaly) return
  const anomalyId = anomaly.id
  const anomalyWasVotedOut = eliminatedPlayerId === anomalyId
  const scoreUpdates = {}
  room.players = room.players.map(p => {
    let gain = 0
    if (p.role === 'The Anomaly' && !anomalyWasVotedOut) gain += 2
    if (p.role === 'Entity') {
      if (anomalyWasVotedOut) gain += 1
      const ownVote = validVotes.find(v => v.voterId === p.id)
      if (ownVote && ownVote.votedPlayerId === anomalyId) gain += 1
    }
    scoreUpdates[p.id] = gain
    return { ...p, score: (p.score || 0) + gain }
  })

  const { winCondition, winValue } = room.gameSettings
  let winner = null
  if (winCondition === 'score') {
    winner = room.players.find(p => (p.score || 0) >= winValue)
  } else if (winCondition === 'rounds' && (room.round || 1) >= winValue) {
    winner = [...room.players].sort((a,b) => (b.score||0) - (a.score||0))[0]
  }

  room.reveal = { anomalyId, eliminatedPlayerId, anomalyWasVotedOut, scoreUpdates }
  room.screen = winner ? 'gameOver' : 'scoreboard'
  room.winner = winner || null
  emitState(roomCode)
}

const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
  console.log(`Outsider server listening on port ${PORT}`)
})
