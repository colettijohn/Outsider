import React, { useEffect, useRef } from 'react'
import { useGame } from '../contexts/GameContext'
import Icon from './Icon'
import PlayerAvatar from './PlayerAvatar'
import ConfettiCanvas from './ConfettiCanvas'
import { incrementStat } from '../utils/helpers'

/**
 * GameOverScreen component - Final winner announcement and standings
 */
const GameOverScreen = () => {
  const { gameState, isHost, handlePlayAgain, me } = useGame()
  const winner = gameState.winner
  if (!winner) return <div>Session has ended!</div>
  
  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score)

  // Track game completion stats
  useEffect(() => {
    // Increment games played
    incrementStat('gamesPlayed')
    
    // Track if player won
    if (me && winner.id === me.id) {
      incrementStat('gamesWon')
    }
    
    // Track rounds played (approximate from scores)
    const maxScore = Math.max(...gameState.players.map(p => p.score))
    const estimatedRounds = Math.ceil(maxScore / 2) // Rough estimate
    incrementStat('totalRounds')
  }, [winner.id, me, gameState.players])

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="relative">
        {/* Winner's Celestial Throne */}
        <div className="relative panel p-6 rounded-lg mb-8 flex flex-col items-center text-center border-2 border-amber-500 z-10 decoding-text">
          <Icon 
            name="Crown"
            className="w-24 h-24 text-amber-400 drop-shadow-lg"
            style={{ animation: 'crown-float 3s ease-in-out infinite' }}
          />
          <p className="text-lg text-gray-300 mt-2">
            The New Ruler of the Cosmos:
          </p>
          <PlayerAvatar 
            player={winner}
            size={128}
            className="my-4 border-4 border-amber-400"
          />
          <p className="text-5xl font-bold text-white title-font">
            {winner.nickname}
          </p>
          <p className="text-3xl text-amber-400 font-semibold">
            {winner.score} Points
          </p>
        </div>
        
        {/* Background Effects */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-96 h-96 bg-amber-500 rounded-full opacity-20 blur-3xl"
            style={{ animation: 'sun-pulse 6s infinite ease-in-out' }}
          />
        </div>
        <ConfettiCanvas isActive={true} />
      </div>

      {/* Final Standings */}
      <div className="w-full max-w-lg mt-4">
        <h3 
          className="text-2xl font-bold mb-4 title-font uppercase text-amber-500 text-center decoding-text"
          style={{ animationDelay: '0.5s' }}
        >
          Final Standings
        </h3>
        <div className="space-y-2">
          {sortedPlayers.map((player, index) => {
            const isWinner = player.id === winner.id
            if (isWinner) return null // Don't show winner again in the list
            
            return (
              <div
                key={player.id}
                className="flex items-center p-3 bg-gray-900/50 rounded-md decoding-text"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <span className="font-bold text-lg w-8 text-gray-400">
                  {index + 1}.
                </span>
                <PlayerAvatar player={player} size={40} />
                <p className="flex-grow ml-3 font-semibold">
                  {player.nickname}
                </p>
                <p className="text-xl font-bold">{player.score} pts</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-12">
        {isHost ? (
          <button
            onClick={handlePlayAgain}
            className="px-12 py-4 rounded-md button-primary text-xl"
          >
            Convene a New Council
          </button>
        ) : (
          <p className="text-gray-400 italic">
            Waiting for the host to start a new session...
          </p>
        )}
      </div>
    </div>
  )
}

export default GameOverScreen
