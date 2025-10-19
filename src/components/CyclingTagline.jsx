import React, { useState, useEffect } from 'react'
import DecodingText from './DecodingText'

/**
 * CyclingTagline component - Cycles through cosmic phrases with decoding animation
 * @param {string} className - Additional CSS classes
 * @param {function} onClick - Click handler (for admin login easter egg)
 */
const CyclingTagline = ({ className = '', onClick }) => {
  const phrases = [
    'Initiating Cosmic Protocol...',
    'Scanning for Anomalies...',
    'Entities Detected...',
    'Connection Established...',
    'A Game of Deception'
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDecoding, setIsDecoding] = useState(true)

  useEffect(() => {
    // Cycle through phrases every 4 seconds
    const interval = setInterval(() => {
      setIsDecoding(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % phrases.length)
      }, 100) // Small delay for smooth transition
    }, 4000)

    return () => clearInterval(interval)
  }, [phrases.length])

  useEffect(() => {
    // Reset decoding state after animation completes
    const timeout = setTimeout(() => {
      setIsDecoding(false)
    }, 1500) // Match DecodingText animation duration

    return () => clearTimeout(timeout)
  }, [currentIndex])

  return (
    <div 
      className={`${className} cursor-pointer hover:text-gray-300 transition-colors`}
      onClick={onClick}
      title="Click for admin access"
    >
      {isDecoding ? (
        <DecodingText text={phrases[currentIndex]} speed={30} />
      ) : (
        <span className="text-gray-400">{phrases[currentIndex]}</span>
      )}
    </div>
  )
}

export default CyclingTagline
