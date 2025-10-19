import React from 'react'

/**
 * PlayerAvatar component - Display a player's celestial avatar image
 * @param {object} player - Player object with avatarIndex
 * @param {number} size - Size of the avatar in pixels
 * @param {string} className - Additional CSS classes
 */
const PlayerAvatar = ({ player, size = 64, className = '' }) => {
  // A curated list of celestial being avatars
  const avatarImages = Array.from(
    { length: 12 }, 
    (_, i) => `/imgs/avatars/celestial_${String(i + 1).padStart(2, '0')}.png`
  )

  // Use the pre-assigned avatarIndex from the player object
  const imageIndex = player?.avatarIndex ?? 0
  const imageUrl = avatarImages[imageIndex]

  return (
    <img
      src={imageUrl}
      alt={`Avatar for ${player?.nickname || 'player'}`}
      className={`rounded-full object-cover bg-gray-900/50 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  )
}

export default PlayerAvatar
