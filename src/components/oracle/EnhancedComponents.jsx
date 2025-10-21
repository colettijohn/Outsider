/**
 * Enhanced Oracle Components with Polish
 * 
 * Wrapper components that add sound and haptic feedback
 * to existing Oracle components.
 */

import React from 'react'
import { OracleButton as BaseButton } from './OracleButton'
import { OracleCard as BaseCard } from './OracleCard'
import { OracleSlider as BaseSlider } from './OracleSlider'
import { haptics } from '../../utils/haptics'
import { sounds } from '../../utils/sounds'

/**
 * Enhanced OracleButton with sound and haptics
 */
export function EnhancedOracleButton({ onClick, variant = 'primary', ...props }) {
  const handleClick = (e) => {
    // Play feedback
    if (variant === 'cosmic' || variant === 'success') {
      sounds.success()
      haptics.heavy()
    } else if (variant === 'danger') {
      sounds.error()
      haptics.error()
    } else {
      sounds.click()
      haptics.medium()
    }

    // Call original onClick
    if (onClick) {
      onClick(e)
    }
  }

  const handleHover = () => {
    sounds.hover()
    haptics.light()
  }

  return (
    <div
      onMouseEnter={handleHover}
      onTouchStart={handleHover}
    >
      <BaseButton
        onClick={handleClick}
        variant={variant}
        {...props}
      />
    </div>
  )
}

/**
 * Enhanced OracleCard with sound and haptics
 */
export function EnhancedOracleCard({ onToggle, onFlip, ...props }) {
  const handleToggle = () => {
    sounds.select()
    haptics.selection()
    if (onToggle) onToggle()
  }

  const handleFlip = () => {
    sounds.cardFlip()
    haptics.cardFlip()
    if (onFlip) onFlip()
  }

  return (
    <BaseCard
      onToggle={handleToggle}
      onFlip={handleFlip}
      {...props}
    />
  )
}

/**
 * Enhanced OracleSlider with sound and haptics
 */
export function EnhancedOracleSlider({ onChange, value, ...props }) {
  const lastTickRef = React.useRef(Math.floor(value / 10))

  const handleChange = (newValue) => {
    // Tick on every 10% milestone
    const currentTick = Math.floor(newValue / 10)
    if (currentTick !== lastTickRef.current) {
      sounds.pop()
      haptics.sliderTick()
      lastTickRef.current = currentTick
    }

    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <BaseSlider
      value={value}
      onChange={handleChange}
      {...props}
    />
  )
}

export default {
  EnhancedOracleButton,
  EnhancedOracleCard,
  EnhancedOracleSlider
}
