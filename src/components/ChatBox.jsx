import React, { useRef, useEffect } from 'react'
import Icon from './Icon'
import PlayerAvatar from './PlayerAvatar'

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

  // Use 'instant' scrolling for better UX when opening the chat panel
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "instant" })

  useEffect(scrollToBottom, [gameState.chatMessages, isDrawer])

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
        <div className={`overflow-y-auto space-y-3 p-2 bg-gray-900/50 rounded-md mb-3 ${isDrawer ? 'flex-grow' : 'h-64 md:h-80'}`}>
          {(gameState.chatMessages || []).map((msg, index) => {
            const player = gameState.players.find(p => p.id === msg.playerId)
            const isYou = msg.playerId === me?.id
            
            return (
              <div 
                key={index}
                className={`flex items-start gap-2 ${isYou ? 'justify-end' : ''}`}
              >
                {!isYou && player && <PlayerAvatar player={player} size={24} />}
                <div className={`max-w-[75%] ${isYou ? 'text-right' : ''}`}>
                  <p className={`text-xs font-semibold ${isYou ? 'text-fuchsia-400' : 'text-gray-400'}`}>
                    {msg.nickname}
                  </p>
                  <p className={`p-2 rounded-lg text-sm ${isYou ? 'bg-fuchsia-800/50' : 'bg-gray-700'}`}>
                    {msg.text}
                  </p>
                </div>
                {isYou && player && <PlayerAvatar player={player} size={24} />}
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Send a message..."
            className="w-full p-2 input-field text-sm"
            maxLength={100}
          />
          <button 
            type="submit"
            className="p-2 bg-gray-600 hover:bg-gray-500 rounded-md"
            aria-label="Send Message"
          >
            <Icon name="Send" className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatBox
