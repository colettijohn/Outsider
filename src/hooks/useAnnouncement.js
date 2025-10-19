import { useEffect, useRef } from 'react'

/**
 * useAnnouncement - Custom hook for screen reader announcements
 * Creates a live region for accessibility announcements
 * @param {string} message - Message to announce
 * @param {string} politeness - 'polite' or 'assertive'
 */
export const useAnnouncement = (message, politeness = 'polite') => {
  const announcementRef = useRef(null)

  useEffect(() => {
    // Create announcement element if it doesn't exist
    if (!announcementRef.current) {
      announcementRef.current = document.createElement('div')
      announcementRef.current.setAttribute('role', 'status')
      announcementRef.current.setAttribute('aria-live', politeness)
      announcementRef.current.setAttribute('aria-atomic', 'true')
      announcementRef.current.className = 'sr-only'
      document.body.appendChild(announcementRef.current)
    }

    // Update message
    if (message) {
      announcementRef.current.textContent = message
    }

    // Cleanup
    return () => {
      if (announcementRef.current && !message) {
        document.body.removeChild(announcementRef.current)
        announcementRef.current = null
      }
    }
  }, [message, politeness])
}

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 * @param {string} politeness - 'polite' or 'assertive'
 */
export const announce = (message, politeness = 'polite') => {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', politeness)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

export default useAnnouncement
