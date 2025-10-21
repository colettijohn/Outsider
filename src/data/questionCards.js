/**
 * Question Cards Data Structure
 * 
 * This file contains all questions in a card-based format with rich metadata.
 * Each card represents a single question pair (crew + impostor version).
 * 
 * Metadata helps with:
 * - AI-powered recommendations
 * - Smart filtering and search
 * - Difficulty balancing
 * - Time estimation
 * - Category organization
 */

import questionsJSON from './questions.json'

/**
 * Category metadata for theming and organization
 */
export const CATEGORY_METADATA = {
  'Deep Thoughts': {
    icon: '💭',
    color: '#8B5CF6',  // purple
    description: 'Philosophical and introspective questions',
    seriousness: 80,
    constellation: 'Lyra'
  },
  'Hypotheticals': {
    icon: '🤔',
    color: '#06B6D4',  // cyan
    description: 'Imaginative what-if scenarios',
    seriousness: 50,
    constellation: 'Andromeda'
  },
  'Wild Cards': {
    icon: '🎬',
    color: '#F59E0B',  // amber
    description: 'Pop culture and entertainment',
    seriousness: 30,
    constellation: 'Cassiopeia'
  },
  'Daily Routines': {
    icon: '☕',
    color: '#10B981',  // emerald
    description: 'Everyday life and habits',
    seriousness: 35,
    constellation: 'Ursa Minor'
  },
  'Objects & Places': {
    icon: '🏛️',
    color: '#3B82F6',  // blue
    description: 'Physical spaces and possessions',
    seriousness: 40,
    constellation: 'Orion'
  },
  'History & Mythology': {
    icon: '⚔️',
    color: '#EF4444',  // red
    description: 'Ancient tales and historical events',
    seriousness: 60,
    constellation: 'Perseus'
  },
  'Science & Nature': {
    icon: '🔬',
    color: '#14B8A6',  // teal
    description: 'Natural world and scientific wonders',
    seriousness: 65,
    constellation: 'Draco'
  },
  'Arts & Literature': {
    icon: '🎨',
    color: '#EC4899',  // pink
    description: 'Creative works and artistic expression',
    seriousness: 55,
    constellation: 'Cygnus'
  },
  'Food & Drink': {
    icon: '🍕',
    color: '#F97316',  // orange
    description: 'Culinary preferences and experiences',
    seriousness: 25,
    constellation: 'Taurus'
  },
  'Travel & Geography': {
    icon: '🌍',
    color: '#22C55E',  // green
    description: 'Places to go and adventures to have',
    seriousness: 45,
    constellation: 'Aquarius'
  },
  'Technology & Future': {
    icon: '🚀',
    color: '#6366F1',  // indigo
    description: 'Innovation and what comes next',
    seriousness: 70,
    constellation: 'Gemini'
  },
  'Personality & Psyche': {
    icon: '🧠',
    color: '#A855F7',  // purple
    description: 'Self-reflection and personal traits',
    seriousness: 75,
    constellation: 'Pisces'
  }
}

/**
 * Infer metadata from question text and category
 */
const inferMetadata = (questionText, category) => {
  const words = questionText.split(' ').length
  const length = questionText.length
  
  // Estimate time based on complexity
  let estimatedTime = 120  // Base 2 minutes
  if (words > 25 || questionText.includes('describe') || questionText.includes('explain')) {
    estimatedTime = 240  // 4 minutes for complex
  } else if (words > 15) {
    estimatedTime = 180  // 3 minutes for medium
  }
  
  // Infer difficulty
  const complexIndicators = [
    'why', 'how', 'describe', 'explain', 'philosophical', 'analyze',
    'humanity', 'society', 'forever', 'entire', 'most important'
  ]
  const simpleIndicators = [
    'favorite', 'what food', 'what movie', 'what song'
  ]
  
  const hasComplex = complexIndicators.some(word => 
    questionText.toLowerCase().includes(word)
  )
  const hasSimple = simpleIndicators.some(phrase => 
    questionText.toLowerCase().includes(phrase)
  )
  
  let difficulty = 'medium'
  if (hasComplex || words > 20) difficulty = 'hard'
  if (hasSimple && words < 15) difficulty = 'easy'
  
  // Infer tags from question content
  const tags = [category.toLowerCase().replace(/\s+/g, '-')]
  
  const tagPatterns = {
    'favorite': ['preferences', 'opinions'],
    'would you': ['hypothetical', 'choice'],
    'if you could': ['hypothetical', 'wishful'],
    'describe': ['creative', 'expressive'],
    'why': ['analytical', 'deep'],
    'what do you think': ['opinion', 'debate'],
    'worst': ['negative', 'critical'],
    'best': ['positive', 'superlative'],
    'secret': ['personal', 'revealing'],
    'always': ['habitual', 'consistent'],
    'never': ['absolutes'],
    'people': ['social', 'humanity']
  }
  
  Object.entries(tagPatterns).forEach(([phrase, newTags]) => {
    if (questionText.toLowerCase().includes(phrase)) {
      tags.push(...newTags)
    }
  })
  
  // Infer spice level (how controversial/bold)
  const spicyWords = [
    'secret', 'afraid', 'worst', 'hate', 'terrifying', 'villain',
    'terrible', 'overrated', 'controversial', 'disaster', 'fear',
    'death', 'forever', 'eliminate', 'brutal'
  ]
  
  let spiceCount = 0
  spicyWords.forEach(word => {
    if (questionText.toLowerCase().includes(word)) spiceCount++
  })
  
  const categorySpice = {
    'Deep Thoughts': 3,
    'Hypotheticals': 2,
    'Wild Cards': 2,
    'Daily Routines': 1,
    'Objects & Places': 1,
    'History & Mythology': 3,
    'Science & Nature': 2,
    'Arts & Literature': 2,
    'Food & Drink': 1,
    'Travel & Geography': 1,
    'Technology & Future': 3,
    'Personality & Psyche': 3
  }
  
  const baseSpice = categorySpice[category] || 2
  const spiceLevel = Math.min(5, Math.max(1, baseSpice + Math.floor(spiceCount / 2)))
  
  // Player count recommendation
  const playerCount = { min: 3, max: 12 }
  if (difficulty === 'hard' || spiceLevel >= 4) {
    playerCount.min = 4  // Complex questions need more mature groups
    playerCount.max = 8
  }
  
  return {
    estimatedTime,
    difficulty,
    playerCount,
    tags: [...new Set(tags)],  // Remove duplicates
    spiceLevel,
    popularity: 0,  // Will be updated based on usage
    isCustom: false
  }
}

/**
 * Convert legacy questions.json to card format
 */
export const convertLegacyQuestions = (legacyQuestions) => {
  const cards = []
  let cardIndex = 0
  
  Object.entries(legacyQuestions).forEach(([category, questions]) => {
    // Skip empty categories
    if (!questions || questions.length === 0) return
    
    const categoryMeta = CATEGORY_METADATA[category] || {
      icon: '⭐',
      color: '#6B7280',
      description: 'General questions',
      seriousness: 50
    }
    
    questions.forEach((questionPair, index) => {
      const cardId = `${category.toLowerCase().replace(/\s+/g, '_')}_${String(cardIndex).padStart(3, '0')}`
      
      cards.push({
        id: cardId,
        category,
        categoryIcon: categoryMeta.icon,
        categoryColor: categoryMeta.color,
        crew: questionPair.crew,
        impostor: questionPair.impostor,
        metadata: inferMetadata(questionPair.crew, category)
      })
      
      cardIndex++
    })
  })
  
  return cards
}

/**
 * Convert cards back to legacy format (for backwards compatibility)
 */
export const convertCardsToLegacy = (cards) => {
  const legacy = {}
  
  cards.forEach(card => {
    if (!legacy[card.category]) {
      legacy[card.category] = []
    }
    legacy[card.category].push({
      crew: card.crew,
      impostor: card.impostor
    })
  })
  
  return legacy
}

/**
 * All question cards with metadata
 */
export const questionCards = convertLegacyQuestions(questionsJSON)

/**
 * Get cards by category
 */
export const getCardsByCategory = (categoryName) => {
  return questionCards.filter(card => card.category === categoryName)
}

/**
 * Get all unique categories
 */
export const getAllCategories = () => {
  return [...new Set(questionCards.map(card => card.category))]
}

/**
 * Get cards by difficulty
 */
export const getCardsByDifficulty = (difficulty) => {
  return questionCards.filter(card => card.metadata.difficulty === difficulty)
}

/**
 * Get cards by spice level
 */
export const getCardsBySpice = (minSpice, maxSpice = 5) => {
  return questionCards.filter(card => 
    card.metadata.spiceLevel >= minSpice && 
    card.metadata.spiceLevel <= maxSpice
  )
}

/**
 * Search cards by text
 */
export const searchCards = (searchTerm) => {
  const term = searchTerm.toLowerCase()
  return questionCards.filter(card => 
    card.crew.toLowerCase().includes(term) ||
    card.impostor.toLowerCase().includes(term) ||
    card.category.toLowerCase().includes(term) ||
    card.metadata.tags.some(tag => tag.includes(term))
  )
}

/**
 * Filter cards by multiple criteria
 */
export const filterCards = ({
  categories = null,
  difficulties = null,
  spiceRange = null,
  tags = null,
  playerCount = null,
  maxTime = null
}) => {
  let filtered = [...questionCards]
  
  if (categories && categories.length > 0) {
    filtered = filtered.filter(card => categories.includes(card.category))
  }
  
  if (difficulties && difficulties.length > 0) {
    filtered = filtered.filter(card => difficulties.includes(card.metadata.difficulty))
  }
  
  if (spiceRange) {
    const [min, max] = spiceRange
    filtered = filtered.filter(card => 
      card.metadata.spiceLevel >= min && card.metadata.spiceLevel <= max
    )
  }
  
  if (tags && tags.length > 0) {
    filtered = filtered.filter(card =>
      tags.some(tag => card.metadata.tags.includes(tag))
    )
  }
  
  if (playerCount) {
    filtered = filtered.filter(card =>
      card.metadata.playerCount.min <= playerCount &&
      card.metadata.playerCount.max >= playerCount
    )
  }
  
  if (maxTime) {
    filtered = filtered.filter(card => card.metadata.estimatedTime <= maxTime)
  }
  
  return filtered
}

/**
 * Get random cards
 */
export const getRandomCards = (count, filters = {}) => {
  const filtered = Object.keys(filters).length > 0 
    ? filterCards(filters) 
    : [...questionCards]
  
  const shuffled = filtered.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

/**
 * Get statistics about questions
 */
export const getQuestionStats = () => {
  return {
    totalCards: questionCards.length,
    categories: getAllCategories().length,
    categoryBreakdown: getAllCategories().map(cat => ({
      category: cat,
      count: getCardsByCategory(cat).length,
      icon: CATEGORY_METADATA[cat]?.icon || '⭐'
    })),
    difficultyBreakdown: {
      easy: getCardsByDifficulty('easy').length,
      medium: getCardsByDifficulty('medium').length,
      hard: getCardsByDifficulty('hard').length
    },
    spiceBreakdown: {
      mild: getCardsBySpice(1, 2).length,
      medium: getCardsBySpice(3, 3).length,
      spicy: getCardsBySpice(4, 5).length
    },
    averageTime: Math.round(
      questionCards.reduce((sum, card) => sum + card.metadata.estimatedTime, 0) / 
      questionCards.length
    )
  }
}

// Export all cards as default
export default questionCards
