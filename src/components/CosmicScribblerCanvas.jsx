import React, { useRef, useEffect, useState } from 'react'
import Icon from './Icon'

/**
 * CosmicScribblerCanvas component - Interactive particle drawing canvas (easter egg)
 * @param {function} onClose - Close canvas callback
 */
const CosmicScribblerCanvas = ({ onClose }) => {
  const canvasRef = useRef(null)
  const particles = useRef([])
  const hue = useRef(0)
  const [timeLeft, setTimeLeft] = useState(10)
  
  // Timer countdown
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalId)
          onClose()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [onClose])

  // Canvas particle animation
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const handleMouseMove = (e) => {
      for (let i = 0; i < 3; i++) {
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 5 + 2,
          opacity: 1,
          vx: Math.random() * 2 - 1,
          vy: Math.random() * 2 - 1,
          hue: hue.current,
        })
      }
      hue.current = (hue.current + 1) % 360
    }

    const animate = () => {
      // Use clearRect to make the canvas transparent, showing the background
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i]
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.opacity})`
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        p.x += p.vx
        p.y += p.vy
        p.opacity -= 0.03
        
        if (p.opacity <= 0) {
          particles.current.splice(i, 1)
        }
      }
      animationFrameId = requestAnimationFrame(animate)
    }
    
    animationFrameId = requestAnimationFrame(animate)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])
  
  const clearCanvas = () => {
    particles.current = []
  }

  return (
    <div className="fixed inset-0 z-50 screen-enter">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-9xl font-bold text-white/20 title-font select-none">
          {timeLeft}
        </span>
      </div>
      <div className="absolute top-4 right-4 flex gap-4">
        <button
          onClick={clearCanvas}
          className="p-3 bg-black/50 rounded-full text-white hover:bg-fuchsia-700/70 transition-colors"
          title="Clear Canvas (Black Hole)"
        >
          <Icon name="CircleDotDashed" className="w-6 h-6" />
        </button>
        <button
          onClick={onClose}
          className="p-3 bg-black/50 rounded-full text-white hover:bg-red-600/70 transition-colors"
          title="Exit Scribbler"
        >
          <Icon name="X" className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

export default CosmicScribblerCanvas
