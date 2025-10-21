import React, { useState } from 'react'
import { OracleButton } from './oracle/OracleButton'
import { OracleCard } from './oracle/OracleCard'
import { OracleSlider } from './oracle/OracleSlider'
import { ParticleEffect } from './oracle/ParticleEffect'
import { questionCards } from '../data/questionCards'

/**
 * Oracle Components Test Page
 * 
 * Interactive showcase of all Oracle UI components.
 * Use this to verify functionality and visual design.
 */
export const OracleComponentsTest = () => {
  // Button states
  const [loadingButton, setLoadingButton] = useState(null)
  const [buttonClicks, setButtonClicks] = useState({})

  // Card states
  const [selectedCards, setSelectedCards] = useState(new Set())
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  // Slider states
  const [seriousness, setSeriousness] = useState(50)
  const [duration, setDuration] = useState(50)
  const [spiceLevel, setSpiceLevel] = useState(50)

  // Particle states
  const [particleType, setParticleType] = useState('gentle')
  const [particleColor, setParticleColor] = useState('#a855f7')

  const sampleCard = questionCards[currentCardIndex] || questionCards[0]

  const handleButtonClick = (buttonName) => {
    setButtonClicks(prev => ({ ...prev, [buttonName]: (prev[buttonName] || 0) + 1 }))
    console.log(`${buttonName} clicked!`)
  }

  const handleLoadingDemo = (buttonName) => {
    setLoadingButton(buttonName)
    setTimeout(() => setLoadingButton(null), 2000)
  }

  const handleCardToggle = (card) => {
    const newSelected = new Set(selectedCards)
    if (newSelected.has(card.id)) {
      newSelected.delete(card.id)
    } else {
      newSelected.add(card.id)
    }
    setSelectedCards(newSelected)
    console.log('Card toggled:', card.id, 'Selected:', newSelected.has(card.id))
  }

  const handleCardFlip = (card, flipped) => {
    console.log('Card flipped:', card.id, 'Is showing impostor:', flipped)
  }

  const nextCard = () => {
    setCurrentCardIndex((currentCardIndex + 1) % questionCards.length)
  }

  const prevCard = () => {
    setCurrentCardIndex((currentCardIndex - 1 + questionCards.length) % questionCards.length)
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background particles */}
      <div className="fixed inset-0 pointer-events-none">
        <ParticleEffect type={particleType} color={particleColor} particleCount={100} size="full" />
      </div>

      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4">
            ✨ Oracle Components Showcase
          </h1>
          <p className="text-gray-400 text-lg">
            Interactive test page for all Oracle UI components
          </p>
        </div>

        {/* Buttons Section */}
        <section className="mb-16 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-500/30">
          <h2 className="text-3xl font-bold text-purple-300 mb-6 flex items-center gap-3">
            <span>🎯</span>
            <span>Oracle Buttons</span>
          </h2>
          
          {/* Button variants */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl text-gray-300 mb-4">Variants</h3>
              <div className="flex flex-wrap gap-4">
                <OracleButton 
                  variant="primary" 
                  onClick={() => handleButtonClick('primary')}
                >
                  Primary Button {buttonClicks.primary ? `(${buttonClicks.primary})` : ''}
                </OracleButton>
                <OracleButton 
                  variant="secondary" 
                  onClick={() => handleButtonClick('secondary')}
                >
                  Secondary Button
                </OracleButton>
                <OracleButton 
                  variant="ghost" 
                  icon="👻"
                  onClick={() => handleButtonClick('ghost')}
                >
                  Ghost Button
                </OracleButton>
                <OracleButton 
                  variant="danger" 
                  onClick={() => handleButtonClick('danger')}
                >
                  Danger Button
                </OracleButton>
                <OracleButton 
                  variant="success" 
                  icon="✅"
                  onClick={() => handleButtonClick('success')}
                >
                  Success Button
                </OracleButton>
                <OracleButton 
                  variant="cosmic"
                  icon="✨"
                  onClick={() => handleButtonClick('cosmic')}
                >
                  Cosmic Button
                </OracleButton>
              </div>
            </div>

            <div>
              <h3 className="text-xl text-gray-300 mb-4">Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <OracleButton size="small" onClick={() => handleButtonClick('small')}>
                  Small
                </OracleButton>
                <OracleButton size="medium" onClick={() => handleButtonClick('medium')}>
                  Medium
                </OracleButton>
                <OracleButton size="large" onClick={() => handleButtonClick('large')}>
                  Large
                </OracleButton>
                <OracleButton size="xl" icon="🚀" onClick={() => handleButtonClick('xl')}>
                  Extra Large
                </OracleButton>
              </div>
            </div>

            <div>
              <h3 className="text-xl text-gray-300 mb-4">States</h3>
              <div className="flex flex-wrap gap-4">
                <OracleButton 
                  loading={loadingButton === 'loading'}
                  onClick={() => handleLoadingDemo('loading')}
                >
                  {loadingButton === 'loading' ? 'Loading...' : 'Click to Load'}
                </OracleButton>
                <OracleButton disabled>
                  Disabled Button
                </OracleButton>
                <OracleButton icon="🎨">
                  With Icon
                </OracleButton>
              </div>
            </div>
          </div>
        </section>

        {/* Card Section */}
        <section className="mb-16 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-500/30">
          <h2 className="text-3xl font-bold text-purple-300 mb-6 flex items-center gap-3">
            <span>🎴</span>
            <span>Oracle Cards</span>
          </h2>

          <div className="space-y-6">
            {/* Card navigation */}
            <div className="flex items-center justify-center gap-4">
              <OracleButton onClick={prevCard} icon="←" size="small">
                Previous
              </OracleButton>
              <span className="text-gray-400">
                Card {currentCardIndex + 1} of {questionCards.length}
              </span>
              <OracleButton onClick={nextCard} icon="→" size="small">
                Next
              </OracleButton>
            </div>

            {/* Cards display */}
            <div className="flex flex-wrap justify-center gap-8">
              {/* Small card */}
              <div className="text-center">
                <p className="text-gray-400 mb-3 text-sm">Small</p>
                <OracleCard
                  question={sampleCard}
                  isSelected={selectedCards.has(sampleCard.id)}
                  onToggle={handleCardToggle}
                  onFlip={handleCardFlip}
                  size="small"
                />
              </div>

              {/* Medium card */}
              <div className="text-center">
                <p className="text-gray-400 mb-3 text-sm">Medium (Default)</p>
                <OracleCard
                  question={sampleCard}
                  isSelected={selectedCards.has(sampleCard.id)}
                  onToggle={handleCardToggle}
                  onFlip={handleCardFlip}
                  size="medium"
                />
              </div>

              {/* Large card */}
              <div className="text-center">
                <p className="text-gray-400 mb-3 text-sm">Large</p>
                <OracleCard
                  question={sampleCard}
                  isSelected={selectedCards.has(sampleCard.id)}
                  onToggle={handleCardToggle}
                  onFlip={handleCardFlip}
                  size="large"
                />
              </div>
            </div>

            <div className="text-center text-gray-400 text-sm">
              <p>💡 Click card to select/deselect</p>
              <p>💡 Click "Flip" button to see Outsider version</p>
              <p>💡 Selected cards: {selectedCards.size}</p>
            </div>
          </div>
        </section>

        {/* Sliders Section */}
        <section className="mb-16 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-500/30">
          <h2 className="text-3xl font-bold text-purple-300 mb-6 flex items-center gap-3">
            <span>🎚️</span>
            <span>Oracle Sliders</span>
          </h2>

          <div className="space-y-8 max-w-2xl mx-auto">
            <OracleSlider
              label="How serious should this gathering be?"
              leftLabel="Party Fun"
              rightLabel="Deep Thinking"
              leftIcon="🎪"
              rightIcon="🧠"
              value={seriousness}
              onChange={setSeriousness}
            />

            <OracleSlider
              label="How long should the session be?"
              leftLabel="Quick (15min)"
              rightLabel="Epic (2hr)"
              leftIcon="⚡"
              rightIcon="🌙"
              value={duration}
              onChange={setDuration}
            />

            <OracleSlider
              label="How spicy should the topics be?"
              leftLabel="Safe & Fun"
              rightLabel="Bold & Wild"
              leftIcon="😊"
              rightIcon="🔥"
              value={spiceLevel}
              onChange={setSpiceLevel}
              thumbIcon="🌶️"
            />

            {/* Slider values display */}
            <div className="bg-gray-900/50 rounded-lg p-6">
              <h3 className="text-lg text-purple-300 mb-4 text-center">Current Values</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Seriousness</p>
                  <p className="text-3xl font-bold text-white">{seriousness}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Duration</p>
                  <p className="text-3xl font-bold text-white">{duration}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Spice Level</p>
                  <p className="text-3xl font-bold text-white">{spiceLevel}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Particle Effects Section */}
        <section className="mb-16 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-500/30">
          <h2 className="text-3xl font-bold text-purple-300 mb-6 flex items-center gap-3">
            <span>✨</span>
            <span>Particle Effects</span>
          </h2>

          <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-wrap gap-4 justify-center">
              <select
                value={particleType}
                onChange={(e) => setParticleType(e.target.value)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="gentle">Gentle</option>
                <option value="intense">Intense</option>
                <option value="burst">Burst</option>
                <option value="trail">Trail</option>
                <option value="cosmic">Cosmic</option>
              </select>

              <select
                value={particleColor}
                onChange={(e) => setParticleColor(e.target.value)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="#a855f7">Purple</option>
                <option value="#ec4899">Pink</option>
                <option value="#3b82f6">Blue</option>
                <option value="#10b981">Green</option>
                <option value="#f59e0b">Amber</option>
                <option value="#ef4444">Red</option>
                <option value="#ffffff">White</option>
              </select>
            </div>

            {/* Particle preview boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black rounded-lg relative overflow-hidden" style={{ height: '300px' }}>
                <ParticleEffect 
                  type={particleType} 
                  color={particleColor} 
                  particleCount={50}
                  size="full"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-white text-sm bg-black/50 px-4 py-2 rounded">
                    Type: {particleType}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg relative overflow-hidden" style={{ height: '300px' }}>
                <ParticleEffect 
                  type="cosmic" 
                  color={particleColor} 
                  particleCount={75}
                  speed={0.5}
                  size="full"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-white text-sm bg-black/50 px-4 py-2 rounded">
                    Cosmic Effect
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center text-gray-400 text-sm">
              💡 Background particles update in real-time based on your selections
            </p>
          </div>
        </section>

        {/* Integration Example */}
        <section className="mb-16 bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-400/50">
          <h2 className="text-3xl font-bold text-purple-300 mb-6 flex items-center gap-3">
            <span>🎭</span>
            <span>Full Integration Example</span>
          </h2>

          <div className="relative">
            {/* Particle background */}
            <div className="absolute inset-0 rounded-lg overflow-hidden opacity-50">
              <ParticleEffect type="cosmic" color="#a855f7" particleCount={30} size="full" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 space-y-6">
              <div className="text-center">
                <h3 className="text-2xl text-white mb-4">
                  ✨ Welcome to the Oracle's Ritual ✨
                </h3>
                <p className="text-purple-200 mb-6">
                  All components working together in harmony
                </p>
              </div>

              <div className="flex justify-center">
                <OracleCard
                  question={sampleCard}
                  isSelected={selectedCards.has(sampleCard.id)}
                  onToggle={handleCardToggle}
                  onFlip={handleCardFlip}
                  size="medium"
                />
              </div>

              <div className="max-w-md mx-auto">
                <OracleSlider
                  label="Adjust your cosmic alignment"
                  leftLabel="Casual"
                  rightLabel="Intense"
                  leftIcon="☁️"
                  rightIcon="⚡"
                  value={seriousness}
                  onChange={setSeriousness}
                  thumbIcon="🔮"
                />
              </div>

              <div className="flex justify-center gap-4">
                <OracleButton variant="ghost" onClick={() => alert('Going back...')}>
                  ← Back
                </OracleButton>
                <OracleButton variant="cosmic" icon="✨" onClick={() => alert('Ritual begins!')}>
                  Begin Ritual
                </OracleButton>
              </div>
            </div>
          </div>
        </section>

        {/* Console Logging Info */}
        <section className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-600/30">
          <h2 className="text-2xl font-bold text-gray-300 mb-4">
            💻 Console Output
          </h2>
          <p className="text-gray-400 mb-4">
            Open browser console (F12) to see component interactions logged in real-time.
          </p>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400">
            <p>→ Button clicks</p>
            <p>→ Card selections</p>
            <p>→ Card flips</p>
            <p>→ Slider value changes</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default OracleComponentsTest
