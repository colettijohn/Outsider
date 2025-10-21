/**
 * QuickRitualScreen - Fast 30-Second Game Setup
 * 
 * A mystical, Oracle-guided experience for rapid game customization.
 * Players answer 3 simple questions via sliders, and the Oracle
 * weaves the perfect question deck using AI recommendations.
 * 
 * Flow:
 * 1. Greeting (3s) - Oracle introduces itself
 * 2. Question 1 (5s) - "How serious?" slider
 * 3. Question 2 (5s) - "How long?" slider
 * 4. Question 3 (5s) - "How spicy?" slider
 * 5. Thinking (3s) - Oracle processes preferences
 * 6. Revealing (6s) - Shows recommended cards with animation
 * 7. Confirmation (3s) - Accept or tweak
 * 
 * Total: ~30 seconds
 */

import React, { useState, useEffect, useRef } from 'react'
import { useGame } from '../contexts/GameContext'
import { OracleOrb, ParticleEffect } from './oracle'
import { EnhancedOracleButton as OracleButton, EnhancedOracleSlider as OracleSlider, EnhancedOracleCard as OracleCard } from './oracle/EnhancedComponents'
import { sounds } from '../utils/sounds'
import { haptics } from '../utils/haptics'
import { oracleAI } from '../services/OracleAI'

export default function QuickRitualScreen() {
  const { setGameScreen, updateGameSettings, handleCreateRoom, nickname } = useGame()
  
  // Flow state
  const [step, setStep] = useState('greeting') // greeting, q1, q2, q3, thinking, revealing, confirmation
  const [preferences, setPreferences] = useState({
    seriousness: 50,
    duration: 50,
    spiceLevel: 50,
    playerCount: 6
  })
  const [recommendation, setRecommendation] = useState(null)
  const [selectedCards, setSelectedCards] = useState([])
  const [showCards, setShowCards] = useState(false)
  
  // Oracle state
  const [oracleState, setOracleState] = useState('idle')
  const [oracleMessage, setOracleMessage] = useState('')
  
  // Animation state
  const [cardRevealIndex, setCardRevealIndex] = useState(0)
  const stepTimerRef = useRef(null)

  // Flow sequence
  useEffect(() => {
    // Create room when entering Quick Ritual
    if (nickname) {
      handleCreateRoom({ preventDefault: () => {} })
    }
    
    startRitual()
    return () => {
      if (stepTimerRef.current) {
        clearTimeout(stepTimerRef.current)
      }
    }
  }, [])

  const startRitual = () => {
    // Step 1: Greeting
    setOracleState('idle')
    setOracleMessage(oracleAI.speak('greeting'))
    sounds.shimmer()
    haptics.light()
    
    stepTimerRef.current = setTimeout(() => {
      setStep('q1')
      setOracleState('listening')
      setOracleMessage("Tell me, how serious should this gathering be? Light-hearted fun or deep contemplation?")
      sounds.whoosh()
    }, 3000)
  }

  const handleSliderComplete = (questionNum) => {
    if (questionNum === 1) {
      // Move to question 2
      sounds.whoosh()
      stepTimerRef.current = setTimeout(() => {
        setStep('q2')
        setOracleMessage("And how much time do the entities have? A quick spark or an epic journey?")
      }, 800)
    } else if (questionNum === 2) {
      // Move to question 3
      sounds.whoosh()
      stepTimerRef.current = setTimeout(() => {
        setStep('q3')
        setOracleMessage("Finally, how bold should these questions be? Safe waters or uncharted territory?")
      }, 800)
    } else if (questionNum === 3) {
      // Move to thinking
      proceedToThinking()
    }
  }

  const proceedToThinking = () => {
    setStep('thinking')
    setOracleState('thinking')
    setOracleMessage(oracleAI.speak('thinking'))
    sounds.thinking()
    haptics.thinking()
    
    // Simulate AI processing
    stepTimerRef.current = setTimeout(() => {
      // Get recommendation from OracleAI
      const result = oracleAI.recommend(preferences)
      setRecommendation(result)
      setSelectedCards(result.cards)
      
      // Move to revealing
      setStep('revealing')
      setOracleState('revealing')
      setOracleMessage(result.reasoning)
      sounds.reveal()
      haptics.reveal()
      
      // Start card reveal animation
      setTimeout(() => {
        setShowCards(true)
        animateCardReveal()
      }, 2000)
      
    }, 3000)
  }

  const animateCardReveal = () => {
    let index = 0
    const interval = setInterval(() => {
      if (index < 6) { // Show first 6 cards
        setCardRevealIndex(index + 1)
        sounds.pop()
        haptics.light()
        index++
      } else {
        clearInterval(interval)
        // Move to confirmation after all cards shown
        setTimeout(() => {
          setStep('confirmation')
          setOracleState('celebrating')
          setOracleMessage("Excellent! These cosmic decrees are ready. Shall we begin the ritual?")
          sounds.celebration()
          haptics.celebration()
        }, 1000)
      }
    }, 400)
  }

  const handleAccept = () => {
    // Update game settings with selected cards
    updateGameSettings({
      customQuestions: selectedCards,
      questionCount: selectedCards.length
    })
    
    // Show celebration
    setOracleState('celebrating')
    setOracleMessage(oracleAI.speak('encouraging'))
    
    // Navigate to lobby after brief celebration
    setTimeout(() => {
      setGameScreen('lobby')
    }, 2000)
  }

  const handleTweak = () => {
    // Go back to question 1 to adjust
    setStep('q1')
    setOracleState('listening')
    setOracleMessage("Let us refine your vision. How serious should the gathering be?")
    setShowCards(false)
    setCardRevealIndex(0)
  }

  const handleAdvancedMode = () => {
    // Navigate to full card browser (Phase 4)
    setGameScreen('cardBrowser')
  }

  const handlePresetSelect = (presetKey) => {
    const result = oracleAI.applyPreset(presetKey)
    if (result) {
      setPreferences(result.preset.preferences)
      // Skip questions and go straight to thinking
      proceedToThinking()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black text-white flex flex-col">
      {/* Particle Background */}
      <div className="fixed inset-0 pointer-events-none">
        <ParticleEffect
          type={step === 'revealing' ? 'burst' : step === 'thinking' ? 'cosmic' : 'gentle'}
          count={step === 'revealing' ? 100 : 60}
          color="#A855F7"
          speed={step === 'thinking' ? 1 : 0.5}
        />
      </div>

      {/* Header with Skip Option */}
      <div className="relative z-10 p-4 flex justify-between items-center">
        <button
          onClick={() => setGameScreen('home')}
          className="px-4 py-2 text-purple-300 hover:text-white transition-colors flex items-center gap-2"
        >
          <span>←</span> Back
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Quick Ritual
          </h1>
          <p className="text-xs text-purple-400">~30 seconds to perfection</p>
        </div>
        <button
          onClick={handleAdvancedMode}
          className="px-4 py-2 text-purple-300 hover:text-white transition-colors"
        >
          Advanced →
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        
        {/* Oracle Orb */}
        <div className="mb-8">
          <OracleOrb
            state={oracleState}
            message={oracleMessage}
            size="large"
            enableParticles={false} // Using background particles instead
            onMessageComplete={() => {
              // Auto-advance after message completes (optional)
            }}
          />
        </div>

        {/* Quick Presets (shown during greeting) */}
        {step === 'greeting' && (
          <div className="mt-8 max-w-4xl w-full animate-fade-in">
            <p className="text-center text-purple-300 mb-4">Or choose a preset ritual:</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(oracleAI.getQuickPresets()).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => handlePresetSelect(key)}
                  className="p-4 bg-purple-900/30 border-2 border-purple-700/50 rounded-lg hover:border-purple-500 hover:bg-purple-800/50 transition-all group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {preset.icon}
                  </div>
                  <div className="text-sm font-semibold">{preset.name}</div>
                  <div className="text-xs text-purple-400 mt-1">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question Sliders */}
        {(step === 'q1' || step === 'q2' || step === 'q3') && (
          <div className="mt-8 max-w-2xl w-full animate-slide-up">
            <div className="bg-purple-900/40 backdrop-blur-sm border-2 border-purple-500/50 rounded-2xl p-8">
              
              {step === 'q1' && (
                <div className="animate-fade-in">
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-3">🎭</div>
                    <h3 className="text-2xl font-bold mb-2">Question 1 of 3</h3>
                    <p className="text-purple-300">Set the tone</p>
                  </div>
                  <OracleSlider
                    value={preferences.seriousness}
                    onChange={(val) => setPreferences(prev => ({ ...prev, seriousness: val }))}
                    min={0}
                    max={100}
                    label="Party Mode ← → Deep Thoughts"
                    emoji="🎭"
                  />
                  <div className="mt-6 flex justify-center">
                    <OracleButton
                      variant="primary"
                      onClick={() => handleSliderComplete(1)}
                    >
                      Next Question →
                    </OracleButton>
                  </div>
                </div>
              )}

              {step === 'q2' && (
                <div className="animate-fade-in">
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-3">⏱️</div>
                    <h3 className="text-2xl font-bold mb-2">Question 2 of 3</h3>
                    <p className="text-purple-300">Choose your duration</p>
                  </div>
                  <OracleSlider
                    value={preferences.duration}
                    onChange={(val) => setPreferences(prev => ({ ...prev, duration: val }))}
                    min={0}
                    max={100}
                    label="Quick Spark ← → Epic Journey"
                    emoji="⏱️"
                  />
                  <div className="text-center mt-4 text-purple-300">
                    Estimated: {Math.round(15 + preferences.duration * 1.05)} minutes
                  </div>
                  <div className="mt-6 flex justify-center gap-3">
                    <OracleButton
                      variant="ghost"
                      onClick={() => setStep('q1')}
                    >
                      ← Back
                    </OracleButton>
                    <OracleButton
                      variant="primary"
                      onClick={() => handleSliderComplete(2)}
                    >
                      Next Question →
                    </OracleButton>
                  </div>
                </div>
              )}

              {step === 'q3' && (
                <div className="animate-fade-in">
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-3">🌶️</div>
                    <h3 className="text-2xl font-bold mb-2">Question 3 of 3</h3>
                    <p className="text-purple-300">How bold should we go?</p>
                  </div>
                  <OracleSlider
                    value={preferences.spiceLevel}
                    onChange={(val) => setPreferences(prev => ({ ...prev, spiceLevel: val }))}
                    min={0}
                    max={100}
                    label="Safe Waters ← → Uncharted Territory"
                    emoji="🌶️"
                  />
                  <div className="mt-6 flex justify-center gap-3">
                    <OracleButton
                      variant="ghost"
                      onClick={() => setStep('q2')}
                    >
                      ← Back
                    </OracleButton>
                    <OracleButton
                      variant="cosmic"
                      onClick={() => handleSliderComplete(3)}
                      icon="✨"
                    >
                      Weave My Decree
                    </OracleButton>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Card Reveal */}
        {step === 'revealing' && showCards && recommendation && (
          <div className="mt-8 max-w-6xl w-full animate-fade-in">
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold mb-2">Your Cosmic Decree</h3>
              <p className="text-purple-300">
                {recommendation.cards.length} questions from {recommendation.categories.length} constellations
              </p>
              <div className="flex justify-center gap-4 mt-3 text-sm">
                <span className="px-3 py-1 bg-purple-700/50 rounded-full">
                  {recommendation.metadata.avgDifficulty} difficulty
                </span>
                <span className="px-3 py-1 bg-purple-700/50 rounded-full">
                  🌶️ {Math.round(recommendation.metadata.avgSpice * 10) / 10}/5
                </span>
                <span className="px-3 py-1 bg-purple-700/50 rounded-full">
                  ⏱️ {recommendation.metadata.estimatedTime}m
                </span>
              </div>
            </div>

            {/* Sample Cards (first 6) */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {recommendation.cards.slice(0, 6).map((card, index) => (
                <div
                  key={card.id}
                  className={`
                    transition-all duration-500 transform
                    ${index < cardRevealIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                  `}
                  style={{
                    transitionDelay: `${index * 100}ms`
                  }}
                >
                  <OracleCard
                    question={card}
                    isSelected={true}
                    onToggle={() => {}}
                  />
                </div>
              ))}
            </div>

            {recommendation.cards.length > 6 && (
              <p className="text-center text-purple-400 text-sm">
                +{recommendation.cards.length - 6} more questions in your deck
              </p>
            )}
          </div>
        )}

        {/* Confirmation */}
        {step === 'confirmation' && (
          <div className="mt-8 max-w-2xl w-full animate-fade-in">
            <div className="bg-purple-900/40 backdrop-blur-sm border-2 border-purple-500/50 rounded-2xl p-8">
              
              {/* Validation */}
              {recommendation && (() => {
                const validation = oracleAI.validateDeck(recommendation.cards)
                return (
                  <div className={`
                    mb-6 p-4 rounded-lg border-2
                    ${validation.valid 
                      ? 'bg-green-900/30 border-green-500/50' 
                      : 'bg-yellow-900/30 border-yellow-500/50'}
                  `}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{validation.valid ? '✅' : '⚠️'}</span>
                      <div className="font-bold">
                        {validation.valid ? 'Deck Ready!' : 'Minor Adjustments Suggested'}
                      </div>
                    </div>
                    {validation.warnings.length > 0 && (
                      <ul className="text-sm space-y-1 ml-10">
                        {validation.warnings.map((warning, i) => (
                          <li key={i} className="text-yellow-200">{warning}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })()}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <OracleButton
                  variant="ghost"
                  onClick={handleTweak}
                  className="flex-1"
                >
                  🔄 Adjust Preferences
                </OracleButton>
                <OracleButton
                  variant="secondary"
                  onClick={handleAdvancedMode}
                  className="flex-1"
                >
                  🎴 Browse All Cards
                </OracleButton>
                <OracleButton
                  variant="cosmic"
                  onClick={handleAccept}
                  className="flex-1"
                  icon="🚀"
                >
                  Begin Ritual!
                </OracleButton>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Progress Indicator */}
      {(step === 'q1' || step === 'q2' || step === 'q3') && (
        <div className="relative z-10 p-4">
          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <div className={`flex-1 h-2 rounded-full transition-all ${step === 'q1' || step === 'q2' || step === 'q3' ? 'bg-purple-500' : 'bg-purple-800'}`} />
              <div className={`flex-1 h-2 rounded-full transition-all ${step === 'q2' || step === 'q3' ? 'bg-purple-500' : 'bg-purple-800'}`} />
              <div className={`flex-1 h-2 rounded-full transition-all ${step === 'q3' ? 'bg-purple-500' : 'bg-purple-800'}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Add custom animations
const style = document.createElement('style')
style.textContent = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
  .animate-slide-up {
    animation: slide-up 0.6s ease-out;
  }
`
if (!document.querySelector('style[data-quick-ritual-animations]')) {
  style.setAttribute('data-quick-ritual-animations', 'true')
  document.head.appendChild(style)
}
