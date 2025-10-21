/**
 * OracleOrb Test Page
 * Interactive showcase for the mystical Oracle character
 */

import React, { useState } from 'react'
import { OracleOrb, TypewriterText, OracleButton } from './oracle'
import { oracleAI } from '../services/OracleAI'

export default function OracleOrbTest() {
  const [orbState, setOrbState] = useState('idle')
  const [message, setMessage] = useState('')
  const [orbSize, setOrbSize] = useState('large')
  const [enableParticles, setEnableParticles] = useState(true)
  const [messageLog, setMessageLog] = useState([])

  // Predefined Oracle messages
  const oracleMessages = {
    greeting: [
      "Welcome, cosmic entity. I sense you seek wisdom...",
      "Greetings, traveler. The stars await your decree...",
      "Ah, you have returned. What mysteries shall we explore today?",
      "I see you, entity. Let us divine the perfect questions together..."
    ],
    questioning: [
      "Tell me, how serious should this gathering be?",
      "Speak your desire regarding the tone of this ritual...",
      "What energy do you wish to summon?",
      "Shall we probe the depths or dance in the shallows?"
    ],
    thinking: [
      "Consulting the cosmic archives...",
      "The stars whisper their secrets...",
      "Let me divine the perfect combination...",
      "The universe reveals its wisdom..."
    ],
    revealing: [
      "I have woven your cosmic decree from the stars...",
      "Behold! The perfect questions have revealed themselves...",
      "The constellations have aligned. Your decree is ready...",
      "I have divined the ideal questions for your gathering..."
    ],
    celebrating: [
      "Excellent choice, entity. The cosmos approves!",
      "Ah, a bold decision! This will spark great discourse.",
      "Wise selection. Your gathering will be enlightening.",
      "The stars smile upon this configuration."
    ],
    warning: [
      "⚠️ Consider adding lighter topics for balance...",
      "⚠️ This may challenge your entities. Are they ready?",
      "⚠️ These questions run deep. Proceed with wisdom.",
      "⚠️ Bold choices! Ensure your entities are prepared."
    ]
  }

  const getRandomMessage = (category) => {
    const messages = oracleMessages[category] || []
    return messages[Math.floor(Math.random() * messages.length)]
  }

  const handleStateDemo = (newState) => {
    setOrbState(newState)
    const msg = getRandomMessage(newState)
    setMessage(msg)
    
    // Add to log
    setMessageLog(prev => [...prev, {
      state: newState,
      message: msg,
      timestamp: new Date().toLocaleTimeString()
    }])
  }

  const handleOracleAIDemo = () => {
    // Simulate Oracle AI conversation
    const sequence = [
      { state: 'listening', message: getRandomMessage('questioning'), delay: 0 },
      { state: 'thinking', message: getRandomMessage('thinking'), delay: 3000 },
      { state: 'revealing', message: getRandomMessage('revealing'), delay: 6000 },
      { state: 'celebrating', message: getRandomMessage('celebrating'), delay: 10000 },
      { state: 'idle', message: '', delay: 13000 }
    ]

    sequence.forEach(({ state, message, delay }) => {
      setTimeout(() => {
        setOrbState(state)
        setMessage(message)
        
        if (message) {
          setMessageLog(prev => [...prev, {
            state,
            message,
            timestamp: new Date().toLocaleTimeString()
          }])
        }
      }, delay)
    })
  }

  const clearLog = () => {
    setMessageLog([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black text-white p-4 overflow-y-auto">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            🔮 Oracle Orb Test Lab
          </h1>
          <p className="text-xl text-purple-300">
            Interactive Testing for the Mystical Guide
          </p>
        </div>

        {/* Main Oracle Display */}
        <section className="mb-12">
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-12 backdrop-blur-sm">
            <div className="flex justify-center">
              <OracleOrb
                state={orbState}
                message={message}
                size={orbSize}
                enableParticles={enableParticles}
                onStateChange={(newState) => console.log('State changed to:', newState)}
                onMessageComplete={() => console.log('Message complete')}
              />
            </div>
          </div>
        </section>

        {/* Controls */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">🎛️ Controls</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* State Controls */}
            <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4 text-purple-300">Oracle States</h3>
              <div className="grid grid-cols-2 gap-3">
                <OracleButton
                  variant={orbState === 'idle' ? 'primary' : 'secondary'}
                  onClick={() => handleStateDemo('idle')}
                  size="small"
                >
                  😴 Idle
                </OracleButton>
                <OracleButton
                  variant={orbState === 'listening' ? 'primary' : 'secondary'}
                  onClick={() => handleStateDemo('listening')}
                  size="small"
                >
                  👂 Listening
                </OracleButton>
                <OracleButton
                  variant={orbState === 'thinking' ? 'primary' : 'secondary'}
                  onClick={() => handleStateDemo('thinking')}
                  size="small"
                >
                  🧠 Thinking
                </OracleButton>
                <OracleButton
                  variant={orbState === 'revealing' ? 'primary' : 'secondary'}
                  onClick={() => handleStateDemo('revealing')}
                  size="small"
                >
                  ✨ Revealing
                </OracleButton>
                <OracleButton
                  variant={orbState === 'celebrating' ? 'primary' : 'secondary'}
                  onClick={() => handleStateDemo('celebrating')}
                  size="small"
                >
                  🎉 Celebrating
                </OracleButton>
                <OracleButton
                  variant={orbState === 'warning' ? 'danger' : 'secondary'}
                  onClick={() => handleStateDemo('warning')}
                  size="small"
                >
                  ⚠️ Warning
                </OracleButton>
              </div>

              <div className="mt-4 pt-4 border-t border-purple-500/30">
                <OracleButton
                  variant="cosmic"
                  onClick={handleOracleAIDemo}
                  className="w-full"
                >
                  🌟 Full Conversation Demo
                </OracleButton>
              </div>
            </div>

            {/* Appearance Controls */}
            <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4 text-purple-300">Appearance</h3>
              
              {/* Size Control */}
              <div className="mb-4">
                <label className="block text-sm text-purple-300 mb-2">Orb Size</label>
                <div className="grid grid-cols-4 gap-2">
                  {['small', 'medium', 'large', 'xl'].map(size => (
                    <button
                      key={size}
                      onClick={() => setOrbSize(size)}
                      className={`
                        px-3 py-2 rounded-lg border-2 transition-all text-xs
                        ${orbSize === size
                          ? 'bg-purple-600 border-purple-400'
                          : 'bg-purple-900/50 border-purple-700 hover:border-purple-500'
                        }
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Particles Toggle */}
              <div className="mb-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-purple-300">Particle Effects</span>
                  <div
                    onClick={() => setEnableParticles(!enableParticles)}
                    className={`
                      w-12 h-6 rounded-full transition-colors relative
                      ${enableParticles ? 'bg-purple-600' : 'bg-gray-600'}
                    `}
                  >
                    <div
                      className={`
                        absolute top-1 left-1 w-4 h-4 bg-white rounded-full
                        transition-transform
                        ${enableParticles ? 'translate-x-6' : 'translate-x-0'}
                      `}
                    />
                  </div>
                </label>
              </div>

              {/* Custom Message */}
              <div>
                <label className="block text-sm text-purple-300 mb-2">Custom Message</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Oracle message..."
                    className="flex-1 px-3 py-2 bg-purple-950/50 border border-purple-700 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        setMessage(e.target.value)
                        e.target.value = ''
                      }
                    }}
                  />
                  <OracleButton
                    variant="secondary"
                    size="small"
                    onClick={() => {
                      const input = document.querySelector('input[type="text"]')
                      setMessage(input.value)
                      input.value = ''
                    }}
                  >
                    Send
                  </OracleButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Message Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">💬 Quick Messages</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(oracleMessages).map(([category, messages]) => (
              <div
                key={category}
                className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 backdrop-blur-sm"
              >
                <h3 className="font-semibold mb-3 text-purple-300 capitalize">{category}</h3>
                <div className="space-y-2">
                  {messages.map((msg, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setOrbState(category)
                        setMessage(msg)
                      }}
                      className="w-full text-left px-3 py-2 text-sm bg-purple-800/30 hover:bg-purple-700/50 rounded-lg transition-colors border border-purple-700/30 hover:border-purple-500/50"
                    >
                      "{msg.slice(0, 50)}{msg.length > 50 ? '...' : ''}"
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TypewriterText Component Test */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">⌨️ TypewriterText Component</h2>
          
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="p-4 bg-purple-950/50 rounded-lg">
                <TypewriterText
                  text="The cosmos speaks through the Oracle..."
                  speed={60}
                  className="text-lg text-purple-200"
                />
              </div>
              <div className="p-4 bg-purple-950/50 rounded-lg">
                <TypewriterText
                  text="I have woven 18 cosmic decrees from 5 constellations. These questions will lead to profound introspection and deep discussion."
                  speed={40}
                  className="text-base text-purple-300 italic"
                  startDelay={1000}
                />
              </div>
              <div className="p-4 bg-purple-950/50 rounded-lg">
                <TypewriterText
                  text="⚠️ Bold choices! Ensure your entities are prepared for controversial topics."
                  speed={50}
                  className="text-sm text-orange-300"
                  cursorChar="●"
                  startDelay={3000}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Message Log */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">📜 Message Log</h2>
            <OracleButton
              variant="ghost"
              size="small"
              onClick={clearLog}
            >
              Clear Log
            </OracleButton>
          </div>
          
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm max-h-96 overflow-y-auto">
            {messageLog.length === 0 ? (
              <p className="text-center text-purple-400 italic">No messages yet. Try triggering some Oracle states!</p>
            ) : (
              <div className="space-y-3">
                {messageLog.map((entry, i) => (
                  <div
                    key={i}
                    className="p-3 bg-purple-950/50 rounded-lg border border-purple-700/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                        {entry.state}
                      </span>
                      <span className="text-xs text-purple-500">{entry.timestamp}</span>
                    </div>
                    <p className="text-sm text-purple-200">"{entry.message}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">📖 Usage Examples</h2>
          
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
            <pre className="text-sm text-purple-200 overflow-x-auto">
              <code>{`// Basic usage
<OracleOrb 
  state="thinking"
  message="Consulting the cosmic archives..."
  size="large"
/>

// With callbacks
<OracleOrb 
  state={orbState}
  message={message}
  onStateChange={(state) => console.log(state)}
  onMessageComplete={() => handleNextStep()}
  enableParticles={true}
/>

// TypewriterText standalone
<TypewriterText
  text="Your message here..."
  speed={50}
  onComplete={() => handleComplete()}
  showCursor={true}
/>`}</code>
            </pre>
          </div>
        </section>

        {/* Integration with OracleAI */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-center">🤖 Integration with OracleAI</h2>
          
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-6 backdrop-blur-sm">
            <p className="text-purple-300 mb-4">
              The Oracle Orb can be connected to OracleAI for dynamic responses:
            </p>
            <pre className="text-sm text-purple-200 overflow-x-auto">
              <code>{`// Example integration
const [orbState, setOrbState] = useState('idle')
const [message, setMessage] = useState('')

const handleQuickRitual = async (preferences) => {
  // Listening phase
  setOrbState('listening')
  setMessage(oracleAI.speak('questioning'))
  
  await delay(2000)
  
  // Thinking phase
  setOrbState('thinking')
  setMessage(oracleAI.speak('thinking'))
  
  await delay(2000)
  
  // Get recommendation
  const result = oracleAI.recommend(preferences)
  
  // Revealing phase
  setOrbState('revealing')
  setMessage(result.reasoning)
  
  await delay(3000)
  
  // Celebrating phase
  setOrbState('celebrating')
  setMessage(oracleAI.speak('encouraging'))
}`}</code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  )
}
