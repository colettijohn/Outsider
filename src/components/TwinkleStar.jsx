import React, { useState, useEffect } from 'react'

/**
 * TwinkleStar component - Animated twinkling star for backgrounds
 * Each star has random position, size, duration, and intensity
 */
const TwinkleStar = () => {
  const [style, setStyle] = useState({})

  useEffect(() => {
    const size = Math.random() * 2 + 1 // Star size between 1px and 3px
    const top = Math.random() * 100
    const left = Math.random() * 100
    const duration = Math.random() * 4 + 3 // Duration between 3s and 7s
    const delay = Math.random() * 5 // Delay up to 5s
    const intensities = ['twinkle-bright', 'twinkle-medium', 'twinkle-dim']
    const animationName = intensities[Math.floor(Math.random() * intensities.length)]

    setStyle({
      width: `${size}px`,
      height: `${size}px`,
      top: `${top}%`,
      left: `${left}%`,
      animation: `${animationName} ${duration}s infinite`,
      animationDelay: `${delay}s`
    })
  }, [])

  return (
    <div
      className="absolute bg-white rounded-full"
      style={style}
    />
  )
}

export default TwinkleStar
