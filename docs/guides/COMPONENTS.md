# Component Documentation

Complete reference for all 35 components in Outsider: Cosmic Council.

---

## 📑 Table of Contents

### Core Components
- [App](#app)
- [GameContext](#gamecontext)

### Screen Components (8)
- [HomeScreen](#homescreen)
- [CustomizeGameScreen](#customizegamescreen)
- [LobbyScreen](#lobbyscreen)
- [GameScreen](#gamescreen)
- [DebateScreen](#debatescreen)
- [VotingScreen](#votingscreen)
- [ScoreboardScreen](#scoreboardscreen)
- [GameOverScreen](#gameoverscreen)

### UI Components (12)
- [Icon](#icon)
- [Timer](#timer)
- [HexButton](#hexbutton)
- [DecodingText](#decodingtext)
- [GlitchyText](#glitchytext)
- [GlitchyLogo](#glitchylogo)
- [GlitchyArchiveText](#glitchyarchivetext)
- [ConfirmationModal](#confirmationmodal)
- [HowToPlayModal](#howtoplaymodal)
- [LoadingScreen](#loadingscreen)
- [PlayerAvatar](#playeravatar)
- [Avatar](#avatar)

### Background Components (4)
- [AnimatedCosmicBackground](#animatedcosmicbackground)
- [BackgroundConstellation](#backgroundconstellation)
- [TwinkleStar](#twinklestar)
- [CosmicScribblerCanvas](#cosmicscribblercanvas)

### Game-Specific Components (9)
- [PresetModal](#presetmodal)
- [RandomSelectionModal](#randomselectionmodal)
- [MeteorShowerOverlay](#meteorshoweroverlay)
- [AdvancedSettingsPanel](#advancedsettingspanel)
- [ChatBox](#chatbox)
- [ConfettiCanvas](#confetticanvas)
- [AdminPanelModal](#adminpanelmodal)

---

## Core Components

### App

**File:** `src/App.jsx`

Main application component that handles routing, easter eggs, and global UI.

**Features:**
- Screen routing for 8 game screens
- Konami code easter egg ("COSMIC")
- Cosmic Scribbler activation
- Mouse/device orientation tracking
- Modal management
- Lucide icons initialization

**Key State:**
- `mousePosition` - For parallax effect
- `showScribbler` - Cosmic Scribbler visibility
- `isKonamiArmed` - Konami code status
- `konamiProgress` - Tracks typed keys

**Context Used:** `useGame()` for all game state

---

### GameContext

**File:** `src/contexts/GameContext.jsx`

Central state management using React Context API.

**Provides:**
- Game state (screen, players, questions, etc.)
- 18+ state variables
- 15+ event handlers
- Socket reference
- Question data
- Admin features

**Key Functions:**
- `handleCreateRoom` - Create new game room
- `handleJoinRoom` - Join existing room
- `handleStartGame` - Start game
- `handleAnswerSubmit` - Submit answer
- `handleVote` - Cast vote
- `handleNextRound` - Progress to next round
- `handlePlayAgain` - Restart game

**Loading Behavior:**
Shows `LoadingScreen` while loading questions.json

---

## Screen Components

### HomeScreen

**File:** `src/components/HomeScreen.jsx`

Landing screen with nickname/room code inputs.

**Props:**
- `onTriggerScribbler` - Callback for Cosmic Scribbler
- `onTriggerKonami` - Callback for Konami code
- `isKonamiArmed` - Konami code status

**Context Used:** `useGame()` for:
- nickname, setNickname
- roomCode, setRoomCode
- handleCreateRoom, handleJoinRoom
- error, setShowRules, setShowAdminLogin

**Features:**
- HTML tag sanitization in nickname
- Auto-uppercase room code
- Field validation
- Error display
- How to Play button
- Admin access via subtitle click

---

### CustomizeGameScreen

**File:** `src/components/CustomizeGameScreen.jsx`

Constellation-based decree (question) selector.

**Context Used:** `useGame()` for:
- handleConfirmCustomization
- questionData

**Local State:**
- 12 constellation categories
- Selected questions (Set)
- Game settings (win condition, value)
- Presets (localStorage)
- Advanced settings
- Animation states

**Features:**
- Interactive constellation grid
- Galactic Core (select all/none)
- Meteor Shower (random selection)
- Preset save/load/delete
- Advanced settings panel
- Win condition selector
- Minimum 3 decrees required

---

### LobbyScreen

**File:** `src/components/LobbyScreen.jsx`

Waiting room with orbital player display.

**Context Used:** `useGame()` for all game state and handlers

**Features:**
- Orbital orrery with 3-12 players
- Room code display with copy
- Host controls (start, kick)
- Bot summoning (up to 12 total)
- Chat system (draggable on desktop, inline on mobile)
- Dynamic radius calculation
- Color-coded player orbits

---

### GameScreen

**File:** `src/components/GameScreen.jsx`

Answer submission phase.

**Context Used:** `useGame()` for:
- gameState, me
- handleAnswerSubmit
- message, setMessage

**Features:**
- Different questions for Entity vs Anomaly
- 60-second timer
- Answer submission
- Character count
- Pending/submitted player indicators
- Auto-submit on timeout

---

### DebateScreen

**File:** `src/components/DebateScreen.jsx`

Answer review before voting.

**Context Used:** `useGame()` for:
- gameState, me
- handleReadyForVote

**Features:**
- Anonymous answer display
- 60-second debate timer
- Ready button
- Ready player indicators
- Auto-ready on timeout

---

### VotingScreen

**File:** `src/components/VotingScreen.jsx`

Vote for The Anomaly.

**Context Used:** `useGame()` for:
- gameState, me
- handleVote

**Features:**
- Answer selection with highlighting
- 45-second voting timer
- Vote confirmation
- Lock-in prevents changes
- Auto-submit null vote on timeout

---

### ScoreboardScreen

**File:** `src/components/ScoreboardScreen.jsx`

Round results and scoring.

**Context Used:** `useGame()` for:
- gameState, isHost
- handleNextRound

**Features:**
- Anomaly reveal panel
- Voting record chart
- Score updates with justifications
- Leaderboard ranking
- Host-only "Next Round" button

---

### GameOverScreen

**File:** `src/components/GameOverScreen.jsx`

Winner announcement and final standings.

**Context Used:** `useGame()` for:
- gameState, isHost
- handlePlayAgain

**Features:**
- Winner spotlight with crown
- Confetti animation
- Final standings leaderboard
- Host-only "Play Again" button

---

## UI Components

### Icon

**File:** `src/components/Icon.jsx`

Wrapper for Lucide icons with camelCase→kebab-case conversion.

**Props:**
- `name` (string) - Icon name (e.g., "CheckCircle2")
- `className` (string) - CSS classes
- `...props` - Passed to <i> element

**Usage:**
```jsx
<Icon name="Sparkles" className="w-6 h-6 text-amber-500" />
```

---

### Timer

**File:** `src/components/Timer.jsx`

Circular countdown timer with color transitions.

**Props:**
- `initialTime` (number) - Starting seconds
- `onTimeOut` (function) - Called when timer hits 0

**Features:**
- Color transitions: green → yellow → red
- Circular progress ring (SVG)
- Auto-calls onTimeOut at 0

---

### HexButton

**File:** `src/components/HexButton.jsx`

Hexagonal SVG button with hover/active states.

**Props:**
- `onClick` (function) - Click handler
- `isActive` (boolean) - Active state styling
- `disabled` (boolean) - Disabled state
- `children` (node) - Button content

**Features:**
- Hexagonal shape via SVG path
- Hover glow effect
- Active state highlighting
- Disabled styling

---

### DecodingText

**File:** `src/components/DecodingText.jsx`

Animated text reveal with scrambling effect.

**Props:**
- `text` (string) - Text to display
- `delay` (number) - Animation delay in seconds

**Features:**
- Scrambles each character initially
- Reveals one character at a time
- Customizable delay

---

### GlitchyText

**File:** `src/components/GlitchyText.jsx`

Text with scrambling glitch effect.

**Props:**
- `children` (string) - Text content
- `isGlitching` (boolean) - Whether to glitch

**Features:**
- Random character substitution
- Continuous glitching when active
- Original text preserved when inactive

---

### GlitchyLogo

**File:** `src/components/GlitchyLogo.jsx`

"OUTSIDER" logo with click-tracking for easter eggs.

**Props:**
- `size` (string) - CSS text size class
- `onTriggerScribbler` (function) - After 5 clicks
- `onTriggerKonami` (function) - After konami code + click
- `isKonamiArmed` (boolean) - Konami code status

**Features:**
- Click counter (resets after 1 second)
- Cosmic Scribbler activation (5 clicks)
- Konami code activation (COSMIC + click)
- Random letter glitching
- Continuous glitch effect when konami armed

---

### GlitchyArchiveText

**File:** `src/components/GlitchyArchiveText.jsx`

Brief glitch effect for single text display.

**Props:**
- `children` (node) - Content to display

**Features:**
- 6-step glitch sequence (900ms total)
- Text shadow effects
- Auto-stops after sequence

---

### ConfirmationModal

**File:** `src/components/ConfirmationModal.jsx`

Yes/No confirmation dialog.

**Props:**
- `message` (string) - Confirmation message
- `onConfirm` (function) - Callback for "Yes"
- `onCancel` (function) - Callback for "No"

**Features:**
- Modal overlay
- Two-button layout
- Click overlay to cancel

---

### HowToPlayModal

**File:** `src/components/HowToPlayModal.jsx`

5-step tutorial modal with animations.

**Props:**
- `onClose` (function) - Close callback

**Features:**
- 5 game steps with icons
- Swipeable carousel
- Navigation dots
- Slide-in animations
- Close button

---

### LoadingScreen

**File:** `src/components/LoadingScreen.jsx`

Animated orrery loading screen.

**Features:**
- 3-phase sequence (ignition → stabilization → standby)
- Rotating SVG orrery
- Cycling status messages
- Orbital rings with glowing effects

---

### PlayerAvatar

**File:** `src/components/PlayerAvatar.jsx`

Player avatar image selector.

**Props:**
- `player` (object) - Player object
- `size` (number) - Avatar size in pixels
- `className` (string) - Additional classes

**Features:**
- 12 celestial avatar images
- Index-based selection (0-11)
- Size customization
- Fallback to index 0 if invalid

---

### Avatar

**File:** `src/components/Avatar.jsx`

Avatar with badges and voting indicators.

**Props:**
- `player` (object) - Player data
- `isHost` (boolean) - Show host badge
- `hasVoted` (boolean) - Show voted checkmark

**Features:**
- PlayerAvatar integration
- Host sparkles badge
- Voted checkmark overlay
- Nickname display

---

## Background Components

### AnimatedCosmicBackground

**File:** `src/components/AnimatedCosmicBackground.jsx`

Multi-layer parallax background.

**Props:**
- `mousePosition` (object) - { x, y } normalized (-0.5 to 0.5)

**Features:**
- 3 nebula layers (parallax depth)
- Background constellations (12)
- Twinkle stars (150)
- Mouse/orientation responsive
- Transform-based movement

---

### BackgroundConstellation

**File:** `src/components/BackgroundConstellation.jsx`

Animated constellation shape for background.

**Props:**
- `category` (string) - Category name
- `x` (number) - X position (0-100)
- `y` (number) - Y position (0-100)

**Features:**
- SVG-based rendering
- Star positions from constellationLayouts
- Line connections
- Twinkling stars
- Line tracing animation

---

### TwinkleStar

**File:** `src/components/TwinkleStar.jsx`

Single twinkling star element.

**Props:**
- `delay` (number) - Animation delay

**Features:**
- Random positioning
- Random size (2-6px)
- 3 brightness levels
- Infinite twinkling animation
- Delayed start

---

### CosmicScribblerCanvas

**File:** `src/components/CosmicScribblerCanvas.jsx`

Interactive particle drawing canvas (easter egg).

**Props:**
- `onClose` (function) - Close callback

**Features:**
- Mouse/touch drawing
- Particle physics (gravity, fade)
- Click for particle burst
- Escape key to close
- Fullscreen canvas overlay

---

## Game-Specific Components

### PresetModal

**File:** `src/components/PresetModal.jsx`

Save/load decree selection presets.

**Props:**
- `mode` (string) - "save" or "load"
- `onClose` (function) - Close callback
- `presets` (object) - Saved presets
- `onSave` (function) - Save handler
- `onLoad` (function) - Load handler
- `onDelete` (function) - Delete handler

**Features:**
- Two modes (save/load)
- Preset name input (save mode)
- Preset list with delete buttons (load mode)
- localStorage integration

---

### RandomSelectionModal

**File:** `src/components/RandomSelectionModal.jsx`

Select random number of constellations.

**Props:**
- `onConfirm` (function) - Confirm with count
- `onCancel` (function) - Cancel callback
- `maxCount` (number) - Maximum selectable

**Features:**
- Number input (1 to maxCount)
- Confirm/Cancel buttons
- Meteor shower trigger

---

### MeteorShowerOverlay

**File:** `src/components/MeteorShowerOverlay.jsx`

Meteor animation targeting specific elements.

**Props:**
- `targets` (array) - Array of DOM elements to target

**Features:**
- Canvas-based animation
- Meteors fly to target elements
- 2-second duration
- Particle trail effect
- Auto-removes after completion

---

### AdvancedSettingsPanel

**File:** `src/components/AdvancedSettingsPanel.jsx`

Customizable timers and decrees.

**Props:**
- `settings` (object) - Current settings
- `onSettingsChange` (function) - Update handler

**Features:**
- Timer sliders (answer, debate, vote)
- Custom decree input
- Add/remove custom questions
- Settings persist in parent state

---

### ChatBox

**File:** `src/components/ChatBox.jsx`

In-game chat system.

**Props:**
- `gameState` (object) - Game state
- `me` (object) - Current player
- `chatInput` (string) - Input value
- `setChatInput` (function) - Input setter
- `handleSendMessage` (function) - Send handler
- `isMobile` (boolean) - Mobile mode
- Desktop-specific props for dragging

**Features:**
- Two modes: draggable (desktop) / inline (mobile)
- Message history with timestamps
- Sender color coding
- Auto-scroll to latest
- Enter key to send

---

### ConfettiCanvas

**File:** `src/components/ConfettiCanvas.jsx`

Falling confetti animation.

**Props:**
- `isActive` (boolean) - Whether to animate

**Features:**
- Canvas-based rendering
- 150 particles
- 5 colors (cosmic theme)
- Rotation and gravity
- Continuous falling

---

### AdminPanelModal

**File:** `src/components/AdminPanelModal.jsx`

Draggable admin control panel.

**Props:**
- `onClose` (function) - Close callback
- `onNavigate` (function) - Screen navigation
- `gameState` (object) - Game state
- `setForcedRole` (function) - Role forcing
- `forcedRole` (string) - Current forced role
- `onAddBot` (function) - Add bot
- `setKickConfirmationTarget` (function) - Kick player
- `me` (object) - Current player

**Features:**
- Password protection (password: "0")
- Draggable panel
- Two tabs:
  * **Navigation**: Jump to any screen
  * **Super Power**: Force roles, reveal anomaly, manage players
- Session management (add bots, kick players)
- Glitch effect on wrong password

---

## Services

### MockSocket

**File:** `src/services/MockSocket.js`

Client-side game simulation service.

**Key Features:**
- Event-based architecture (emit/on)
- Room management
- Player management
- Bot AI with personality
- Score calculation
- Game state updates
- Timer management

**Events Handled:**
- createRoom, joinRoom, startGame
- submitAnswer, readyForVote, vote
- nextRound, playAgain
- addBot, kickPlayer
- sendMessage

---

## Utilities

### helpers.js

**File:** `src/utils/helpers.js`

**Functions:**
- `getScoreJustification(player, reveal, votes)` - Calculate score reasoning
- `fallbackCopy(text, onSuccess, onError)` - Clipboard fallback

---

## Data

### questions.json

**File:** `src/data/questions.json`

Question database organized by category.

**Structure:**
```json
{
  "Category Name": [
    {
      "crew": "Question for Entities",
      "impostor": "Question for Anomaly"
    }
  ]
}
```

---

### constellationLayouts.js

**File:** `src/data/constellationLayouts.js`

Constellation visual configurations.

**Structure:**
```javascript
{
  "Category Name": {
    name: "Display Name",
    stars: [{ x: number, y: number }],
    lines: [[starIndex1, starIndex2]]
  }
}
```

---

## Component Hierarchy

```
App
├── AnimatedCosmicBackground
│   ├── BackgroundConstellation (x12)
│   └── TwinkleStar (x150)
├── Header
│   ├── HexButton (Home button)
│   └── GlitchyLogo
├── Main (Screen Router)
│   ├── HomeScreen
│   │   ├── GlitchyLogo
│   │   └── Icon
│   ├── CustomizeGameScreen
│   │   ├── HexButton
│   │   ├── PresetModal
│   │   ├── RandomSelectionModal
│   │   ├── MeteorShowerOverlay
│   │   └── AdvancedSettingsPanel
│   ├── LobbyScreen
│   │   ├── PlayerAvatar (x3-12)
│   │   ├── HexButton
│   │   └── ChatBox
│   ├── GameScreen
│   │   ├── Timer
│   │   ├── GlitchyText
│   │   └── PlayerAvatar
│   ├── DebateScreen
│   │   ├── Timer
│   │   └── PlayerAvatar
│   ├── VotingScreen
│   │   ├── Timer
│   │   └── PlayerAvatar
│   ├── ScoreboardScreen
│   │   ├── PlayerAvatar
│   │   └── HexButton
│   └── GameOverScreen
│       ├── PlayerAvatar
│       ├── ConfettiCanvas
│       └── HexButton
├── Footer
└── Modals/Overlays
    ├── CosmicScribblerCanvas
    ├── AdminPanelModal
    │   ├── Icon
    │   └── GlitchyText
    ├── ConfirmationModal
    └── HowToPlayModal
        └── Icon
```

---

**Total Components: 35**

**Last Updated:** October 17, 2025
