import React, { useEffect, useRef } from 'react'
import { useGame } from '../contexts/GameContext'
import Icon from './Icon'
import PlayerAvatar from './PlayerAvatar'
import { getScoreJustification, incrementStat } from '../utils/helpers'

/**
 * ScoreboardScreen component - Round results and voting record
 */
const ScoreboardScreen = () => {
  const { gameState, isHost, handleNextRound, me } = useGame()
  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score)
  const anomaly = gameState.players.find(p => p.id === gameState.reveal.anomalyId)
  const { anomalyWasVotedOut } = gameState.reveal
  const hasTrackedWin = useRef(false)

  // Track Anomaly wins (only once per round)
  useEffect(() => {
    if (!hasTrackedWin.current && me && anomaly && me.id === anomaly.id && !anomalyWasVotedOut) {
      incrementStat('anomalyWins')
      hasTrackedWin.current = true
    }
  }, [me, anomaly, anomalyWasVotedOut])

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold mb-6 title-font uppercase text-amber-500 text-center">
        Round Debriefing
      </h2>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Verdict & Voting Record */}
        <div className="lg:w-1/2 flex flex-col gap-6">
          {/* Verdict */}
          <div 
            className={`panel p-4 rounded-lg flex flex-col items-center text-center border-2 ${
              anomalyWasVotedOut ? 'border-green-500' : 'border-red-500'
            } decoding-text`}
          >
            <Icon 
              name={anomalyWasVotedOut ? 'CheckCircle' : 'XCircle'}
              className={`w-12 h-12 mb-2 ${
                anomalyWasVotedOut ? 'text-green-400' : 'text-red-400'
              }`}
            />
            <p className="text-lg text-gray-300">
              The Anomaly was {anomalyWasVotedOut ? 'identified' : 'not identified'}.
            </p>
            <p className="text-2xl font-bold text-red-400 title-font">
              {anomaly?.nickname || 'Unknown'}
            </p>
            <PlayerAvatar player={anomaly} size={80} className="my-3" />
          </div>
          
          {/* Voting Record */}
          <div className="panel p-4 rounded-lg">
            <h3 className="title-font text-xl font-bold text-amber-500 text-center mb-4">
              Voting Record
            </h3>
            <div 
              className="space-y-2 overflow-y-auto pr-2"
              style={{ maxHeight: 'calc(100% - 40px)' }}
            >
              {(gameState.votes || []).map((vote, index) => {
                const voter = gameState.players.find(p => p.id === vote.voterId)
                const votedFor = gameState.players.find(p => p.id === vote.votedPlayerId)
                if (!voter) return null
                
                return (
                  <div
                    key={vote.voterId}
                    className="flex items-center justify-between p-2 bg-gray-900/50 rounded-md decoding-text"
                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-2">
                      <PlayerAvatar player={voter} size={32} />
                      <span className="font-semibold">{voter.nickname}</span>
                    </div>
                    <Icon name="ArrowRight" className="w-5 h-5 text-gray-400" />
                    {votedFor ? (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{votedFor.nickname}</span>
                        <PlayerAvatar player={votedFor} size={32} />
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">Abstained</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        
        {/* Right Column: Scoreboard */}
        <div className="lg:w-1/2">
          <div className="panel p-4 rounded-lg">
            <h3 className="title-font text-xl font-bold text-amber-500 text-center mb-4">
              Influence Standings
            </h3>
            <div className="space-y-2">
              {sortedPlayers.map((player, index) => {
                const scoreGained = gameState.reveal.scoreUpdates[player.id] || 0
                const justification = getScoreJustification(
                  player, 
                  gameState.reveal, 
                  gameState.votes || []
                )
                const isLeader = index === 0
                
                return (
                  <div
                    key={player.id}
                    className={`flex items-center p-3 rounded-md transition-all duration-300 ${
                      isLeader ? 'bg-amber-800/30 border-l-4 border-amber-500' : 'bg-gray-900/50'
                    } decoding-text`}
                    style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                  >
                    <span 
                      className={`font-bold text-lg w-8 ${
                        isLeader ? 'text-amber-400' : 'text-gray-400'
                      }`}
                    >
                      {index + 1}.
                    </span>
                    <PlayerAvatar player={player} size={40} />
                    <div className="flex-grow ml-3">
                      <p className="font-semibold">{player.nickname}</p>
                      <p className="text-xs text-green-400">{justification}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{player.score}</p>
                      {scoreGained > 0 && (
                        <p className="text-sm text-green-400">+{scoreGained}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        {isHost ? (
          <button
            onClick={handleNextRound}
            className="px-12 py-3 rounded-md button-primary text-lg"
          >
            Begin Round 0{gameState.round + 1}
          </button>
        ) : (
          <p className="text-gray-400 italic animate-pulse">
            Waiting for host to begin the next session...
          </p>
        )}
      </div>
    </div>
  )
}

export default ScoreboardScreen
