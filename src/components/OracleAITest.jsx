/**
 * OracleAI Test Page
 * Interactive testing interface for the AI recommendation engine
 */

import React, { useState, useEffect } from 'react'
import { oracleAI } from '../services/OracleAI'
import { OracleButton, OracleCard, OracleSlider } from './oracle'

export default function OracleAITest() {
  // Preferences state
  const [preferences, setPreferences] = useState({
    seriousness: 50,
    duration: 50,
    spiceLevel: 50,
    playerCount: 6,
    specialFocus: []
  })

  // Results state
  const [recommendation, setRecommendation] = useState(null)
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [oracleMessage, setOracleMessage] = useState('')
  const [showAlternatives, setShowAlternatives] = useState(false)

  // Get recommendations when preferences change
  useEffect(() => {
    const timer = setTimeout(() => {
      setOracleMessage(oracleAI.speak('thinking'))
      
      setTimeout(() => {
        const result = oracleAI.recommend(preferences)
        setRecommendation(result)
        setOracleMessage(oracleAI.speak('revealing'))
      }, 500)
    }, 300)

    return () => clearTimeout(timer)
  }, [preferences])

  const handleSliderChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const applyPreset = (presetKey) => {
    const result = oracleAI.applyPreset(presetKey)
    if (result) {
      setSelectedPreset(presetKey)
      setPreferences(result.preset.preferences)
      setRecommendation(result.recommendation)
      setOracleMessage(oracleAI.speak('encouraging'))
    }
  }

  const validateDeck = () => {
    if (!recommendation) return null
    return oracleAI.validateDeck(recommendation.cards)
  }

  const validation = validateDeck()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-4 overflow-y-auto">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            🔮 Oracle AI Test Lab
          </h1>
          <p className="text-xl text-purple-300">
            Interactive Testing for the Recommendation Engine
          </p>
          {oracleMessage && (
            <div className="mt-4 p-4 bg-purple-800/30 border border-purple-500/50 rounded-lg backdrop-blur-sm">
              <p className="text-purple-200 italic">"{oracleMessage}"</p>
            </div>
          )}
        </div>

        {/* Quick Presets */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">⚡ Quick Presets</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(oracleAI.getQuickPresets()).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-300
                  ${selectedPreset === key
                    ? 'bg-purple-600 border-purple-400 shadow-lg shadow-purple-500/50'
                    : 'bg-purple-900/30 border-purple-700/50 hover:border-purple-500 hover:bg-purple-800/50'
                  }
                `}
              >
                <div className="text-4xl mb-2">{preset.icon}</div>
                <div className="font-bold text-sm">{preset.name}</div>
                <div className="text-xs text-purple-300 mt-1">{preset.description}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Custom Preferences */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🎛️ Custom Preferences</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Seriousness Slider */}
            <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-6 backdrop-blur-sm">
              <label className="block mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">🎭 Tone</span>
                  <span className="text-purple-300">
                    {preferences.seriousness < 33 ? 'Party Mode 🎉' : 
                     preferences.seriousness > 66 ? 'Deep Thoughts 🧠' : 
                     'Balanced ⚖️'}
                  </span>
                </div>
                <OracleSlider
                  value={preferences.seriousness}
                  onChange={(val) => handleSliderChange('seriousness', val)}
                  min={0}
                  max={100}
                  label="Party ← → Deep"
                  emoji="🎭"
                />
              </label>
            </div>

            {/* Duration Slider */}
            <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-6 backdrop-blur-sm">
              <label className="block mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">⏱️ Duration</span>
                  <span className="text-purple-300">
                    {Math.round(15 + preferences.duration * 1.05)} min
                  </span>
                </div>
                <OracleSlider
                  value={preferences.duration}
                  onChange={(val) => handleSliderChange('duration', val)}
                  min={0}
                  max={100}
                  label="Quick ← → Epic"
                  emoji="⏱️"
                />
              </label>
            </div>

            {/* Spice Level Slider */}
            <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-6 backdrop-blur-sm">
              <label className="block mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">🌶️ Spice Level</span>
                  <span className="text-purple-300">
                    {preferences.spiceLevel < 33 ? 'Safe 😊' : 
                     preferences.spiceLevel > 66 ? 'Wild 🔥' : 
                     'Medium 🌶️'}
                  </span>
                </div>
                <OracleSlider
                  value={preferences.spiceLevel}
                  onChange={(val) => handleSliderChange('spiceLevel', val)}
                  min={0}
                  max={100}
                  label="Safe ← → Wild"
                  emoji="🌶️"
                />
              </label>
            </div>

            {/* Player Count */}
            <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-6 backdrop-blur-sm">
              <label className="block mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">👥 Players</span>
                  <span className="text-purple-300">{preferences.playerCount} people</span>
                </div>
                <OracleSlider
                  value={preferences.playerCount}
                  onChange={(val) => handleSliderChange('playerCount', val)}
                  min={3}
                  max={12}
                  label="3-12 players"
                  emoji="👥"
                />
              </label>
            </div>
          </div>
        </section>

        {/* Recommendation Results */}
        {recommendation && (
          <>
            {/* Summary */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">✨ Recommendation Summary</h2>
              <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-2 border-purple-500/50 rounded-xl p-6 backdrop-blur-sm">
                <div className="mb-6">
                  <p className="text-lg text-purple-200 italic mb-4">
                    "{recommendation.reasoning}"
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-purple-300">Confidence:</span>
                    <div className="flex-1 bg-purple-900/50 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${recommendation.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{Math.round(recommendation.confidence * 100)}%</span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-purple-800/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-300">
                      {recommendation.metadata.actualCount}
                    </div>
                    <div className="text-xs text-purple-400">Questions</div>
                  </div>
                  <div className="text-center p-3 bg-purple-800/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-300">
                      {recommendation.categories.length}
                    </div>
                    <div className="text-xs text-purple-400">Categories</div>
                  </div>
                  <div className="text-center p-3 bg-purple-800/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-300">
                      {recommendation.metadata.avgDifficulty}
                    </div>
                    <div className="text-xs text-purple-400">Difficulty</div>
                  </div>
                  <div className="text-center p-3 bg-purple-800/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-300">
                      {recommendation.metadata.estimatedTime}m
                    </div>
                    <div className="text-xs text-purple-400">Est. Time</div>
                  </div>
                </div>

                {/* Categories */}
                <div className="mt-4">
                  <div className="text-sm text-purple-300 mb-2">Focus Areas:</div>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.categories.map(cat => (
                      <span
                        key={cat}
                        className="px-3 py-1 bg-purple-700/50 rounded-full text-sm"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Validation */}
            {validation && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">✅ Deck Validation</h2>
                <div className={`
                  border-2 rounded-xl p-6 backdrop-blur-sm
                  ${validation.valid 
                    ? 'bg-green-900/30 border-green-500/50' 
                    : 'bg-yellow-900/30 border-yellow-500/50'}
                `}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{validation.valid ? '✅' : '⚠️'}</span>
                    <div>
                      <div className="font-bold text-lg">
                        {validation.valid ? 'Deck Ready!' : 'Needs Attention'}
                      </div>
                      <div className="text-sm opacity-80">
                        {validation.stats.count} cards, {validation.stats.categories} categories
                      </div>
                    </div>
                  </div>

                  {validation.warnings.length > 0 && (
                    <div className="mb-4">
                      <div className="font-semibold mb-2">Warnings:</div>
                      <ul className="space-y-1">
                        {validation.warnings.map((warning, i) => (
                          <li key={i} className="text-sm text-yellow-200">{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {validation.suggestions.length > 0 && (
                    <div>
                      <div className="font-semibold mb-2">Suggestions:</div>
                      <ul className="space-y-1">
                        {validation.suggestions.map((suggestion, i) => (
                          <li key={i} className="text-sm text-purple-200">💡 {suggestion.message}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-purple-500/30">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-purple-300">Easy:</span>{' '}
                        <span className="font-bold">{validation.stats.difficulty.easy}</span>
                      </div>
                      <div>
                        <span className="text-purple-300">Medium:</span>{' '}
                        <span className="font-bold">{validation.stats.difficulty.medium}</span>
                      </div>
                      <div>
                        <span className="text-purple-300">Hard:</span>{' '}
                        <span className="font-bold">{validation.stats.difficulty.hard}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Sample Cards */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">🎴 Sample Questions (Top 6)</h2>
                <div className="text-sm text-purple-300">
                  {recommendation.cards.length} total cards
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendation.cards.slice(0, 6).map((card, i) => (
                  <div key={card.id} className="relative">
                    <div className="absolute -top-2 -left-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold text-sm z-10">
                      {i + 1}
                    </div>
                    <OracleCard
                      question={card}
                      isSelected={false}
                      onToggle={() => console.log('Toggle', card.id)}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Alternatives */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">🔄 Alternative Suggestions</h2>
                <OracleButton
                  variant="ghost"
                  size="small"
                  onClick={() => setShowAlternatives(!showAlternatives)}
                >
                  {showAlternatives ? 'Hide' : 'Show'}
                </OracleButton>
              </div>
              
              {showAlternatives && (
                <div className="grid md:grid-cols-2 gap-4">
                  {oracleAI.generateAlternatives(preferences).map((alt) => (
                    <div
                      key={alt.name}
                      className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-6 backdrop-blur-sm hover:border-purple-500 transition-colors cursor-pointer"
                      onClick={() => setPreferences(alt.preferences)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{alt.icon}</span>
                        <div>
                          <div className="font-bold">{alt.name}</div>
                          <div className="text-sm text-purple-300">{alt.description}</div>
                        </div>
                      </div>
                      <div className="text-xs text-purple-400">
                        {alt.recommendation.cards.length} questions · {' '}
                        {alt.recommendation.categories.length} categories · {' '}
                        {alt.recommendation.metadata.estimatedTime}m
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* Actions */}
        <section className="flex justify-center gap-4">
          <OracleButton
            variant="secondary"
            onClick={() => {
              setPreferences({
                seriousness: 50,
                duration: 50,
                spiceLevel: 50,
                playerCount: 6,
                specialFocus: []
              })
              setSelectedPreset(null)
            }}
          >
            Reset
          </OracleButton>
          <OracleButton
            variant="cosmic"
            onClick={() => {
              console.log('Full Recommendation:', recommendation)
              console.log('Validation:', validation)
              alert('Check console for full data!')
            }}
          >
            View Full Data
          </OracleButton>
        </section>
      </div>
    </div>
  )
}
