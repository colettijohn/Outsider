/**
 * QuickRitualTest - Testing & Demo Page
 * Standalone test page for the Quick Ritual flow
 */

import React, { useState } from 'react'
import { OracleButton } from './oracle'

export default function QuickRitualTest() {
  const [testMode, setTestMode] = useState('demo')
  
  const scenarios = [
    {
      name: "Quick Party Game",
      description: "15-min light-hearted session",
      preferences: { seriousness: 20, duration: 20, spiceLevel: 30 }
    },
    {
      name: "Deep Discussion",
      description: "Epic philosophical journey",
      preferences: { seriousness: 85, duration: 80, spiceLevel: 60 }
    },
    {
      name: "Balanced Mix",
      description: "Perfect for any group",
      preferences: { seriousness: 50, duration: 50, spiceLevel: 50 }
    },
    {
      name: "Spicy & Bold",
      description: "Controversial topics",
      preferences: { seriousness: 70, duration: 60, spiceLevel: 90 }
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black text-white p-4 overflow-y-auto">
      <div className="max-w-6xl mx-auto py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            🎭 Quick Ritual Test Lab
          </h1>
          <p className="text-xl text-purple-300">
            Interactive Testing for the 30-Second Setup Flow
          </p>
        </div>

        {/* Mode Selector */}
        <section className="mb-12">
          <div className="flex justify-center gap-4">
            <OracleButton
              variant={testMode === 'demo' ? 'primary' : 'secondary'}
              onClick={() => setTestMode('demo')}
            >
              📊 Demo Mode
            </OracleButton>
            <OracleButton
              variant={testMode === 'scenarios' ? 'primary' : 'secondary'}
              onClick={() => setTestMode('scenarios')}
            >
              🎬 Test Scenarios
            </OracleButton>
            <OracleButton
              variant={testMode === 'docs' ? 'primary' : 'secondary'}
              onClick={() => setTestMode('docs')}
            >
              📖 Documentation
            </OracleButton>
          </div>
        </section>

        {/* Demo Mode */}
        {testMode === 'demo' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-3xl font-bold mb-6 text-center">🎬 Quick Ritual Demo</h2>
              
              <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-8 backdrop-blur-sm text-center">
                <div className="mb-6">
                  <p className="text-purple-300 text-lg mb-4">
                    Access the Quick Ritual screen to test the full flow:
                  </p>
                  <OracleButton
                    variant="cosmic"
                    size="large"
                    icon="🔮"
                    onClick={() => {
                      // In a real scenario, this would use the game context
                      console.log("Navigate to Quick Ritual")
                      alert("In the game, use: gameContext.setGameScreen('quickRitual')")
                    }}
                  >
                    Launch Quick Ritual
                  </OracleButton>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="p-6 bg-purple-950/50 rounded-lg text-left">
                    <h3 className="text-xl font-bold mb-4 text-purple-300">✨ Features</h3>
                    <ul className="space-y-2 text-sm text-purple-200">
                      <li>• 7-step guided flow (~30 seconds)</li>
                      <li>• Oracle Orb with state transitions</li>
                      <li>• 3 simple slider questions</li>
                      <li>• AI-powered recommendations</li>
                      <li>• Animated card reveals</li>
                      <li>• Deck validation</li>
                      <li>• 5 quick presets</li>
                      <li>• Progressive disclosure UI</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-purple-950/50 rounded-lg text-left">
                    <h3 className="text-xl font-bold mb-4 text-purple-300">🎯 Flow Steps</h3>
                    <ol className="space-y-2 text-sm text-purple-200">
                      <li><strong>1. Greeting (3s)</strong> - Oracle introduces itself</li>
                      <li><strong>2. Question 1 (5s)</strong> - How serious? 🎭</li>
                      <li><strong>3. Question 2 (5s)</strong> - How long? ⏱️</li>
                      <li><strong>4. Question 3 (5s)</strong> - How spicy? 🌶️</li>
                      <li><strong>5. Thinking (3s)</strong> - Oracle processes</li>
                      <li><strong>6. Revealing (6s)</strong> - Shows cards</li>
                      <li><strong>7. Confirmation (3s)</strong> - Accept/tweak</li>
                    </ol>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 text-center">🎮 Console Access</h2>
              
              <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
                <p className="text-purple-300 mb-4">Use these commands in the browser console:</p>
                <pre className="bg-purple-950/50 p-4 rounded-lg text-sm text-purple-200 overflow-x-auto">
{`// Navigate to Quick Ritual
gameContext.setGameScreen('quickRitual')

// Skip to specific step (for testing)
// In component, set: setStep('revealing')

// Test with preset
const result = oracleAI.applyPreset('quickGame')
console.log(result)`}
                </pre>
              </div>
            </section>
          </div>
        )}

        {/* Test Scenarios */}
        {testMode === 'scenarios' && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">🎬 Test Scenarios</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {scenarios.map((scenario, i) => (
                <div
                  key={i}
                  className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm"
                >
                  <h3 className="text-xl font-bold mb-2">{scenario.name}</h3>
                  <p className="text-purple-300 text-sm mb-4">{scenario.description}</p>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-400">Seriousness:</span>
                      <span className="font-bold">{scenario.preferences.seriousness}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Duration:</span>
                      <span className="font-bold">{scenario.preferences.duration}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">Spice Level:</span>
                      <span className="font-bold">{scenario.preferences.spiceLevel}%</span>
                    </div>
                  </div>

                  <OracleButton
                    variant="secondary"
                    size="small"
                    onClick={() => {
                      console.log(`Testing scenario: ${scenario.name}`, scenario.preferences)
                      alert(`In Quick Ritual, set these preferences and click through the flow`)
                    }}
                    className="w-full"
                  >
                    Test This Scenario
                  </OracleButton>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4">🧪 Testing Checklist</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-purple-300 mb-2">Functional Tests:</h4>
                  <ul className="space-y-1 text-purple-200">
                    <li>☐ All 7 steps complete successfully</li>
                    <li>☐ Oracle state transitions work</li>
                    <li>☐ Sliders update preferences</li>
                    <li>☐ Back button works on Q2 & Q3</li>
                    <li>☐ Presets apply correctly</li>
                    <li>☐ Cards reveal with animation</li>
                    <li>☐ Validation shows warnings</li>
                    <li>☐ Accept navigates to lobby</li>
                    <li>☐ Tweak returns to Q1</li>
                    <li>☐ Advanced mode navigation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-300 mb-2">UX Tests:</h4>
                  <ul className="space-y-1 text-purple-200">
                    <li>☐ Flow completes in ~30 seconds</li>
                    <li>☐ Messages are clear and helpful</li>
                    <li>☐ Animations feel smooth</li>
                    <li>☐ No jarring transitions</li>
                    <li>☐ Progress indicator updates</li>
                    <li>☐ Mobile responsive (320px+)</li>
                    <li>☐ Touch targets 44px+</li>
                    <li>☐ Haptic feedback works</li>
                    <li>☐ Particle effects enhance mood</li>
                    <li>☐ Overall feel is magical</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documentation */}
        {testMode === 'docs' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-3xl font-bold mb-6 text-center">📖 Documentation</h2>
              
              <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4">Quick Ritual Component</h3>
                
                <div className="space-y-6 text-purple-200">
                  <div>
                    <h4 className="text-xl font-semibold text-purple-300 mb-2">Purpose</h4>
                    <p>
                      A revolutionary 30-second game setup experience that replaces the traditional
                      boring settings screen. The Oracle guides players through 3 simple questions
                      and uses AI to recommend the perfect question deck.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-purple-300 mb-2">Architecture</h4>
                    <pre className="bg-purple-950/50 p-4 rounded-lg text-sm overflow-x-auto">
{`QuickRitualScreen
├── Uses OracleOrb (state transitions)
├── Uses OracleSlider (3 questions)
├── Uses OracleCard (card reveals)
├── Uses OracleButton (navigation)
├── Uses ParticleEffect (background)
├── Integrates OracleAI (recommendations)
└── Updates GameContext (selected cards)`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-purple-300 mb-2">State Machine</h4>
                    <pre className="bg-purple-950/50 p-4 rounded-lg text-sm overflow-x-auto">
{`greeting → q1 → q2 → q3 → thinking → revealing → confirmation

Each state:
- Updates Oracle appearance/message
- Shows relevant UI elements
- Auto-advances or waits for user
- Tracks preferences
- Animates transitions`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-purple-300 mb-2">Integration Points</h4>
                    <ul className="space-y-2">
                      <li><strong>GameContext:</strong> Uses setGameScreen, updateGameSettings</li>
                      <li><strong>OracleAI:</strong> Calls recommend(), validateDeck(), getQuickPresets()</li>
                      <li><strong>Navigation:</strong> Home → Quick Ritual → Lobby</li>
                      <li><strong>Escape Hatch:</strong> "Advanced" button → Full customize screen</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-purple-300 mb-2">Key Features</h4>
                    <ul className="space-y-2">
                      <li>✨ <strong>Progressive Disclosure:</strong> One question at a time</li>
                      <li>🎭 <strong>Oracle Personality:</strong> Mystical guide adds character</li>
                      <li>⚡ <strong>Quick Presets:</strong> Skip to recommended configs</li>
                      <li>🎴 <strong>Animated Reveals:</strong> Cards appear one by one</li>
                      <li>✅ <strong>Validation:</strong> Warns about deck issues</li>
                      <li>🔄 <strong>Refinement:</strong> Easy to tweak and retry</li>
                      <li>📱 <strong>Mobile-First:</strong> Touch-optimized throughout</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-purple-300 mb-2">Performance</h4>
                    <ul className="space-y-2">
                      <li>Target: Complete flow in ~30 seconds</li>
                      <li>Lazy loading: Only renders current step</li>
                      <li>Particle optimization: Reduced count vs background</li>
                      <li>Animation: CSS transforms (GPU accelerated)</li>
                      <li>AI processing: Simulated 3s delay (feels intentional)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 text-center">🚀 Future Enhancements</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-bold mb-3 text-purple-300">Phase 5 Polish</h3>
                  <ul className="space-y-2 text-sm text-purple-200">
                    <li>• Sound effects for transitions</li>
                    <li>• Richer haptic patterns</li>
                    <li>• Oracle voice synthesis</li>
                    <li>• More particle variety</li>
                    <li>• Micro-animations on cards</li>
                  </ul>
                </div>

                <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-bold mb-3 text-purple-300">Advanced Features</h3>
                  <ul className="space-y-2 text-sm text-purple-200">
                    <li>• Save custom presets</li>
                    <li>• Share ritual configs</li>
                    <li>• Learning from past games</li>
                    <li>• Seasonal question sets</li>
                    <li>• Multiplayer ritual sync</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        )}

      </div>
    </div>
  )
}
