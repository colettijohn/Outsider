import React, { useState, useEffect } from 'react'

/**
 * GlitchyArchiveText component - Text that glitches briefly then resolves
 * @param {string} text - Text to display with glitch effect
 */
const GlitchyArchiveText = ({ text }) => {
  const [isGlitching, setIsGlitching] = useState(true)
  const glitchChars = '█▒▓░§⅋⌰⍳⍴⍼⎅⏁☍⟳⠞⡥⢖⣒'

  useEffect(() => {
    const timeout = setTimeout(() => setIsGlitching(false), 300)
    return () => clearTimeout(timeout)
  }, [text])

  if (!isGlitching) {
    return <>{text}</>
  }

  const glitchyCharsList = text.split('').map((char, index) => (
    <span key={index}>
      {char === ' ' ? ' ' : glitchChars[Math.floor(Math.random() * glitchChars.length)]}
    </span>
  ))
  
  return <>{glitchyCharsList}</>
}

export default GlitchyArchiveText
