import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import MockSocket from '../services/MockSocket'
import SocketService from '../services/SocketService'
import LoadingScreen from '../components/LoadingScreen'
import { fallbackCopy, saveRecentRoom, generateLobbyLink } from '../utils/helpers'
import { announce } from '../hooks/useAnnouncement'

/**
 * GameContext - Global game state management
 * Handles all socket communication, game state, and event handlers
 */
const GameContext = createContext(null)

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within GameProvider')
  }
  return context
}

export const GameProvider = ({ children }) => {
  // Core state
  const [gameState, setGameState] = useState({ screen: 'home' })
  const [nickname, setNickname] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [questionData, setQuestionData] = useState(null)
  const [roomCode, setRoomCode] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [message, setMessage] = useState('')
  const [isConnected, setIsConnected] = useState(true)
  
  // Admin and UI state
  const [isAdmin, setIsAdmin] = useState(false)
  const [forcedRole, setForcedRole] = useState(null)
  const [showHomeConfirm, setShowHomeConfirm] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [kickConfirmationTarget, setKickConfirmationTarget] = useState(null)
  const [isStarting, setIsStarting] = useState(false)
  
  // Chat state
  const [chatInput, setChatInput] = useState('')
  
  const socketRef = useRef(null)

  // Initialize socket and load questions
  useEffect(() => {
    if (!socketRef.current) {
      // Import questions.json
      import('../data/questions.json')
        .then(module => {
          const data = module.default
          const allQuestions = Object.values(data).flat()
          data["General"] = allQuestions
          setQuestionData({ categories: data, all: allQuestions })
          setIsLoading(false)
        })
        .catch(err => {
          console.error("Failed to load questions.json:", err)
          setError("Critical error: Could not load game decrees. Please refresh.")
          setQuestionData({}) // Set to empty object on error to unblock
          setIsLoading(false)
        })
      // Initialize socket service (real server if configured; else MockSocket)
      const serverUrl = import.meta.env.VITE_SERVER_URL
      socketRef.current = serverUrl ? new SocketService(serverUrl) : new MockSocket()
      socketRef.current.on('updateGameState', (newState) => { 
        setError('')
        setGameState(newState)
        
        // Announce state changes for accessibility
        if (newState.screen === 'lobby' && gameState.screen === 'home') {
          announce(`Joined lobby. Room code: ${newState.roomCode}. ${newState.players.length} players in lobby.`)
        } else if (newState.screen === 'game' && gameState.screen === 'lobby') {
          announce(`Game starting. Round ${newState.round}. Prepare to answer the cosmic decree.`)
        } else if (newState.screen === 'debate' && gameState.screen === 'game') {
          announce(`Debate phase. ${newState.debateTimer} seconds to discuss answers.`)
        } else if (newState.screen === 'voting' && gameState.screen === 'debate') {
          announce(`Voting phase. Vote for who you think is the anomaly.`)
        } else if (newState.screen === 'scoreboard') {
          announce(`Round complete. Viewing results.`)
        } else if (newState.screen === 'gameover') {
          announce(`Game over! Winner is ${newState.winner?.nickname} with ${newState.winner?.score} points!`)
        }
      })
      socketRef.current.on('error', (errorMessage) => {
        setError(errorMessage)
        announce(`Error: ${errorMessage}`, 'assertive')
      })
      socketRef.current.on('kicked', () => {
        alert("You have been removed from the session.")
        resetToHome()
      })
      socketRef.current.on('connectionStatusChange', ({ isConnected }) => {
        setIsConnected(isConnected)
        if (isConnected) {
          announce('Connection restored.')
        } else {
          announce('Connection lost. Attempting to reconnect...', 'assertive')
        }
      })
    }

    // Check for admin mode in URL
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('admin') === 'true') {
      setIsAdmin(true)
    }
  }, [])

  // Reset to home screen
  const resetToHome = useCallback(() => {
    // Tear down existing socket
    try { socketRef.current?.disconnect?.() } catch {}
    const serverUrl = import.meta.env.VITE_SERVER_URL
    socketRef.current = serverUrl ? new SocketService(serverUrl) : new MockSocket()
    // Re-attach listeners
    socketRef.current.on('kicked', () => {
      alert("You have been removed from the session.")
      resetToHome()
    })
    socketRef.current.on('updateGameState', (newState) => { 
      setError('')
      setGameState(newState)
    })
    socketRef.current.on('error', (errorMessage) => setError(errorMessage))
    
    // Reset all state
    setGameState({ screen: 'home' })
    setNickname('')
    setRoomCode('')
    setError('')
    setCopied(false)
    setMessage('')
    setIsAdmin(false)
    setForcedRole(null)
    setShowHomeConfirm(false)
    setShowRules(false)
    setShowAdminLogin(false)
    setKickConfirmationTarget(null)
    setChatInput('')
  }, [])

  // Generate mock state for admin navigation
  const generateMockStateForScreen = useCallback((screenName) => {
    if (!questionData) return { screen: 'home' }

    const basePlayers = [
      { id: 'mock-user-id', nickname: nickname || 'You', isHost: true, score: 3, role: 'Entity', avatarIndex: 0 },
      { id: 'mock-bot-1', nickname: 'Bot Alpha', isHost: false, score: 5, isBot: true, role: 'The Anomaly', avatarIndex: 1 },
      { id: 'mock-bot-2', nickname: 'Bot Beta', isHost: false, score: 2, isBot: true, role: 'Entity', avatarIndex: 2 },
      { id: 'mock-bot-3', nickname: 'Bot Gamma', isHost: false, score: 4, isBot: true, role: 'Entity', avatarIndex: 3 },
    ].map(p => ({ ...p, avatarIndex: Math.floor(Math.random() * 12) }))

    const baseState = {
      roomCode: 'MOCK',
      players: basePlayers,
      gameSettings: { 
        winCondition: 'score', 
        winValue: 5, 
        customTimers: { answer: 60, debate: 60, vote: 45 } 
      },
      questions: questionData.all,
      chatMessages: [
        { playerId: 'mock-bot-1', nickname: 'Bot Alpha', text: 'The council chamber is quiet today.', timestamp: new Date().toISOString() },
        { playerId: 'mock-bot-2', nickname: 'Bot Beta', text: 'Indeed. Awaiting the final entities.', timestamp: new Date().toISOString() },
        { playerId: 'mock-user-id', nickname: 'You', text: 'I have arrived.', timestamp: new Date().toISOString() },
      ]
    }

    switch (screenName) {
      case 'home': 
        return { screen: 'home' }
      case 'customizeGame': 
        return { ...baseState, screen: 'customizeGame', players: [basePlayers[0]] }
      case 'lobby': 
        return { ...baseState, screen: 'lobby', players: [basePlayers[0]] }
      case 'game': 
        return { 
          ...baseState, 
          screen: 'game', 
          round: 2, 
          timer: 60, 
          question: questionData.all[5], 
          answers: [], 
          votes: [] 
        }
      case 'debate': 
        return { 
          ...baseState, 
          screen: 'debate', 
          round: 2, 
          timer: 60, 
          question: questionData.all[5],
          answers: [
            { playerId: 'mock-user-id', answer: 'A truly cosmic quandary.' },
            { playerId: 'mock-bot-1', answer: 'The premise is fundamentally flawed.' },
            { playerId: 'mock-bot-2', answer: 'Indeed, a classic philosophical point.' },
          ], 
          readyPlayerIds: ['mock-bot-2']
        }
      case 'voting': 
        return { 
          ...baseState, 
          screen: 'voting', 
          round: 2, 
          timer: 45, 
          question: questionData.all[5], 
          answers: [
            { playerId: 'mock-user-id', answer: 'A truly cosmic quandary.' },
            { playerId: 'mock-bot-1', answer: 'The premise is fundamentally flawed.' },
            { playerId: 'mock-bot-2', answer: 'Indeed, a classic philosophical point.' },
          ], 
          votes: [] 
        }
      case 'scoreboard': 
        return { 
          ...baseState, 
          screen: 'scoreboard', 
          round: 2,
          reveal: {
            anomalyId: 'mock-bot-1',
            eliminatedPlayerId: 'mock-bot-1',
            anomalyWasVotedOut: true,
            scoreUpdates: { 
              'mock-user-id': 2, 
              'mock-bot-1': 0, 
              'mock-bot-2': 1, 
              'mock-bot-3': 1 
            }
          },
          players: basePlayers.map(p => ({
            ...p, 
            score: p.score + ((p.id === 'mock-user-id' ? 2 : (p.id === 'mock-bot-1' ? 0 : 1)))
          }))
        }
      case 'gameOver': 
        return { ...baseState, screen: 'gameOver', winner: basePlayers[1] }
      default: 
        return { screen: 'home' }
    }
  }, [nickname, questionData])

  // Admin navigation handler
  const handleAdminLoginNavigate = useCallback((screenName) => {
    const newState = generateMockStateForScreen(screenName)
    if (socketRef.current) {
      newState.players?.forEach(p => {
        if (p.id === 'mock-user-id') {
          socketRef.current.id = p.id
        }
      })
      socketRef.current.currentGameState = newState
    }
    setGameState(newState)
  }, [generateMockStateForScreen])

  // Game event handlers
  const handleCreateRoom = useCallback((e) => { 
    e.preventDefault()
    if (nickname) {
      socketRef.current.emit('createRoom', { nickname })
    }
  }, [nickname])

  const handleConfirmCustomization = useCallback((customQuestions, gameSettings) => {
    socketRef.current.emit('confirmCustomization', { customQuestions, gameSettings })
  }, [])

  const handleJoinRoom = useCallback((e) => { 
    e.preventDefault()
    if (nickname && roomCode) {
      socketRef.current.emit('joinRoom', { nickname, roomCode: roomCode.toUpperCase() })
      // Save to recent rooms
      saveRecentRoom(roomCode, nickname)
    }
  }, [nickname, roomCode])

  const handleStartGame = useCallback(() => {
    if (isStarting) return // Prevent double-clicks
    setIsStarting(true)
    socketRef.current.emit('startGame', { roomCode: gameState.roomCode, forcedRole })
    
    // Reset after 2 seconds as a safety (game should transition before this)
    setTimeout(() => setIsStarting(false), 2000)
  }, [gameState.roomCode, forcedRole, isStarting])

  const handleAnswerSubmit = useCallback((answer) => {
    // Prevent submitting empty answer if timer runs out while typing
    if (message.trim() || answer) { 
      socketRef.current.emit('submitAnswer', { 
        roomCode: gameState.roomCode, 
        answer: answer || message 
      })
      setMessage('')
    }
  }, [gameState.roomCode, message])

  const handleVote = useCallback((votedPlayerId) => {
    socketRef.current.emit('vote', { 
      roomCode: gameState.roomCode, 
      votedPlayerId 
    })
  }, [gameState.roomCode])

  const handleNextRound = useCallback(() => {
    socketRef.current.emit('nextRound', { roomCode: gameState.roomCode })
  }, [gameState.roomCode])

  const handleReadyForVote = useCallback(() => {
    socketRef.current.emit('readyForVote')
  }, [])

  const handlePlayAgain = useCallback(() => {
    socketRef.current.emit('playAgain', { roomCode: gameState.roomCode })
  }, [gameState.roomCode])

  const handleAddBot = useCallback(() => {
    socketRef.current.emit('addBot')
  }, [])

  const handleKickPlayer = useCallback((playerId) => {
    socketRef.current.emit('kickPlayer', { playerId })
  }, [])

  const handleSendMessage = useCallback((e) => {
    e.preventDefault()
    if (chatInput.trim()) {
      socketRef.current.emit('sendMessage', { message: chatInput })
    }
    setChatInput('')
  }, [chatInput])

  // Copy room code to clipboard
  const copyRoomCode = useCallback(() => {
    if (!gameState.roomCode) return
    
    const onSuccess = () => {
      setCopied(true)
      announce(`Room code ${gameState.roomCode} copied to clipboard`)
      setTimeout(() => setCopied(false), 2000)
    }
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(gameState.roomCode)
        .then(onSuccess)
        .catch(err => {
          console.warn('Clipboard API failed, using fallback.', err)
          fallbackCopy(gameState.roomCode, onSuccess)
        })
    } else {
      fallbackCopy(gameState.roomCode, onSuccess)
    }
  }, [gameState.roomCode])

  // Copy lobby link to clipboard
  const copyLobbyLink = useCallback(() => {
    if (!gameState.roomCode) return
    
    const lobbyLink = generateLobbyLink(gameState.roomCode)
    
    const onSuccess = () => {
      setLinkCopied(true)
      announce(`Lobby link copied to clipboard. Share with friends to join instantly.`)
      setTimeout(() => setLinkCopied(false), 2000)
    }
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(lobbyLink)
        .then(onSuccess)
        .catch(err => {
          console.warn('Clipboard API failed, using fallback.', err)
          fallbackCopy(lobbyLink, onSuccess)
        })
    } else {
      fallbackCopy(lobbyLink, onSuccess)
    }
  }, [gameState.roomCode])

  // Get current player info
  const me = gameState.players?.find(p => p.id === socketRef.current?.id)
  const isHost = me?.isHost

  // Show loading screen while initializing
  if (isLoading || !questionData) {
    return <LoadingScreen />
  }

  const value = {
    // State
    gameState,
    nickname,
    setNickname,
    roomCode,
    setRoomCode,
    error,
    copied,
    message,
    setMessage,
    isConnected,
    isStarting,
    isAdmin,
    setIsAdmin,
    forcedRole,
    setForcedRole,
    showHomeConfirm,
    setShowHomeConfirm,
    showRules,
    setShowRules,
    showAdminLogin,
    setShowAdminLogin,
    kickConfirmationTarget,
    setKickConfirmationTarget,
    chatInput,
    setChatInput,
    
    // Refs
    socketRef,
    
    // Data
    questionData,
    me,
    isHost,
    
    // Event handlers
    resetToHome,
    handleCreateRoom,
    handleConfirmCustomization,
    handleJoinRoom,
    handleStartGame,
    handleAnswerSubmit,
    handleVote,
    handleNextRound,
    handleReadyForVote,
    handlePlayAgain,
    handleAddBot,
    handleKickPlayer,
    handleSendMessage,
    copyRoomCode,
    copyLobbyLink,
    handleAdminNavigate: handleAdminLoginNavigate,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export default GameContext
