# 🚀 Customize Game Redesign - IMPLEMENTATION ROADMAP

## 📋 Overview

This document outlines a **step-by-step, risk-managed implementation plan** to transform the Customize Game screen into "The Oracle's Ritual" experience.

Each step is:
- ✅ **Independently testable** - Can be verified in isolation
- ✅ **Non-breaking** - Existing functionality preserved
- ✅ **Incrementally valuable** - Each step improves the UX
- ✅ **Rollback-safe** - Easy to revert if issues arise

---

## 🎯 IMPLEMENTATION STRATEGY

### **Approach: Parallel Development with Feature Flags**

We'll build the new system alongside the current one, then switch over when ready.

```javascript
// Feature flag system
const FEATURES = {
  NEW_CUSTOMIZE_SCREEN: true,  // Toggle new/old
  ORACLE_AI: false,             // Enable AI features
  CARD_SYSTEM: false,           // Enable card browser
  QUICK_RITUAL: false           // Enable quick setup
}
```

**Benefits:**
- Test new features without breaking production
- Gradual rollout to users
- Easy A/B testing
- Safe rollback path

---

## 📊 IMPLEMENTATION PHASES

### **Phase 1: Foundation & Infrastructure** (Week 1)
Build core systems without touching current UI

### **Phase 2: Oracle Component** (Week 1-2)
Create the mystical guide interface

### **Phase 3: Quick Ritual** (Week 2)
AI-powered fast setup flow

### **Phase 4: Card System** (Week 3)
Individual question browsing

### **Phase 5: Polish & Integration** (Week 4)
Effects, animations, testing

### **Phase 6: Launch & Monitor** (Week 4+)
Deployment and iteration

---

# 🔧 DETAILED STEP-BY-STEP PLAN

---

## **PHASE 1: FOUNDATION & INFRASTRUCTURE**

### **Step 1.1: Set Up Feature Flag System** ⏱️ 30 minutes

**Goal:** Enable safe A/B testing and gradual rollout

**Files to Create:**
- `src/config/features.js`

**Implementation:**

```javascript
// src/config/features.js
export const FEATURES = {
  // Main toggle - switches entire customize screen
  NEW_CUSTOMIZE_SCREEN: false,
  
  // Sub-features (only work if NEW_CUSTOMIZE_SCREEN is true)
  ORACLE_AI: false,
  CARD_SYSTEM: false,
  QUICK_RITUAL: false,
  VOICE_OF_ORACLE: false,
  GESTURE_CONTROLS: false,
  SOCIAL_FEATURES: false,
  GAMIFICATION: false
}

// Helper to check if feature is enabled
export const isFeatureEnabled = (featureName) => {
  if (featureName === 'NEW_CUSTOMIZE_SCREEN') {
    return FEATURES.NEW_CUSTOMIZE_SCREEN
  }
  // Sub-features require main flag to be true
  return FEATURES.NEW_CUSTOMIZE_SCREEN && FEATURES[featureName]
}

// Get all enabled features
export const getEnabledFeatures = () => {
  return Object.keys(FEATURES).filter(key => isFeatureEnabled(key))
}
```

**Testing:**
```javascript
// Test in browser console
import { isFeatureEnabled } from './config/features'
console.log(isFeatureEnabled('NEW_CUSTOMIZE_SCREEN')) // false
console.log(isFeatureEnabled('ORACLE_AI')) // false
```

**Success Criteria:**
- ✅ Feature flags toggle correctly
- ✅ No impact on existing functionality
- ✅ Can import in any component

---

### **Step 1.2: Refactor Questions Data Structure** ⏱️ 2 hours

**Goal:** Transform questions.json into individual card format with metadata

**Files to Modify:**
- `src/data/questions.json`
- `src/data/questionCards.js` (new)

**Current Structure:**
```json
{
  "Deep Thoughts": {
    "crew": ["Question 1", "Question 2"],
    "impostor": ["Question 1", "Question 2"]
  }
}
```

**New Structure:**
```javascript
// src/data/questionCards.js
export const questionCards = [
  {
    id: "dt_001",
    category: "Deep Thoughts",
    categoryIcon: "💭",
    crew: "If you had to describe your personality as a flavor, what would it be and why?",
    impostor: "If you had to describe someone else's personality as a flavor, what would it be?",
    metadata: {
      estimatedTime: 180,        // seconds
      difficulty: "medium",       // easy, medium, hard
      playerCount: { min: 4, max: 8 },
      tags: ["introspective", "creative", "fun"],
      spiceLevel: 2,              // 1-5 (1=safe, 5=controversial)
      popularity: 0,              // Will be calculated from usage
      isCustom: false
    }
  },
  // ... more cards
]

// Helper to convert old format to new format
export const convertLegacyQuestions = (oldFormat) => {
  const cards = []
  let cardId = 0
  
  Object.entries(oldFormat).forEach(([category, questions]) => {
    const crew = questions.crew || []
    const impostor = questions.impostor || []
    
    crew.forEach((crewQ, index) => {
      cards.push({
        id: `${category.toLowerCase().replace(/\s+/g, '_')}_${String(cardId).padStart(3, '0')}`,
        category,
        categoryIcon: getCategoryIcon(category),
        crew: crewQ,
        impostor: impostor[index] || crewQ,
        metadata: inferMetadata(crewQ, category)
      })
      cardId++
    })
  })
  
  return cards
}

// Infer metadata from question text
const inferMetadata = (questionText, category) => {
  const length = questionText.length
  const words = questionText.split(' ').length
  
  return {
    estimatedTime: words < 15 ? 120 : words < 25 ? 180 : 240,
    difficulty: inferDifficulty(questionText),
    playerCount: { min: 3, max: 12 },
    tags: inferTags(questionText, category),
    spiceLevel: inferSpiceLevel(questionText),
    popularity: 0,
    isCustom: false
  }
}

const inferDifficulty = (text) => {
  const complexWords = ['philosophical', 'theoretical', 'analyze', 'hypothetical']
  const hasComplex = complexWords.some(word => text.toLowerCase().includes(word))
  return hasComplex ? 'hard' : text.length > 100 ? 'medium' : 'easy'
}

const inferTags = (text, category) => {
  const tagMap = {
    'would you': ['hypothetical'],
    'favorite': ['preferences'],
    'why': ['deep', 'introspective'],
    'describe': ['creative'],
    'if you could': ['wishful', 'fun']
  }
  
  const tags = [category.toLowerCase().replace(/\s+/g, '-')]
  
  Object.entries(tagMap).forEach(([phrase, newTags]) => {
    if (text.toLowerCase().includes(phrase)) {
      tags.push(...newTags)
    }
  })
  
  return [...new Set(tags)]
}

const inferSpiceLevel = (text) => {
  const spicyWords = ['controversial', 'political', 'religion', 'death', 'sex']
  const spicyCount = spicyWords.filter(word => 
    text.toLowerCase().includes(word)
  ).length
  
  return Math.min(spicyCount + 1, 5)
}

const getCategoryIcon = (category) => {
  const icons = {
    'Deep Thoughts': '💭',
    'Food & Drink': '🍕',
    'Tech & Future': '🚀',
    'Travel & Adventure': '🌍',
    'Pop Culture': '🎬',
    'Science & Nature': '🔬',
    'Sports & Games': '⚽',
    'Art & Music': '🎨',
    'Work & Career': '💼',
    'Philosophy': '🤔',
    'Relationships': '❤️',
    'Wild & Weird': '🎪'
  }
  return icons[category] || '⭐'
}

// Backwards compatibility - convert cards back to old format
export const convertCardsToLegacy = (cards) => {
  const legacy = {}
  
  cards.forEach(card => {
    if (!legacy[card.category]) {
      legacy[card.category] = { crew: [], impostor: [] }
    }
    legacy[card.category].crew.push(card.crew)
    legacy[card.category].impostor.push(card.impostor)
  })
  
  return legacy
}
```

**Files to Create:**
- `src/utils/questionConverter.js`

```javascript
// src/utils/questionConverter.js
import oldQuestions from '../data/questions.json'
import { convertLegacyQuestions } from '../data/questionCards'

// Run this once to convert old format
export const migrateQuestions = () => {
  const cards = convertLegacyQuestions(oldQuestions)
  console.log('Converted questions:', cards.length)
  console.log('Sample card:', cards[0])
  return cards
}
```

**Migration Script:**
```javascript
// scripts/migrateQuestions.js
// Run with: node scripts/migrateQuestions.js
const fs = require('fs')
const path = require('path')

const oldQuestions = require('../src/data/questions.json')

// Import conversion function (you'll need to adjust imports)
// For now, manually run the conversion and save output

console.log('Starting migration...')
// Run conversion
// Save to new file
console.log('Migration complete!')
```

**Testing:**
```javascript
// In browser console or test file
import { questionCards, convertCardsToLegacy } from './data/questionCards'
import oldQuestions from './data/questions.json'

// Test conversion
const legacy = convertCardsToLegacy(questionCards)
console.log('Original categories:', Object.keys(oldQuestions).length)
console.log('Converted categories:', Object.keys(legacy).length)
console.log('Card count:', questionCards.length)

// Verify a card
console.log('Sample card:', questionCards[0])
```

**Success Criteria:**
- ✅ All questions converted to card format
- ✅ Metadata inferred for each card
- ✅ Can convert back to legacy format
- ✅ No data loss
- ✅ Existing game still works with legacy format

---

### **Step 1.3: Create Shared UI Components** ⏱️ 3 hours

**Goal:** Build reusable components for new design system

**Files to Create:**
- `src/components/oracle/OracleButton.jsx`
- `src/components/oracle/OracleCard.jsx`
- `src/components/oracle/OracleSlider.jsx`
- `src/components/oracle/ParticleEffect.jsx`

**1. OracleButton.jsx**
```jsx
import React from 'react'
import { triggerHaptic } from '../utils/helpers'

/**
 * Mystical button component with particle effects and haptics
 */
export const OracleButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon = null,
  className = '',
  ...props
}) => {
  const handleClick = (e) => {
    if (disabled) return
    triggerHaptic('medium')
    onClick?.(e)
  }

  const variantStyles = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/50',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
    ghost: 'bg-transparent hover:bg-white/10 text-purple-300 border border-purple-500/50',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  }

  const sizeStyles = {
    small: 'px-4 py-2 text-sm min-h-[44px]',
    medium: 'px-6 py-3 text-base min-h-[48px]',
    large: 'px-8 py-4 text-lg min-h-[56px]'
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        rounded-lg font-medium
        transition-all duration-200
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {children}
    </button>
  )
}
```

**2. OracleCard.jsx**
```jsx
import React, { useState } from 'react'
import { triggerHaptic } from '../utils/helpers'

/**
 * 3D flippable card for questions
 */
export const OracleCard = ({
  question,
  isSelected = false,
  onToggle,
  onFlip,
  size = 'medium',
  className = ''
}) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleFlip = (e) => {
    e.stopPropagation()
    setIsFlipped(!isFlipped)
    setIsAnimating(true)
    triggerHaptic('light')
    onFlip?.(question, !isFlipped)
    
    setTimeout(() => setIsAnimating(false), 600)
  }

  const handleToggle = () => {
    if (isAnimating) return
    triggerHaptic('medium')
    onToggle?.(question)
  }

  const sizeStyles = {
    small: 'w-32 h-40 text-xs',
    medium: 'w-48 h-64 text-sm',
    large: 'w-64 h-80 text-base'
  }

  return (
    <div className={`${sizeStyles[size]} perspective-1000 ${className}`}>
      <div
        className={`
          relative w-full h-full
          transform-style-3d transition-transform duration-600
          ${isFlipped ? 'rotate-y-180' : ''}
        `}
      >
        {/* Front of card (Crew question) */}
        <div
          className={`
            absolute inset-0 backface-hidden
            rounded-xl p-4
            ${isSelected ? 'bg-purple-600 ring-4 ring-purple-400' : 'bg-gray-800'}
            border border-purple-500/30
            cursor-pointer
            hover:border-purple-400
            transition-all duration-200
            flex flex-col
          `}
          onClick={handleToggle}
        >
          {/* Category badge */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{question.categoryIcon}</span>
            <span className="text-xs text-purple-300 uppercase">
              {question.category}
            </span>
          </div>

          {/* Question text */}
          <p className="flex-1 text-white font-medium overflow-auto">
            {question.crew}
          </p>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
            <span>⏱️ {Math.floor(question.metadata.estimatedTime / 60)}min</span>
            <span>👥 {question.metadata.playerCount.min}-{question.metadata.playerCount.max}</span>
            <span>🔥 {question.metadata.spiceLevel}/5</span>
          </div>

          {/* Flip indicator */}
          <button
            onClick={handleFlip}
            className="mt-2 text-xs text-purple-400 hover:text-purple-300"
          >
            Flip to see Outsider version →
          </button>

          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute top-2 right-2 bg-white text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
              ✓
            </div>
          )}
        </div>

        {/* Back of card (Impostor question) */}
        <div
          className={`
            absolute inset-0 backface-hidden rotate-y-180
            rounded-xl p-4
            bg-red-900 border border-red-500/30
            cursor-pointer
            flex flex-col
          `}
          onClick={handleToggle}
        >
          {/* Category badge */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💀</span>
            <span className="text-xs text-red-300 uppercase">
              Outsider Version
            </span>
          </div>

          {/* Question text */}
          <p className="flex-1 text-white font-medium overflow-auto">
            {question.impostor}
          </p>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
            <span>⏱️ {Math.floor(question.metadata.estimatedTime / 60)}min</span>
            <span>👥 {question.metadata.playerCount.min}-{question.metadata.playerCount.max}</span>
            <span>🔥 {question.metadata.spiceLevel}/5</span>
          </div>

          {/* Flip back indicator */}
          <button
            onClick={handleFlip}
            className="mt-2 text-xs text-red-400 hover:text-red-300"
          >
            ← Flip back
          </button>

          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute top-2 right-2 bg-white text-red-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
              ✓
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Add custom CSS for 3D transforms
const style = document.createElement('style')
style.textContent = `
  .perspective-1000 { perspective: 1000px; }
  .transform-style-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; }
  .rotate-y-180 { transform: rotateY(180deg); }
`
document.head.appendChild(style)
```

**3. OracleSlider.jsx**
```jsx
import React, { useState } from 'react'
import { triggerHaptic } from '../utils/helpers'

/**
 * Mystical slider for Quick Ritual questions
 */
export const OracleSlider = ({
  label,
  leftLabel,
  rightLabel,
  leftIcon,
  rightIcon,
  min = 0,
  max = 100,
  value = 50,
  onChange,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value)
    onChange?.(newValue)
    
    // Haptic feedback on certain values
    if (newValue % 10 === 0) {
      triggerHaptic('light')
    }
  }

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => {
    setIsDragging(false)
    triggerHaptic('medium')
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-center text-lg text-purple-300 font-medium">
          {label}
        </label>
      )}

      {/* Slider track */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className={`
            w-full h-3 rounded-lg appearance-none cursor-pointer
            bg-gradient-to-r from-purple-900 via-purple-600 to-purple-900
            focus:outline-none focus:ring-4 focus:ring-purple-500/50
            ${isDragging ? 'scale-105' : ''}
            transition-transform duration-200
          `}
          style={{
            background: `linear-gradient(to right, 
              rgb(88, 28, 135) 0%, 
              rgb(147, 51, 234) ${value}%, 
              rgb(55, 48, 163) ${value}%, 
              rgb(88, 28, 135) 100%)`
          }}
        />
        
        {/* Custom thumb indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg pointer-events-none flex items-center justify-center text-lg"
          style={{ left: `calc(${value}% - 16px)` }}
        >
          ✨
        </div>
      </div>

      {/* Labels with icons */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-purple-300">
          {leftIcon && <span className="text-2xl">{leftIcon}</span>}
          <span>{leftLabel}</span>
        </div>
        <div className="flex items-center gap-2 text-purple-300">
          <span>{rightLabel}</span>
          {rightIcon && <span className="text-2xl">{rightIcon}</span>}
        </div>
      </div>
    </div>
  )
}
```

**4. ParticleEffect.jsx**
```jsx
import React, { useEffect, useRef } from 'react'

/**
 * Canvas-based particle effects for Oracle
 */
export const ParticleEffect = ({
  type = 'gentle',  // gentle, intense, burst, trail
  color = '#a855f7',  // purple
  particleCount = 50,
  className = ''
}) => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Create particles
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      life: Math.random() * 100
    }))

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life += 1

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Pulsing opacity
        particle.opacity = 0.3 + Math.sin(particle.life * 0.05) * 0.2

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [type, color, particleCount])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
```

**Testing:**
```jsx
// Test components in isolation
// Create src/components/oracle/OracleComponentTest.jsx

import React, { useState } from 'react'
import { OracleButton } from './OracleButton'
import { OracleCard } from './OracleCard'
import { OracleSlider } from './OracleSlider'
import { ParticleEffect } from './ParticleEffect'

export const OracleComponentTest = () => {
  const [sliderValue, setSliderValue] = useState(50)
  const [selectedCards, setSelectedCards] = useState(new Set())

  const sampleCard = {
    id: 'test_001',
    category: 'Deep Thoughts',
    categoryIcon: '💭',
    crew: 'If you had to describe your personality as a flavor, what would it be?',
    impostor: 'If you had to describe someone else\'s personality as a flavor...',
    metadata: {
      estimatedTime: 180,
      difficulty: 'medium',
      playerCount: { min: 4, max: 8 },
      tags: ['fun', 'creative'],
      spiceLevel: 2
    }
  }

  const handleCardToggle = (card) => {
    const newSelected = new Set(selectedCards)
    if (newSelected.has(card.id)) {
      newSelected.delete(card.id)
    } else {
      newSelected.add(card.id)
    }
    setSelectedCards(newSelected)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-4xl text-white mb-8">Oracle Components Test</h1>

      {/* Buttons */}
      <section className="mb-12">
        <h2 className="text-2xl text-purple-300 mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <OracleButton variant="primary" onClick={() => console.log('Primary')}>
            Primary Button
          </OracleButton>
          <OracleButton variant="secondary" onClick={() => console.log('Secondary')}>
            Secondary Button
          </OracleButton>
          <OracleButton variant="ghost" icon="✨">
            Ghost Button
          </OracleButton>
          <OracleButton variant="danger" size="large">
            Danger Button
          </OracleButton>
          <OracleButton disabled>Disabled Button</OracleButton>
        </div>
      </section>

      {/* Card */}
      <section className="mb-12">
        <h2 className="text-2xl text-purple-300 mb-4">Card</h2>
        <div className="flex justify-center">
          <OracleCard
            question={sampleCard}
            isSelected={selectedCards.has(sampleCard.id)}
            onToggle={handleCardToggle}
            onFlip={(card, flipped) => console.log('Flipped:', flipped)}
          />
        </div>
      </section>

      {/* Slider */}
      <section className="mb-12">
        <h2 className="text-2xl text-purple-300 mb-4">Slider</h2>
        <div className="max-w-md mx-auto">
          <OracleSlider
            label="How serious should this gathering be?"
            leftLabel="Party Fun"
            rightLabel="Deep Thinking"
            leftIcon="🎪"
            rightIcon="🧠"
            value={sliderValue}
            onChange={setSliderValue}
          />
          <p className="text-white text-center mt-4">Value: {sliderValue}</p>
        </div>
      </section>

      {/* Particle Effect */}
      <section className="mb-12">
        <h2 className="text-2xl text-purple-300 mb-4">Particle Effect</h2>
        <div className="w-full h-64 bg-black rounded-lg relative overflow-hidden">
          <ParticleEffect type="gentle" color="#a855f7" particleCount={100} />
        </div>
      </section>
    </div>
  )
}
```

**Success Criteria:**
- ✅ All components render correctly
- ✅ Buttons have haptic feedback
- ✅ Cards flip smoothly in 3D
- ✅ Sliders are touch-friendly
- ✅ Particles animate smoothly
- ✅ Components are reusable

---

### **Step 1.4: Create AI Recommendation Engine** ⏱️ 4 hours

**Goal:** Build smart question selector based on user preferences

**Files to Create:**
- `src/services/OracleAI.js`

```javascript
// src/services/OracleAI.js
import { questionCards } from '../data/questionCards'

/**
 * AI-powered recommendation engine for question selection
 */
export class OracleAI {
  constructor() {
    this.personality = {
      tone: 'wise_mysterious',
      humor: 0.3,
      formality: 0.7
    }
  }

  /**
   * Generate question recommendations based on user preferences
   * @param {Object} preferences - User's answers to Quick Ritual questions
   * @returns {Object} - Recommended cards with reasoning
   */
  recommend(preferences) {
    const {
      seriousness = 50,    // 0-100 (0=party, 100=deep)
      duration = 50,       // 0-100 (0=quick, 100=epic)
      spiceLevel = 50,     // 0-100 (0=safe, 100=wild)
      playerCount = 6,     // number of players
      specialFocus = []    // array of preferred categories
    } = preferences

    // Calculate target counts
    const targetCardCount = this.calculateTargetCount(duration, playerCount)
    const targetCategories = this.selectCategories(seriousness, spiceLevel, specialFocus)
    
    // Score all cards
    const scoredCards = questionCards.map(card => ({
      card,
      score: this.scoreCard(card, preferences),
      reasoning: this.explainScore(card, preferences)
    }))

    // Sort by score and select top cards
    scoredCards.sort((a, b) => b.score - a.score)
    const selectedCards = scoredCards.slice(0, targetCardCount)

    // Ensure category diversity
    const balancedCards = this.ensureBalance(selectedCards, targetCategories)

    return {
      cards: balancedCards.map(c => c.card),
      reasoning: this.generateExplanation(balancedCards, preferences),
      confidence: this.calculateConfidence(balancedCards),
      alternatives: scoredCards.slice(targetCardCount, targetCardCount + 10).map(c => c.card)
    }
  }

  /**
   * Calculate how many cards to recommend based on game duration
   */
  calculateTargetCount(duration, playerCount) {
    // Duration: 0 = 15min, 50 = 45min, 100 = 2hr
    const minCards = 12
    const maxCards = 40
    
    // Estimate: 2-3 minutes per question
    const availableMinutes = 15 + (duration / 100) * (120 - 15)
    const estimatedRounds = Math.floor(availableMinutes / (2.5 * playerCount / 5))
    
    return Math.max(minCards, Math.min(maxCards, estimatedRounds))
  }

  /**
   * Select which categories to focus on
   */
  selectCategories(seriousness, spiceLevel, specialFocus) {
    const allCategories = [
      { name: 'Deep Thoughts', seriousness: 80, spice: 30 },
      { name: 'Food & Drink', seriousness: 20, spice: 10 },
      { name: 'Tech & Future', seriousness: 60, spice: 40 },
      { name: 'Travel & Adventure', seriousness: 40, spice: 20 },
      { name: 'Pop Culture', seriousness: 30, spice: 30 },
      { name: 'Science & Nature', seriousness: 70, spice: 20 },
      { name: 'Sports & Games', seriousness: 30, spice: 15 },
      { name: 'Art & Music', seriousness: 50, spice: 25 },
      { name: 'Work & Career', seriousness: 60, spice: 40 },
      { name: 'Philosophy', seriousness: 90, spice: 50 },
      { name: 'Relationships', seriousness: 70, spice: 60 },
      { name: 'Wild & Weird', seriousness: 40, spice: 80 }
    ]

    // Score categories based on preferences
    const scored = allCategories.map(cat => {
      let score = 100
      
      // Penalize based on mismatch with seriousness
      score -= Math.abs(cat.seriousness - seriousness) * 0.5
      
      // Penalize based on mismatch with spice level
      score -= Math.abs(cat.spice - spiceLevel) * 0.3
      
      // Boost if in special focus
      if (specialFocus.includes(cat.name)) {
        score += 50
      }
      
      return { ...cat, score }
    })

    // Select top 4-6 categories
    scored.sort((a, b) => b.score - a.score)
    const categoryCount = seriousness > 60 ? 4 : 5  // Fewer categories for serious games
    
    return scored.slice(0, categoryCount).map(c => c.name)
  }

  /**
   * Score individual card based on preferences
   */
  scoreCard(card, preferences) {
    const { seriousness, spiceLevel, duration } = preferences
    let score = 50  // Base score

    // Difficulty scoring
    const difficultyMap = { easy: 20, medium: 50, hard: 80 }
    const cardDifficulty = difficultyMap[card.metadata.difficulty]
    score += (100 - Math.abs(cardDifficulty - seriousness)) * 0.3

    // Spice level scoring
    const cardSpice = card.metadata.spiceLevel * 20  // Convert 1-5 to 0-100
    score += (100 - Math.abs(cardSpice - spiceLevel)) * 0.2

    // Duration scoring
    const targetTime = duration < 50 ? 120 : 180  // Prefer shorter for quick games
    score += (200 - Math.abs(card.metadata.estimatedTime - targetTime)) * 0.1

    // Popularity boost (if we have usage data)
    score += card.metadata.popularity * 10

    // Tag bonus
    const goodTags = this.getPreferredTags(preferences)
    const tagMatches = card.metadata.tags.filter(tag => goodTags.includes(tag)).length
    score += tagMatches * 5

    return score
  }

  /**
   * Get preferred tags based on preferences
   */
  getPreferredTags(preferences) {
    const { seriousness, spiceLevel } = preferences
    const tags = []

    if (seriousness < 40) tags.push('fun', 'light', 'quick')
    if (seriousness > 60) tags.push('deep', 'introspective', 'philosophical')
    if (spiceLevel > 60) tags.push('controversial', 'bold')
    if (spiceLevel < 40) tags.push('safe', 'wholesome')

    return tags
  }

  /**
   * Explain why a card was scored highly
   */
  explainScore(card, preferences) {
    const reasons = []
    
    if (preferences.seriousness > 60 && card.metadata.difficulty === 'hard') {
      reasons.push('Perfect for deep discussion')
    }
    if (preferences.seriousness < 40 && card.metadata.difficulty === 'easy') {
      reasons.push('Great for light-hearted fun')
    }
    if (card.metadata.spiceLevel >= 4 && preferences.spiceLevel > 60) {
      reasons.push('Bold and provocative')
    }
    if (card.metadata.popularity > 0.7) {
      reasons.push('Player favorite')
    }

    return reasons.join(', ') || 'Well-balanced question'
  }

  /**
   * Ensure category balance in selection
   */
  ensureBalance(scoredCards, targetCategories) {
    const balanced = []
    const categoryCount = {}

    // Initialize counts
    targetCategories.forEach(cat => categoryCount[cat] = 0)

    // Calculate target per category
    const targetPerCategory = Math.ceil(scoredCards.length / targetCategories.length)

    // First pass: add cards from target categories
    for (const scored of scoredCards) {
      const category = scored.card.category
      
      if (targetCategories.includes(category)) {
        if (categoryCount[category] < targetPerCategory) {
          balanced.push(scored)
          categoryCount[category]++
        }
      }
    }

    // Second pass: fill remaining slots with highest scores
    for (const scored of scoredCards) {
      if (!balanced.includes(scored) && balanced.length < scoredCards.length) {
        balanced.push(scored)
      }
    }

    return balanced
  }

  /**
   * Generate human-readable explanation of recommendations
   */
  generateExplanation(selectedCards, preferences) {
    const { seriousness, duration, spiceLevel } = preferences
    
    // Analyze selected cards
    const categories = [...new Set(selectedCards.map(c => c.card.category))]
    const avgSpice = selectedCards.reduce((sum, c) => 
      sum + c.card.metadata.spiceLevel, 0) / selectedCards.length
    const avgDifficulty = selectedCards.filter(c => 
      c.card.metadata.difficulty === 'hard').length / selectedCards.length

    // Generate explanation
    let explanation = "I have woven "
    explanation += `${selectedCards.length} cosmic decrees from ${categories.length} constellations. `

    if (seriousness < 40) {
      explanation += "These questions will spark laughter and light-hearted debate. "
    } else if (seriousness > 60) {
      explanation += "These questions will lead to profound introspection and deep discussion. "
    } else {
      explanation += "These questions balance fun with thoughtfulness. "
    }

    if (avgSpice > 3) {
      explanation += "⚠️ Expect bold, controversial topics. "
    } else if (avgSpice < 2) {
      explanation += "Safe for all audiences. "
    }

    if (duration < 40) {
      explanation += `Perfect for a ${Math.round(15 + duration * 0.45)}-minute gathering.`
    } else {
      explanation += `Enough content for an epic ${Math.round(duration * 1.2)}-minute session.`
    }

    return explanation
  }

  /**
   * Calculate confidence in recommendations
   */
  calculateConfidence(selectedCards) {
    // Higher confidence if:
    // - Cards have high average scores
    // - Good category balance
    // - Diverse question types

    const avgScore = selectedCards.reduce((sum, c) => sum + c.score, 0) / selectedCards.length
    const categories = new Set(selectedCards.map(c => c.card.category))
    const diversityScore = (categories.size / 12) * 100

    const confidence = (avgScore * 0.7 + diversityScore * 0.3) / 100

    return Math.min(1, Math.max(0, confidence))
  }

  /**
   * Generate alternative suggestions
   */
  generateAlternatives(preferences) {
    // Create 3 different preference profiles and get recommendations
    const alternatives = []

    // More serious version
    alternatives.push({
      name: "Deeper Dive",
      icon: "🧠",
      description: "Turn up the thoughtfulness",
      cards: this.recommend({ ...preferences, seriousness: Math.min(100, preferences.seriousness + 30) }).cards
    })

    // More fun version
    alternatives.push({
      name: "Lighter Touch",
      icon: "🎪",
      description: "Keep it fun and breezy",
      cards: this.recommend({ ...preferences, seriousness: Math.max(0, preferences.seriousness - 30) }).cards
    })

    // Spicier version
    alternatives.push({
      name: "Spice It Up",
      icon: "🔥",
      description: "Add some controversy",
      cards: this.recommend({ ...preferences, spiceLevel: Math.min(100, preferences.spiceLevel + 30) }).cards
    })

    return alternatives
  }

  /**
   * Oracle's mystical sayings
   */
  speak(context, userMessage = '') {
    const greetings = [
      "Welcome, cosmic entity. I sense you seek wisdom...",
      "Greetings, traveler. The stars await your decree...",
      "Ah, you have returned. What mysteries shall we explore today?",
      "I see you, entity. Let us divine the perfect questions together..."
    ]

    const questioning = [
      "Tell me, how serious should this gathering be?",
      "Speak your desire regarding the tone of this ritual...",
      "What energy do you wish to summon?",
      "Shall we probe the depths or dance in the shallows?"
    ]

    const revealing = [
      "I have woven your cosmic decree from the stars...",
      "Behold! The perfect questions have revealed themselves...",
      "The constellations have aligned. Your decree is ready...",
      "I have divined the ideal questions for your gathering..."
    ]

    const encouraging = [
      "Excellent choice, entity. The cosmos approves.",
      "Ah, a bold decision! This will spark great discourse.",
      "Wise selection. Your gathering will be enlightening.",
      "The stars smile upon this configuration."
    ]

    const warnings = [
      "⚠️ Consider adding lighter topics for balance...",
      "⚠️ This may challenge your entities. Are they ready?",
      "⚠️ These questions run deep. Proceed with wisdom.",
      "⚠️ Bold choices! Ensure your entities are prepared."
    ]

    // Select appropriate response based on context
    switch (context) {
      case 'greeting':
        return this.randomChoice(greetings)
      case 'questioning':
        return this.randomChoice(questioning)
      case 'revealing':
        return this.randomChoice(revealing)
      case 'encouraging':
        return this.randomChoice(encouraging)
      case 'warning':
        return this.randomChoice(warnings)
      default:
        return "The cosmos speaks in mysterious ways..."
    }
  }

  /**
   * Helper: random choice from array
   */
  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  /**
   * Validate deck before game starts
   */
  validateDeck(cards) {
    const warnings = []
    const suggestions = []

    // Check minimum
    if (cards.length < 12) {
      warnings.push("⚠️ Not enough questions. Add at least 12 cards.")
      suggestions.push({ action: 'add_random', count: 12 - cards.length })
    }

    // Check category diversity
    const categories = new Set(cards.map(c => c.category))
    if (categories.size < 3) {
      warnings.push("⚠️ Consider adding more variety (at least 3 categories).")
      suggestions.push({ action: 'add_category', categories: this.suggestCategories(cards) })
    }

    // Check balance
    const avgSpice = cards.reduce((sum, c) => sum + c.metadata.spiceLevel, 0) / cards.length
    if (avgSpice > 4) {
      warnings.push("⚠️ Very spicy topics! Ensure players are comfortable.")
    } else if (avgSpice < 1.5) {
      suggestions.push({ action: 'add_spice', message: "Consider adding bolder questions" })
    }

    // Check difficulty balance
    const difficulties = cards.map(c => c.metadata.difficulty)
    const hardCount = difficulties.filter(d => d === 'hard').length
    const easyCount = difficulties.filter(d => d === 'easy').length
    
    if (hardCount / cards.length > 0.7) {
      warnings.push("⚠️ Very challenging deck. Consider some easier questions.")
    }

    return {
      valid: cards.length >= 12,
      warnings,
      suggestions
    }
  }

  /**
   * Suggest categories to add for balance
   */
  suggestCategories(currentCards) {
    const currentCategories = new Set(currentCards.map(c => c.category))
    const allCategories = [...new Set(questionCards.map(c => c.category))]
    
    return allCategories.filter(cat => !currentCategories.has(cat)).slice(0, 3)
  }
}

// Export singleton instance
export const oracleAI = new OracleAI()
```

**Testing:**
```javascript
// Test in browser console
import { oracleAI } from './services/OracleAI'

// Test recommendations
const preferences = {
  seriousness: 70,    // Deep thinking
  duration: 50,       // Medium game
  spiceLevel: 40,     // Moderate spice
  playerCount: 6,
  specialFocus: ['Philosophy', 'Science & Nature']
}

const result = oracleAI.recommend(preferences)
console.log('Recommended cards:', result.cards.length)
console.log('Explanation:', result.reasoning)
console.log('Confidence:', result.confidence)
console.log('Sample card:', result.cards[0])

// Test Oracle speech
console.log(oracleAI.speak('greeting'))
console.log(oracleAI.speak('revealing'))

// Test validation
const testDeck = result.cards.slice(0, 8)  // Too few cards
const validation = oracleAI.validateDeck(testDeck)
console.log('Validation:', validation)
```

**Success Criteria:**
- ✅ Recommendations match user preferences
- ✅ Good category balance
- ✅ Explanations are clear and helpful
- ✅ Validation catches problems
- ✅ Oracle personality is engaging

---

## **PHASE 1 COMPLETION CHECKLIST**

- [ ] Feature flags working
- [ ] Questions converted to card format
- [ ] Backwards compatibility maintained
- [ ] OracleButton component tested
- [ ] OracleCard component tested
- [ ] OracleSlider component tested
- [ ] ParticleEffect component tested
- [ ] OracleAI recommendations accurate
- [ ] Validation logic working
- [ ] No breaking changes to existing game
- [ ] All components documented

**Time Estimate:** 10-12 hours
**Risk Level:** Low (no changes to existing UI)

---

## **PHASE 2: ORACLE COMPONENT** (Coming next...)

This will be Steps 2.1 through 2.4, building the mystical Oracle orb interface.

Would you like me to continue with Phase 2 details?

---

## 📝 NOTES

- Each step includes testing instructions
- Success criteria clearly defined
- Backwards compatibility maintained
- Can pause/resume at any step
- Feature flags allow safe testing

