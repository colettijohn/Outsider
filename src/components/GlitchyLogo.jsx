import React, { useState, useEffect } from 'react'

/**
 * GlitchyLogo component - "OUTSIDER" logo with random glitch effects
 * @param {string} size - Tailwind text size class
 * @param {string} className - Additional CSS classes
 * @param {function} onTriggerKonami - Callback when logo is clicked
 * @param {boolean} isKonamiArmed - Whether Konami code is active
 */
const GlitchyLogo = ({ 
  size = 'text-5xl', 
  className = '', 
  onTriggerKonami, 
  isKonamiArmed = false 
}) => {
  const [glitchIndex, setGlitchIndex] = useState(-1)
  const letters = "OUTSIDER".split('')

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * letters.length)
      setGlitchIndex(randomIndex)
      setTimeout(() => setGlitchIndex(-1), 250) // Glitch duration
    }, 3000) // Time between glitches

    return () => clearInterval(interval)
  }, [])

  const handleClick = () => {
    // Konami trigger check
    if (onTriggerKonami) {
      onTriggerKonami()
    }
  }

  return (
    <div className={`p-2 ${className}`} onClick={handleClick}>
      <span
        className={`title-font tracking-widest uppercase ${size} select-none text-amber-500 whitespace-nowrap cursor-pointer ${
          isKonamiArmed ? 'konami-armed' : ''
        }`}
      >
        {letters.map((letter, index) => (
          <span
            key={index}
            className={index === glitchIndex ? 'glitching-letter' : 'inline-block'}
          >
            {letter}
          </span>
        ))}
      </span>
    </div>
  )
}

export default GlitchyLogo
