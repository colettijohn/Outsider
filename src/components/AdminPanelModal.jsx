import React, { useState, useEffect, useRef } from 'react'
import Icon from './Icon'
import GlitchyText from './GlitchyText'

/**
 * AdminPanelModal - Draggable admin control panel for development/debugging
 * @param {function} onClose - Close modal callback
 * @param {function} onNavigate - Navigate to screen callback
 * @param {object} gameState - Current game state
 * @param {function} setForcedRole - Set forced role callback
 * @param {string} forcedRole - Currently forced role
 * @param {function} onAddBot - Add bot callback
 * @param {function} setKickConfirmationTarget - Set kick target callback
 * @param {object} me - Current player object
 */
const AdminPanelModal = ({ 
  onClose, 
  onNavigate, 
  gameState, 
  setForcedRole, 
  forcedRole, 
  onAddBot, 
  setKickConfirmationTarget, 
  me 
}) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isGlitching, setIsGlitching] = useState(false)
  const [activeTab, setActiveTab] = useState('Navigation')

  // State for position and dragging
  const panelWidth = 384 // Tailwind's max-w-sm = 24rem = 384px
  const [position, setPosition] = useState({ 
    x: (window.innerWidth / 2) - (panelWidth / 2), 
    y: 100 
  })
  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const mouseDownPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      })
    }
    const handleMouseUp = () => setIsDragging(false)

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, offset])

  const handleMouseDown = (e) => {
    // Only drag if the clicked element is a designated drag handle
    if (e.target.dataset.dragHandle) {
      mouseDownPos.current = { x: e.clientX, y: e.clientY }
      setIsDragging(true)
      const rect = e.currentTarget.getBoundingClientRect()
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleTitleClick = (e) => {
    const deltaX = e.clientX - mouseDownPos.current.x
    const deltaY = e.clientY - mouseDownPos.current.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const clickThreshold = 5 // Pixels

    if (distance < clickThreshold) {
      onClose()
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === '0') {
      setError('')
      setIsUnlocked(true)
    } else {
      setError('Cosmic Signature Not Recognized.')
      setPassword('')
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 500)
    }
  }

  const screens = [
    'home', 
    'quickRitual', 
    'customizeGame', 
    'cardBrowser', 
    'lobby', 
    'game', 
    'debate', 
    'voting', 
    'scoreboard', 
    'gameOver'
  ]
  const anomalyPlayer = gameState.players?.find(p => p.role === 'The Anomaly')
  
  // Helper function to format screen names
  const formatScreenName = (screen) => {
    const names = {
      'home': 'Home',
      'quickRitual': '⚡ Quick Ritual',
      'customizeGame': '🎴 Full Customize',
      'cardBrowser': '📚 Card Browser',
      'lobby': 'Lobby',
      'game': 'Game',
      'debate': 'Debate',
      'voting': 'Voting',
      'scoreboard': 'Scoreboard',
      'gameOver': 'Game Over'
    }
    return names[screen] || screen.charAt(0).toUpperCase() + screen.slice(1).replace(/([A-Z])/g, ' $1').trim()
  }

  return (
    <div 
      className="panel p-0 rounded-lg shadow-2xl max-w-sm w-full"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: 1000,
        borderWidth: '2px'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Draggable Header */}
      <div 
        data-drag-handle="true"
        className="relative flex items-center justify-center p-3 bg-gray-900 rounded-t-md cursor-move"
      >
        <button 
          onClick={onClose} 
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition z-10"
        >
          <Icon name="X" className="w-5 h-5" />
        </button>
        <h2 
          data-drag-handle="true" 
          className="text-lg text-amber-500 title-font cursor-pointer select-none"
          onClick={handleTitleClick}
        >
          Admin Controls
        </h2>
      </div>
      
      {/* Panel Content */}
      <div className="p-4">
        {isUnlocked ? (
          <div>
            {/* Tabs */}
            <div className="flex mb-4 border-b-2 border-amber-500/20">
              <button 
                onClick={() => setActiveTab('Navigation')} 
                className={`flex-1 pb-2 font-semibold ${
                  activeTab === 'Navigation' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-400'
                }`}
              >
                Navigation
              </button>
              <button 
                onClick={() => setActiveTab('Super Power')} 
                className={`flex-1 pb-2 font-semibold ${
                  activeTab === 'Super Power' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-400'
                }`}
              >
                Super Power
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'Navigation' && (
              <div key="nav">
                <h3 className="text-lg font-bold text-center text-amber-500 title-font mb-3">
                  Screen Navigation
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {screens.map(screen => (
                    <button 
                      key={screen}
                      onClick={() => onNavigate(screen)}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition text-sm"
                    >
                      {formatScreenName(screen)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Super Power' && (
              <div key="power">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-center text-amber-500 title-font mb-2">
                    Force Role
                  </h3>
                  <p className="text-xs text-center text-gray-500 mb-3">
                    (Takes effect next round)
                  </p>
                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => setForcedRole('The Anomaly')}
                      className={`w-full p-2 font-semibold rounded-md transition ${
                        forcedRole === 'The Anomaly' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      Become Anomaly
                    </button>
                    <button 
                      onClick={() => setForcedRole('Entity')}
                      className={`w-full p-2 font-semibold rounded-md transition ${
                        forcedRole === 'Entity' ? 'bg-amber-500 text-gray-900' : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      Become Entity
                    </button>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <h3 className="text-lg font-bold text-center text-amber-500 title-font mb-2">
                    Reveal Anomaly
                  </h3>
                  <div className="text-center p-3 bg-gray-900/50 rounded-md">
                    {anomalyPlayer ? (
                      <p className="text-xl font-bold text-red-400">{anomalyPlayer.nickname}</p>
                    ) : (
                      <p className="text-gray-400">No active game or role assigned.</p>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <h3 className="text-lg font-bold text-center text-amber-500 title-font mb-2">
                    Session Roster
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {(gameState.players || []).map(player => (
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
            
            <div className="mt-4">
              <h3 className="text-lg font-bold text-center text-amber-500 title-font mb-2">
                Session Management
              </h3>
              <button 
                onClick={onAddBot}
                disabled={gameState.players?.length >= 12}
                className="w-full p-2 bg-blue-800 hover:bg-blue-700 rounded-md transition disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Summon Bot
              </button>
              {gameState.players?.length >= 12 && (
                <p className="text-xs text-center text-gray-500 mt-1">Session is full.</p>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="text-xl text-center text-amber-500 title-font mb-2">
              <GlitchyText isGlitching={isGlitching}>Admin Access</GlitchyText>
            </h3>
            <p className="text-gray-400 text-center mb-4">
              <GlitchyText isGlitching={isGlitching}>Enter the override sequence.</GlitchyText>
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 text-center text-lg input-field mb-2"
              placeholder="••••••••"
              required
            />
            {error && <p className="text-red-400 text-center text-sm mb-3">{error}</p>}
            <button type="submit" className="w-full p-2 button-primary rounded-md">
              Authorize
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default AdminPanelModal
