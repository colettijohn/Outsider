import React, { useCallback } from 'react'
import { useGame } from '../contexts/GameContext'
import Icon from './Icon'
import Timer from './Timer'
import PlayerAvatar from './PlayerAvatar'

/**
 * VotingScreen component - Vote for the anomaly
 */
const VotingScreen = () => {
  const { gameState, me, handleVote } = useGame()
  const myVote = (gameState.votes || []).find(v => v.voterId === me.id)

  const handleTimeOut = useCallback(() => {
    if (!myVote) {
      handleVote(null) // Submit a null vote if time runs out
    }
  }, [myVote, handleVote])

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="title-font tracking-wider text-lg text-amber-500">
            JUDGEMENT PROTOCOL
          </div>
          <Timer initialTime={gameState.timer} onTimeOut={handleTimeOut} />
        </div>
        
        {/* Transcripts Panel */}
        <div className="panel p-4 md:p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-amber-500 title-font tracking-wider text-center">
            {myVote ? 'VOTE LOCKED IN' : 'SELECT THE ANOMALOUS TRANSMISSION'}
          </h3>
          
          <div className="p-3 bg-gray-900/50 rounded-md mb-4 border-l-4 border-amber-500">
            <p className="text-sm text-amber-400 mb-1">Decree Under Review:</p>
            <p className="text-lg font-medium text-gray-200">
              "{gameState.question.crew}"
            </p>
          </div>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto -mr-2 pr-2">
            {(gameState.answers || []).map((answerObj, index) => {
              const player = gameState.players.find(p => p.id === answerObj.playerId)
              if (!player) return null

              const isYou = player.id === me.id
              const isVotedFor = myVote?.votedPlayerId === player.id
              const isDisabled = isYou || !!myVote

              return (
                <button
                  key={index}
                  onClick={() => handleVote(player.id)}
                  disabled={isDisabled}
                  className={`w-full flex items-start gap-3 p-3 rounded-md text-left transition-all duration-200 relative
                    ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-700/50'}
                    ${isVotedFor ? 'bg-red-500/30 ring-2 ring-red-500' : 'bg-gray-900/50'}`}
                >
                  <PlayerAvatar player={player} size={40} className="flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-fuchsia-400">{player.nickname}</p>
                    <p className="text-gray-200">"{answerObj.answer}"</p>
                  </div>
                  {isVotedFor && (
                    <Icon 
                      name="Target"
                      className="absolute top-2 right-2 w-6 h-6 text-red-400 animate-pulse"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VotingScreen
