import React, { useRef, useEffect, useState } from 'react'
import Icon from './Icon'
import PlayerAvatar from './PlayerAvatar'

// Helper function to format relative time
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return ''
  
  const now = new Date()
  const messageTime = new Date(timestamp)
  const diffMs = now - messageTime
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffSeconds < 10) return 'just now'
  if (diffSeconds < 60) return `${diffSeconds}s ago`
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

/**
 * ChatBox component - In-game chat system
 * @param {boolean} isDrawer - Whether to display as a mobile drawer
 * @param {function} onClose - Close chat callback
 * @param {function} onMouseDown - Mouse down handler for dragging (desktop mode)
 * @param {object} gameState - Current game state with chat messages
 * @param {object} me - Current player object
 * @param {string} chatInput - Current chat input value
 * @param {function} setChatInput - Update chat input callback
 * @param {function} handleSendMessage - Send message callback
 */
const ChatBox = ({ 
  isDrawer = false, 
  onClose, 
  onMouseDown,
  gameState,
  me,
  chatInput,
  setChatInput,
  handleSendMessage
}) => {
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const inputRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(Date.now())

  // Update current time every 10 seconds for relative timestamps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  // Smart scrolling: only auto-scroll if user was already at bottom
  const scrollToBottom = () => {
    const container = messagesContainerRef.current
    if (!container) return
    
    const { scrollTop, scrollHeight, clientHeight } = container
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50
    
    // Only auto-scroll if user was already near the bottom (within 50px)
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(scrollToBottom, [gameState.chatMessages])
  
  // Auto-focus input when chat opens (especially useful with keyboard shortcut)
  useEffect(() => {
    if (inputRef.current) {
      // Small delay to ensure smooth animation
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, []) // Only on mount

  const containerClasses = isDrawer 
    ? 'w-full h-full flex flex-col bg-gray-800 rounded-t-2xl' 
    : 'w-full max-w-lg'

  return (
    <div className={containerClasses}>
      <div className={`panel p-4 rounded-md ${isDrawer ? 'flex flex-col flex-grow h-full rounded-t-2xl' : ''}`}>
        <div 
          className={`flex items-center justify-center mb-3 relative ${!isDrawer ? 'cursor-move' : ''}`}
          onMouseDown={!isDrawer ? onMouseDown : undefined}
        >
          {isDrawer && (
            <div className="absolute top-0 w-12 h-1.5 bg-gray-600 rounded-full" />
          )}
          <h3 className={`title-font text-xl font-bold text-amber-500 text-center ${isDrawer ? 'pt-4' : ''}`}>
            Council Comms
          </h3>
          <button 
            onClick={onClose}
            className="absolute right-2 top-2 p-1 text-gray-400 hover:text-white z-10"
          >
            <Icon name="X" className="w-6 h-6" />
          </button>
        </div>
        
        {/* Message Display */}
        <div 
          ref={messagesContainerRef}
          className={`overflow-y-auto space-y-3 p-2 bg-gray-900/50 rounded-md mb-3 ${isDrawer ? 'flex-grow' : 'h-64 md:h-80'}`}
        >
          {(gameState.chatMessages || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
              <Icon name="MessageCircle" className="w-12 h-12 mb-2 opacity-50" />
              <p className="text-sm">No messages yet.</p>
              <p className="text-xs mt-1">Be the first to say hello!</p>
            </div>
          ) : (
            <>
              {(gameState.chatMessages || []).map((msg, index) => {
                const player = gameState.players.find(p => p.id === msg.playerId)
                const isYou = msg.playerId === me?.id
                const prevMsg = index > 0 ? gameState.chatMessages[index - 1] : null
                const isGrouped = prevMsg && prevMsg.playerId === msg.playerId
                
                return (
                  <div 
                    key={index}
                    className={`flex items-start gap-2 ${isYou ? 'justify-end' : ''} ${isGrouped ? 'mt-1' : 'mt-3'}`}
                  >
                    {!isYou && (
                      isGrouped ? (
                        <div style={{ width: '24px' }} /> // Spacer for grouped messages
                      ) : (
                        player && <PlayerAvatar player={player} size={24} />
                      )
                    )}
                    <div className={`max-w-[75%] ${isYou ? 'text-right' : ''}`}>
                      {!isGrouped && (
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`text-xs font-semibold ${isYou ? 'text-fuchsia-400' : 'text-gray-400'}`}>
                            {msg.nickname}
                          </p>
                          <p className="text-xs text-gray-600">
                            {formatRelativeTime(msg.timestamp)}
                          </p>
                        </div>
                      )}
                      <p className={`p-2 rounded-lg text-sm ${isYou ? 'bg-fuchsia-800/50' : 'bg-gray-700'} ${isGrouped ? 'mt-0.5' : ''}`}>
                        {msg.text}
                      </p>
                    </div>
                    {isYou && (
                      isGrouped ? (
                        <div style={{ width: '24px' }} /> // Spacer for grouped messages
                      ) : (
                        player && <PlayerAvatar player={player} size={24} />
                      )
                    )}
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        
        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message... (Press Enter to send)"
              className="w-full p-2 input-field text-sm"
              maxLength={100}
            />
            <button 
              type="submit"
              disabled={!chatInput.trim()}
              className={`p-2 rounded-md transition-all ${
                chatInput.trim() 
                  ? 'bg-amber-600 hover:bg-amber-500 hover:scale-105 active:scale-95' 
                  : 'bg-gray-700 cursor-not-allowed opacity-50'
              }`}
              aria-label="Send Message"
            >
              <Icon name="Send" className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 px-1">
            <span className="opacity-75">
              Press Enter to send
            </span>
            <span className={chatInput.length >= 90 ? 'text-amber-400 font-semibold' : ''}>
              {chatInput.length}/100
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatBox
