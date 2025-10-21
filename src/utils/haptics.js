/**
 * Enhanced Haptic Feedback System
 * 
 * Provides rich haptic patterns for different interaction types.
 * Gracefully degrades on devices without vibration support.
 */

export class HapticFeedback {
  constructor() {
    this.isSupported = 'vibrate' in navigator
    this.isEnabled = true // Can be toggled in settings
  }

  /**
   * Check if haptics are available and enabled
   */
  canVibrate() {
    return this.isSupported && this.isEnabled
  }

  /**
   * Enable/disable haptics
   */
  setEnabled(enabled) {
    this.isEnabled = enabled
  }

  /**
   * Light tap - for hover, focus, small actions
   */
  light() {
    if (!this.canVibrate()) return
    navigator.vibrate(10)
  }

  /**
   * Medium tap - for button presses, selections
   */
  medium() {
    if (!this.canVibrate()) return
    navigator.vibrate(20)
  }

  /**
   * Heavy tap - for confirmations, completions
   */
  heavy() {
    if (!this.canVibrate()) return
    navigator.vibrate(40)
  }

  /**
   * Success pattern - for achievements, validations
   */
  success() {
    if (!this.canVibrate()) return
    navigator.vibrate([20, 50, 20, 50, 30])
  }

  /**
   * Error pattern - for warnings, failures
   */
  error() {
    if (!this.canVibrate()) return
    navigator.vibrate([50, 30, 50])
  }

  /**
   * Selection pattern - for picking items
   */
  selection() {
    if (!this.canVibrate()) return
    navigator.vibrate([15, 20, 15])
  }

  /**
   * Notification pattern - for alerts, messages
   */
  notification() {
    if (!this.canVibrate()) return
    navigator.vibrate([30, 40, 30, 40, 30])
  }

  /**
   * Reveal pattern - for dramatic moments
   */
  reveal() {
    if (!this.canVibrate()) return
    navigator.vibrate([10, 30, 10, 30, 10, 30, 50])
  }

  /**
   * Thinking pattern - for processing states
   */
  thinking() {
    if (!this.canVibrate()) return
    navigator.vibrate([10, 30, 10])
  }

  /**
   * Celebration pattern - for wins, completions
   */
  celebration() {
    if (!this.canVibrate()) return
    navigator.vibrate([30, 50, 30, 50, 30, 50, 100])
  }

  /**
   * Slider tick - for slider milestones
   */
  sliderTick() {
    if (!this.canVibrate()) return
    navigator.vibrate(8)
  }

  /**
   * Card flip - for card interactions
   */
  cardFlip() {
    if (!this.canVibrate()) return
    navigator.vibrate([12, 15, 12])
  }

  /**
   * Drawer open/close - for panel animations
   */
  drawer() {
    if (!this.canVibrate()) return
    navigator.vibrate([15, 20, 25])
  }

  /**
   * Custom pattern
   */
  custom(pattern) {
    if (!this.canVibrate()) return
    if (Array.isArray(pattern)) {
      navigator.vibrate(pattern)
    } else {
      navigator.vibrate(pattern)
    }
  }
}

// Export singleton instance
export const haptics = new HapticFeedback()

// Export class for custom instances
export default HapticFeedback
