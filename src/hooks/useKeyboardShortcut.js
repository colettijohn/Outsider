import { useEffect } from 'react'

/**
 * useKeyboardShortcut - Custom hook for handling keyboard shortcuts
 * @param {string|string[]} keys - Key or array of keys to listen for
 * @param {function} callback - Function to call when key is pressed
 * @param {Object} options - Configuration options
 */
export const useKeyboardShortcut = (keys, callback, options = {}) => {
  const {
    ctrlKey = false,
    shiftKey = false,
    altKey = false,
    preventDefault = true,
    enabled = true,
    ignoreInputs = true
  } = options

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event) => {
      // Ignore if typing in input/textarea (unless explicitly allowed)
      if (ignoreInputs) {
        const target = event.target
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        ) {
          return
        }
      }

      // Check modifier keys
      if (ctrlKey && !event.ctrlKey) return
      if (shiftKey && !event.shiftKey) return
      if (altKey && !event.altKey) return

      // Normalize keys to array
      const keysArray = Array.isArray(keys) ? keys : [keys]
      
      // Check if pressed key matches any target keys (case-insensitive)
      const keyPressed = event.key.toLowerCase()
      const matches = keysArray.some(k => k.toLowerCase() === keyPressed)

      if (matches) {
        if (preventDefault) {
          event.preventDefault()
        }
        callback(event)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [keys, callback, ctrlKey, shiftKey, altKey, preventDefault, enabled, ignoreInputs])
}

export default useKeyboardShortcut
