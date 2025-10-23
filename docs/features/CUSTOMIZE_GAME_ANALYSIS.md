# 🎮 Customize Game Screen - Component Analysis

## Overview

The **Customize Game Screen** (`CustomizeGameScreen.jsx`) is a sophisticated constellation-based question selector that allows the host to customize which questions (called "decrees") will be used in the game. It features a visually striking celestial/space theme with interactive constellation graphics.

---

## 🏗️ Architecture

### Component Structure

```
CustomizeGameScreen
├── Left Column: Celestial Atlas (Question Browser)
│   ├── Header with controls (Undo/Redo, Galactic Core, Meteor Shower)
│   ├── Quick Presets (4 preset buttons)
│   ├── Search Bar
│   └── Constellation Grid (Interactive question categories)
│
├── Right Column: Decree Manifest (Selected Categories)
│   ├── Progress Indicator (3+ required)
│   ├── Selected Categories List
│   ├── Win Condition Selector
│   ├── Preset Management (Save/Load)
│   ├── Advanced Settings Toggle
│   └── Confirm Button
│
└── Modals & Overlays
    ├── PresetModal (Save/Load presets)
    ├── RandomSelectionModal (Random selection)
    ├── MeteorShowerOverlay (Visual effect)
    ├── AdvancedSettingsPanel (Timers, custom questions)
    └── Question Preview Modal (Shows questions in category)
```

---

## 🎯 Core Functionality

### 1. **Question Categories (Constellations)**

The game has **12 question categories**, each represented as a constellation:

```javascript
const ATLAS_CATEGORIES = [
  "Deep Thoughts",          // Philosophical questions
  "Hypotheticals",          // "What if" scenarios
  "Wild Cards",             // Unpredictable/fun
  "Daily Routines",         // Everyday life
  "Objects & Places",       // Physical things/locations
  "History & Mythology",    // Historical/mythical topics
  "Science & Nature",       // Scientific concepts
  "Arts & Literature",      // Creative/cultural
  "Food & Drink",           // Culinary topics
  "Travel & Geography",     // Places and travel
  "Technology & Future",    // Tech and futurism
  "Personality & Psyche"    // Self-reflection
]
```

Each category contains multiple questions (decrees). Each question has:
- **Crew Question** - For regular players
- **Impostor Question** - For the Outsider (slightly different)

---

### 2. **State Management**

```javascript
// Core Selection State
const [selectedQuestions, setSelectedQuestions] = useState(() => new Set())
// Set of question IDs (q.crew) that are selected

// Undo/Redo System
const [undoStack, setUndoStack] = useState([])
const [redoStack, setRedoStack] = useState([])

// Game Configuration
const [gameSettings, setGameSettings] = useState({ 
  winCondition: 'score',  // 'score' or 'rounds'
  winValue: 5            // 5 points or 3 rounds
})

// UI State
const [activeCategory, setActiveCategory] = useState(null)
const [searchQuery, setSearchQuery] = useState('')
const [focusedIndex, setFocusedIndex] = useState(0)
const [previewCategory, setPreviewCategory] = useState(null)

// Presets
const [presets, setPresets] = useState({})  // Saved in localStorage

// Advanced Settings
const [advancedSettings, setAdvancedSettings] = useState({
  customTimers: { answer: 60, debate: 60, vote: 45 },
  customDecrees: []  // Custom questions added by host
})
```

---

## 🖱️ Interaction Patterns

### 1. **Constellation Selection**

**Click a constellation** → Toggle entire category on/off

```javascript
const handleConstellationClick = (catName) => {
  // Visual animation
  setActivatedCategory(catName)
  setTimeout(() => setActivatedCategory(null), 1200)
  
  // Save to undo stack
  setUndoStack(prev => [...prev, new Set(selectedQuestions)])
  setRedoStack([])
  
  // Toggle all questions in category
  const allCurrentlySelected = isCategorySelected(catName)
  const newSelected = new Set(selectedQuestions)
  
  if (allCurrentlySelected) {
    categoryQuestions.forEach(q => newSelected.delete(q))  // Remove
  } else {
    categoryQuestions.forEach(q => newSelected.add(q))     // Add
  }
  
  setSelectedQuestions(newSelected)
}
```

**Category is selected if ALL questions in it are selected:**

```javascript
const isCategorySelected = (catName) => {
  const categoryQuestions = questionCategories[catName]
  return categoryQuestions.every(q => selectedQuestions.has(q.crew))
}
```

---

### 2. **Keyboard Shortcuts**

| Shortcut | Action |
|----------|--------|
| **Arrow Keys** | Navigate constellations |
| **Space** | Toggle selected constellation |
| **Enter** | Preview constellation questions |
| **Ctrl+Z** | Undo last action |
| **Ctrl+Y** (or **Ctrl+Shift+Z**) | Redo action |
| **Esc** | Close modal/preview |

**Navigation Logic:**
```javascript
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.target.tagName === 'INPUT') return  // Don't interfere with typing
    
    switch(e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        setFocusedIndex(prev => (prev + 1) % availableCategories.length)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        setFocusedIndex(prev => (prev - 1 + availableCategories.length) % availableCategories.length)
        break
      case ' ':
        handleConstellationClick(availableCategories[focusedIndex])
        break
      case 'Enter':
        setPreviewCategory(availableCategories[focusedIndex])
        break
    }
  }
  // ...
}, [focusedIndex, availableCategories])
```

---

### 3. **Preview System**

**Three ways to preview a category:**

1. **Right-click** constellation → Opens preview modal
2. **Long-press** (mobile) → 500ms touch hold
3. **Hover** for 2 seconds → Shows tooltip

```javascript
// Right-click preview
onContextMenu={(e) => handlePreviewCategory(cat, e)}

// Long-press preview
onTouchStart={(e) => handleLongPressStart(cat, e)}
onTouchEnd={handleLongPressEnd}

// Hover tooltip
onMouseEnter={() => {
  hoverTimer.current = setTimeout(() => {
    setHoveredCategory(cat)
  }, 2000)
}}
```

**Preview Modal shows:**
- Category name
- Number of questions
- All question pairs (crew + impostor)
- Add/Remove button

---

### 4. **Quick Selection Features**

#### **Galactic Core** - Select All/None
```javascript
const handleGeneralSelect = () => {
  if (selectedQuestions.size === allQuestions.length) {
    setSelectedQuestions(new Set())  // Deselect all
  } else {
    setSelectedQuestions(new Set(allQuestions.map(q => q.crew)))  // Select all
  }
}
```

#### **Meteor Shower** - Random Selection
- Opens modal asking "How many random categories?"
- Randomly selects N categories
- Triggers visual meteor shower effect targeting selected constellations

```javascript
const handleRandomSelect = (count) => {
  const shuffled = [...constellationCategories].sort(() => 0.5 - Math.random())
  const randomCategories = shuffled.slice(0, count)
  
  // Select all questions in random categories
  const newSelectedQuestions = new Set()
  randomCategories.forEach(catName => {
    questionCategories[catName].forEach(q => newSelectedQuestions.add(q.crew))
  })
  
  setSelectedQuestions(newSelectedQuestions)
  setMeteorShowerTargets(targetElements)  // Visual effect
}
```

---

### 5. **Quick Presets**

Four built-in presets for fast setup:

```javascript
const presetMap = {
  quickGame: [
    "Deep Thoughts", 
    "Wild Cards", 
    "Daily Routines"
  ],  // 3 categories - Fast game
  
  brainTeasers: [
    "Deep Thoughts", 
    "Hypotheticals", 
    "Personality & Psyche"
  ],  // 3 categories - Thoughtful
  
  partyMix: [
    "Wild Cards", 
    "Food & Drink", 
    "Daily Routines", 
    "Objects & Places"
  ],  // 4 categories - Fun/social
  
  cosmicJourney: [
    "Science & Nature", 
    "History & Mythology", 
    "Technology & Future", 
    "Travel & Geography"
  ]   // 4 categories - Educational
}
```

Each preset:
- Icon and color-coded button
- Shows category count
- Triggers meteor shower effect on selection

---

## 💾 Preset System

### Save Preset
```javascript
const handleSavePreset = (name) => {
  const selectedCategories = constellationCategories
    .filter(cat => isCategorySelected(cat))
  
  const newPresets = { ...presets, [name]: selectedCategories }
  setPresets(newPresets)
  localStorage.setItem('outsider_presets', JSON.stringify(newPresets))
}
```

### Load Preset
```javascript
const handleLoadPreset = (presetName) => {
  const presetCategories = presets[presetName]
  const newSelected = new Set()
  
  presetCategories.forEach(catName => {
    questionCategories[catName].forEach(q => newSelected.add(q.crew))
  })
  
  setSelectedQuestions(newSelected)
}
```

**Stored in:** `localStorage` with key `'outsider_presets'`

---

## 🎨 Visual Design

### Constellation Graphics

Each category is rendered as an SVG constellation:

```javascript
const layout = constellationLayouts[cat] || constellationLayouts["Default"]

<svg viewBox="0 0 100 100">
  {/* Stardust particles (background) */}
  {Array.from({ length: 20 }).map((_, i) => (
    <circle className="stardust-particle" r={1.5} ... />
  ))}
  
  {/* Connecting lines */}
  {layout.lines.map(([p1, p2], i) => (
    <line 
      x1={layout.stars[p1].x} 
      y1={layout.stars[p1].y}
      x2={layout.stars[p2].x} 
      y2={layout.stars[p2].y}
      className="constellation-line"
    />
  ))}
  
  {/* Stars (points) */}
  {layout.stars.map((star, i) => (
    <circle cx={star.x} cy={star.y} r={3} className="constellation-star" />
  ))}
</svg>
```

**Constellation Layouts:**
- Defined in `constellationLayouts.js`
- Each has a name (e.g., "Lyra", "Gemini", "Supernova")
- Stars positioned with x/y coordinates (0-100 scale)
- Lines connect star indices

**Example:**
```javascript
"Deep Thoughts": {
  name: "Lyra",
  stars: [
    { x: 50, y: 15 },
    { x: 25, y: 40 },
    { x: 75, y: 40 },
    { x: 25, y: 85 },
    { x: 75, y: 85 }
  ],
  lines: [[0, 1], [0, 2], [1, 3], [2, 4], [1, 2]]
}
```

### Animations

**Genesis Animation** (when clicked):
```css
.activated-genesis {
  animation: genesis-glow 1.2s ease-out;
}
```

**Stardust particles:**
```css
.stardust-particle {
  animation: twinkle 2s infinite;
}
```

**Constellation lines appear with staggered delay:**
```javascript
style={{ animationDelay: `${0.35 + i * 0.05}s` }}
```

---

## 🎮 Game Settings

### Win Conditions

Two options:

1. **First to 5** (`score` mode)
   - First player to reach 5 points wins
   - Standard competitive mode

2. **Best of 3** (`rounds` mode)
   - Play 3 rounds
   - Player with most wins takes all
   - Faster gameplay

```javascript
const [gameSettings, setGameSettings] = useState({ 
  winCondition: 'score',  // or 'rounds'
  winValue: 5            // or 3
})
```

---

## ⚙️ Advanced Settings

Accessed via **Advanced Settings** button:

```javascript
const [advancedSettings, setAdvancedSettings] = useState({
  customTimers: { 
    answer: 60,   // Answer phase (seconds)
    debate: 60,   // Debate phase
    vote: 45      // Voting phase
  },
  customDecrees: []  // Host can add custom questions
})
```

**Custom Decrees:**
- Host can write their own questions
- Must provide both crew and impostor versions
- Added to the question pool

---

## 🔍 Search & Filter

```javascript
const [searchQuery, setSearchQuery] = useState('')

// Filter available categories by search
const availableCategories = constellationCategories
  .filter(cat => !isCategorySelected(cat))  // Hide selected
  .filter(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
```

**Search features:**
- Real-time filtering as you type
- Shows match count
- Clear button (X) when active
- Case-insensitive

---

## 📊 Progress Tracking

### Minimum Requirements

```javascript
const minQuestions = 3
const canContinue = selectedQuestions.size >= minQuestions
```

**Visual Progress Bar:**
- Red: < 2 categories
- Yellow: 2 categories
- Green: ≥ 3 categories (ready)

**Progress Display:**
```jsx
<div className="flex items-center justify-between">
  <span>{selectedCategories.length} / {minQuestions} minimum</span>
  {canContinue && (
    <span className="text-green-400">
      <Icon name="CheckCircle2" /> Ready
    </span>
  )}
</div>
```

---

## 🚀 Confirmation Flow

When user clicks **"Confirm & Enter Lobby"**:

```javascript
const handleConfirm = () => {
  // 1. Collect selected questions
  const customQuestions = Array.from(selectedQuestions)
    .map(crew => allQuestions.find(q => q.crew === crew))
    .filter(Boolean)
  
  // 2. Add custom decrees from advanced settings
  const finalQuestions = [...customQuestions, ...advancedSettings.customDecrees]
  
  // 3. Merge timers into game settings
  const finalGameSettings = { 
    ...gameSettings, 
    customTimers: advancedSettings.customTimers 
  }
  
  // 4. Emit to server via socket
  handleConfirmCustomization(
    finalQuestions.length > 0 ? finalQuestions : [], 
    finalGameSettings
  )
}
```

**Server-side (`GameContext.jsx`):**
```javascript
const handleConfirmCustomization = useCallback((customQuestions, gameSettings) => {
  socketRef.current.emit('confirmCustomization', { 
    customQuestions, 
    gameSettings 
  })
}, [])
```

**Result:** Transitions to Lobby screen with configured game

---

## 🎨 UI Components Breakdown

### Left Column: Celestial Atlas

**Header Section:**
- Title: "Celestial Atlas"
- Undo/Redo buttons (with Ctrl+Z hint)
- Galactic Core button (select all/none)
- Meteor Shower button (random selection)

**Quick Presets (4 buttons):**
```jsx
<button onClick={() => handleQuickPreset('quickGame')}>
  <Icon name="Dices" />
  Quick Game
  3 categories
</button>
// + brainTeasers, partyMix, cosmicJourney
```

**Search Bar:**
- Magnifying glass icon
- Clear button (when active)
- Match count display
- Keyboard navigation hint

**Constellation Grid:**
- Responsive: 33% → 25% → 20% width (mobile → tablet → desktop)
- Aspect ratio: square
- Each shows constellation SVG
- Focus ring for keyboard navigation
- Click to toggle, right-click to preview

### Right Column: Decree Manifest

**Selected Categories List:**
```jsx
<SelectedCategoryCard 
  catName={cat} 
  onRemove={handleConstellationClick}
/>
```

Each card shows:
- Small constellation icon
- Category name
- Remove button (X)

**Win Condition Toggle:**
- Two HexButtons side-by-side
- "First to 5" vs "Best of 3"

**Action Buttons:**
- Save Preset
- Load Preset
- Advanced Settings (toggle)
- Confirm & Enter Lobby (main CTA)

---

## 🧪 Testing & Edge Cases

### Handled Edge Cases

1. **No categories selected**
   - Confirm button disabled
   - Shows "Select at least 3 decrees" warning

2. **All categories selected**
   - Celestial Atlas shows "All available decrees have been added"
   - Search still works

3. **Search with no results**
   - Shows "No constellations match '{query}'"

4. **Keyboard navigation with filtered list**
   - Focused index resets when search changes
   - Navigation wraps around (loops)

5. **Undo/Redo edge cases**
   - Undo disabled when stack empty
   - Redo cleared when new action taken
   - Ctrl+Z/Y work even when modal open (but Esc takes priority)

6. **localStorage errors**
   - Try/catch when loading presets
   - Gracefully continues if storage unavailable

7. **Missing constellation layouts**
   - Fallback to "Default" layout if category not found

---

## 📱 Mobile Considerations

### Current Mobile Support

✅ **Works Well:**
- Long-press to preview (500ms)
- Touch interactions on constellations
- Responsive grid (33% width on mobile)
- Stacks layout vertically (flex-col on mobile)

⚠️ **Could Be Improved:**
- Text sizes not fully responsive
- Buttons could be larger (44px minimum)
- Quick preset buttons small on mobile
- Undo/Redo buttons tiny
- Search bar could be larger touch target
- Constellation grid items small to tap

**Potential Mobile Improvements:**
1. Larger touch targets for constellations
2. Bigger quick preset buttons
3. Responsive text sizing
4. Better spacing/padding
5. Mobile-optimized keyboard (for search)
6. Swipe gestures for undo/redo

---

## 🔄 Data Flow

```
User Interaction
    ↓
State Update (setSelectedQuestions)
    ↓
Re-render constellation grid
    ↓
Update Decree Manifest list
    ↓
Update progress bar
    ↓
Enable/disable Confirm button
    ↓
[User clicks Confirm]
    ↓
handleConfirm() collects data
    ↓
handleConfirmCustomization() emits socket event
    ↓
Server processes customization
    ↓
Server sends updated game state
    ↓
GameContext updates state
    ↓
Screen transitions to Lobby
```

---

## 🎯 Key Functions Reference

| Function | Purpose | Triggers |
|----------|---------|----------|
| `handleConstellationClick(catName)` | Toggle category selection | Click, Space key |
| `handleGeneralSelect()` | Select/deselect all | Galactic Core button |
| `handleRandomSelect(count)` | Random selection with effect | Meteor Shower modal |
| `handleQuickPreset(type)` | Apply quick preset | Quick preset buttons |
| `handlePreviewCategory(catName)` | Show category questions | Right-click, Enter key |
| `handleUndo()` | Revert last change | Ctrl+Z |
| `handleRedo()` | Reapply undone change | Ctrl+Y |
| `handleSavePreset(name)` | Save current selection | Save modal |
| `handleLoadPreset(name)` | Load saved preset | Load modal |
| `handleConfirm()` | Finalize and start game | Confirm button |

---

## 🎨 CSS Classes Reference

| Class | Purpose |
|-------|---------|
| `.constellation` | Base constellation container |
| `.constellation-star` | Star point (circle) |
| `.constellation-line` | Connecting line |
| `.constellation-star.selected` | Selected state styling |
| `.constellation-line.selected` | Selected line styling |
| `.activated-genesis` | Animation when clicked |
| `.stardust-particle` | Background particle |
| `.galaxy-core` | Galactic core icon animation |
| `.advanced-panel` | Slide-out panel container |
| `.advanced-panel.open` | Panel visible state |

---

## 📦 Dependencies

### Internal Components
- `Icon` - Lucide icon wrapper
- `HexButton` - Styled hexagonal button
- `PresetModal` - Save/load preset interface
- `RandomSelectionModal` - Random count selector
- `MeteorShowerOverlay` - Visual effect overlay
- `AdvancedSettingsPanel` - Advanced configuration
- `TooltipPortal` - Portal-based tooltips

### Context
- `useGame()` - Game state and socket functions

### Data
- `constellationLayouts` - SVG constellation definitions
- `questionData` - All questions organized by category

---

## 🚀 Summary

The **Customize Game Screen** is a feature-rich, visually impressive interface that:

1. ✅ Allows hosts to select which question categories to include
2. ✅ Provides multiple selection methods (click, keyboard, random, presets)
3. ✅ Supports undo/redo for mistake recovery
4. ✅ Lets users preview questions before selecting
5. ✅ Enables saving/loading custom presets
6. ✅ Includes advanced configuration (timers, custom questions)
7. ✅ Uses space-themed visuals with constellation graphics
8. ✅ Enforces minimum 3 categories for game balance
9. ✅ Integrates smoothly with socket-based multiplayer system

**Strengths:**
- Beautiful, thematic UI
- Excellent keyboard navigation
- Powerful undo/redo system
- Flexible preset system
- Preview functionality

**Areas for Mobile Improvement:**
- Touch target sizes
- Responsive typography
- Better spacing for mobile
- Simplified interactions

**Status:** Fully functional, ready for mobile optimization! 📱
