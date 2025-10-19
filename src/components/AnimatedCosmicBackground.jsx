import React, { useState, useEffect } from 'react'
import TwinkleStar from './TwinkleStar'
import BackgroundConstellation from './BackgroundConstellation'
import { constellationLayouts } from '../data/constellationLayouts'

/**
 * AnimatedCosmicBackground component - Parallax cosmic background with stars and constellations
 * @param {object} mousePosition - Mouse position for parallax effect { x, y }
 */
const AnimatedCosmicBackground = ({ mousePosition }) => {
  const [bgConstellations, setBgConstellations] = useState([])
  const [twinkleStars, setTwinkleStars] = useState([])
  const [hoveredConstellation, setHoveredConstellation] = useState(null)
  
  useEffect(() => {
    // Constellation Generation
    const allShapes = Object.values(constellationLayouts).filter(c => c.name !== 'Unknown')
    const isMobile = window.innerWidth < 768
    const numConstellations = isMobile ? 8 : 12
    const generatedConstellations = []
    const animationNames = ['drift-1', 'drift-2', 'drift-3', 'drift-4']

    for (let i = 0; i < numConstellations; i++) {
      const size = (Math.random() * 8 + 2) * 16 // Range: 32px to 160px
      const top = Math.random() * 120 - 10
      const left = Math.random() * 120 - 10
      
      // Normalize size to a 0-1 range for calculating parallax effect
      const normalizedSize = (size - 32) / (160 - 32)

      const duration = 60 - (normalizedSize * 30) // Smaller = slower (60s), larger = faster (30s)
      const opacity = 0.1 + (normalizedSize * 0.3) // Smaller = fainter (0.1), larger = brighter (0.4)
      
      const delay = Math.random() * -duration
      const animationName = animationNames[Math.floor(Math.random() * animationNames.length)]

      generatedConstellations.push({
        id: i,
        shape: allShapes[i % allShapes.length],
        style: {
          width: `${size}px`,
          height: `${size}px`,
          top: `${top}%`,
          left: `${left}%`,
          opacity: opacity,
          animation: `${animationName} ${duration}s linear infinite`,
          animationDelay: `${delay}s`
        }
      })
    }
    setBgConstellations(generatedConstellations)

    // Twinkle Star Generation
    const numStars = isMobile ? 100 : 200
    const starsArray = []
    for (let i = 0; i < numStars; i++) {
      starsArray.push(<TwinkleStar key={`twinkle-${i}`} />)
    }
    setTwinkleStars(starsArray)
  }, [])
  
  const nebulaLayer = (
    <div
      className="absolute inset-0 transition-transform duration-500 ease-out"
      style={{ transform: `translateX(${mousePosition.x * 10}px) translateY(${mousePosition.y * 10}px)` }}
    >
      <div className="nebula" style={{ '--nebula-color': '#A21CAF', width: '600px', height: '600px', top: '5%', left: '10%' }} />
      <div className="nebula" style={{ '--nebula-color': '#0369A1', width: '800px', height: '800px', top: '50%', left: '60%' }} />
      <div className="nebula" style={{ '--nebula-color': '#B45309', width: '500px', height: '500px', top: '70%', left: '5%' }} />
    </div>
  )

  return (
    <div className="fixed inset-0" style={{ zIndex: -1 }}>
      {nebulaLayer}
      <div 
        className="absolute inset-0 transition-transform duration-500 ease-out"
        style={{ transform: `translateX(${mousePosition.x * 30}px) translateY(${mousePosition.y * 30}px)` }}
      >
        {twinkleStars}
      </div>
      <div 
        className="absolute inset-0 transition-transform duration-500 ease-out"
        style={{ transform: `translateX(${mousePosition.x * 60}px) translateY(${mousePosition.y * 60}px)` }}
      >
        {bgConstellations.map(constellation => (
          <BackgroundConstellation
            key={constellation.id}
            id={constellation.id}
            shape={constellation.shape}
            animationStyle={constellation.style}
            isHovered={hoveredConstellation === constellation.id}
            setHoveredId={setHoveredConstellation}
          />
        ))}
      </div>
    </div>
  )
}

export default AnimatedCosmicBackground
