import React, { useCallback, useEffect, useRef } from 'react'
import { useGame } from '../contexts/GameContext'
import Icon from './Icon'
import Timer from './Timer'
import GlitchyText from './GlitchyText'
import PlayerAvatar from './PlayerAvatar'
import { incrementStat } from '../utils/helpers'

/**
 * GameScreen component - Answer submission phase
 */
const GameScreen = () => {
  const { gameState, me, handleAnswerSubmit, message, setMessage } = useGame()
  const myAnswer = gameState.answers?.find(a => a.playerId === me.id)
  const isAnomaly = me?.role === 'The Anomaly'
  const hasTrackedAnomaly = useRef(false)

  // Track if player is Anomaly (only once per game)
  useEffect(() => {
    if (isAnomaly && !hasTrackedAnomaly.current && gameState.round === 1) {
      incrementStat('gamesAsAnomaly')
      hasTrackedAnomaly.current = true
    }
  }, [isAnomaly, gameState.round])

  const handleTimeOut = useCallback(() => {
    handleAnswerSubmit('(No interpretation was given in time)')
  }, [handleAnswerSubmit])

  const questionText = isAnomaly ? gameState.question.impostor : gameState.question.crew
  
  // Calculate submission progress
  const humanPlayers = (gameState.players || []).filter(p => !p.isBot)
  const answeredCount = humanPlayers.filter(p => (gameState.answers || []).some(a => a.playerId === p.id)).length
  const totalHumans = humanPlayers.length
  const gracePeriodActive = gameState.gracePeriodActive
  const gracePeriodTimeLeft = gameState.gracePeriodTimeLeft

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Main Terminal (Left/Top) */}
      <div className="flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="title-font tracking-wider text-lg text-amber-500">
            ROUND 0{gameState.round}
          </div>
          <Timer initialTime={gameState.timer} onTimeOut={handleTimeOut} />
        </div>
        
        {/* Terminal Panel */}
        <div className="panel p-6 rounded-lg flex flex-col h-full">
          {/* Incoming Transmission */}
          <div className="mb-6 border-b-2 border-amber-500/20 pb-4">
            <h3 className="text-lg font-semibold mb-2 text-amber-500 title-font tracking-wider">
              INCOMING COSMIC DECREE...
            </h3>
            <p className="text-2xl font-medium min-h-[4rem]">
              <GlitchyText isGlitching={true}>{questionText}</GlitchyText>
            </p>
          </div>
          
          {/* Input/Transmission Area */}
          {myAnswer ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-4 bg-gray-900/50 rounded-md">
              <Icon name="CheckCircle2" className="w-16 h-16 text-green-400 mb-4" />
              <h3 className="text-2xl font-bold title-font">
                Interpretation Transmitted
              </h3>
              <p className="text-gray-400">
                Awaiting consensus from the Council.
              </p>
            </div>
          ) : (
            <form 
              className="flex-grow flex flex-col"
              onSubmit={(ev) => { 
                ev.preventDefault()
                handleAnswerSubmit() 
              }}
            >
              <label 
                htmlFor="interpretation-input"
                className="text-lg font-semibold mb-2 text-fuchsia-400 title-font tracking-wider"
              >
                SCRIBE INTERPRETATION:
              </label>
              <textarea
                id="interpretation-input"
                value={message}
                onChange={(ev) => setMessage(ev.target.value)}
                placeholder="Your thoughts become reality..."
                className="w-full flex-grow p-3 h-32 bg-gray-900/50 rounded-md border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                required
              />
              <button 
                type="submit"
                className="w-full mt-4 p-3 button-primary rounded-md text-lg"
              >
                Transmit to Council
              </button>
            </form>
          )}
        </div>
      </div>
      
      {/* Council Roster (Right/Bottom) */}
      <div className="lg:w-1/3 flex-shrink-0">
        <div className="panel p-4 rounded-lg">
          <h3 className="title-font text-xl font-bold text-amber-500 text-center mb-4">
            Council Roster
          </h3>
          
          {/* Grace Period Warning */}
          {gracePeriodActive && gracePeriodTimeLeft !== null && (
            <div className="mb-4 p-3 bg-orange-900/50 border-2 border-orange-500 rounded-md animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <Icon name="AlertTriangle" className="w-5 h-5 text-orange-400" />
                <span className="text-orange-400 font-bold title-font">AUTO-ADVANCE</span>
                <Icon name="AlertTriangle" className="w-5 h-5 text-orange-400" />
              </div>
              <p className="text-center text-sm text-orange-300 mb-1">
                50% threshold reached!
              </p>
              <p className="text-center text-2xl font-bold text-orange-400 title-font">
                {gracePeriodTimeLeft}s
              </p>
              <p className="text-center text-xs text-orange-300 mt-1">
                Submit now or auto-advance
              </p>
            </div>
          )}
          
          {/* Progress Indicator */}
          <div className="mb-4 p-2 bg-gray-900/50 rounded-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">Submissions:</span>
              <span className="text-sm font-bold text-amber-400">
                {answeredCount}/{totalHumans}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  answeredCount / totalHumans >= 0.5 ? 'bg-orange-500' : 'bg-amber-500'
                }`}
                style={{ width: `${totalHumans > 0 ? (answeredCount / totalHumans) * 100 : 0}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            {(gameState.players || []).map(player => {
              const hasAnswered = (gameState.answers || []).some(a => a.playerId === player.id)
              const isYou = player.id === me.id
              
              return (
                <div
                  key={player.id}
                  className={`flex items-center gap-4 p-3 rounded-md transition-all duration-300 ${
                    hasAnswered ? 'bg-green-500/10' : 'bg-gray-900/50'
                  }`}
                >
                  <PlayerAvatar player={player} size={40} />
                  <div className="flex-grow">
                    <p className={`font-semibold ${isYou ? 'text-fuchsia-400' : ''}`}>
                      {player.nickname}
                    </p>
                  </div>
                  {hasAnswered ? (
                    <Icon name="CheckCircle2" className="w-6 h-6 text-green-400" />
                  ) : (
                    <Icon name="Hourglass" className="w-6 h-6 text-gray-400 animate-pulse" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameScreen
