/**
 * Server-side Input Sanitization Utilities
 * Prevents XSS attacks and validates user input
 */

/**
 * Sanitize text input to prevent XSS
 * @param {string} input - Raw user input
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} - Sanitized text
 */
export function sanitizeText(input, maxLength = 500) {
  if (typeof input !== 'string') return ''
  
  // Remove HTML tags and encode special characters
  let sanitized = input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
  
  // Trim and limit length
  sanitized = sanitized.trim().substring(0, maxLength)
  
  return sanitized
}

/**
 * Sanitize nickname
 * @param {string} nickname - Raw nickname input
 * @returns {string} - Sanitized nickname
 */
export function sanitizeNickname(nickname) {
  if (typeof nickname !== 'string') return ''
  
  // Allow only alphanumeric, spaces, and basic punctuation
  let sanitized = nickname
    .replace(/[^a-zA-Z0-9\s\-_]/g, '')
    .trim()
    .substring(0, 20)
  
  return sanitized || 'Entity'
}

/**
 * Validate room code format
 * @param {string} code - Room code to validate
 * @returns {boolean} - True if valid
 */
export function isValidRoomCode(code) {
  if (typeof code !== 'string') return false
  
  // Must be exactly 4 characters, alphanumeric
  return /^[A-Z0-9]{4}$/.test(code.toUpperCase())
}

/**
 * Sanitize chat message
 * @param {string} message - Raw message
 * @returns {string} - Sanitized message
 */
export function sanitizeChatMessage(message) {
  return sanitizeText(message, 300)
}

/**
 * Sanitize answer/decree response
 * @param {string} answer - Raw answer
 * @returns {string} - Sanitized answer
 */
export function sanitizeAnswer(answer) {
  return sanitizeText(answer, 500)
}
