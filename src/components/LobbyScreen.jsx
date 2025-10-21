import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useGame } from '../contexts/GameContext'
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut'
import Icon from './Icon'
import PlayerAvatar from './PlayerAvatar'
import HexButton from './HexButton'
import ChatBox from './ChatBox'

/**
 * LobbyScreen component - Waiting room with player orrery
 */
const LobbyScreen = () => {
  const {
    gameState,
    me,
    isHost,
    isConnected,
    isStarting,
    handleStartGame,
    copyRoomCode,
    copyLobbyLink,
    copied,
    linkCopied,
    setKickConfirmationTarget,
    chatInput,
    setChatInput,
    handleSendMessage
  } = useGame()
  const canStart = gameState.players.length >= 3

  // Helper function for haptic feedback on mobile
  const triggerHaptic = (style = 'light') => {
    if (window.navigator && window.navigator.vibrate) {
      const patterns = {
        light: 10,
        medium: 20,
        heavy: 30,
        success: [10, 50, 10]
      }
      window.navigator.vibrate(patterns[style] || 10)
    }
  }

  // Keyboard shortcuts for lobby
  useKeyboardShortcut('c', copyRoomCode)
  useKeyboardShortcut('s', () => {
    if (isHost && canStart) handleStartGame()
  }, { enabled: isHost && canStart })
  const colors = ['#A21CAF', '#BE185D', '#0369A1', '#B45309', '#5B21B6', '#15803D']
  const orreryRef = useRef(null)
  const chatInputRef = useRef(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [radius, setRadius] = useState(150)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  
  // State for mobile chat drawer swipe
  const [drawerSwipeStart, setDrawerSwipeStart] = useState(null)
  const [drawerOffset, setDrawerOffset] = useState(0)
  
  // State for draggable chat
  const [chatPosition, setChatPosition] = useState({ 
    x: window.innerWidth / 2 - 256, 
    y: window.innerHeight * 0.3 
  })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0, chatX: 0, chatY: 0 })

  useEffect(() => {
    const updateRadius = () => {
      if (orreryRef.current) {
        const orrerySize = orreryRef.current.offsetWidth
        setRadius(orrerySize / 2 - 40)
      }
    }
    
    const checkMobile = () => {
      const mobileState = window.innerWidth < 768
      if (mobileState !== isMobile) {
        setIsMobile(mobileState)
        setIsChatOpen(false)
      }
    }
    
    updateRadius()
    window.addEventListener('resize', updateRadius)
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', updateRadius)
      window.removeEventListener('resize', checkMobile)
    }
  }, [isMobile])

  // Improved drag handling with bounds checking
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e) => {
      e.preventDefault()
      
      const deltaX = e.clientX - dragStartRef.current.x
      const deltaY = e.clientY - dragStartRef.current.y
      
      let newX = dragStartRef.current.chatX + deltaX
      let newY = dragStartRef.current.chatY + deltaY
      
      // Bounds checking (keep chat panel within viewport)
      const chatWidth = 512 // max-w-lg
      const chatHeight = 500 // approximate height
      const margin = 20
      
      newX = Math.max(margin, Math.min(newX, window.innerWidth - chatWidth - margin))
      newY = Math.max(margin, Math.min(newY, window.innerHeight - chatHeight - margin))
      
      setChatPosition({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const handleChatMouseDown = (e) => {
    // Only allow dragging from the header area
    if (e.target.closest('.chat-input, .messages-container, button, input')) {
      return
    }
    
    e.preventDefault()
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      chatX: chatPosition.x,
      chatY: chatPosition.y
    }
  }
  
  const handleToggleChat = () => setIsChatOpen(!isChatOpen)
  
  const handleOpenChat = useCallback(() => {
    setIsChatOpen(true)
  }, [])

  // Mobile chat drawer swipe handlers
  const handleDrawerTouchStart = (e) => {
    setDrawerSwipeStart(e.touches[0].clientY)
  }

  const handleDrawerTouchMove = (e) => {
    if (drawerSwipeStart === null) return
    const currentY = e.touches[0].clientY
    const diff = currentY - drawerSwipeStart
    if (diff > 0) {
      setDrawerOffset(diff)
    }
  }

  const handleDrawerTouchEnd = () => {
    if (drawerOffset > 100) {
      triggerHaptic('light')
      setIsChatOpen(false)
    }
    setDrawerOffset(0)
    setDrawerSwipeStart(null)
  }

  // Keyboard shortcuts for lobby
  useKeyboardShortcut('c', copyRoomCode)
  useKeyboardShortcut('t', handleOpenChat) // 't' for talk
  useKeyboardShortcut('/', handleOpenChat) // '/' for chat (common pattern)
  useKeyboardShortcut('s', () => {
    if (isHost && canStart) handleStartGame()
  }, { enabled: isHost && canStart })
  // Calculate orbit positions with constrained circular paths
  const [orbitTime, setOrbitTime] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setOrbitTime(prev => prev + 0.016) // ~60fps
    }, 16)
    return () => clearInterval(interval)
  }, [])
  
  const playerOrbits = useMemo(() => {
    return gameState.players.map((player, index) => {
      const totalPlayers = gameState.players.length
      const baseAngle = (index / totalPlayers) * Math.PI * 2
      const rotationSpeed = 0.05 + (index * 0.02) // Different speeds for visual interest
      const angle = baseAngle + (orbitTime * rotationSpeed)
      
      // Calculate position on circular path with constrained radius
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      
      return {
        player,
        x,
        y,
        isYou: player.id === me.id
      }
    })
  }, [gameState.players, me.id, orbitTime, radius])

  return (
    <div className="w-full flex flex-col items-center justify-center relative px-4 md:px-0">
      <div className="text-center mb-4 md:mb-8">
        <h2 className="title-font text-3xl md:text-4xl font-bold text-amber-500 uppercase">
          Council Chamber
        </h2>
        <p className="text-gray-400 text-sm md:text-base mt-1">Awaiting assembly of all entities.</p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mt-2">
          <p className="text-gray-500 text-xs md:text-sm">
            {gameState.players.length} / 12 players assembled
          </p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
            <span className="text-xs text-gray-500">
              {isConnected ? 'Connected' : 'Reconnecting...'}
            </span>
          </div>
        </div>
      </div>

      {/* The Orrery */}
      <div
        ref={orreryRef}
        className="relative w-full max-w-sm h-auto aspect-square md:max-w-md my-4 md:my-8"
      >
        {/* Central Star (Session Code) */}
        <div
          className="absolute inset-0 rounded-full flex flex-col items-center justify-center p-4"
          style={{ animation: 'orrery-pulse 8s infinite ease-in-out' }}
        >
          <span className="text-xs md:text-sm text-amber-500 uppercase">Session Code</span>
          <span className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-[0.2em] text-gray-200 title-font my-1 md:my-2">
            {gameState.roomCode}
          </span>
          <div className="flex flex-col sm:flex-row items-center gap-2 mt-2">
            <button
              onClick={() => {
                triggerHaptic('light')
                copyRoomCode()
              }}
              className="flex items-center gap-2 px-4 py-2 md:px-3 md:py-1 bg-gray-800/50 hover:bg-gray-700/70 active:bg-gray-700 rounded-full transition-all active:scale-95 min-h-[44px] md:min-h-0"
            >
              {copied ? (
                <Icon name="Check" className="w-5 h-5 md:w-4 md:h-4 text-green-400" />
              ) : (
                <Icon name="Copy" className="w-5 h-5 md:w-4 md:h-4" />
              )}
              <span className="text-sm md:text-xs font-medium">{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={() => {
                triggerHaptic('light')
                copyLobbyLink()
              }}
              className="flex items-center gap-2 px-4 py-2 md:px-3 md:py-1 bg-amber-600/50 hover:bg-amber-600/70 active:bg-amber-600 rounded-full transition-all active:scale-95 min-h-[44px] md:min-h-0"
              title="Share this link with friends to join instantly"
            >
              {linkCopied ? (
                <Icon name="Check" className="w-5 h-5 md:w-4 md:h-4 text-green-400" />
              ) : (
                <Icon name="Share2" className="w-5 h-5 md:w-4 md:h-4" />
              )}
              <span className="text-sm md:text-xs font-medium">{linkCopied ? 'Link Copied!' : 'Share Link'}</span>
            </button>
          </div>
        </div>

        {/* Orbiting Players (Planets) */}
        {playerOrbits.map(({ player, x, y, isYou }) => (
          <div
            key={player.id}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100"
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
            }}
          >
            <div className="flex flex-col items-center text-center w-16 md:w-20 active:scale-95 transition-transform duration-300 touch-manipulation">
              <PlayerAvatar 
                player={player} 
                size={isMobile ? 40 : 48} 
                className={`border-2 ${isYou ? 'border-fuchsia-500 ring-2 ring-fuchsia-500/30' : 'border-gray-600'}`}
              />
              <p className="text-xs md:text-sm font-semibold truncate w-full mt-1 md:mt-2">
                {player.nickname}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls Section */}
      <div className="mt-4 md:mt-8 w-full max-w-md flex flex-col gap-3 md:gap-4 px-4 md:px-0">
        {isHost ? (
          <div className="text-center">
            <HexButton 
              onClick={() => {
                triggerHaptic('medium')
                handleStartGame()
              }}
              disabled={!canStart || isStarting} 
              isActive={canStart && !isStarting}
            >
              {isStarting ? 'Starting...' : 'Ignite Session'}
            </HexButton>
            {gameState.players.length < 3 && (
              <p className="text-yellow-400 text-xs md:text-sm mt-2">
                At least 3 Entities are required for consensus.
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-400 italic text-center animate-pulse text-sm md:text-base">
            Awaiting session ignition...
          </p>
        )}
        
        {isHost && (
          <div className="panel p-3 md:p-4 rounded-md">
            <h3 className="title-font text-lg md:text-xl font-bold text-amber-500 text-center">
              Player Management
            </h3>
            <div className="mt-2 md:mt-3 border-t border-amber-500/20 pt-2 md:pt-3">
              <h4 className="font-semibold text-center text-gray-400 mb-2 text-sm md:text-base">
                Session Roster
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {gameState.players.map(player => (
                  <div 
                    key={player.id}
                    className="flex items-center justify-between p-2 md:p-2 bg-gray-900/50 rounded-md min-h-[44px] md:min-h-0"
                  >
                    <span className="font-semibold truncate text-sm md:text-base">{player.nickname}</span>
                    {player.id !== me?.id && (
                      <button
                        onClick={() => {
                          triggerHaptic('light')
                          setKickConfirmationTarget(player)
                        }}
                        className="px-3 py-2 md:px-2 md:py-1 text-xs bg-red-800 hover:bg-red-700 active:bg-red-700 rounded-md transition min-h-[44px] md:min-h-0 touch-manipulation"
                      >
                        Kick
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={() => {
            triggerHaptic('light')
            handleToggleChat()
          }}
          className="w-full flex items-center justify-between p-4 md:p-3 bg-gray-800/50 hover:bg-gray-700/70 active:bg-gray-700 rounded-md transition group min-h-[56px] md:min-h-0 touch-manipulation"
        >
          <div className="flex items-center gap-3">
            <Icon name="MessageCircle" className="w-6 h-6 md:w-5 md:h-5 text-amber-500" />
            <span className="font-semibold text-gray-200 text-base md:text-base">Council Comms</span>
          </div>
          <span className="text-xs text-gray-500 group-hover:text-gray-400 hidden md:block">
            Press <kbd className="kbd text-xs">T</kbd> or <kbd className="kbd text-xs">/</kbd>
          </span>
        </button>
      </div>

      {/* Desktop Chat Panel */}
      {!isMobile && isChatOpen && (
        <div
          className="fixed w-full max-w-lg z-20"
          style={{
            top: 0,
            left: 0,
            transform: `translate(${chatPosition.x}px, ${chatPosition.y}px)`,
            cursor: isDragging ? 'grabbing' : 'default'
          }}
        >
          <div className="data-slate-enter">
            <ChatBox
              isDrawer={false}
              onClose={handleToggleChat}
              onMouseDown={handleChatMouseDown}
              isDragging={isDragging}
              gameState={gameState}
              me={me}
              chatInput={chatInput}
              setChatInput={setChatInput}
              handleSendMessage={handleSendMessage}
            />
          </div>
        </div>
      )}

      {/* Mobile Chat Drawer */}
      {isMobile && isChatOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            onClick={handleToggleChat}
            className="absolute inset-0 bg-black/60 archive-backdrop-enter"
          />
          <div 
            className="absolute bottom-0 left-0 right-0 h-[75vh] data-slate-enter transition-transform"
            style={{ 
              transform: `translateY(${drawerOffset}px)`,
              maxHeight: '75vh'
            }}
            onTouchStart={handleDrawerTouchStart}
            onTouchMove={handleDrawerTouchMove}
            onTouchEnd={handleDrawerTouchEnd}
          >
            <ChatBox
              isDrawer={true}
              onClose={handleToggleChat}
              gameState={gameState}
              me={me}
              chatInput={chatInput}
              setChatInput={setChatInput}
              handleSendMessage={handleSendMessage}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default LobbyScreen
