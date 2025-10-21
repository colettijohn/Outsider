/**
 * CardBrowserTest - Testing & Demo Page
 * Comprehensive testing interface for the Card Browser
 */

import React, { useState } from 'react'
import { OracleButton } from './oracle'
import { questionCards } from '../data/questionCards'

export default function CardBrowserTest() {
  const [testMode, setTestMode] = useState('overview')

  const stats = {
    totalCards: questionCards.length,
    categories: [...new Set(questionCards.map(c => c.category))].length,
    difficulties: {
      easy: questionCards.filter(c => c.metadata.difficulty === 'easy').length,
      medium: questionCards.filter(c => c.metadata.difficulty === 'medium').length,
      hard: questionCards.filter(c => c.metadata.difficulty === 'hard').length
    },
    spice: {
      1: questionCards.filter(c => c.metadata.spiceLevel === 1).length,
      2: questionCards.filter(c => c.metadata.spiceLevel === 2).length,
      3: questionCards.filter(c => c.metadata.spiceLevel === 3).length,
      4: questionCards.filter(c => c.metadata.spiceLevel === 4).length,
      5: questionCards.filter(c => c.metadata.spiceLevel === 5).length
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black text-white p-4 overflow-y-auto">
      <div className="max-w-6xl mx-auto py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            🎴 Card Browser Test Lab
          </h1>
          <p className="text-xl text-purple-300">
            Advanced Card Selection Interface Testing
          </p>
        </div>

        {/* Mode Selector */}
        <section className="mb-12">
          <div className="flex justify-center gap-4 flex-wrap">
            <OracleButton
              variant={testMode === 'overview' ? 'primary' : 'secondary'}
              onClick={() => setTestMode('overview')}
            >
              📊 Overview
            </OracleButton>
            <OracleButton
              variant={testMode === 'features' ? 'primary' : 'secondary'}
              onClick={() => setTestMode('features')}
            >
              ✨ Features
            </OracleButton>
            <OracleButton
              variant={testMode === 'testing' ? 'primary' : 'secondary'}
              onClick={() => setTestMode('testing')}
            >
              🧪 Testing
            </OracleButton>
            <OracleButton
              variant={testMode === 'stats' ? 'primary' : 'secondary'}
              onClick={() => setTestMode('stats')}
            >
              📈 Stats
            </OracleButton>
          </div>
        </section>

        {/* Overview Mode */}
        {testMode === 'overview' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-3xl font-bold mb-6 text-center">📖 Card Browser Overview</h2>
              
              <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-8 backdrop-blur-sm text-center">
                <div className="mb-6">
                  <p className="text-purple-300 text-lg mb-4">
                    Browse all {questionCards.length} questions with advanced filtering and selection
                  </p>
                  <OracleButton
                    variant="cosmic"
                    size="large"
                    icon="🔮"
                    onClick={() => {
                      console.log("Navigate to Card Browser")
                      alert("In the game, use: gameContext.setGameScreen('cardBrowser')")
                    }}
                  >
                    Launch Card Browser
                  </OracleButton>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="p-6 bg-purple-950/50 rounded-lg">
                    <div className="text-4xl mb-3">🔍</div>
                    <h3 className="text-xl font-bold mb-2 text-purple-300">Search & Filter</h3>
                    <p className="text-sm text-purple-200">
                      Find exactly what you need with text search and multi-dimensional filters
                    </p>
                  </div>

                  <div className="p-6 bg-purple-950/50 rounded-lg">
                    <div className="text-4xl mb-3">🎴</div>
                    <h3 className="text-xl font-bold mb-2 text-purple-300">Card Selection</h3>
                    <p className="text-sm text-purple-200">
                      Tap to select individual cards or use quick actions for bulk operations
                    </p>
                  </div>

                  <div className="p-6 bg-purple-950/50 rounded-lg">
                    <div className="text-4xl mb-3">🗂️</div>
                    <h3 className="text-xl font-bold mb-2 text-purple-300">Collection Drawer</h3>
                    <p className="text-sm text-purple-200">
                      Slide-up panel shows selected cards with validation and actions
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 text-center">🎯 User Flow</h2>
              
              <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
                <ol className="space-y-4 text-purple-200">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">1</span>
                    <div>
                      <div className="font-bold text-white">Browse Cards</div>
                      <div className="text-sm">View all {questionCards.length} question cards in grid or list layout</div>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">2</span>
                    <div>
                      <div className="font-bold text-white">Apply Filters</div>
                      <div className="text-sm">Narrow by category, difficulty, spice level, or search text</div>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">3</span>
                    <div>
                      <div className="font-bold text-white">Select Cards</div>
                      <div className="text-sm">Tap individual cards or use quick actions (Select All, Random 10, etc.)</div>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">4</span>
                    <div>
                      <div className="font-bold text-white">Review Collection</div>
                      <div className="text-sm">Open drawer to see selected cards and validation status</div>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">5</span>
                    <div>
                      <div className="font-bold text-white">Continue</div>
                      <div className="text-sm">Accept deck and proceed to lobby</div>
                    </div>
                  </li>
                </ol>
              </div>
            </section>
          </div>
        )}

        {/* Features Mode */}
        {testMode === 'features' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6 text-center">✨ Feature Showcase</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Search */}
              <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">🔍</div>
                  <h3 className="text-xl font-bold">Text Search</h3>
                </div>
                <ul className="space-y-2 text-sm text-purple-200">
                  <li>• Search question text</li>
                  <li>• Search categories</li>
                  <li>• Search tags</li>
                  <li>• Real-time filtering</li>
                  <li>• Clear button for reset</li>
                </ul>
              </div>

              {/* Filters */}
              <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">🎛️</div>
                  <h3 className="text-xl font-bold">Multi-Dimensional Filters</h3>
                </div>
                <ul className="space-y-2 text-sm text-purple-200">
                  <li>• Category (12+ categories)</li>
                  <li>• Difficulty (easy/medium/hard)</li>
                  <li>• Spice level (1-5)</li>
                  <li>• Sort by multiple criteria</li>
                  <li>• Collapsible filter panel</li>
                </ul>
              </div>

              {/* Quick Actions */}
              <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">⚡</div>
                  <h3 className="text-xl font-bold">Quick Actions</h3>
                </div>
                <ul className="space-y-2 text-sm text-purple-200">
                  <li>• Select All (filtered results)</li>
                  <li>• Random 10 cards</li>
                  <li>• Clear selection</li>
                  <li>• Select entire category</li>
                  <li>• One-click operations</li>
                </ul>
              </div>

              {/* Collection Drawer */}
              <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">🗂️</div>
                  <h3 className="text-xl font-bold">Collection Drawer</h3>
                </div>
                <ul className="space-y-2 text-sm text-purple-200">
                  <li>• Slide-up from bottom</li>
                  <li>• Shows selected cards</li>
                  <li>• Real-time validation</li>
                  <li>• Remove cards inline</li>
                  <li>• Badge counter on toggle</li>
                </ul>
              </div>

              {/* Card Display */}
              <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">🎴</div>
                  <h3 className="text-xl font-bold">Card Display</h3>
                </div>
                <ul className="space-y-2 text-sm text-purple-200">
                  <li>• Grid view (responsive)</li>
                  <li>• List view (future)</li>
                  <li>• Flip animations</li>
                  <li>• Selection indicator</li>
                  <li>• Metadata display</li>
                </ul>
              </div>

              {/* Validation */}
              <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">✅</div>
                  <h3 className="text-xl font-bold">Smart Validation</h3>
                </div>
                <ul className="space-y-2 text-sm text-purple-200">
                  <li>• Minimum card requirement</li>
                  <li>• Category diversity check</li>
                  <li>• Balance suggestions</li>
                  <li>• Warning messages</li>
                  <li>• Powered by OracleAI</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Testing Mode */}
        {testMode === 'testing' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6 text-center">🧪 Testing Checklist</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4 text-purple-300">Functional Tests</h3>
                <ul className="space-y-2 text-sm text-purple-200">
                  <li>☐ All {questionCards.length} cards display correctly</li>
                  <li>☐ Search filters results in real-time</li>
                  <li>☐ Category filter works</li>
                  <li>☐ Difficulty filter works</li>
                  <li>☐ Spice filter works</li>
                  <li>☐ Sort by changes order</li>
                  <li>☐ Select/deselect individual cards</li>
                  <li>☐ Select All button works</li>
                  <li>☐ Random 10 button works</li>
                  <li>☐ Clear button works</li>
                  <li>☐ Collection drawer slides up/down</li>
                  <li>☐ Remove cards from drawer</li>
                  <li>☐ Validation shows warnings</li>
                  <li>☐ Continue button navigates to lobby</li>
                  <li>☐ Back button returns to Quick Ritual</li>
                </ul>
              </div>

              <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4 text-purple-300">UX Tests</h3>
                <ul className="space-y-2 text-sm text-purple-200">
                  <li>☐ Cards are clearly readable</li>
                  <li>☐ Selection state is obvious</li>
                  <li>☐ Filters are discoverable</li>
                  <li>☐ Drawer animation is smooth</li>
                  <li>☐ Badge updates on selection</li>
                  <li>☐ No empty states feel broken</li>
                  <li>☐ Mobile responsive (320px+)</li>
                  <li>☐ Touch targets 44px+</li>
                  <li>☐ Scrolling is smooth</li>
                  <li>☐ Search is fast</li>
                  <li>☐ Icons make sense</li>
                  <li>☐ Colors aid understanding</li>
                  <li>☐ No visual glitches</li>
                  <li>☐ Overall feel is professional</li>
                  <li>☐ Easy to build a deck</li>
                </ul>
              </div>

              <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4 text-purple-300">Edge Cases</h3>
                <ul className="space-y-2 text-sm text-purple-200">
                  <li>☐ Search with no results</li>
                  <li>☐ Select 0 cards and continue</li>
                  <li>☐ Select 60 cards (all)</li>
                  <li>☐ Rapid filtering changes</li>
                  <li>☐ Multiple filters at once</li>
                  <li>☐ Clear filters after selection</li>
                  <li>☐ Drawer with 1 card</li>
                  <li>☐ Drawer with 60 cards</li>
                  <li>☐ Long category names</li>
                  <li>☐ Special characters in search</li>
                </ul>
              </div>

              <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4 text-purple-300">Performance</h3>
                <ul className="space-y-2 text-sm text-purple-200">
                  <li>☐ Initial load is fast</li>
                  <li>☐ Search doesn't lag</li>
                  <li>☐ Filter changes are instant</li>
                  <li>☐ Selecting cards is responsive</li>
                  <li>☐ Drawer animation is 60fps</li>
                  <li>☐ Scrolling is smooth with all cards</li>
                  <li>☐ No memory leaks</li>
                  <li>☐ Works on low-end devices</li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm text-center">
              <h3 className="text-xl font-bold mb-4">Console Commands</h3>
              <pre className="bg-purple-950/50 p-4 rounded-lg text-sm text-left text-purple-200 overflow-x-auto">
{`// Navigate to Card Browser
gameContext.setGameScreen('cardBrowser')

// Get all cards
import { questionCards } from './data/questionCards'
console.log(questionCards)

// Test filtering
const filtered = questionCards.filter(c => c.category === 'Deep Thoughts')
console.log(filtered)

// Test validation
import { oracleAI } from './services/OracleAI'
const validation = oracleAI.validateDeck(selectedCards)
console.log(validation)`}
              </pre>
            </div>
          </div>
        )}

        {/* Stats Mode */}
        {testMode === 'stats' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6 text-center">📈 Card Database Statistics</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm text-center">
                <div className="text-5xl font-bold text-purple-400 mb-2">{stats.totalCards}</div>
                <div className="text-lg text-purple-300">Total Cards</div>
              </div>

              <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm text-center">
                <div className="text-5xl font-bold text-purple-400 mb-2">{stats.categories}</div>
                <div className="text-lg text-purple-300">Categories</div>
              </div>

              <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm text-center">
                <div className="text-5xl font-bold text-purple-400 mb-2">
                  {Math.round((stats.totalCards / stats.categories) * 10) / 10}
                </div>
                <div className="text-lg text-purple-300">Avg per Category</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4 text-purple-300">Difficulty Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(stats.difficulties).map(([level, count]) => (
                    <div key={level}>
                      <div className="flex justify-between mb-1">
                        <span className="capitalize">{level}</span>
                        <span className="font-bold">{count} cards ({Math.round(count / stats.totalCards * 100)}%)</span>
                      </div>
                      <div className="w-full bg-purple-950/50 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            level === 'easy' ? 'bg-green-500' :
                            level === 'medium' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${(count / stats.totalCards) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4 text-purple-300">Spice Level Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(stats.spice).map(([level, count]) => (
                    <div key={level}>
                      <div className="flex justify-between mb-1">
                        <span>{'🌶️'.repeat(parseInt(level))} Level {level}</span>
                        <span className="font-bold">{count} cards ({Math.round(count / stats.totalCards * 100)}%)</span>
                      </div>
                      <div className="w-full bg-purple-950/50 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                          style={{ width: `${(count / stats.totalCards) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4 text-purple-300">Category Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[...new Set(questionCards.map(c => c.category))].sort().map(category => {
                  const count = questionCards.filter(c => c.category === category).length
                  return (
                    <div key={category} className="p-3 bg-purple-950/50 rounded-lg">
                      <div className="font-semibold mb-1">{category}</div>
                      <div className="text-sm text-purple-300">{count} cards</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
