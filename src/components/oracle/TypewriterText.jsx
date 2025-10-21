/**
 * TypewriterText - Animated Text Display
 * 
 * A reusable component for typewriter effect text.
 * Can be used independently for Oracle messages or other UI text.
 */

import React, { useState, useEffect, useRef } from 'react'

export function TypewriterText({
  text = '',
  speed = 50, // milliseconds per character
  onComplete = null,
  className = '',
  showCursor = true,
  cursorChar = '▊',
  startDelay = 0,
  enableSound = false // Future: typing sound effects
}) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    // Reset on text change
    setDisplayedText('')
    setIsComplete(false)

    if (!text) return

    // Start delay before typing begins
    const startTimer = setTimeout(() => {
      let currentIndex = 0

      timerRef.current = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1))
          currentIndex++

          // Future: Play typing sound
          if (enableSound) {
            // playTypingSound()
          }
        } else {
          clearInterval(timerRef.current)
          setIsComplete(true)
          
          if (onComplete) {
            onComplete()
          }
        }
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(startTimer)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [text, speed, startDelay, onComplete, enableSound])

  return (
    <span className={className}>
      {displayedText}
      {showCursor && !isComplete && (
        <span className="animate-pulse inline-block ml-1 opacity-70">
          {cursorChar}
        </span>
      )}
    </span>
  )
}

export default TypewriterText
