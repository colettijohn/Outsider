import React, { useState, useEffect } from 'react'
import { useGame } from '../contexts/GameContext'
import GlitchyLogo from './GlitchyLogo'
import CyclingTagline from './CyclingTagline'
import StatsFooter from './StatsFooter'
import Icon from './Icon'
import { getRecentRooms, clearRecentRooms } from '../utils/helpers'

/**
 * HomeScreen component - Main landing screen with nickname/room code inputs
 * @param {function} onTriggerScribbler - Callback for Cosmic Scribbler easter egg
 * @param {function} onTriggerKonami - Callback for Konami code easter egg
 * @param {boolean} isKonamiArmed - Whether Konami code is active
 */
const HomeScreen = ({ onTriggerScribbler, onTriggerKonami, isKonamiArmed }) => {
  const {
    nickname,
    setNickname,
    roomCode,
    setRoomCode,
    handleCreateRoom,
    handleJoinRoom,
    error,
    setShowRules,
    setShowAdminLogin
  } = useGame()
  
  const [recentRooms, setRecentRooms] = useState([])
  const [showRecent, setShowRecent] = useState(false)
  const [showJoinSection, setShowJoinSection] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setRecentRooms(getRecentRooms())
    
    // Check for join parameter in URL - auto-expand join section
    const urlParams = new URLSearchParams(window.location.search)
    const joinCode = urlParams.get('join')
    if (joinCode) {
      setRoomCode(joinCode.toUpperCase())
      setShowJoinSection(true)
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleNicknameChange = (ev) => {
    const sanitized = ev.target.value.replace(/<|>/g, '')
    setNickname(sanitized)
  }

  const handleQuickJoin = (room) => {
    setRoomCode(room.code)
    if (room.nickname && !nickname) {
      setNickname(room.nickname)
    }
    setShowRecent(false)
    // Trigger the actual join
    setTimeout(() => {
      handleJoinRoom({ preventDefault: () => {} })
    }, 100)
  }

  const handleClearHistory = () => {
    clearRecentRooms()
    setRecentRooms([])
    setShowRecent(false)
  }

  return (
    <div className="flex flex-col justify-center items-center text-center relative z-10 max-w-lg mx-auto w-full space-y-6 md:space-y-8">
      {/* Logo Section */}
      <div className="flex flex-col items-center space-y-3">
        <GlitchyLogo 
          size="text-7xl md:text-9xl"
          onTriggerScribbler={onTriggerScribbler}
          onTriggerKonami={onTriggerKonami}
        />
        <CyclingTagline 
          className="title-font"
          onClick={() => setShowAdminLogin(true)}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div 
          className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-md text-center w-full flex items-start gap-2"
          role="alert"
          aria-live="assertive"
        >
          <Icon name="AlertCircle" className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-left">{error}</span>
        </div>
      )}
      
      {/* Main Input Section */}
      <div className="space-y-4 w-full">
        {/* Nickname Input */}
        <div>
          <label htmlFor="nickname-input" className="sr-only">
            Your Designation (nickname for the game)
          </label>
          <input
            id="nickname-input"
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter your Designation..."
            className="w-full p-3 text-center text-lg input-field"
            required
            maxLength={12}
            aria-describedby={isFocused ? "nickname-counter" : undefined}
          />
          {/* Show character counter only when focused or typing */}
          {(isFocused || nickname.length > 0) && (
            <p 
              id="nickname-counter"
              aria-live="polite"
              className={`mt-1 text-xs text-right font-mono transition-all ${
                nickname.length === 0 ? 'text-gray-600' :
                nickname.length < 8 ? 'text-green-400' :
                nickname.length < 11 ? 'text-yellow-400' :
                'text-red-400'
              }`}
            >
              {nickname.length}/12
            </p>
          )}
        </div>

        {/* Primary Action: Start New Session */}
        <button
          onClick={handleCreateRoom}
          disabled={!nickname}
          className="w-full p-4 button-primary rounded-md text-xl font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 group"
          title={!nickname ? "Enter a designation first" : "Create a new game session"}
        >
          <Icon name="Rocket" className="w-5 h-5 transition-transform group-hover:translate-y-[-2px]" />
          Start New Session
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-gray-900 px-2 text-gray-500">OR</span>
          </div>
        </div>

        {/* Join Existing Game - Collapsed by default */}
        {!showJoinSection ? (
          <button
            onClick={() => setShowJoinSection(true)}
            disabled={!nickname}
            className="w-full p-3 bg-gray-800/40 hover:bg-gray-700/50 border border-gray-700 hover:border-amber-500/30 rounded-md text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
            title={!nickname ? "Enter a designation first" : "Join an existing game session"}
          >
            <Icon name="LogIn" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            Join Existing Game
            <Icon name="ChevronDown" className="w-4 h-4" />
          </button>
        ) : (
          <div className="space-y-3 p-4 bg-gray-800/30 border border-gray-700 rounded-lg animate-slideIn">
            {/* Header with collapse button */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-amber-400">
                <Icon name="LogIn" className="w-4 h-4" />
                <span className="font-medium text-sm">Join Existing Game</span>
              </div>
              <button
                onClick={() => {
                  setShowJoinSection(false)
                  setShowRecent(false)
                }}
                className="text-gray-500 hover:text-gray-400 transition-colors p-1"
                aria-label="Hide join options"
              >
                <Icon name="X" className="w-4 h-4" />
              </button>
            </div>

            {/* Recent Rooms First - If they exist */}
            {recentRooms.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Icon name="Clock" className="w-3 h-3" />
                  <span>Recent Rooms</span>
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                  {recentRooms.map((room, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleQuickJoin(room)}
                      className="w-full text-left px-3 py-2.5 bg-gray-700/50 hover:bg-amber-500/10 border border-gray-600 hover:border-amber-500/30 rounded text-sm flex items-center justify-between group transition-all duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono tracking-wider text-amber-300 font-semibold">{room.code}</span>
                        <span className="text-gray-500 text-xs">as {room.nickname}</span>
                      </div>
                      <Icon name="ArrowRight" className="w-4 h-4 text-gray-600 group-hover:text-amber-400 transition-all group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="w-full text-xs text-red-400/60 hover:text-red-400 py-1 transition-colors flex items-center justify-center gap-1"
                >
                  <Icon name="Trash2" className="w-3 h-3" />
                  Clear History
                </button>
                
                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700/50"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-gray-800/30 px-2 text-gray-600">or enter code</span>
                  </div>
                </div>
              </div>
            )}

            {/* Join Form */}
            <form onSubmit={handleJoinRoom} className="space-y-2">
              <input
                id="roomcode-input"
                type="text"
                value={roomCode}
                onChange={(ev) => setRoomCode(ev.target.value.toUpperCase())}
                placeholder="ENTER SECTOR CODE"
                className="w-full p-3 text-center tracking-[0.3em] text-lg input-field uppercase font-bold placeholder:font-normal placeholder:tracking-normal"
                maxLength={4}
                aria-label="Room code to join"
                autoFocus
              />
              <button
                type="submit"
                disabled={!nickname || !roomCode || roomCode.length !== 4}
                className="w-full p-3 bg-gray-600 hover:bg-gray-500 hover:shadow-lg hover:shadow-gray-500/30 rounded-md font-semibold disabled:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 flex items-center justify-center gap-2 group"
              >
                <Icon name="LogIn" className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                Join Lobby
              </button>
            </form>
          </div>
        )}
      </div>

      {/* How to Play Button */}
      <button
        onClick={() => setShowRules(true)}
        className="w-12 h-12 flex items-center justify-center bg-gray-800/50 rounded-full text-gray-400 hover:bg-gray-700/70 hover:text-white hover:shadow-lg hover:shadow-amber-500/30 hover:scale-110 transition-all duration-200 active:scale-95 group"
        aria-label="How to Play"
        title="How to Play - Learn the rules"
      >
        <img src="imgs/how_to_play.png" alt="How to Play" className="w-6 h-6 transition-transform group-hover:rotate-12" />
      </button>

      {/* Stats Footer - Collapsible */}
      <StatsFooter className="fixed bottom-0 left-0 right-0 z-20" />
    </div>
  )
}

export default HomeScreen
