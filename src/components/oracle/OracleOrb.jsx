/**
 * OracleOrb - The Mystical Guide
 * 
 * A sentient cosmic orb that communicates with players through
 * animated text and particle effects. Acts as the personality
 * behind the Oracle experience.
 * 
 * States:
 * - idle: Gentle pulsing, waiting for interaction
 * - listening: Focused attention, absorbing input
 * - thinking: Processing, particles swirling
 * - revealing: Sharing wisdom, particles burst
 * - celebrating: Success animation
 * 
 * Features:
 * - Smooth state transitions
 * - Typewriter text effect
 * - Particle system integration
 * - Haptic feedback on state changes
 * - Responsive animations
 */

import React, { useState, useEffect, useRef } from 'react'
import { ParticleEffect } from './ParticleEffect'

export function OracleOrb({ 
  message = '', 
  state = 'idle',
  onStateChange = null,
  onMessageComplete = null,
  size = 'large', // 'small', 'medium', 'large', 'xl'
  enableParticles = true,
  enableSound = false // Future: sound effects
}) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentState, setCurrentState] = useState(state)
  const orbRef = useRef(null)
  const typewriterTimer = useRef(null)
  const prevStateRef = useRef(state)

  // State colors and effects
  const stateConfig = {
    idle: {
      color: 'from-purple-500 to-blue-500',
      glow: 'shadow-purple-500/50',
      intensity: 0.5,
      particleType: 'gentle',
      particleCount: 30,
      pulseSpeed: 3
    },
    listening: {
      color: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/70',
      intensity: 0.7,
      particleType: 'gentle',
      particleCount: 50,
      pulseSpeed: 2
    },
    thinking: {
      color: 'from-purple-600 via-pink-500 to-orange-500',
      glow: 'shadow-pink-500/80',
      intensity: 0.9,
      particleType: 'cosmic',
      particleCount: 80,
      pulseSpeed: 1.5
    },
    revealing: {
      color: 'from-yellow-400 via-pink-500 to-purple-600',
      glow: 'shadow-yellow-400/90',
      intensity: 1,
      particleType: 'burst',
      particleCount: 100,
      pulseSpeed: 1
    },
    celebrating: {
      color: 'from-green-400 via-cyan-500 to-blue-500',
      glow: 'shadow-green-400/90',
      intensity: 1,
      particleType: 'burst',
      particleCount: 120,
      pulseSpeed: 0.8
    },
    warning: {
      color: 'from-orange-500 to-red-500',
      glow: 'shadow-orange-500/80',
      intensity: 0.8,
      particleType: 'intense',
      particleCount: 60,
      pulseSpeed: 2
    }
  }

  const sizeConfig = {
    small: { width: 80, height: 80, fontSize: 'text-xs' },
    medium: { width: 120, height: 120, fontSize: 'text-sm' },
    large: { width: 180, height: 180, fontSize: 'text-base' },
    xl: { width: 240, height: 240, fontSize: 'text-lg' }
  }

  const config = stateConfig[currentState] || stateConfig.idle
  const dimensions = sizeConfig[size] || sizeConfig.large

  // Trigger haptic feedback on state change
  useEffect(() => {
    if (prevStateRef.current !== state) {
      triggerHaptic(state)
      prevStateRef.current = state
      
      if (onStateChange) {
        onStateChange(state)
      }
    }
    setCurrentState(state)
  }, [state, onStateChange])

  // Typewriter effect for messages
  useEffect(() => {
    if (!message) {
      setDisplayedText('')
      setIsTyping(false)
      return
    }

    // Clear previous text
    setDisplayedText('')
    setIsTyping(true)

    let currentIndex = 0
    const speed = state === 'revealing' ? 30 : 50 // Faster for revealing

    typewriterTimer.current = setInterval(() => {
      if (currentIndex <= message.length) {
        setDisplayedText(message.slice(0, currentIndex))
        currentIndex++

        // Small haptic tick on every 5th character
        if (currentIndex % 5 === 0) {
          triggerHaptic('light')
        }
      } else {
        clearInterval(typewriterTimer.current)
        setIsTyping(false)
        
        if (onMessageComplete) {
          onMessageComplete()
        }
      }
    }, speed)

    return () => {
      if (typewriterTimer.current) {
        clearInterval(typewriterTimer.current)
      }
    }
  }, [message, state, onMessageComplete])

  // Haptic feedback helper
  const triggerHaptic = (intensity) => {
    if (!navigator.vibrate) return

    const patterns = {
      light: 10,
      medium: 20,
      heavy: 40,
      idle: 15,
      listening: 20,
      thinking: [10, 30, 10],
      revealing: [20, 40, 20, 40],
      celebrating: [30, 50, 30, 50, 30],
      warning: [40, 20, 40]
    }

    const pattern = patterns[intensity] || patterns.medium
    navigator.vibrate(pattern)
  }

  return (
    <div className="oracle-orb-container relative flex flex-col items-center">
      {/* Particle Effects */}
      {enableParticles && (
        <div className="absolute inset-0 pointer-events-none">
          <ParticleEffect
            type={config.particleType}
            count={config.particleCount}
            color={currentState === 'revealing' ? '#FFD700' : '#A855F7'}
            speed={config.intensity}
          />
        </div>
      )}

      {/* The Orb */}
      <div
        ref={orbRef}
        className="oracle-orb relative z-10"
        style={{
          width: dimensions.width,
          height: dimensions.height
        }}
      >
        {/* Outer glow rings */}
        <div
          className={`
            absolute inset-0 rounded-full
            bg-gradient-to-br ${config.color}
            opacity-20 blur-xl
            animate-pulse
            shadow-2xl ${config.glow}
          `}
          style={{
            animationDuration: `${config.pulseSpeed}s`
          }}
        />
        <div
          className={`
            absolute inset-2 rounded-full
            bg-gradient-to-br ${config.color}
            opacity-30 blur-lg
            animate-pulse
            shadow-xl ${config.glow}
          `}
          style={{
            animationDuration: `${config.pulseSpeed * 1.2}s`,
            animationDelay: '0.3s'
          }}
        />

        {/* Main orb body */}
        <div
          className={`
            absolute inset-4 rounded-full
            bg-gradient-to-br ${config.color}
            shadow-2xl ${config.glow}
            flex items-center justify-center
            transition-all duration-500
            transform
            ${currentState === 'thinking' ? 'animate-spin-slow' : ''}
            ${currentState === 'celebrating' ? 'animate-bounce' : ''}
          `}
          style={{
            opacity: config.intensity
          }}
        >
          {/* Inner sparkle */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white to-transparent opacity-30 animate-pulse" />
          
          {/* Eye/Core - state-dependent icon */}
          <div className="relative z-10 text-4xl select-none">
            {currentState === 'idle' && '👁️'}
            {currentState === 'listening' && '👂'}
            {currentState === 'thinking' && '🧠'}
            {currentState === 'revealing' && '✨'}
            {currentState === 'celebrating' && '🎉'}
            {currentState === 'warning' && '⚠️'}
          </div>
        </div>

        {/* Rotating ring (thinking state) */}
        {currentState === 'thinking' && (
          <div className="absolute inset-0">
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 border-r-pink-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Message display */}
      {message && (
        <div
          className={`
            mt-8 max-w-2xl
            bg-purple-900/40 backdrop-blur-sm
            border-2 border-purple-500/50
            rounded-2xl p-6
            ${dimensions.fontSize}
            text-center
            shadow-lg shadow-purple-500/30
            transition-all duration-300
          `}
        >
          <p className="text-purple-100 leading-relaxed">
            {displayedText}
            {isTyping && (
              <span className="inline-block w-2 h-5 ml-1 bg-purple-400 animate-pulse" />
            )}
          </p>
          
          {/* State indicator */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-purple-400">
            <div className={`w-2 h-2 rounded-full bg-purple-400 ${isTyping ? 'animate-pulse' : ''}`} />
            <span className="uppercase tracking-wider">{currentState}</span>
          </div>
        </div>
      )}

      {/* Loading dots for thinking state */}
      {currentState === 'thinking' && !message && (
        <div className="mt-8 flex gap-2">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      )}
    </div>
  )
}

// Add custom animation to global styles (or include in main.css)
const style = document.createElement('style')
style.textContent = `
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 4s linear infinite;
  }
`
if (!document.querySelector('style[data-oracle-animations]')) {
  style.setAttribute('data-oracle-animations', 'true')
  document.head.appendChild(style)
}

export default OracleOrb
