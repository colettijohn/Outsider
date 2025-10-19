import React, { useCallback } from 'react'
import { useGame } from '../contexts/GameContext'
import Icon from './Icon'
import Timer from './Timer'
import PlayerAvatar from './PlayerAvatar'

/**
 * DebateScreen component - Review answers before voting
 */
const DebateScreen = () => {
  const { gameState, me, handleReadyForVote } = useGame()
  const hasReadied = gameState.readyPlayerIds?.includes(me.id)

  const handleTimeOut = useCallback(() => {
    if (!hasReadied) {
      handleReadyForVote()
    }
  }, [hasReadied, handleReadyForVote])

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="title-font tracking-wider text-lg text-amber-500">
            COUNCIL DEBATE
          </div>
          <Timer initialTime={gameState.timer} onTimeOut={handleTimeOut} />
        </div>
        
        {/* Transcripts Panel */}
        <div className="panel p-4 md:p-6 rounded-lg">
          <div className="p-3 bg-gray-900/50 rounded-md mb-4 border-l-4 border-amber-500">
            <p className="text-sm text-amber-400 mb-1">Decree Under Review:</p>
            <p className="text-lg font-medium text-gray-200">
              "{gameState.question.crew}"
            </p>
          </div>
          
          <div className="space-y-3 max-h-[50vh] overflow-y-auto -mr-2 pr-2">
            {(gameState.answers || []).map((answerObj, index) => {
              const player = gameState.players.find(p => p.id === answerObj.playerId)
              if (!player) return null
              
              const isReady = gameState.readyPlayerIds?.includes(player.id)

              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-md transition-all duration-300 ${
                    isReady ? 'bg-green-900/30' : 'bg-gray-900/50'
                  }`}
                >
                  <PlayerAvatar player={player} size={40} className="flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="font-semibold text-fuchsia-400">{player.nickname}</p>
                    <p className="text-gray-200">"{answerObj.answer}"</p>
                  </div>
                  {isReady && (
                    <Icon name="Check" className="w-6 h-6 text-green-400 flex-shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Ready Button */}
      <div className="mt-6">
        <button
          onClick={handleReadyForVote}
          disabled={hasReadied}
          className="w-full p-4 button-primary rounded-md text-xl"
        >
          {hasReadied ? 'Awaiting Other Entities...' : 'Ready to Vote'}
        </button>
      </div>
    </div>
  )
}

export default DebateScreen
