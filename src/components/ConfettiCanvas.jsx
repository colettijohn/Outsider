import React, { useRef, useEffect } from 'react'

/**
 * ConfettiCanvas component - Falling confetti animation
 * @param {boolean} isActive - Whether confetti should be animating
 */
const ConfettiCanvas = ({ isActive }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId
    const particles = []
    const particleCount = 150
    const colors = ['#FBBF24', '#F59E0B', '#BE185D', '#A21CAF', '#FFFFFF']

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height - canvas.height
        this.size = Math.random() * 8 + 4
        this.speed = Math.random() * 3 + 2
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.rotation = Math.random() * 360
        this.spin = Math.random() * 10 - 5
      }
      
      update() {
        this.y += this.speed
        this.rotation += this.spin
        if (this.y > canvas.height) {
          this.y = -20
          this.x = Math.random() * canvas.width
        }
      }
      
      draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation * Math.PI / 180)
        ctx.fillStyle = this.color
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
        ctx.restore()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { 
        p.update()
        p.draw(ctx)
      })
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationFrameId)
  }, [isActive])

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  )
}

export default ConfettiCanvas
