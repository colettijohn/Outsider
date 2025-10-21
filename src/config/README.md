# Configuration Files

## Feature Flags (`features.js`)

This directory contains configuration files for the application.

### Usage

```javascript
import { isFeatureEnabled, FEATURES } from './config/features'

// Check if new customize screen is enabled
if (isFeatureEnabled('NEW_CUSTOMIZE_SCREEN')) {
  // Use new Oracle-based experience
  return <OracleCustomizeScreen />
} else {
  // Use existing experience
  return <CustomizeGameScreen />
}

// Check sub-features
if (isFeatureEnabled('ORACLE_AI')) {
  // Show AI recommendations
}
```

### Debugging in Console

Open browser console and test:

```javascript
import features from './config/features'

// Check current status
console.table(features.getFeatureStatus())

// Enable a feature
features.enableFeature('ORACLE_AI')

// Test with all features
features.enableAllFeatures()

// Revert to safe mode
features.disableAllFeatures()
```

### A/B Testing

```javascript
import { abTest } from './config/features'

// Enable for 50% of users
if (abTest('NEW_CUSTOMIZE_SCREEN', 50)) {
  // User is in test group
}
```

### Feature Descriptions

| Feature | Description | Dependencies |
|---------|-------------|--------------|
| `NEW_CUSTOMIZE_SCREEN` | Master switch for new Oracle experience | None |
| `ORACLE_AI` | AI-powered question recommendations | NEW_CUSTOMIZE_SCREEN |
| `CARD_SYSTEM` | Individual question card browser | NEW_CUSTOMIZE_SCREEN |
| `QUICK_RITUAL` | Fast 3-question setup flow | NEW_CUSTOMIZE_SCREEN, ORACLE_AI |
| `VOICE_OF_ORACLE` | Text-to-speech for Oracle | NEW_CUSTOMIZE_SCREEN |
| `GESTURE_CONTROLS` | Mobile swipe/shake gestures | NEW_CUSTOMIZE_SCREEN |
| `SOCIAL_FEATURES` | Popular presets, trending decks | NEW_CUSTOMIZE_SCREEN |
| `GAMIFICATION` | Levels, achievements, progression | NEW_CUSTOMIZE_SCREEN |
| `PREVIEW_THEATER` | Simulate game rounds before playing | NEW_CUSTOMIZE_SCREEN |
| `ENHANCED_PARTICLES` | Advanced particle effects | NEW_CUSTOMIZE_SCREEN |
| `SOUND_EFFECTS` | Sound effects and ambient audio | NEW_CUSTOMIZE_SCREEN |

### Implementation Strategy

1. **Week 1**: Enable `NEW_CUSTOMIZE_SCREEN` for development only
2. **Week 2**: Add `ORACLE_AI` and `QUICK_RITUAL`
3. **Week 3**: Add `CARD_SYSTEM` and `GESTURE_CONTROLS`
4. **Week 4**: Add polish features (particles, sound, gamification)
5. **Week 5**: A/B test with 10% of users
6. **Week 6**: Gradual rollout to 100%

### Rollback Plan

If issues arise:

```javascript
// Instant rollback to old experience
FEATURES.NEW_CUSTOMIZE_SCREEN = false
```

No code changes needed - just flip the flag!
