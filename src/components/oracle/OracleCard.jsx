import React, { useState } from 'react'

/**
 * Haptic feedback helper
 */
const triggerHaptic = (style = 'medium') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30
    }
    navigator.vibrate(patterns[style] || 20)
  }
}

/**
 * OracleCard - 3D flippable card for displaying questions
 * 
 * A beautiful card component that:
 * - Flips in 3D to show crew/impostor versions
 * - Indicates selection state
 * - Shows question metadata (time, players, spice)
 * - Provides smooth animations
 * - Touch-friendly with haptic feedback
 * 
 * @example
 * <OracleCard
 *   question={questionCard}
 *   isSelected={selectedCards.has(card.id)}
 *   onToggle={handleToggle}
 *   onFlip={handleFlip}
 *   size="medium"
 * />
 */
export const OracleCard = ({
  question,
  isSelected = false,
  onToggle,
  onFlip,
  size = 'medium',
  showMetadata = true,
  className = ''
}) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleFlip = (e) => {
    e.stopPropagation()
    if (isAnimating) return
    
    setIsFlipped(!isFlipped)
    setIsAnimating(true)
    triggerHaptic('light')
    onFlip?.(question, !isFlipped)
    
    setTimeout(() => setIsAnimating(false), 600)
  }

  const handleToggle = () => {
    if (isAnimating) return
    triggerHaptic('medium')
    onToggle?.(question)
  }

  const sizeStyles = {
    small: 'w-40 h-52',
    medium: 'w-56 h-72',
    large: 'w-72 h-96'
  }

  const textSizeStyles = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }

  return (
    <div 
      className={`${sizeStyles[size]} perspective-1000 ${className}`}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`
          relative w-full h-full
          transition-transform duration-600 ease-out
          ${isFlipped ? 'rotate-y-180' : ''}
        `}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front of card (Crew question) */}
        <div
          className={`
            absolute inset-0
            rounded-xl p-4
            ${isSelected 
              ? 'bg-gradient-to-br from-purple-600 to-purple-800 ring-4 ring-purple-400 shadow-xl shadow-purple-500/50' 
              : 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-750 hover:to-gray-850'
            }
            border-2 ${isSelected ? 'border-purple-300' : 'border-purple-500/30'}
            cursor-pointer
            hover:border-purple-400
            transition-all duration-200
            flex flex-col
            ${textSizeStyles[size]}
          `}
          style={{ backfaceVisibility: 'hidden' }}
          onClick={handleToggle}
        >
          {/* Category badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl drop-shadow-lg" aria-hidden="true">
              {question.categoryIcon}
            </span>
            <span className="text-xs text-purple-300 uppercase font-semibold tracking-wide">
              {question.category}
            </span>
          </div>

          {/* Question text */}
          <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
            <p className="text-white font-medium leading-relaxed">
              {question.crew}
            </p>
          </div>

          {/* Metadata */}
          {showMetadata && question.metadata && (
            <div className="flex items-center justify-between text-xs text-gray-300 mt-3 pt-3 border-t border-white/10">
              <span className="flex items-center gap-1" title="Estimated time">
                <span aria-hidden="true">⏱️</span>
                <span>{Math.floor(question.metadata.estimatedTime / 60)}min</span>
              </span>
              <span className="flex items-center gap-1" title="Player count">
                <span aria-hidden="true">👥</span>
                <span>{question.metadata.playerCount.min}-{question.metadata.playerCount.max}</span>
              </span>
              <span className="flex items-center gap-1" title="Spice level">
                <span aria-hidden="true">🔥</span>
                <span>{question.metadata.spiceLevel}/5</span>
              </span>
            </div>
          )}

          {/* Flip indicator */}
          <button
            onClick={handleFlip}
            className="mt-3 text-xs text-purple-400 hover:text-purple-300 transition-colors underline"
            aria-label="Flip to see Outsider version"
          >
            Flip to see Outsider version →
          </button>

          {/* Selection indicator */}
          {isSelected && (
            <div 
              className="absolute top-3 right-3 bg-white text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg"
              aria-label="Selected"
            >
              ✓
            </div>
          )}
        </div>

        {/* Back of card (Impostor question) */}
        <div
          className={`
            absolute inset-0
            rounded-xl p-4
            ${isSelected
              ? 'bg-gradient-to-br from-red-700 to-red-900 ring-4 ring-red-400 shadow-xl shadow-red-500/50'
              : 'bg-gradient-to-br from-red-800 to-red-950 hover:from-red-750 hover:to-red-900'
            }
            border-2 ${isSelected ? 'border-red-300' : 'border-red-500/30'}
            cursor-pointer
            flex flex-col
            ${textSizeStyles[size]}
          `}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
          onClick={handleToggle}
        >
          {/* Category badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl drop-shadow-lg" aria-hidden="true">💀</span>
            <span className="text-xs text-red-300 uppercase font-semibold tracking-wide">
              Outsider Version
            </span>
          </div>

          {/* Question text */}
          <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-transparent">
            <p className="text-white font-medium leading-relaxed">
              {question.impostor}
            </p>
          </div>

          {/* Metadata */}
          {showMetadata && question.metadata && (
            <div className="flex items-center justify-between text-xs text-gray-300 mt-3 pt-3 border-t border-white/10">
              <span className="flex items-center gap-1">
                <span aria-hidden="true">⏱️</span>
                <span>{Math.floor(question.metadata.estimatedTime / 60)}min</span>
              </span>
              <span className="flex items-center gap-1">
                <span aria-hidden="true">👥</span>
                <span>{question.metadata.playerCount.min}-{question.metadata.playerCount.max}</span>
              </span>
              <span className="flex items-center gap-1">
                <span aria-hidden="true">🔥</span>
                <span>{question.metadata.spiceLevel}/5</span>
              </span>
            </div>
          )}

          {/* Flip back indicator */}
          <button
            onClick={handleFlip}
            className="mt-3 text-xs text-red-400 hover:text-red-300 transition-colors underline"
            aria-label="Flip back to crew version"
          >
            ← Flip back
          </button>

          {/* Selection indicator */}
          {isSelected && (
            <div 
              className="absolute top-3 right-3 bg-white text-red-600 rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg"
              aria-label="Selected"
            >
              ✓
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OracleCard
