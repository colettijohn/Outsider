import React, { useState, useEffect } from 'react'

/**
 * LoadingScreen component - Animated orrery (planetary system) with loading messages
 */
const LoadingScreen = () => {
  const [phase, setPhase] = useState('stabilizing')
  const [messageIndex, setMessageIndex] = useState(0)
  
  const messages = [
    'Calibrating Sensors...',
    'Establishing Connection...',
    'Synchronizing Timelines...',
    'Loading Cosmic Data...'
  ]

  useEffect(() => {
    const stabilizationTimer = setTimeout(() => setPhase('stabilized'), 1000)
    const standbyTimer = setTimeout(() => setPhase('standby'), 3000)
    
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 2000)

    return () => {
      clearTimeout(stabilizationTimer)
      clearTimeout(standbyTimer)
      clearInterval(messageInterval)
    }
  }, [])

  const currentMessage = messages[messageIndex]
  const messageChars = currentMessage.split('').map((char, i) => 
    <span 
      key={`${messageIndex}-${i}`}
      className="loading-message-char"
      style={{ animationDelay: `${i * 0.03}s` }}
    >
      {char}
    </span>
  )

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center screen-enter">
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        <svg 
          className={`orrery-loader ${phase}`}
          viewBox="0 0 200 200"
          style={{ overflow: 'visible' }}
        >
          {/* Ring Group 1 */}
          <g className="ring-group-1" style={{ transformOrigin: 'center' }}>
            <circle 
              className="ring"
              cx={100} cy={100} r={90}
              fill="none" stroke="#F59E0B" strokeWidth={0.5} opacity={0.5}
            />
            <circle 
              className="planet"
              cx={100} cy={10} r={4}
              fill="#60A5FA"
              style={{ animationDelay: '0.8s' }}
            />
          </g>

          {/* Ring Group 2 */}
          <g className="ring-group-2" style={{ transformOrigin: 'center' }}>
            <circle 
              className="ring"
              cx={100} cy={100} r={65}
              fill="none" stroke="#F59E0B" strokeWidth={0.75} opacity={0.7}
              style={{ animationDelay: '0.2s' }}
            />
            <circle 
              className="planet"
              cx={35} cy={100} r={6}
              fill="#A21CAF"
              style={{ animationDelay: '1.0s' }}
            />
          </g>

          {/* Ring Group 3 */}
          <g className="ring-group-1" style={{ transformOrigin: 'center' }}>
            <circle 
              className="ring"
              cx={100} cy={100} r={40}
              fill="none" stroke="#FBBF24" strokeWidth={1}
              style={{ animationDelay: '0.4s' }}
            />
            <circle 
              className="planet"
              cx={140} cy={100} r={3}
              fill="#BE185D"
              style={{ animationDelay: '1.2s' }}
            />
          </g>

          {/* Central Core (Sun) */}
          <g className="core-sun" style={{ animationDelay: '0.6s' }}>
            <circle cx={100} cy={100} r={15} fill="#FBBF24" />
            <text
              x="50%" y="50%"
              dy=".3em" textAnchor="middle"
              className="logo-text title-font text-2xl fill-current text-gray-900 font-bold unselectable"
            >
              O
            </text>
          </g>
        </svg>
      </div>
      
      <p 
        key={messageIndex}
        className="loading-message text-lg title-font text-amber-500 mt-12 tracking-widest h-6"
      >
        {messageChars}
      </p>
    </div>
  )
}

export default LoadingScreen
