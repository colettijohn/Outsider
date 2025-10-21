# 🧪 Development Test Pages

## Accessing Test Pages

While developing the new Oracle-based Customize Game screen, you can access these test pages to verify components and data structures.

### How to Access

Test pages are accessible by modifying the game state in the browser console:

#### 1. Feature Flag Test Page

```javascript
// In browser console:
window.gameContext.setGameState({ ...window.gameContext.gameState, screen: 'featureTest' })
```

**What it does:**
- Toggle feature flags on/off
- Run automated tests
- View current configuration
- Debug feature system

**Features:**
- Visual toggle buttons
- Real-time status display
- Console debugging tools
- Test runner

---

#### 2. Question Cards Test Page

```javascript
// In browser console:
window.gameContext.setGameState({ ...window.gameContext.gameState, screen: 'questionCardsTest' })
```

**What it does:**
- View question card statistics
- Test search and filtering
- Verify metadata inference
- Test utility functions
- Check backwards compatibility

**Features:**
- Category breakdown
- Difficulty distribution
- Spice level analysis
- Live search
- Filter by category/difficulty/spice
- Random card viewer
- Console logging utilities

---

## Quick Start

1. Start the development server:
```bash
npm run dev
```

2. Open browser console (F12)

3. Access game context:
```javascript
// First, make gameContext available globally (add this to GameContext.jsx):
window.gameContext = gameContext
```

4. Navigate to test pages using the commands above

---

## What's Been Built So Far

### ✅ Phase 1.1: Feature Flag System
**Files:**
- `src/config/features.js` - Feature toggle system
- `src/config/README.md` - Documentation
- `src/components/FeatureFlagTest.jsx` - Test UI

**Status:** Complete and tested

**How to use:**
```javascript
import { isFeatureEnabled, FEATURES } from './config/features'

if (isFeatureEnabled('NEW_CUSTOMIZE_SCREEN')) {
  // Use new experience
}
```

---

### ✅ Phase 1.2: Question Cards Data Structure
**Files:**
- `src/data/questionCards.js` - Card format with metadata
- `src/components/QuestionCardsTest.jsx` - Test UI

**Status:** Complete and tested

**Features:**
- ✅ All 60 questions converted to card format
- ✅ Metadata inferred (difficulty, spice, time, tags)
- ✅ 12 categories with icons and colors
- ✅ Utility functions (search, filter, random)
- ✅ Backwards compatible

**How to use:**
```javascript
import { questionCards, searchCards, filterCards } from './data/questionCards'

// Get all cards
const cards = questionCards  // 60 cards

// Search
const results = searchCards('favorite')

// Filter
const filtered = filterCards({
  categories: ['Deep Thoughts'],
  difficulties: ['hard'],
  spiceRange: [4, 5]
})
```

---

## Statistics

Current question database:
- **Total Cards:** 60
- **Categories:** 12
- **Average Time:** 3 minutes per question
- **Difficulty:** 20 easy, 25 medium, 15 hard
- **Spice:** 30 mild, 20 medium, 10 spicy

---

## Next Steps

### 🚧 Phase 1.3: Shared UI Components (In Progress)
Building:
- OracleButton (touch-friendly, haptic feedback)
- OracleCard (3D flippable)
- OracleSlider (mystical range inputs)
- ParticleEffect (canvas animations)

### 📋 Phase 1.4: AI Recommendation Engine (Next)
Will build:
- Smart question selection algorithm
- Personality-driven explanations
- Deck validation
- Oracle's voice responses

---

## Console Debugging

### Feature Flags

```javascript
// View all features
window.features.getStatus()

// Enable a feature
window.features.enable('ORACLE_AI')

// Disable a feature
window.features.disable('ORACLE_AI')

// Get enabled features
window.features.getEnabled()
```

### Question Cards

```javascript
// In QuestionCardsTest page, these are logged to console:

// View all categories
console.log(getAllCategories())

// Get easy cards
console.log(getCardsByDifficulty('easy'))

// Get spicy cards (level 4-5)
console.log(getCardsBySpice(4, 5))

// Get 10 random cards
console.log(getRandomCards(10))

// Convert back to legacy format
console.log(convertCardsToLegacy(questionCards))

// View statistics
console.table(getQuestionStats())
```

---

## Return to Home

To return to the normal home screen:

```javascript
window.gameContext.resetToHome()
```

Or refresh the page.

---

## Adding More Test Pages

To add a new test page:

1. Create component in `src/components/YourTestPage.jsx`
2. Import in `App.jsx`
3. Add to `screens` object:
   ```javascript
   const screens = {
     // ...existing screens
     yourTestPage: <YourTestPage />
   }
   ```
4. Access via: `gameState.screen = 'yourTestPage'`

---

## Notes

- Test pages are only for development
- They won't be accessible in production (remove from build)
- Feature flags default to OFF (safe)
- All changes are backwards compatible
- No breaking changes to existing game

---

**Last Updated:** Phase 1.2 Complete
**Next Update:** Phase 1.3 (Shared UI Components)
