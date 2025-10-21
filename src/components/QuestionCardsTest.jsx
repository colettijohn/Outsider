import React, { useState } from 'react'
import {
  questionCards,
  getCardsByCategory,
  getAllCategories,
  getCardsByDifficulty,
  getCardsBySpice,
  searchCards,
  filterCards,
  getRandomCards,
  getQuestionStats,
  CATEGORY_METADATA,
  convertCardsToLegacy
} from '../data/questionCards'
import questionsJSON from '../data/questions.json'

/**
 * Test component to verify question card conversion and utilities
 */
export const QuestionCardsTest = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [spiceRange, setSpiceRange] = useState([1, 5])
  const [sampleCard, setSampleCard] = useState(questionCards[0])

  const stats = getQuestionStats()
  const categories = getAllCategories()

  // Test search
  const searchResults = searchTerm ? searchCards(searchTerm) : []

  // Test filtering
  const filteredCards = filterCards({
    categories: selectedCategory !== 'all' ? [selectedCategory] : null,
    difficulties: selectedDifficulty !== 'all' ? [selectedDifficulty] : null,
    spiceRange: spiceRange
  })

  // Test conversion back to legacy
  const legacyFormat = convertCardsToLegacy(questionCards)
  const isBackwardsCompatible = 
    Object.keys(legacyFormat).length === Object.keys(questionsJSON).filter(k => questionsJSON[k].length > 0).length

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-purple-400 mb-2">
            🎴 Question Cards Test
          </h1>
          <p className="text-gray-400">
            Verify question conversion and utility functions
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-6">
            <p className="text-sm text-purple-300 mb-1">Total Cards</p>
            <p className="text-4xl font-bold text-white">{stats.totalCards}</p>
          </div>
          <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-6">
            <p className="text-sm text-blue-300 mb-1">Categories</p>
            <p className="text-4xl font-bold text-white">{stats.categories}</p>
          </div>
          <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-6">
            <p className="text-sm text-green-300 mb-1">Avg Time</p>
            <p className="text-4xl font-bold text-white">{Math.floor(stats.averageTime / 60)}min</p>
          </div>
          <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-6">
            <p className="text-sm text-red-300 mb-1">Backwards Compatible</p>
            <p className="text-4xl font-bold text-white">{isBackwardsCompatible ? '✅' : '❌'}</p>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Difficulty Distribution</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-green-400 text-3xl font-bold">{stats.difficultyBreakdown.easy}</p>
              <p className="text-gray-400">Easy</p>
            </div>
            <div className="text-center">
              <p className="text-yellow-400 text-3xl font-bold">{stats.difficultyBreakdown.medium}</p>
              <p className="text-gray-400">Medium</p>
            </div>
            <div className="text-center">
              <p className="text-red-400 text-3xl font-bold">{stats.difficultyBreakdown.hard}</p>
              <p className="text-gray-400">Hard</p>
            </div>
          </div>
        </div>

        {/* Spice Breakdown */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Spice Level Distribution</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-blue-400 text-3xl font-bold">{stats.spiceBreakdown.mild}</p>
              <p className="text-gray-400">Mild (1-2)</p>
            </div>
            <div className="text-center">
              <p className="text-orange-400 text-3xl font-bold">{stats.spiceBreakdown.medium}</p>
              <p className="text-gray-400">Medium (3)</p>
            </div>
            <div className="text-center">
              <p className="text-red-400 text-3xl font-bold">{stats.spiceBreakdown.spicy}</p>
              <p className="text-gray-400">Spicy (4-5)</p>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Categories ({stats.categories})</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.categoryBreakdown.map(cat => (
              <div
                key={cat.category}
                className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => setSelectedCategory(cat.category)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-white font-semibold text-sm">{cat.category}</span>
                </div>
                <p className="text-gray-400 text-xs">{cat.count} cards</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Search & Filter</h2>
          
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions..."
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
            {searchTerm && (
              <p className="text-gray-400 text-sm mt-2">
                Found {searchResults.length} cards matching "{searchTerm}"
              </p>
            )}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {CATEGORY_METADATA[cat]?.icon} {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Spice: {spiceRange[0]} - {spiceRange[1]}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={spiceRange[1]}
                onChange={(e) => setSpiceRange([1, parseInt(e.target.value)])}
                className="w-full"
              />
            </div>
          </div>

          <p className="text-gray-400 text-sm mt-4">
            Showing {filteredCards.length} cards
          </p>
        </div>

        {/* Sample Card Display */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Sample Card</h2>
            <button
              onClick={() => setSampleCard(getRandomCards(1)[0])}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              🎲 Random Card
            </button>
          </div>

          {sampleCard && (
            <div className="bg-gray-700 rounded-lg p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{sampleCard.categoryIcon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{sampleCard.category}</h3>
                    <p className="text-xs text-gray-400">ID: {sampleCard.id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-semibold
                    ${sampleCard.metadata.difficulty === 'easy' ? 'bg-green-600' : ''}
                    ${sampleCard.metadata.difficulty === 'medium' ? 'bg-yellow-600' : ''}
                    ${sampleCard.metadata.difficulty === 'hard' ? 'bg-red-600' : ''}
                  `}>
                    {sampleCard.metadata.difficulty.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 bg-orange-600 rounded-full text-xs font-semibold">
                    🔥 {sampleCard.metadata.spiceLevel}/5
                  </span>
                </div>
              </div>

              {/* Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4">
                  <p className="text-green-400 font-semibold mb-2">👥 Crew Version</p>
                  <p className="text-white">{sampleCard.crew}</p>
                </div>
                <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4">
                  <p className="text-red-400 font-semibold mb-2">💀 Outsider Version</p>
                  <p className="text-white">{sampleCard.impostor}</p>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-4 gap-4 text-center text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Time</p>
                  <p className="text-white font-semibold">⏱️ {Math.floor(sampleCard.metadata.estimatedTime / 60)}min</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Players</p>
                  <p className="text-white font-semibold">
                    👥 {sampleCard.metadata.playerCount.min}-{sampleCard.metadata.playerCount.max}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Tags</p>
                  <p className="text-white font-semibold">🏷️ {sampleCard.metadata.tags.length}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Custom</p>
                  <p className="text-white font-semibold">{sampleCard.metadata.isCustom ? '✅' : '❌'}</p>
                </div>
              </div>

              {/* Tags */}
              {sampleCard.metadata.tags.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-400 text-sm mb-2">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {sampleCard.metadata.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Utility Functions Test */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Utility Functions</h2>
          <div className="space-y-3">
            <button
              onClick={() => console.log('All categories:', getAllCategories())}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-left"
            >
              📋 Log All Categories
            </button>
            <button
              onClick={() => console.log('Easy cards:', getCardsByDifficulty('easy'))}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-left"
            >
              ✨ Log Easy Cards
            </button>
            <button
              onClick={() => console.log('Spicy cards:', getCardsBySpice(4, 5))}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-left"
            >
              🔥 Log Spicy Cards (4-5)
            </button>
            <button
              onClick={() => console.log('Random 10:', getRandomCards(10))}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-left"
            >
              🎲 Log 10 Random Cards
            </button>
            <button
              onClick={() => console.log('Legacy format:', convertCardsToLegacy(questionCards))}
              className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-left"
            >
              🔄 Log Legacy Format
            </button>
            <button
              onClick={() => console.table(getQuestionStats())}
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-left"
            >
              📊 Log Statistics (Table)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionCardsTest
