import React from 'react'
import PlayerAvatar from './PlayerAvatar'
import Icon from './Icon'

/**
 * Avatar component - Player avatar with badges and voting indicators
 * @param {object} player - Player object
 * @param {boolean} isHost - Whether player is the host
 * @param {boolean} hasVoted - Whether player has voted
 */
const Avatar = ({ player, isHost, hasVoted }) => {
  const { nickname } = player

  return (
    <div className="relative flex flex-col items-center space-y-2">
      <div className="relative w-20 h-20">
        <PlayerAvatar 
          player={player} 
          size={80} 
          className="border-2 border-gray-600" 
        />
        {hasVoted && (
          <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
            <Icon name="CheckCircle2" className="w-10 h-10 text-green-400" />
          </div>
        )}
      </div>
      <p className="text-sm font-semibold truncate w-24 text-center">{nickname}</p>
      {isHost && (
        <Icon 
          name="Sparkles" 
          className="absolute -top-1 -right-1 text-amber-500 w-5 h-5" 
        />
      )}
    </div>
  )
}

export default Avatar
