/**
 * Sound Effects System
 * 
 * Provides audio feedback for interactions.
 * Uses Web Audio API for crisp, low-latency sounds.
 */

export class SoundEffects {
  constructor() {
    this.context = null
    this.isEnabled = true
    this.volume = 0.3 // 0-1
    this.sounds = {}
    
    this.init()
  }

  /**
   * Initialize Audio Context
   */
  init() {
    try {
      // Create AudioContext on first user interaction
      this.context = new (window.AudioContext || window.webkitAudioContext)()
    } catch (e) {
      console.warn('Web Audio API not supported', e)
    }
  }

  /**
   * Resume context (needed for mobile)
   */
  resume() {
    if (this.context && this.context.state === 'suspended') {
      this.context.resume()
    }
  }

  /**
   * Set enabled state
   */
  setEnabled(enabled) {
    this.isEnabled = enabled
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  /**
   * Check if audio is available
   */
  canPlay() {
    return this.context && this.isEnabled
  }

  /**
   * Play a synthesized tone
   */
  playTone(frequency, duration, type = 'sine') {
    if (!this.canPlay()) return
    this.resume()

    const oscillator = this.context.createOscillator()
    const gainNode = this.context.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.context.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    gainNode.gain.setValueAtTime(this.volume, this.context.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.context.currentTime + duration
    )

    oscillator.start(this.context.currentTime)
    oscillator.stop(this.context.currentTime + duration)
  }

  /**
   * Button click sound
   */
  click() {
    this.playTone(800, 0.05, 'sine')
  }

  /**
   * Hover sound (subtle)
   */
  hover() {
    this.playTone(600, 0.03, 'sine')
  }

  /**
   * Success sound (ascending)
   */
  success() {
    if (!this.canPlay()) return
    this.resume()

    const notes = [523.25, 659.25, 783.99] // C, E, G
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.1, 'triangle')
      }, i * 80)
    })
  }

  /**
   * Error sound (descending)
   */
  error() {
    if (!this.canPlay()) return
    this.resume()

    const notes = [392, 329.63] // G, E
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.15, 'square')
      }, i * 100)
    })
  }

  /**
   * Whoosh sound (for transitions)
   */
  whoosh() {
    if (!this.canPlay()) return
    this.resume()

    const oscillator = this.context.createOscillator()
    const gainNode = this.context.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.context.destination)

    oscillator.frequency.setValueAtTime(800, this.context.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(
      100,
      this.context.currentTime + 0.3
    )
    oscillator.type = 'sawtooth'

    gainNode.gain.setValueAtTime(this.volume * 0.5, this.context.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.context.currentTime + 0.3
    )

    oscillator.start(this.context.currentTime)
    oscillator.stop(this.context.currentTime + 0.3)
  }

  /**
   * Pop sound (for appearing elements)
   */
  pop() {
    this.playTone(1200, 0.08, 'sine')
  }

  /**
   * Shimmer sound (for magical effects)
   */
  shimmer() {
    if (!this.canPlay()) return
    this.resume()

    const notes = [523.25, 659.25, 783.99, 1046.50] // C, E, G, C
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.1, 'triangle')
      }, i * 40)
    })
  }

  /**
   * Card flip sound
   */
  cardFlip() {
    this.playTone(700, 0.06, 'triangle')
  }

  /**
   * Drawer open sound
   */
  drawerOpen() {
    if (!this.canPlay()) return
    this.resume()

    const oscillator = this.context.createOscillator()
    const gainNode = this.context.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.context.destination)

    oscillator.frequency.setValueAtTime(200, this.context.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(
      400,
      this.context.currentTime + 0.2
    )
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(this.volume * 0.4, this.context.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.context.currentTime + 0.2
    )

    oscillator.start(this.context.currentTime)
    oscillator.stop(this.context.currentTime + 0.2)
  }

  /**
   * Drawer close sound
   */
  drawerClose() {
    if (!this.canPlay()) return
    this.resume()

    const oscillator = this.context.createOscillator()
    const gainNode = this.context.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.context.destination)

    oscillator.frequency.setValueAtTime(400, this.context.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(
      200,
      this.context.currentTime + 0.2
    )
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(this.volume * 0.4, this.context.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.context.currentTime + 0.2
    )

    oscillator.start(this.context.currentTime)
    oscillator.stop(this.context.currentTime + 0.2)
  }

  /**
   * Thinking sound (pulsing)
   */
  thinking() {
    this.playTone(440, 0.1, 'sine')
  }

  /**
   * Reveal sound (dramatic)
   */
  reveal() {
    if (!this.canPlay()) return
    this.resume()

    const notes = [261.63, 329.63, 392, 523.25] // C, E, G, C
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.15, 'triangle')
      }, i * 100)
    })
  }

  /**
   * Celebration sound (fanfare)
   */
  celebration() {
    if (!this.canPlay()) return
    this.resume()

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51] // C, E, G, C, E
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.2, 'triangle')
      }, i * 80)
    })
  }

  /**
   * Selection sound
   */
  select() {
    this.playTone(900, 0.05, 'sine')
  }

  /**
   * Deselect sound
   */
  deselect() {
    this.playTone(500, 0.05, 'sine')
  }
}

// Export singleton instance
export const sounds = new SoundEffects()

// Export class for custom instances
export default SoundEffects
