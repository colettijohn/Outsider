import React, { useEffect, useRef } from 'react'

/**
 * ParticleEffect - Canvas-based particle effects for Oracle
 * 
 * Creates beautiful animated particles that:
 * - Float and drift naturally
 * - Pulse with life-like opacity
 * - Wrap around screen edges
 * - Perform smoothly (60fps)
 * - Support multiple effect types
 * 
 * @example
 * <ParticleEffect 
 *   type="gentle" 
 *   color="#a855f7" 
 *   particleCount={50}
 * />
 */
export const ParticleEffect = ({
  type = 'gentle',  // gentle, intense, burst, trail, cosmic
  color = '#a855f7',  // purple
  particleCount = 50,
  speed = 1,
  size = 'medium',
  className = ''
}) => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    // Set canvas size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.scale(dpr, dpr)
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    // Particle configurations based on type
    const configs = {
      gentle: {
        speed: 0.5 * speed,
        sizeRange: [1, 3],
        opacityRange: [0.3, 0.6],
        velocityRange: 0.5
      },
      intense: {
        speed: 1.5 * speed,
        sizeRange: [2, 4],
        opacityRange: [0.4, 0.8],
        velocityRange: 1.5
      },
      burst: {
        speed: 2 * speed,
        sizeRange: [3, 6],
        opacityRange: [0.6, 1],
        velocityRange: 3
      },
      trail: {
        speed: 1 * speed,
        sizeRange: [1, 2],
        opacityRange: [0.2, 0.5],
        velocityRange: 2
      },
      cosmic: {
        speed: 0.7 * speed,
        sizeRange: [2, 5],
        opacityRange: [0.5, 0.9],
        velocityRange: 1
      }
    }

    const config = configs[type] || configs.gentle

    // Create particles
    const createParticles = () => {
      const particles = []
      const rect = canvas.getBoundingClientRect()
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * config.velocityRange,
          vy: (Math.random() - 0.5) * config.velocityRange,
          size: Math.random() * (config.sizeRange[1] - config.sizeRange[0]) + config.sizeRange[0],
          baseOpacity: Math.random() * (config.opacityRange[1] - config.opacityRange[0]) + config.opacityRange[0],
          life: Math.random() * 100,
          lifeSpeed: 0.02 + Math.random() * 0.03
        })
      }
      
      return particles
    }

    particlesRef.current = createParticles()

    // Animation loop
    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx * config.speed
        particle.y += particle.vy * config.speed
        particle.life += particle.lifeSpeed

        // Wrap around edges
        if (particle.x < 0) particle.x = rect.width
        if (particle.x > rect.width) particle.x = 0
        if (particle.y < 0) particle.y = rect.height
        if (particle.y > rect.height) particle.y = 0

        // Pulsing opacity
        const pulseOpacity = particle.baseOpacity + Math.sin(particle.life * 0.05) * 0.2

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        
        // Convert hex to RGB and add opacity
        const r = parseInt(color.slice(1, 3), 16)
        const g = parseInt(color.slice(3, 5), 16)
        const b = parseInt(color.slice(5, 7), 16)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${pulseOpacity})`
        
        ctx.fill()

        // Cosmic type gets a glow effect
        if (type === 'cosmic') {
          ctx.shadowBlur = 10
          ctx.shadowColor = color
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', updateCanvasSize)
    }
  }, [type, color, particleCount, speed])

  const sizeClasses = {
    small: 'h-32',
    medium: 'h-64',
    large: 'h-96',
    full: 'h-full'
  }

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none w-full ${sizeClasses[size] || sizeClasses.medium} ${className}`}
      aria-hidden="true"
    />
  )
}

export default ParticleEffect
