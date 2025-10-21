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

  // Keyboard shortcuts for lobby
  useKeyboardShortcut('c', copyRoomCode)
  useKeyboardShortcut('s', () => {
    if (isHost && canStart) handleStartGame()
  }, { enabled: isHost && canStart })
  const colors = ['#A21CAF', '#BE185D', '#0369A1', '#B45309', '#5B21B6', '#15803D']
  const orreryRef = useRef(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [radius, setRadius] = useState(150)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  
  // State for draggable chat
  const [chatPosition, setChatPosition] = useState({ 
    x: window.innerWidth / 2 - 256, 
    y: window.innerHeight * 0.5 
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

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

  // Effect for handling drag logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return
      setChatPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const handleChatMouseDown = (e) => {
    setIsDragging(true)
    const rect = e.currentTarget.parentElement.parentElement.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }
  
  const handleToggleChat = () => setIsChatOpen(!isChatOpen)

  // Memoize player orbital calculations for performance
  const playerOrbits = useMemo(() => {
    return gameState.players.map((player, index) => ({
      player,
      angle: (index / gameState.players.length) * 360,
      duration: 20 + (index * 5),
      isYou: player.id === me.id
    }))
  }, [gameState.players, me.id])

  return (
    <div className="w-full flex flex-col items-center justify-center relative">
      <div className="text-center mb-8">
        <h2 className="title-font text-4xl font-bold text-amber-500 uppercase">
          Council Chamber
        </h2>
        <p className="text-gray-400">Awaiting assembly of all entities.</p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <p className="text-gray-500 text-sm">
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
        className="relative w-full max-w-sm h-auto aspect-square md:max-w-md my-8"
      >
        {/* Central Star (Session Code) */}
        <div
          className="absolute inset-0 rounded-full flex flex-col items-center justify-center"
          style={{ animation: 'orrery-pulse 8s infinite ease-in-out' }}
        >
          <span className="text-sm text-amber-500 uppercase">Session Code</span>
          <span className="text-6xl md:text-7xl font-bold tracking-[0.2em] text-gray-200 title-font my-2">
            {gameState.roomCode}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={copyRoomCode}
              className="flex items-center gap-2 px-3 py-1 bg-gray-800/50 hover:bg-gray-700/70 rounded-full transition-all hover:scale-105 active:scale-95"
            >
              {copied ? (
                <Icon name="Check" className="w-4 h-4 text-green-400" />
              ) : (
                <Icon name="Copy" className="w-4 h-4" />
              )}
              <span className="text-xs">{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={copyLobbyLink}
              className="flex items-center gap-2 px-3 py-1 bg-amber-600/50 hover:bg-amber-600/70 rounded-full transition-all hover:scale-105 active:scale-95"
              title="Share this link with friends to join instantly"
            >
              {linkCopied ? (
                <Icon name="Check" className="w-4 h-4 text-green-400" />
              ) : (
                <Icon name="Share2" className="w-4 h-4" />
              )}
              <span className="text-xs">{linkCopied ? 'Link Copied!' : 'Share Link'}</span>
            </button>
          </div>
        </div>

        {/* Orbiting Players (Planets) */}
        {playerOrbits.map(({ player, angle, duration, isYou }) => (
          <div
            key={player.id}
            className="orrery-player"
            style={{
              '--radius': `${radius}px`,
              transform: `rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg)`,
              animationDuration: `${duration}s`
            }}
          >
            <div className="orrery-player-avatar flex flex-col items-center text-center w-20">
              <PlayerAvatar 
                player={player} 
                size={48} 
                className={`border-2 ${isYou ? 'border-fuchsia-500' : 'border-gray-600'}`}
              />
              <p className="text-sm font-semibold truncate w-full mt-2">
                {player.nickname}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls Section */}
      <div className="mt-8 w-full max-w-md flex flex-col gap-4">
        {isHost ? (
          <div className="text-center">
            <HexButton 
              onClick={handleStartGame} 
              disabled={!canStart || isStarting} 
              isActive={canStart && !isStarting}
            >
              {isStarting ? 'Starting...' : 'Ignite Session'}
            </HexButton>
            {gameState.players.length < 3 && (
              <p className="text-yellow-400 text-sm mt-2">
                At least 3 Entities are required for consensus.
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-400 italic text-center animate-pulse">
            Awaiting session ignition...
          </p>
        )}
        
        {isHost && (
          <div className="panel p-4 rounded-md">
            <h3 className="title-font text-xl font-bold text-amber-500 text-center">
              Player Management
            </h3>
            <div className="mt-3 border-t border-amber-500/20 pt-3">
              <h4 className="font-semibold text-center text-gray-400 mb-2">
                Session Roster
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {gameState.players.map(player => (
                  <div 
                    key={player.id}
                    className="flex items-center justify-between p-2 bg-gray-900/50 rounded-md"
                  >
                    <span className="font-semibold truncate">{player.nickname}</span>
                    {player.id !== me?.id && (
                      <button
                        onClick={() => setKickConfirmationTarget(player)}
                        className="px-2 py-1 text-xs bg-red-800 hover:bg-red-700 rounded-md transition"
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
          onClick={handleToggleChat}
          className="w-full flex items-center justify-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-700/70 rounded-md transition"
        >
          <Icon name="MessageCircle" className="w-5 h-5 text-amber-500" />
          <span className="font-semibold text-gray-200">Council Comms</span>
        </button>
      </div>

      {/* Desktop Chat Panel */}
      {!isMobile && isChatOpen && (
        <div
          className="fixed w-full max-w-lg z-20"
          style={{
            top: 0,
            left: 0,
            transform: `translate(${chatPosition.x}px, ${chatPosition.y}px)`
          }}
        >
          <div className="data-slate-enter">
            <ChatBox
              isDrawer={false}
              onClose={handleToggleChat}
              onMouseDown={handleChatMouseDown}
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
          <div className="absolute bottom-0 left-0 right-0 h-[70%] data-slate-enter">
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
