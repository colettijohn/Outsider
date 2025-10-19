import React, { useRef, useEffect } from 'react'

/**
 * MeteorShowerOverlay component - Animated meteor shower effect targeting specific elements
 * @param {Array} targets - Array of DOM elements to target with meteors
 */
const MeteorShowerOverlay = ({ targets }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || targets.length === 0) return

    canvas.classList.add('active')
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const targetPositions = targets.map(t => {
      if (!t) return null
      const rect = t.getBoundingClientRect()
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    }).filter(Boolean)

    if (targetPositions.length === 0) {
      canvas.classList.remove('active')
      return
    }

    const meteors = []

    class Meteor {
      constructor(startX, startY, tx, ty) {
        this.startX = startX
        this.startY = startY
        this.x = startX
        this.y = startY
        this.tx = tx
        this.ty = ty
        this.distanceToTarget = Math.sqrt(Math.pow(tx - startX, 2) + Math.pow(ty - startY, 2))
        this.distanceTraveled = 0
        this.angle = Math.atan2(ty - startY, tx - startX)
        this.speed = Math.random() * 5 + 5
        this.trail = []
      }

      update() {
        if (this.distanceTraveled >= this.distanceToTarget) {
          // Struck target - meteor complete
          return false // Remove meteor
        }
        
        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed
        this.distanceTraveled = Math.sqrt(Math.pow(this.x - this.startX, 2) + Math.pow(this.y - this.startY, 2))

        this.trail.push({ x: this.x, y: this.y, opacity: 1 })
        if (this.trail.length > 20) this.trail.shift()

        this.trail.forEach(p => p.opacity -= 0.05)
        
        return true
      }

      draw(ctx) {
        ctx.beginPath()
        ctx.moveTo(this.trail[0]?.x, this.trail[0]?.y)
        for (let i = 1; i < this.trail.length; i++) {
          ctx.lineTo(this.trail[i].x, this.trail[i].y)
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.trail[this.trail.length - 1]?.opacity || 0})`
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }
    
    targetPositions.forEach((pos, i) => {
      setTimeout(() => {
        const startX = Math.random() < 0.5 ? -50 : canvas.width + 50
        const startY = Math.random() * canvas.height
        const meteor = new Meteor(startX, startY, pos.x, pos.y)
        meteors.push(meteor)
      }, i * 150)
    })

    let animationFrameId
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = meteors.length - 1; i >= 0; i--) {
        if (!meteors[i].update()) {
          meteors.splice(i, 1)
        } else {
          meteors[i].draw(ctx)
        }
      }
      if (meteors.length > 0) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        // Fade out canvas when done
        canvas.classList.remove('active')
      }
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [targets])

  return <canvas ref={canvasRef} id="meteor-shower-canvas" />
}

export default MeteorShowerOverlay
