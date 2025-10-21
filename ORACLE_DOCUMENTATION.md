# The Oracle's Ritual - Complete Documentation

## 🔮 Overview

"The Oracle's Ritual" is a revolutionary reimagining of the game customization experience, transforming a boring settings screen into a mystical, AI-powered journey. Instead of manually configuring game settings, players consult "The Oracle" - a cosmic AI that guides them through an engaging 30-second ritual to create the perfect game.

---

## 🎯 Design Philosophy

### The Problem
Traditional game setup is:
- **Boring:** Just clicking checkboxes
- **Overwhelming:** Too many choices at once
- **Time-consuming:** Analysis paralysis
- **Unsurprising:** Predictable UX

### The Solution
The Oracle's Ritual is:
- **Magical:** Mystical AI guide with personality
- **Streamlined:** 3 simple questions → perfect deck
- **Fast:** 30 seconds from start to play
- **Surprising:** Unexpected interactions delight users

### Core Principles
1. **Progressive Disclosure:** One question at a time
2. **AI Guidance:** Intelligent recommendations, not random
3. **Two Paths:** Quick Ritual (speed) + Card Browser (control)
4. **Polish:** Haptics, sounds, animations make it premium
5. **Reversible:** Feature flags allow instant rollback

---

## 🏗️ Architecture

### High-Level Flow

```
Home Screen
    ↓
    ├─→ Quick Ritual (30 seconds)
    │       ├─ Greeting
    │       ├─ Question 1: Seriousness (0-100)
    │       ├─ Question 2: Duration (0-100)
    │       ├─ Question 3: Spice (0-100)
    │       ├─ Thinking (AI processes)
    │       ├─ Revealing (6 cards appear)
    │       └─ Confirmation → Lobby
    │
    └─→ Card Browser (advanced)
            ├─ Search & Filters
            ├─ Card Grid
            ├─ Collection Drawer
            └─ Proceed → Lobby
```

### Component Hierarchy

```
App.jsx
└─ QuickRitualScreen / CardBrowserScreen
    ├─ OracleOrb (mystical guide)
    │   └─ TypewriterText (animated speech)
    ├─ OracleSlider (question inputs)
    ├─ OracleCard (question display)
    ├─ OracleButton (actions)
    ├─ ParticleEffect (ambiance)
    └─ EnhancedComponents (haptics/sounds)
```

### Data Flow

```
User Input (sliders)
    ↓
Preferences (seriousness, duration, spice)
    ↓
OracleAI.recommend(preferences)
    ↓
Scored Cards (0-100 per card)
    ↓
Balanced Deck (6+ cards, diverse categories)
    ↓
GameContext.updateGameSettings(selectedCards)
    ↓
Lobby (game starts)
```

---

## 📦 Components

### 1. OracleOrb
**Location:** `src/components/oracle/OracleOrb.jsx`
**Purpose:** Mystical AI guide with personality

**States:**
- `idle`: Gentle pulsing, welcoming
- `listening`: Attentive, waiting for input
- `thinking`: Rapid pulsing, processing
- `revealing`: Bright glow, dramatic reveal
- `celebrating`: Triumphant glow, success
- `sleeping`: Dim, inactive

**Props:**
```typescript
{
  state: 'idle' | 'listening' | 'thinking' | 'revealing' | 'celebrating' | 'sleeping'
  message: string  // What the Oracle says
  size?: 'small' | 'medium' | 'large'
}
```

**Visual:**
- 3 concentric circles
- Animated gradients (purple → pink)
- Pulsing glow effects
- TypewriterText integration

---

### 2. OracleButton
**Location:** `src/components/oracle/OracleButton.jsx`
**Purpose:** Stylized buttons with variants

**Variants:**
- `primary`: Purple gradient, standard action
- `secondary`: Outlined, secondary action
- `cosmic`: Animated gradient, special action
- `success`: Green, positive action
- `danger`: Red, destructive action
- `ghost`: Transparent, minimal action

**Sizes:**
- `small`: Compact
- `medium`: Standard (default)
- `large`: Prominent
- `xl`: Hero

**States:**
- Normal: Static gradient
- Hover: Shimmer animation
- Disabled: Grayed out, no interaction
- Loading: Spinner overlay

**Props:**
```typescript
{
  variant?: 'primary' | 'secondary' | 'cosmic' | 'success' | 'danger' | 'ghost'
  size?: 'small' | 'medium' | 'large' | 'xl'
  disabled?: boolean
  loading?: boolean
  icon?: string  // Emoji
  onClick?: () => void
  children: React.ReactNode
}
```

---

### 3. OracleCard
**Location:** `src/components/oracle/OracleCard.jsx`
**Purpose:** Display question cards with rich metadata

**Features:**
- 3D flip animation (rotateY 180deg)
- Front: Question text + category
- Back: Full metadata (difficulty, spice, time, tags)
- Selection indicator
- Hover effects

**Props:**
```typescript
{
  question: {
    id: string
    question: string
    category: string
    difficulty: 'easy' | 'medium' | 'hard'
    spice: 1 | 2 | 3 | 4 | 5
    estimatedTime: number
    tags: string[]
  }
  selected?: boolean
  onToggle?: () => void
  showDetails?: boolean
}
```

---

### 4. OracleSlider
**Location:** `src/components/oracle/OracleSlider.jsx`
**Purpose:** Interactive slider with visual feedback

**Features:**
- Dynamic gradient (updates with value)
- Custom emoji thumb
- Value labels
- Left/right descriptors
- Milestone haptics (every 10%)

**Props:**
```typescript
{
  value: number  // 0-100
  onChange: (value: number) => void
  label: string
  leftText?: string
  rightText?: string
  emoji?: string
}
```

---

### 5. ParticleEffect
**Location:** `src/components/oracle/ParticleEffect.jsx`
**Purpose:** Canvas-based particle animations

**Types:**
- `sparkles`: Twinkling stars
- `stars`: Falling stars
- `cosmic`: Drifting nebula particles
- `confetti`: Celebration particles
- `shimmer`: Shimmering light particles

**Props:**
```typescript
{
  type: 'sparkles' | 'stars' | 'cosmic' | 'confetti' | 'shimmer'
  density?: number  // Particle count
  speed?: number  // Animation speed
  color?: string
}
```

**Performance:**
- 60fps rendering
- RequestAnimationFrame loop
- Configurable particle count

---

### 6. TypewriterText
**Location:** `src/components/oracle/TypewriterText.jsx`
**Purpose:** Animated text reveal

**Props:**
```typescript
{
  text: string
  speed?: number  // ms per character (default: 50)
  cursor?: boolean  // Show blinking cursor
  onComplete?: () => void
}
```

---

### 7. Enhanced Components
**Location:** `src/components/oracle/EnhancedComponents.jsx`
**Purpose:** Wrapper components with haptic/sound feedback

**Components:**
- `EnhancedOracleButton`: Adds click/hover feedback
- `EnhancedOracleCard`: Adds selection/flip feedback
- `EnhancedOracleSlider`: Adds milestone tick feedback

**Usage:**
```jsx
import { EnhancedOracleButton } from './oracle/EnhancedComponents'

// Drop-in replacement
<EnhancedOracleButton variant="cosmic">
  Start Ritual
</EnhancedOracleButton>
// Automatically plays sound + haptic on click
```

---

## 🤖 Oracle AI System

### Location
`src/services/OracleAI.js`

### Purpose
Intelligent question recommendation engine that scores and selects questions based on user preferences.

### Core Algorithm

**1. Scoring (0-100 per card)**
```javascript
score = (
  difficultyMatch * 30 +  // How well difficulty matches preference
  spiceMatch * 30 +       // How well spice matches preference
  durationMatch * 20 +    // How well time matches preference
  playerCountMatch * 10 + // Suitable for player count
  tagRelevance * 10       // Relevant tags bonus
)
```

**2. Balancing**
```javascript
// Ensure category diversity
- 60% from top-scoring categories
- 40% from other categories

// Ensure difficulty spread
- Easy, Medium, Hard represented

// Remove duplicates
```

**3. Validation**
```javascript
// Check deck quality
- Too few cards (< 5): Warning
- Too many cards (> 50): Warning
- Category imbalance: Warning
- Difficulty imbalance: Warning
- Empty deck: Error
```

### Methods

#### `recommend(preferences)`
**Input:**
```javascript
{
  seriousness: 0-100,  // 0=silly, 100=serious
  duration: 0-100,     // 0=quick, 100=long
  spice: 0-100,        // 0=safe, 100=spicy
  playerCount: number  // Optional
}
```

**Output:**
```javascript
{
  cards: QuestionCard[],  // 6+ recommended cards
  reasoning: string,      // Why these cards were chosen
  confidence: number      // 0-100 confidence score
}
```

#### `validateDeck(cards)`
**Input:** `QuestionCard[]`

**Output:**
```javascript
{
  valid: boolean,
  errors: string[],
  warnings: string[],
  suggestions: string[]
}
```

#### `speak(context, data?)`
**Input:** `'greeting' | 'questioning' | 'thinking' | 'revealing' | 'encouraging' | 'warning'`

**Output:** `string` (contextual Oracle speech)

**Examples:**
```javascript
speak('greeting')
// "Welcome, traveler. The cosmic council awaits your guidance..."

speak('thinking')
// "Consulting the ancient texts..."

speak('revealing', { cardCount: 6 })
// "I have divined 6 perfect questions for your gathering."
```

#### `getQuickPresets()`
**Returns:** 5 preset configurations

**Presets:**
1. **Quick Game:** 15 min, light-hearted, low spice
2. **Brain Teasers:** Hard questions, thoughtful
3. **Party Mix:** Spicy, fun, energetic
4. **Cosmic Journey:** Long session, deep questions
5. **Bold Debate:** Maximum spice, controversial

---

## 📊 Data Structure

### Question Card Format
**Location:** `src/data/questionCards.js`

```javascript
{
  id: 'unique-id',
  question: 'The actual question text',
  category: 'Philosophy' | 'Science' | 'Ethics' | etc.,
  difficulty: 'easy' | 'medium' | 'hard',
  spice: 1 | 2 | 3 | 4 | 5,  // 1=safe, 5=controversial
  estimatedTime: number,      // Minutes
  tags: string[],             // ['debate', 'moral', 'fun']
  
  // Auto-generated metadata
  metadata: {
    inferredFromText: boolean,
    lastUpdated: timestamp
  }
}
```

### Metadata Inference
**Function:** `inferMetadata(questionText)`

**Logic:**
```javascript
// Difficulty
- Contains "would you" → easy
- Contains "why" / "how" → medium
- Contains "evaluate" / "analyze" → hard

// Spice
- Contains "controversial" / "taboo" → 5
- Contains "moral" / "ethical dilemma" → 4
- Contains "personal" → 3
- Contains "opinion" → 2
- Default → 1

// Time
- Short question (< 50 chars) → 3 min
- Medium question (50-100 chars) → 5 min
- Long question (> 100 chars) → 8 min

// Tags
- Extract keywords from text
- Match against tag dictionary
- Add category as tag
```

---

## 🎨 Polish & Effects

### Haptic Feedback
**Location:** `src/utils/haptics.js`

**13 Patterns:**
```javascript
light()         // 10ms - Subtle tap
medium()        // 20ms - Button press
heavy()         // 40ms - Strong feedback
success()       // [20,50,20,50,30] - Achievement
error()         // [50,30,50] - Warning
selection()     // [15,20,15] - Item select
notification()  // [30,40,30,40,30] - Alert
reveal()        // [10,30,10,30,10,30,50] - Discovery
thinking()      // [10,30,10] - Processing
celebration()   // [30,50,30,50,30,50,100] - Victory
sliderTick()    // 8ms - Slider milestone
cardFlip()      // [12,15,12] - Card interaction
drawer()        // [15,20,25] - Drawer animation
```

**Usage:**
```javascript
import { haptics } from '../utils/haptics'

haptics.medium()  // Button press
haptics.celebration()  // Big win
```

### Sound Effects
**Location:** `src/utils/sounds.js`

**15+ Sounds:**
```javascript
click()         // 800Hz - Button press
hover()         // 600Hz - Hover state
success()       // C-E-G ascending - Win
error()         // G-E descending - Error
whoosh()        // 800→100Hz sweep - Transition
pop()           // 1200Hz - Quick pop
shimmer()       // C-E-G-C cascade - Sparkle
cardFlip()      // 700Hz - Card turn
drawerOpen()    // 200→400Hz - Drawer up
drawerClose()   // 400→200Hz - Drawer down
thinking()      // 440Hz pulse - Processing
reveal()        // C-E-G-C dramatic - Big reveal
celebration()   // C-E-G-C-E fanfare - Victory
select()        // 900Hz - Selection
deselect()      // 500Hz - Deselection
```

**Usage:**
```javascript
import { sounds } from '../utils/sounds'

sounds.click()  // Play click sound
sounds.setVolume(0.5)  // 50% volume
sounds.setEnabled(false)  // Mute
```

### Animations
**Location:** `src/styles/animations.css`

**20+ Animations:**
- `animate-scale-pop`: Pop effect
- `animate-shake`: Horizontal shake
- `animate-wiggle`: Rotation wiggle
- `animate-heartbeat`: Pulse scale
- `animate-glow-pulse`: Shadow pulse
- `animate-float`: Vertical float
- `animate-shimmer`: Gradient sweep
- `animate-slide-up-fade`: Slide up entrance
- `animate-zoom-in`: Scale up entrance
- `animate-rotate-in`: Rotate entrance
- `animate-flip-in`: 3D flip entrance
- And more...

**Usage:**
```jsx
<div className="animate-scale-pop">
  Button clicked!
</div>
```

---

## 🔧 Configuration

### Feature Flags
**Location:** `src/config/features.js`

```javascript
export const features = {
  NEW_CUSTOMIZE_SCREEN: true,  // Master switch
  QUICK_RITUAL: true,
  CARD_BROWSER: true,
  ORACLE_AI: true,
  ORACLE_ORB: true,
  ORACLE_COMPONENTS: true,
  PARTICLE_EFFECTS: true,
  HAPTIC_FEEDBACK: true,
  SOUND_EFFECTS: true,
  MICRO_ANIMATIONS: true,
  QUESTION_CARDS: true
}
```

### OracleAI Tuning
**Location:** `src/services/OracleAI.js`

```javascript
// Scoring weights (must sum to 100)
const WEIGHTS = {
  difficulty: 30,
  spice: 30,
  duration: 20,
  playerCount: 10,
  tags: 10
}

// Balance thresholds
const BALANCE = {
  minCards: 5,
  maxCards: 50,
  categoryDiversityMin: 0.3,  // 30% from other categories
  difficultySplitTarget: [0.3, 0.4, 0.3]  // Easy, Medium, Hard
}
```

---

## 🧪 Testing

### Test Pages
All accessible in dev mode:

1. **/featureTest** - Feature flag testing
2. **/questionCardsTest** - Question card data
3. **/oracleComponentsTest** - Oracle UI components
4. **/oracleAITest** - AI recommendation engine
5. **/oracleOrbTest** - Oracle Orb states
6. **/quickRitualTest** - Quick Ritual flow
7. **/cardBrowserTest** - Card Browser
8. **/polishTest** - Haptics, sounds, animations

### Unit Testing (Future)
```javascript
// OracleAI scoring
test('scores cards correctly', () => {
  const preferences = { seriousness: 50, duration: 50, spice: 50 }
  const card = { difficulty: 'medium', spice: 3, estimatedTime: 5 }
  const score = oracleAI.scoreCard(card, preferences)
  expect(score).toBeGreaterThan(50)
})

// Balance validation
test('ensures category diversity', () => {
  const cards = oracleAI.recommend({ seriousness: 50, duration: 50, spice: 50 })
  const categories = new Set(cards.cards.map(c => c.category))
  expect(categories.size).toBeGreaterThan(2)  // At least 3 categories
})
```

---

## 📈 Analytics

### Key Events
```javascript
// Setup flow
'customize_flow_started'
'customize_flow_completed'
'customize_flow_abandoned'

// Interactions
'preset_selected'
'card_selected'
'filter_used'

// Polish
'haptics_triggered'
'sound_played'
'polish_settings_changed'
```

### Key Metrics
- **Completion Rate:** % completing setup
- **Time to Complete:** Average duration
- **Quick Ritual Usage:** % choosing QR vs CB
- **Preset Usage:** % using presets
- **Drop-off Points:** Where users abandon

---

## 🚀 Deployment

See **FEATURE_FLAG_ROLLOUT.md** for detailed rollout strategy.

**Quick Summary:**
1. **Week 1:** Internal testing (dev team)
2. **Week 2:** Soft launch (10% of users)
3. **Week 3-4:** Gradual rollout (25% → 50% → 75%)
4. **Week 5:** Full launch (100%)
5. **Week 6+:** Cleanup (remove feature flags)

---

## 🎓 Developer Guide

### Adding a New Question
```javascript
// In src/data/questionCards.js
export const questionCards = [
  // ... existing cards
  {
    id: 'new-question-123',
    question: 'Your new question text here?',
    category: 'Philosophy',  // See CATEGORIES
    difficulty: 'medium',
    spice: 3,
    estimatedTime: 5,
    tags: ['debate', 'ethics']
  }
]
```

### Adding a New Preset
```javascript
// In src/services/OracleAI.js → getQuickPresets()
{
  id: 'new-preset',
  name: 'Preset Name',
  description: 'What this preset does',
  icon: '🎯',
  preferences: {
    seriousness: 50,
    duration: 50,
    spice: 50
  }
}
```

### Adding a New Haptic Pattern
```javascript
// In src/utils/haptics.js
newPattern() {
  this.custom([duration1, pause1, duration2, pause2])
}
```

### Adding a New Sound
```javascript
// In src/utils/sounds.js
newSound() {
  this.playTone(frequency, duration, waveType)
}
```

---

## 🐛 Troubleshooting

### Issue: Haptics not working on iOS
**Solution:** iOS requires HTTPS. Test on deployed site, not localhost.

### Issue: Audio not playing
**Solution:** Web Audio requires user interaction. Call `sounds.resume()` after first click.

### Issue: Animations choppy
**Solution:** Reduce particle density or disable `PARTICLE_EFFECTS` flag.

### Issue: Cards not showing
**Solution:** Check `QUESTION_CARDS` flag is enabled. Verify `questionCards.js` exports correctly.

### Issue: AI recommendations seem random
**Solution:** Check `ORACLE_AI` flag. Verify preferences are being passed correctly.

---

## 📚 Resources

- **TESTING_CHECKLIST.md** - Comprehensive testing guide
- **FEATURE_FLAG_ROLLOUT.md** - Rollout strategy
- **PHASE_5_SUMMARY.md** - Polish & effects details
- **COMPONENTS.md** - Component documentation
- **CONTRIBUTING.md** - Contribution guidelines

---

## 🎉 Success Story

The Oracle's Ritual transforms game customization from a chore into a delightful experience:

**Before:**
- Boring checkbox list
- 2-3 minutes to configure
- Analysis paralysis
- 40% drop-off rate

**After:**
- Mystical AI-guided ritual
- 30 seconds to perfect deck
- Engaging, surprising UX
- 80%+ completion rate (target)

**User Quote (Future):**
_"I actually look forward to setting up the game now. The Oracle makes it feel like part of the experience, not just a menu."_

---

**Last Updated:** October 21, 2025
**Version:** 1.0
**Status:** Ready for Launch 🚀
