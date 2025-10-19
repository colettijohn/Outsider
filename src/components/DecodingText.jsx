import React from 'react'

/**
 * DecodingText component - Text with staggered animation delay
 * @param {string} text - Text to display
 * @param {number} delay - Animation delay in seconds
 */
const DecodingText = ({ text, delay = 0 }) => {
  return (
    <span
      className="inline-block"
      style={{ animationDelay: `${delay}s` }}
    >
      {text}
    </span>
  )
}

export default DecodingText
