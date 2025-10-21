/**
 * CardBrowserScreen - Advanced Card Selection Interface
 * 
 * For players who want full control over their question deck.
 * Browse all 60 cards with filtering, search, and category navigation.
 * 
 * Features:
 * - Browse all cards in card grid or list view
 * - Filter by category, difficulty, spice level, tags
 * - Search by text
 * - Swipe gestures on mobile (future)
 * - Collection drawer showing selected cards
 * - Drag to reorder (future)
 * - Quick actions (select all category, random X)
 * - Oracle guidance available
 */

import React, { useState, useEffect, useMemo } from 'react'
import { useGame } from '../contexts/GameContext'
import { ParticleEffect } from './oracle'
import { EnhancedOracleButton as OracleButton, EnhancedOracleCard as OracleCard } from './oracle/EnhancedComponents'
import { sounds } from '../utils/sounds'
import { haptics } from '../utils/haptics'
import { questionCards, CATEGORY_METADATA } from '../data/questionCards'
import { oracleAI } from '../services/OracleAI'
import Icon from './Icon'

export default function CardBrowserScreen() {
  const { setGameScreen, updateGameSettings } = useGame()
  
  // Selection state
  const [selectedCards, setSelectedCards] = useState([])
  const [showDrawer, setShowDrawer] = useState(false)
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedSpice, setSelectedSpice] = useState('all')
  const [sortBy, setSortBy] = useState('category') // category, difficulty, spice, popularity
  
  // View state
  const [viewMode, setViewMode] = useState('grid') // grid, list
  const [showFilters, setShowFilters] = useState(false)

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(questionCards.map(c => c.category))].sort()
    return ['all', ...cats]
  }, [])

  // Filter and sort cards
  const filteredCards = useMemo(() => {
    let cards = questionCards

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      cards = cards.filter(card => 
        card.question.toLowerCase().includes(query) ||
        card.category.toLowerCase().includes(query) ||
        card.metadata.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      cards = cards.filter(c => c.category === selectedCategory)
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      cards = cards.filter(c => c.metadata.difficulty === selectedDifficulty)
    }

    // Spice filter
    if (selectedSpice !== 'all') {
      const spiceLevel = parseInt(selectedSpice)
      cards = cards.filter(c => c.metadata.spiceLevel === spiceLevel)
    }

    // Sort
    cards = [...cards].sort((a, b) => {
      switch (sortBy) {
        case 'category':
          return a.category.localeCompare(b.category)
        case 'difficulty':
          const diffOrder = { easy: 1, medium: 2, hard: 3 }
          return diffOrder[a.metadata.difficulty] - diffOrder[b.metadata.difficulty]
        case 'spice':
          return a.metadata.spiceLevel - b.metadata.spiceLevel
        case 'popularity':
          return b.metadata.popularity - a.metadata.popularity
        default:
          return 0
      }
    })

    return cards
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedSpice, sortBy])

  // Toggle card selection
  const handleToggleCard = (card) => {
    setSelectedCards(prev => {
      const isSelected = prev.some(c => c.id === card.id)
      if (isSelected) {
        return prev.filter(c => c.id !== card.id)
      } else {
        return [...prev, card]
      }
    })
  }

  // Quick actions
  const handleSelectAll = () => {
    setSelectedCards(filteredCards)
  }

  const handleDeselectAll = () => {
    setSelectedCards([])
  }

  const handleSelectRandom = (count) => {
    const available = questionCards.filter(card => 
      !selectedCards.some(c => c.id === card.id)
    )
    const shuffled = [...available].sort(() => Math.random() - 0.5)
    const random = shuffled.slice(0, count)
    setSelectedCards(prev => [...prev, ...random])
  }

  const handleSelectCategory = (category) => {
    const categoryCards = questionCards.filter(c => c.category === category)
    const newCards = categoryCards.filter(card => 
      !selectedCards.some(c => c.id === card.id)
    )
    setSelectedCards(prev => [...prev, ...newCards])
  }

  const handleRemoveCard = (cardId) => {
    setSelectedCards(prev => prev.filter(c => c.id !== cardId))
  }

  // Proceed with selected cards
  const handleContinue = () => {
    const validation = oracleAI.validateDeck(selectedCards)
    
    if (!validation.valid) {
      // Show warnings
      alert(validation.warnings.join('\n'))
      return
    }

    updateGameSettings({
      customQuestions: selectedCards,
      questionCount: selectedCards.length
    })
    
    setGameScreen('lobby')
  }

  // Get validation
  const validation = selectedCards.length > 0 ? oracleAI.validateDeck(selectedCards) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black text-white flex flex-col">
      {/* Particle Background */}
      <div className="fixed inset-0 pointer-events-none">
        <ParticleEffect type="gentle" count={40} color="#A855F7" speed={0.3} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-purple-700/30 bg-purple-900/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Back Button */}
            <button
              onClick={() => setGameScreen('quickRitual')}
              className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
            >
              <Icon name="ArrowLeft" className="w-5 h-5" />
              <span className="hidden sm:inline">Quick Ritual</span>
            </button>

            {/* Title */}
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Card Browser
              </h1>
              <p className="text-xs text-purple-400">
                {filteredCards.length} of {questionCards.length} cards
                {selectedCards.length > 0 && ` · ${selectedCards.length} selected`}
              </p>
            </div>

            {/* Collection Drawer Toggle */}
            <button
              onClick={() => {
                const newState = !showDrawer
                setShowDrawer(newState)
                if (newState) {
                  sounds.drawerOpen()
                  haptics.drawer()
                } else {
                  sounds.drawerClose()
                  haptics.light()
                }
              }}
              className={`
                relative px-4 py-2 rounded-lg border-2 transition-all
                ${selectedCards.length > 0
                  ? 'bg-purple-600 border-purple-400 animate-pulse'
                  : 'bg-purple-900/50 border-purple-700/50 hover:border-purple-500'
                }
              `}
            >
              <Icon name="ShoppingCart" className="w-5 h-5" />
              {selectedCards.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {selectedCards.length}
                </span>
              )}
            </button>
          </div>

          {/* Search & Filters */}
          <div className="mt-4 space-y-3">
            {/* Search Bar */}
            <div className="relative">
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="text"
                placeholder="Search questions, categories, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-purple-950/50 border border-purple-700 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white"
                >
                  <Icon name="X" className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filter Toggle & Quick Actions */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <OracleButton
                variant={showFilters ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setShowFilters(!showFilters)}
                icon="🔍"
              >
                Filters
              </OracleButton>
              <OracleButton
                variant="ghost"
                size="small"
                onClick={handleSelectAll}
              >
                Select All ({filteredCards.length})
              </OracleButton>
              <OracleButton
                variant="ghost"
                size="small"
                onClick={() => handleSelectRandom(10)}
              >
                Random 10
              </OracleButton>
              <OracleButton
                variant="ghost"
                size="small"
                onClick={handleDeselectAll}
                disabled={selectedCards.length === 0}
              >
                Clear
              </OracleButton>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4 space-y-3">
                <div className="grid md:grid-cols-4 gap-3">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-xs text-purple-300 mb-1">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat === 'all' ? 'All Categories' : cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <label className="block text-xs text-purple-300 mb-1">Difficulty</label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                    >
                      <option value="all">All Levels</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  {/* Spice Filter */}
                  <div>
                    <label className="block text-xs text-purple-300 mb-1">Spice Level</label>
                    <select
                      value={selectedSpice}
                      onChange={(e) => setSelectedSpice(e.target.value)}
                      className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                    >
                      <option value="all">All Spice</option>
                      <option value="1">🌶️ Mild (1)</option>
                      <option value="2">🌶️🌶️ Medium (2)</option>
                      <option value="3">🌶️🌶️🌶️ Spicy (3)</option>
                      <option value="4">🌶️🌶️🌶️🌶️ Hot (4)</option>
                      <option value="5">🌶️🌶️🌶️🌶️🌶️ Nuclear (5)</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-xs text-purple-300 mb-1">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 bg-purple-950/50 border border-purple-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                    >
                      <option value="category">Category</option>
                      <option value="difficulty">Difficulty</option>
                      <option value="spice">Spice Level</option>
                      <option value="popularity">Popularity</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 overflow-y-auto p-4">
        <div className="max-w-7xl mx-auto">
          {filteredCards.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No cards found</h3>
              <p className="text-purple-300">Try adjusting your filters or search query</p>
              <OracleButton
                variant="secondary"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setSelectedDifficulty('all')
                  setSelectedSpice('all')
                }}
                className="mt-4"
              >
                Reset Filters
              </OracleButton>
            </div>
          ) : (
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
                : 'space-y-4'
              }
            `}>
              {filteredCards.map((card) => (
                <OracleCard
                  key={card.id}
                  question={card}
                  isSelected={selectedCards.some(c => c.id === card.id)}
                  onToggle={() => handleToggleCard(card)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Collection Drawer (Slide-up panel) */}
      {showDrawer && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setShowDrawer(false)}
        />
      )}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50
          bg-purple-900/95 backdrop-blur-md
          border-t-2 border-purple-500/50
          transition-transform duration-300
          ${showDrawer ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'}
        `}
      >
        {/* Drawer Handle */}
        <button
          onClick={() => setShowDrawer(!showDrawer)}
          className="w-full py-3 flex items-center justify-center gap-2 text-purple-300 hover:text-white transition-colors"
        >
          <div className="w-12 h-1 bg-purple-500 rounded-full" />
        </button>

        {/* Drawer Content */}
        <div className="max-h-96 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">
                Selected Cards ({selectedCards.length})
              </h3>
              <OracleButton
                variant="ghost"
                size="small"
                onClick={handleDeselectAll}
                disabled={selectedCards.length === 0}
              >
                Clear All
              </OracleButton>
            </div>

            {/* Validation */}
            {validation && (
              <div className={`
                mb-4 p-4 rounded-lg border-2
                ${validation.valid 
                  ? 'bg-green-900/30 border-green-500/50' 
                  : 'bg-yellow-900/30 border-yellow-500/50'}
              `}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{validation.valid ? '✅' : '⚠️'}</span>
                  <div className="font-bold">
                    {validation.valid ? 'Deck Ready!' : 'Needs Attention'}
                  </div>
                </div>
                {validation.warnings.length > 0 && (
                  <ul className="text-sm space-y-1 ml-10">
                    {validation.warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                )}
                {validation.suggestions.length > 0 && (
                  <ul className="text-sm space-y-1 ml-10 mt-2 text-purple-200">
                    {validation.suggestions.map((suggestion, i) => (
                      <li key={i}>💡 {suggestion.message}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Selected Cards Grid */}
            {selectedCards.length === 0 ? (
              <div className="text-center py-8 text-purple-400">
                <p>No cards selected yet</p>
                <p className="text-sm mt-1">Browse and tap cards to add them</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {selectedCards.map((card) => (
                  <div
                    key={card.id}
                    className="relative bg-purple-800/30 border border-purple-700/50 rounded-lg p-3 text-sm group"
                  >
                    <button
                      onClick={() => handleRemoveCard(card.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <Icon name="X" className="w-4 h-4" />
                    </button>
                    <div className="text-xs text-purple-400 mb-1">{card.category}</div>
                    <div className="line-clamp-2">{card.question}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <OracleButton
                variant="secondary"
                onClick={() => setShowDrawer(false)}
                className="flex-1"
              >
                Keep Browsing
              </OracleButton>
              <OracleButton
                variant="cosmic"
                onClick={handleContinue}
                disabled={selectedCards.length === 0}
                className="flex-1"
                icon="🚀"
              >
                Continue to Lobby
              </OracleButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
