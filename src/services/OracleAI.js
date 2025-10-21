/**
 * OracleAI - Intelligent Question Recommendation Engine
 * 
 * This service provides AI-powered question selection for the Oracle experience.
 * It analyzes user preferences and recommends the perfect question mix.
 * 
 * Features:
 * - Smart card selection based on preferences
 * - Category diversity balancing
 * - Difficulty and spice level matching
 * - Personality-driven explanations
 * - Deck validation
 * - Oracle's mystical voice
 */

import { questionCards, CATEGORY_METADATA } from '../data/questionCards'

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
      alternatives: scoredCards.slice(targetCardCount, targetCardCount + 10).map(c => c.card),
      categories: targetCategories,
      metadata: {
        targetCount: targetCardCount,
        actualCount: balancedCards.length,
        avgDifficulty: this.calculateAvgDifficulty(balancedCards),
        avgSpice: this.calculateAvgSpice(balancedCards),
        estimatedTime: this.estimateGameTime(balancedCards, playerCount)
      }
    }
  }

  /**
   * Calculate how many cards to recommend based on game duration
   */
  calculateTargetCount(duration, playerCount) {
    // Duration: 0 = 15min, 50 = 45min, 100 = 2hr
    const minCards = 12
    const maxCards = 40
    
    // Estimate: 2-3 minutes per question round
    const availableMinutes = 15 + (duration / 100) * (120 - 15)
    const minutesPerRound = 2.5
    const estimatedRounds = Math.floor(availableMinutes / minutesPerRound)
    
    return Math.max(minCards, Math.min(maxCards, estimatedRounds))
  }

  /**
   * Select which categories to focus on based on preferences
   */
  selectCategories(seriousness, spiceLevel, specialFocus) {
    const allCategories = [
      { name: 'Deep Thoughts', seriousness: 80, spice: 30 },
      { name: 'Hypotheticals', seriousness: 50, spice: 20 },
      { name: 'Wild Cards', seriousness: 30, spice: 30 },
      { name: 'Daily Routines', seriousness: 35, spice: 10 },
      { name: 'Objects & Places', seriousness: 40, spice: 15 },
      { name: 'History & Mythology', seriousness: 60, spice: 40 },
      { name: 'Science & Nature', seriousness: 65, spice: 20 },
      { name: 'Arts & Literature', seriousness: 55, spice: 25 },
      { name: 'Food & Drink', seriousness: 25, spice: 10 },
      { name: 'Travel & Geography', seriousness: 45, spice: 20 },
      { name: 'Technology & Future', seriousness: 70, spice: 40 },
      { name: 'Personality & Psyche', seriousness: 75, spice: 50 }
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
    const categoryCount = seriousness > 60 ? 4 : seriousness < 40 ? 6 : 5
    
    return scored.slice(0, categoryCount).map(c => c.name)
  }

  /**
   * Score individual card based on preferences
   */
  scoreCard(card, preferences) {
    const { seriousness, spiceLevel, duration, playerCount } = preferences
    let score = 50  // Base score

    // Difficulty scoring
    const difficultyMap = { easy: 20, medium: 50, hard: 80 }
    const cardDifficulty = difficultyMap[card.metadata.difficulty]
    score += (100 - Math.abs(cardDifficulty - seriousness)) * 0.3

    // Spice level scoring
    const cardSpice = card.metadata.spiceLevel * 20  // Convert 1-5 to 0-100
    score += (100 - Math.abs(cardSpice - spiceLevel)) * 0.2

    // Duration scoring (prefer shorter questions for quick games)
    const targetTime = duration < 50 ? 120 : 180
    score += (200 - Math.abs(card.metadata.estimatedTime - targetTime)) * 0.1

    // Player count scoring
    const { min, max } = card.metadata.playerCount
    if (playerCount >= min && playerCount <= max) {
      score += 10  // Bonus for player count match
    }

    // Popularity boost (if we have usage data)
    score += card.metadata.popularity * 10

    // Tag bonus
    const goodTags = this.getPreferredTags(preferences)
    const tagMatches = card.metadata.tags.filter(tag => goodTags.includes(tag)).length
    score += tagMatches * 5

    return Math.max(0, Math.min(100, score))
  }

  /**
   * Get preferred tags based on preferences
   */
  getPreferredTags(preferences) {
    const { seriousness, spiceLevel } = preferences
    const tags = []

    if (seriousness < 40) tags.push('fun', 'light', 'quick', 'preferences')
    if (seriousness > 60) tags.push('deep', 'introspective', 'philosophical', 'analytical')
    if (spiceLevel > 60) tags.push('controversial', 'bold', 'personal')
    if (spiceLevel < 40) tags.push('safe', 'wholesome', 'positive')

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
    if (card.metadata.spiceLevel <= 2 && preferences.spiceLevel < 40) {
      reasons.push('Safe and comfortable')
    }
    if (card.metadata.popularity > 0.7) {
      reasons.push('Player favorite')
    }

    return reasons.length > 0 ? reasons.join(', ') : 'Well-balanced question'
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
    const hardCount = selectedCards.filter(c => 
      c.card.metadata.difficulty === 'hard').length

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

    const estimatedMinutes = Math.round(15 + duration * 1.05)
    if (duration < 40) {
      explanation += `Perfect for a ${estimatedMinutes}-minute gathering.`
    } else {
      explanation += `Enough content for an epic ${estimatedMinutes}-minute session.`
    }

    return explanation
  }

  /**
   * Calculate confidence in recommendations
   */
  calculateConfidence(selectedCards) {
    if (selectedCards.length === 0) return 0

    const avgScore = selectedCards.reduce((sum, c) => sum + c.score, 0) / selectedCards.length
    const categories = new Set(selectedCards.map(c => c.card.category))
    const diversityScore = Math.min(1, categories.size / 6) // Target 6 categories

    const confidence = (avgScore / 100) * 0.7 + diversityScore * 0.3

    return Math.min(1, Math.max(0, confidence))
  }

  /**
   * Calculate average difficulty
   */
  calculateAvgDifficulty(selectedCards) {
    if (selectedCards.length === 0) return 'medium'

    const difficultyScores = { easy: 1, medium: 2, hard: 3 }
    const avgScore = selectedCards.reduce((sum, c) => 
      sum + difficultyScores[c.card.metadata.difficulty], 0) / selectedCards.length

    if (avgScore < 1.5) return 'easy'
    if (avgScore > 2.5) return 'hard'
    return 'medium'
  }

  /**
   * Calculate average spice level
   */
  calculateAvgSpice(selectedCards) {
    if (selectedCards.length === 0) return 0

    return selectedCards.reduce((sum, c) => 
      sum + c.card.metadata.spiceLevel, 0) / selectedCards.length
  }

  /**
   * Estimate total game time
   */
  estimateGameTime(selectedCards, playerCount) {
    if (selectedCards.length === 0) return 0

    const totalQuestionTime = selectedCards.reduce((sum, c) => 
      sum + c.card.metadata.estimatedTime, 0)
    
    // Add setup and voting time
    const setupTime = 5 * 60 // 5 minutes
    const votingTime = selectedCards.length * 30 // 30 seconds per vote
    
    return Math.round((setupTime + totalQuestionTime + votingTime) / 60) // Return in minutes
  }

  /**
   * Generate alternative suggestions
   */
  generateAlternatives(preferences) {
    const alternatives = []

    // More serious version
    alternatives.push({
      name: "Deeper Dive",
      icon: "🧠",
      description: "Turn up the thoughtfulness",
      preferences: { ...preferences, seriousness: Math.min(100, preferences.seriousness + 30) }
    })

    // More fun version
    alternatives.push({
      name: "Lighter Touch",
      icon: "🎪",
      description: "Keep it fun and breezy",
      preferences: { ...preferences, seriousness: Math.max(0, preferences.seriousness - 30) }
    })

    // Spicier version
    alternatives.push({
      name: "Spice It Up",
      icon: "🔥",
      description: "Add some controversy",
      preferences: { ...preferences, spiceLevel: Math.min(100, preferences.spiceLevel + 30) }
    })

    // Longer version
    alternatives.push({
      name: "Extended Journey",
      icon: "🌙",
      description: "Make it last longer",
      preferences: { ...preferences, duration: Math.min(100, preferences.duration + 30) }
    })

    return alternatives.map(alt => ({
      ...alt,
      recommendation: this.recommend(alt.preferences)
    }))
  }

  /**
   * Oracle's mystical sayings
   */
  speak(context, data = {}) {
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

    const thinking = [
      "Consulting the cosmic archives...",
      "The stars whisper their secrets...",
      "Let me divine the perfect combination...",
      "The universe reveals its wisdom..."
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
      case 'thinking':
        return this.randomChoice(thinking)
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
    let valid = true

    // Check minimum
    if (cards.length < 12) {
      warnings.push("⚠️ Not enough questions. Add at least 12 cards.")
      suggestions.push({ 
        action: 'add_random', 
        count: 12 - cards.length,
        message: `Add ${12 - cards.length} more cards`
      })
      valid = false
    }

    // Check category diversity
    const categories = new Set(cards.map(c => c.category))
    if (categories.size < 3) {
      warnings.push("⚠️ Consider adding more variety (at least 3 categories).")
      const missingCategories = this.suggestCategories(cards)
      suggestions.push({ 
        action: 'add_category', 
        categories: missingCategories,
        message: `Try adding: ${missingCategories.slice(0, 2).join(', ')}`
      })
    }

    // Check balance
    const avgSpice = cards.reduce((sum, c) => sum + c.metadata.spiceLevel, 0) / cards.length
    if (avgSpice > 4) {
      warnings.push("⚠️ Very spicy topics! Ensure players are comfortable.")
    } else if (avgSpice < 1.5) {
      suggestions.push({ 
        action: 'add_spice', 
        message: "Consider adding bolder questions for variety"
      })
    }

    // Check difficulty balance
    const difficulties = cards.map(c => c.metadata.difficulty)
    const hardCount = difficulties.filter(d => d === 'hard').length
    const ratio = hardCount / cards.length
    
    if (ratio > 0.7) {
      warnings.push("⚠️ Very challenging deck. Consider some easier questions.")
      suggestions.push({
        action: 'add_easy',
        message: "Add some lighter questions for balance"
      })
    } else if (ratio < 0.1) {
      suggestions.push({
        action: 'add_challenging',
        message: "Consider adding thought-provoking questions"
      })
    }

    return {
      valid,
      warnings,
      suggestions,
      stats: {
        count: cards.length,
        categories: categories.size,
        avgSpice: Math.round(avgSpice * 10) / 10,
        difficulty: {
          easy: difficulties.filter(d => d === 'easy').length,
          medium: difficulties.filter(d => d === 'medium').length,
          hard: difficulties.filter(d => d === 'hard').length
        }
      }
    }
  }

  /**
   * Suggest categories to add for balance
   */
  suggestCategories(currentCards) {
    const currentCategories = new Set(currentCards.map(c => c.category))
    const allCategories = Object.keys(CATEGORY_METADATA)
    
    return allCategories.filter(cat => !currentCategories.has(cat)).slice(0, 3)
  }

  /**
   * Quick preset configurations
   */
  getQuickPresets() {
    return {
      quickGame: {
        name: "Quick Game",
        icon: "⚡",
        description: "Fast-paced fun (15-20 min)",
        preferences: {
          seriousness: 30,
          duration: 20,
          spiceLevel: 40,
          playerCount: 6
        }
      },
      brainTeasers: {
        name: "Brain Teasers",
        icon: "🧠",
        description: "Deep thinking required",
        preferences: {
          seriousness: 80,
          duration: 60,
          spiceLevel: 50,
          playerCount: 6
        }
      },
      partyMix: {
        name: "Party Mix",
        icon: "🎉",
        description: "Perfect for groups",
        preferences: {
          seriousness: 40,
          duration: 50,
          spiceLevel: 30,
          playerCount: 8
        }
      },
      cosmicJourney: {
        name: "Cosmic Journey",
        icon: "🌌",
        description: "Balanced exploration",
        preferences: {
          seriousness: 55,
          duration: 55,
          spiceLevel: 55,
          playerCount: 6
        }
      },
      boldDebate: {
        name: "Bold Debate",
        icon: "🔥",
        description: "Controversial & spicy",
        preferences: {
          seriousness: 70,
          duration: 50,
          spiceLevel: 85,
          playerCount: 6
        }
      }
    }
  }

  /**
   * Apply a preset and get recommendations
   */
  applyPreset(presetName) {
    const presets = this.getQuickPresets()
    const preset = presets[presetName]
    
    if (!preset) {
      console.warn(`Preset "${presetName}" not found`)
      return null
    }

    return {
      preset,
      recommendation: this.recommend(preset.preferences)
    }
  }
}

// Export singleton instance
export const oracleAI = new OracleAI()

// Export class for testing
export default OracleAI
