import React, { useState, useRef, useEffect } from 'react'

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
 * OracleSlider - Mystical slider for Quick Ritual questions
 * 
 * A beautiful range input component that:
 * - Provides smooth touch interactions
 * - Shows dynamic gradient based on value
 * - Displays custom thumb with emoji
 * - Haptic feedback on milestones
 * - Accessible with ARIA labels
 * 
 * @example
 * <OracleSlider
 *   label="How serious should this gathering be?"
 *   leftLabel="Party Fun"
 *   rightLabel="Deep Thinking"
 *   leftIcon="🎪"
 *   rightIcon="🧠"
 *   value={seriousness}
 *   onChange={setSeriousness}
 * />
 */
export const OracleSlider = ({
  label,
  leftLabel,
  rightLabel,
  leftIcon,
  rightIcon,
  min = 0,
  max = 100,
  value = 50,
  onChange,
  thumbIcon = '✨',
  showValue = false,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [displayValue, setDisplayValue] = useState(value)
  const sliderRef = useRef(null)
  const lastHapticValue = useRef(value)

  useEffect(() => {
    setDisplayValue(value)
  }, [value])

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value)
    setDisplayValue(newValue)
    onChange?.(newValue)
    
    // Haptic feedback on every 10% milestone
    if (Math.abs(newValue - lastHapticValue.current) >= 10) {
      triggerHaptic('light')
      lastHapticValue.current = Math.floor(newValue / 10) * 10
    }
  }

  const handleMouseDown = () => {
    setIsDragging(true)
    triggerHaptic('light')
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    triggerHaptic('medium')
  }

  // Calculate gradient position
  const percentage = ((displayValue - min) / (max - min)) * 100

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-center text-lg text-purple-300 font-medium">
          {label}
        </label>
      )}

      {/* Value display (optional) */}
      {showValue && (
        <div className="text-center text-2xl font-bold text-white">
          {displayValue}
        </div>
      )}

      {/* Slider container */}
      <div className="relative px-2">
        {/* Track background with gradient */}
        <div className="relative h-4 rounded-full overflow-hidden bg-gray-800">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-150"
            style={{
              width: `${percentage}%`,
              background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(168, 85, 247))'
            }}
          />
        </div>

        {/* Range input (invisible but functional) */}
        <input
          ref={sliderRef}
          type="range"
          min={min}
          max={max}
          value={displayValue}
          onChange={handleChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          aria-label={label || 'Slider'}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={displayValue}
          className={`
            absolute top-0 left-0 w-full h-4
            appearance-none bg-transparent cursor-pointer
            focus:outline-none
            ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          `}
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'none'
          }}
        />
        
        {/* Custom thumb */}
        <div
          className={`
            absolute top-1/2 -translate-y-1/2 -translate-x-1/2
            w-12 h-12 
            bg-white rounded-full 
            shadow-xl shadow-purple-500/50
            flex items-center justify-center 
            text-2xl
            pointer-events-none
            transition-all duration-150
            ${isDragging ? 'scale-110 shadow-2xl shadow-purple-500/70' : 'scale-100'}
          `}
          style={{ 
            left: `calc(${percentage}% + ${8 - (percentage * 0.16)}px)` // Slight adjustment for edge cases
          }}
          aria-hidden="true"
        >
          {thumbIcon}
        </div>
      </div>

      {/* Labels with icons */}
      <div className="flex items-center justify-between text-sm px-2">
        <div className="flex items-center gap-2 text-purple-300">
          {leftIcon && <span className="text-2xl" aria-hidden="true">{leftIcon}</span>}
          <span className="font-medium">{leftLabel}</span>
        </div>
        <div className="flex items-center gap-2 text-purple-300">
          <span className="font-medium">{rightLabel}</span>
          {rightIcon && <span className="text-2xl" aria-hidden="true">{rightIcon}</span>}
        </div>
      </div>
    </div>
  )
}

// Custom CSS for range input styling
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    /* Remove default styling */
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 48px;
      height: 48px;
      background: transparent;
      cursor: pointer;
      border: none;
    }

    input[type="range"]::-moz-range-thumb {
      width: 48px;
      height: 48px;
      background: transparent;
      cursor: pointer;
      border: none;
    }

    input[type="range"]::-webkit-slider-runnable-track {
      height: 16px;
      background: transparent;
    }

    input[type="range"]::-moz-range-track {
      height: 16px;
      background: transparent;
    }

    input[type="range"]:focus {
      outline: none;
    }

    input[type="range"]:focus::-webkit-slider-thumb {
      box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.3);
      border-radius: 50%;
    }

    input[type="range"]:focus::-moz-range-thumb {
      box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.3);
      border-radius: 50%;
    }
  `
  if (!document.querySelector('#oracle-slider-styles')) {
    style.id = 'oracle-slider-styles'
    document.head.appendChild(style)
  }
}

export default OracleSlider
