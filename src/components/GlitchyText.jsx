import React, { useState, useEffect } from 'react'

/**
 * GlitchyText component - Text that scrambles into glitch characters
 * @param {string} children - Text to display
 * @param {boolean} isGlitching - Whether to apply glitch effect
 */
const GlitchyText = ({ children, isGlitching }) => {
  const originalText = children
  const [text, setText] = useState(originalText)
  const glitchChars = '█▒▓░§⅋⌰⍳⍴⍼⎅⏁☍⟳⠞⡥⢖⣒⣲⣴⣾⣿'

  useEffect(() => {
    if (!isGlitching) {
      setText(originalText)
      return
    }

    const interval = setInterval(() => {
      const scrambled = originalText
        .split('')
        .map(char => (char === ' ' ? ' ' : glitchChars[Math.floor(Math.random() * glitchChars.length)]))
        .join('')
      setText(scrambled)
    }, 50)

    const timeout = setTimeout(() => {
      clearInterval(interval)
      setText(originalText)
    }, 450)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [isGlitching, originalText])

  return <>{text}</>
}

export default GlitchyText
