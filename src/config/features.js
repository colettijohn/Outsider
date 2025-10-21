/**
 * Feature Flag System
 * 
 * This system allows us to safely develop and test new features
 * without affecting the current production experience.
 * 
 * Toggle features on/off here to control what users see.
 */

export const FEATURES = {
  // Main toggle - switches entire customize screen
  // When false, uses existing CustomizeGameScreen.jsx
  // When true, uses new Oracle-based experience
  NEW_CUSTOMIZE_SCREEN: false,
  
  // Sub-features (only work if NEW_CUSTOMIZE_SCREEN is true)
  
  // AI-powered recommendations in Quick Ritual
  ORACLE_AI: false,
  
  // Card-based individual question browser
  CARD_SYSTEM: false,
  
  // Fast 3-question setup flow
  QUICK_RITUAL: false,
  
  // Text-to-speech for Oracle with mystical voice
  VOICE_OF_ORACLE: false,
  
  // Mobile gesture controls (swipe, shake, long-press)
  GESTURE_CONTROLS: false,
  
  // Popular presets, trending decks, social features
  SOCIAL_FEATURES: false,
  
  // Progression levels, achievements, stats
  GAMIFICATION: false,
  
  // Preview theater - simulate game rounds
  PREVIEW_THEATER: false,
  
  // Advanced particle effects and animations
  ENHANCED_PARTICLES: false,
  
  // Sound effects and ambient audio
  SOUND_EFFECTS: false
}

/**
 * Check if a feature is enabled
 * @param {string} featureName - Name of the feature to check
 * @returns {boolean} - Whether the feature is enabled
 */
export const isFeatureEnabled = (featureName) => {
  // NEW_CUSTOMIZE_SCREEN is the master switch
  if (featureName === 'NEW_CUSTOMIZE_SCREEN') {
    return FEATURES.NEW_CUSTOMIZE_SCREEN
  }
  
  // All other features require NEW_CUSTOMIZE_SCREEN to be true
  if (!FEATURES.NEW_CUSTOMIZE_SCREEN) {
    return false
  }
  
  return FEATURES[featureName] || false
}

/**
 * Get all currently enabled features
 * @returns {string[]} - Array of enabled feature names
 */
export const getEnabledFeatures = () => {
  if (!FEATURES.NEW_CUSTOMIZE_SCREEN) {
    return []
  }
  
  return Object.keys(FEATURES).filter(key => isFeatureEnabled(key))
}

/**
 * Enable a feature (useful for debugging)
 * @param {string} featureName - Feature to enable
 */
export const enableFeature = (featureName) => {
  FEATURES[featureName] = true
  console.log(`✅ Feature enabled: ${featureName}`)
}

/**
 * Disable a feature (useful for debugging)
 * @param {string} featureName - Feature to disable
 */
export const disableFeature = (featureName) => {
  FEATURES[featureName] = false
  console.log(`❌ Feature disabled: ${featureName}`)
}

/**
 * Enable all features (useful for testing)
 */
export const enableAllFeatures = () => {
  Object.keys(FEATURES).forEach(key => {
    FEATURES[key] = true
  })
  console.log('✨ All features enabled!')
}

/**
 * Disable all features (safe mode)
 */
export const disableAllFeatures = () => {
  Object.keys(FEATURES).forEach(key => {
    FEATURES[key] = false
  })
  console.log('🛡️ All features disabled (safe mode)')
}

/**
 * Get feature status report (useful for debugging)
 * @returns {Object} - Status of all features
 */
export const getFeatureStatus = () => {
  const status = {}
  Object.keys(FEATURES).forEach(key => {
    status[key] = {
      configValue: FEATURES[key],
      actuallyEnabled: isFeatureEnabled(key),
      requiresMasterSwitch: key !== 'NEW_CUSTOMIZE_SCREEN'
    }
  })
  return status
}

/**
 * A/B Testing Helper
 * Randomly enable feature for percentage of users
 * @param {string} featureName - Feature to test
 * @param {number} percentage - Percentage of users (0-100)
 * @returns {boolean} - Whether feature should be enabled for this session
 */
export const abTest = (featureName, percentage = 50) => {
  if (!FEATURES.NEW_CUSTOMIZE_SCREEN) return false
  
  // Use consistent random seed per session
  const sessionId = sessionStorage.getItem('ab_test_id') || 
    Math.random().toString(36).substring(7)
  
  if (!sessionStorage.getItem('ab_test_id')) {
    sessionStorage.setItem('ab_test_id', sessionId)
  }
  
  // Simple hash to get consistent value
  let hash = 0
  const str = sessionId + featureName
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  
  const userValue = Math.abs(hash % 100)
  return userValue < percentage
}

// Export default for convenience
export default {
  FEATURES,
  isFeatureEnabled,
  getEnabledFeatures,
  enableFeature,
  disableFeature,
  enableAllFeatures,
  disableAllFeatures,
  getFeatureStatus,
  abTest
}
