// --- Game Simulation Logic (MockSocket) ---
// This class simulates a WebSocket connection for local gameplay
class MockSocket {
    constructor() {
        this.events = {}
        this.id = crypto.randomUUID()
        this.roomCode = null
        this.nickname = null
        this.currentGameState = {}
    }

    on(event, callback) {
        this.events[event] = callback
    }

    emit(event, data) {
        console.log(`EMITTING [${event}]`, data)
        // Chat messages should be instant. We handle them synchronously.
        if (event === 'sendMessage') {
            this.handleEmit(event, data)
        } else {
            // Other actions can have a simulated network delay.
            setTimeout(() => this.handleEmit(event, data), 300)
        }
    }

    generateRoomCode() {
        // Use a more readable character set (exclude confusing characters like 0/O, 1/I/L)
        const chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ' // 32 characters (excludes 0,1,I,L,O)
        let code = ''
        for (let i = 0; i < 4; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return code
    }

    handleEmit(event, data) {
        switch (event) {
            case 'createRoom': {
                this.nickname = data.nickname
                this.roomCode = this.generateRoomCode()
                const avatarCount = 12 // Should match the number of avatar images
                const randomAvatarIndex = Math.floor(Math.random() * avatarCount)
                const hostPlayer = { id: this.id, nickname: this.nickname, isHost: true, score: 0, avatarIndex: randomAvatarIndex }
                this.currentGameState = {
                    screen: 'customizeGame',
                    roomCode: this.roomCode,
                    players: [hostPlayer],
                    gameSettings: { winCondition: 'score', winValue: 5 },
                    usedAvatarIndices: [randomAvatarIndex],
                    chatMessages: []
                }
                this.events['updateGameState'](this.currentGameState)
                break
            }
            case 'confirmCustomization': {
                this.currentGameState = {
                    ...this.currentGameState,
                    questions: data.customQuestions,
                    gameSettings: data.gameSettings,
                    screen: 'lobby',
                    chatMessages: this.currentGameState.chatMessages || []
                }
                this.events['updateGameState'](this.currentGameState)
                break
            }
            case 'joinRoom': {
                // Validate input data first
                if (!data || !data.nickname || !data.roomCode) {
                    return this.events['error']("Invalid join request.")
                }

                if (data.roomCode.length !== 4) {
                    return this.events['error']("Invalid session code.")
                }

                this.nickname = data.nickname
                this.roomCode = data.roomCode

                if (this.currentGameState.players && this.currentGameState.players.length >= 12) {
                    return this.events['error']("Session is full.")
                }

                const avatarCount = 12
                const availableIndices = Array.from({ length: avatarCount }, (_, i) => i)
                const nextIndex = availableIndices.length > 0 ? availableIndices[Math.floor(Math.random() * availableIndices.length)] : 0

                const newPlayer = { id: this.id, nickname: this.nickname, isHost: false, score: 0, avatarIndex: nextIndex }

                // If this is the first player joining (i.e., no host player object exists yet), create a mock one.
                if (!this.currentGameState.players) {
                    this.currentGameState.players = [{ id: crypto.randomUUID(), nickname: 'Host', isHost: true, score: 0, isBot: true, avatarIndex: 0, chatMessages: [] }]
                }
                this.currentGameState.players.push(newPlayer)

                this.events['updateGameState'](this.currentGameState)
                break
            }
            case 'startGame': {
                const gamePlayers = [...this.currentGameState.players]
                let anomalyId = gamePlayers.length > 0 ? gamePlayers[0].id : this.id

                if (gamePlayers.length > 0) {
                    const playerIds = gamePlayers.map(p => p.id)
                    const forcedRole = data.forcedRole
                    const starterPlayerId = this.id

                    if (forcedRole && playerIds.includes(starterPlayerId)) {
                        if (forcedRole === 'The Anomaly') anomalyId = starterPlayerId
                        else {
                            const otherPlayerIds = playerIds.filter(id => id !== starterPlayerId)
                            if (otherPlayerIds.length > 0) anomalyId = otherPlayerIds[Math.floor(Math.random() * otherPlayerIds.length)]
                            else anomalyId = starterPlayerId
                        }
                    } else {
                        anomalyId = playerIds[Math.floor(Math.random() * playerIds.length)]
                    }
                }

                const answerTime = this.currentGameState.gameSettings?.customTimers?.answer || 60

                this.currentGameState = {
                    ...this.currentGameState, screen: 'game', round: 1, timer: answerTime,
                    question: this.currentGameState.questions.length > 0 ? this.currentGameState.questions[Math.floor(Math.random() * this.currentGameState.questions.length)] : { crew: "No decrees available", impostor: "No decrees available" },
                    players: gamePlayers.map(p => ({ ...p, role: p.id === anomalyId ? 'The Anomaly' : 'Entity', score: 0 })),
                    answers: [], votes: [], eliminatedPlayerIds: []
                }
                this.events['updateGameState'](this.currentGameState)
                break
            }
            case 'submitAnswer': {
                const entityBotAnswers = ["A fascinating concept.", "One must consider the implications.", "Indeed, a fundamental truth.", "It is as the cosmos wills it.", "A clear and logical conclusion."]
                const anomalyBotAnswers = ["Is that truly the question?", "A paradox within a paradox.", "From a certain perspective...", "The premise is flawed.", "Chaos theory suggests otherwise."]

                const myAnswer = { playerId: this.id, answer: data.answer }
                const bots = this.currentGameState.players.filter(p => p.isBot)
                const anomaly = this.currentGameState.players.find(p => p.role === 'The Anomaly')

                const botAnswers = bots.map(bot => {
                    const isAnomaly = bot.id === anomaly?.id
                    const answerPool = isAnomaly ? anomalyBotAnswers : entityBotAnswers
                    const answer = answerPool[Math.floor(Math.random() * answerPool.length)]
                    return { playerId: bot.id, answer: answer }
                })

                const debateTime = this.currentGameState.gameSettings?.customTimers?.debate || 60
                this.currentGameState = {
                    ...this.currentGameState,
                    screen: 'debate',
                    timer: debateTime,
                    answers: [myAnswer, ...botAnswers],
                    readyPlayerIds: [] // Initialize ready players list
                }
                this.events['updateGameState'](this.currentGameState)
                break
            }
            case 'addBot': {
                if (!this.currentGameState.players) this.currentGameState.players = []
                if (this.currentGameState.players.length >= 12) {
                    break // Silently fail if lobby is full
                }

                const botNames = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa"]
                const existingBotNames = this.currentGameState.players
                    .filter(p => p.isBot)
                    .map(p => p.nickname.split(' ')[1])

                let newBotName = "Omega" // Fallback
                for (const name of botNames) {
                    if (!existingBotNames.includes(name)) {
                        newBotName = name
                        break
                    }
                }

                const usedIndices = this.currentGameState.players.map(p => p.avatarIndex)
                let nextIndex = 0
                while (usedIndices.includes(nextIndex)) { nextIndex++ }

                const newBot = { id: crypto.randomUUID(), nickname: `Bot ${newBotName}`, isHost: false, score: 0, isBot: true, avatarIndex: nextIndex }

                if (this.currentGameState.screen === 'game' || this.currentGameState.screen === 'voting') {
                    newBot.role = 'Entity' // New bots in-game are always entities
                }

                this.currentGameState.players.push(newBot)
                this.events['updateGameState'](this.currentGameState)
                break
            }
            case 'kickPlayer': {
                const { playerId } = data
                const kickedPlayer = this.currentGameState.players.find(p => p.id === playerId)
                if (!kickedPlayer) break

                // If the kicked player is the current connection, force them to home screen.
                if (this.id === playerId) {
                    this.events['kicked']()
                    break
                }

                this.currentGameState.players = this.currentGameState.players.filter(p => p.id !== playerId)

                // If the host was kicked, assign a new host
                if (kickedPlayer.isHost && this.currentGameState.players.length > 0) {
                    let newHost = this.currentGameState.players.find(p => !p.isBot)
                    if (!newHost) newHost = this.currentGameState.players[0] // Fallback to a bot
                    if (newHost) newHost.isHost = true
                }

                this.events['updateGameState'](this.currentGameState)
                break
            }
            case 'readyForVote': {
                if (!this.currentGameState.readyPlayerIds.includes(this.id)) {
                    this.currentGameState.readyPlayerIds.push(this.id)
                }

                const humanPlayers = this.currentGameState.players.filter(p => !p.isBot)
                const allReady = humanPlayers.every(p => this.currentGameState.readyPlayerIds.includes(p.id))

                if (allReady) {
                    const voteTime = this.currentGameState.gameSettings?.customTimers?.vote || 45
                    this.currentGameState = { ...this.currentGameState, screen: 'voting', timer: voteTime }
                }

                this.events['updateGameState'](this.currentGameState)
                break
            }
            case 'vote': {
                const myVote = { voterId: this.id, votedPlayerId: data.votedPlayerId }
                const bots = this.currentGameState.players.filter(p => p.isBot)
                const allPlayerIds = this.currentGameState.players.map(p => p.id)

                const botVotes = bots.map(bot => {
                    const potentialTargets = allPlayerIds.filter(id => id !== bot.id)
                    const votedPlayerId = potentialTargets.length > 0 ? potentialTargets[Math.floor(Math.random() * potentialTargets.length)] : null
                    return { voterId: bot.id, votedPlayerId: votedPlayerId }
                }).filter(vote => vote.votedPlayerId)

                const allVotes = [myVote, ...botVotes]

                this.currentGameState = { ...this.currentGameState, votes: allVotes }
                this.events['updateGameState'](this.currentGameState)

                setTimeout(() => {
                    const voteCounts = allVotes.reduce((acc, vote) => {
                        acc[vote.votedPlayerId] = (acc[vote.votedPlayerId] || 0) + 1
                        return acc
                    }, {})

                    let eliminatedPlayerId = null
                    let maxVotes = 0
                    let tiedPlayers = []

                    for (const playerId in voteCounts) {
                        if (voteCounts[playerId] > maxVotes) {
                            maxVotes = voteCounts[playerId]
                            tiedPlayers = [playerId]
                        } else if (voteCounts[playerId] === maxVotes) {
                            tiedPlayers.push(playerId)
                        }
                    }

                    if (tiedPlayers.length === 1) {
                        eliminatedPlayerId = tiedPlayers[0]
                    } else if (tiedPlayers.length > 1) {
                        eliminatedPlayerId = tiedPlayers[Math.floor(Math.random() * tiedPlayers.length)]
                    }

                    const anomaly = this.currentGameState.players.find(p => p.role === 'The Anomaly')
                    if (!anomaly) return
                    const anomalyId = anomaly.id
                    const anomalyWasVotedOut = eliminatedPlayerId === anomalyId
                    const scoreUpdates = {}

                    const updatedPlayers = this.currentGameState.players.map(player => {
                        let scoreGained = 0
                        if (player.role === 'The Anomaly' && !anomalyWasVotedOut) scoreGained += 2
                        const ownVote = allVotes.find(v => v.voterId === player.id)
                        if (player.role === 'Entity') {
                            if (anomalyWasVotedOut) scoreGained += 1
                            if (ownVote && ownVote.votedPlayerId === anomalyId) scoreGained += 1
                        }

                        scoreUpdates[player.id] = scoreGained
                        return { ...player, score: player.score + scoreGained }
                    })

                    let winner = null
                    const { winCondition, winValue } = this.currentGameState.gameSettings
                    if (winCondition === 'score') {
                        winner = updatedPlayers.find(p => p.score >= winValue)
                    } else if (winCondition === 'rounds' && this.currentGameState.round >= winValue) {
                        winner = updatedPlayers.reduce((prev, current) => (prev.score > current.score) ? prev : current)
                    }

                    const finalGameState = {
                        ...this.currentGameState,
                        screen: winner ? 'gameOver' : 'scoreboard',
                        players: updatedPlayers,
                        winner: winner,
                        reveal: {
                            anomalyId: anomalyId,
                            eliminatedPlayerId,
                            anomalyWasVotedOut: anomalyWasVotedOut,
                            scoreUpdates: scoreUpdates
                        }
                    }
                    this.events['updateGameState'](finalGameState)
                }, 1500)
                break
            }
            case 'nextRound': {
                const currentPlayers = this.currentGameState.players
                let anomalyId = currentPlayers.length > 1 ? currentPlayers[0].id : this.id
                const playerIds = currentPlayers.map(p => p.id)
                anomalyId = playerIds[Math.floor(Math.random() * playerIds.length)]

                const answerTime = this.currentGameState.gameSettings?.customTimers?.answer || 60
                this.currentGameState = {
                    ...this.currentGameState, screen: 'game', timer: answerTime,
                    round: this.currentGameState.round + 1,
                    question: this.currentGameState.questions.length > 0 ? this.currentGameState.questions[Math.floor(Math.random() * this.currentGameState.questions.length)] : { crew: "No decrees available", impostor: "No decrees available" },
                    players: currentPlayers.map(p => ({ ...p, role: p.id === anomalyId ? 'The Anomaly' : 'Entity' })),
                    answers: [], votes: []
                }
                this.events['updateGameState'](this.currentGameState)
                break
            }
            case 'playAgain': {
                this.emit('createRoom', { nickname: this.nickname })
                break
            }
            case 'sendMessage': {
                if (!this.currentGameState.chatMessages) {
                    this.currentGameState.chatMessages = []
                }
                const newMessage = {
                    playerId: this.id,
                    nickname: this.nickname,
                    text: data.message,
                    timestamp: new Date().toISOString()
                }
                this.currentGameState.chatMessages.push(newMessage)
                this.events['updateGameState'](this.currentGameState)
                break
            }
        }
    }
}

export default MockSocket
