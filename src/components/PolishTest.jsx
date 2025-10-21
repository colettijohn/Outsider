/**
 * Polish & Effects Test Page
 * 
 * Comprehensive showcase of haptics, sounds, and animations.
 * Allows testing and tuning of all micro-interactions.
 */

import React, { useState } from 'react'
import { haptics } from '../utils/haptics'
import { sounds } from '../utils/sounds'
import { EnhancedOracleButton, EnhancedOracleCard, EnhancedOracleSlider } from './oracle/EnhancedComponents'
import '../styles/animations.css'

export default function PolishTest() {
  const [soundsEnabled, setSoundsEnabled] = useState(true)
  const [hapticsEnabled, setHapticsEnabled] = useState(true)
  const [volume, setVolume] = useState(50)
  const [sliderValue, setSliderValue] = useState(50)
  const [selectedCard, setSelectedCard] = useState(false)
  const [animationClass, setAnimationClass] = useState('')

  // Update settings
  React.useEffect(() => {
    sounds.setEnabled(soundsEnabled)
    sounds.setVolume(volume / 100)
  }, [soundsEnabled, volume])

  React.useEffect(() => {
    haptics.setEnabled(hapticsEnabled)
  }, [hapticsEnabled])

  // Trigger animation helper
  const triggerAnimation = (className) => {
    setAnimationClass(className)
    setTimeout(() => setAnimationClass(''), 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 text-white p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Polish & Effects Showcase
        </h1>
        <p className="text-center text-purple-300 mb-8">
          Test haptics, sounds, and animations
        </p>

        {/* Device Info */}
        <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-4 mb-8">
          <h3 className="text-lg font-semibold mb-2">Device Capabilities</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-purple-400">Haptics:</span>{' '}
              {haptics.canVibrate() ? (
                <span className="text-green-400">✓ Supported</span>
              ) : (
                <span className="text-red-400">✗ Not Supported</span>
              )}
            </div>
            <div>
              <span className="text-purple-400">Audio:</span>{' '}
              {sounds.canPlay() ? (
                <span className="text-green-400">✓ Supported</span>
              ) : (
                <span className="text-red-400">✗ Not Supported</span>
              )}
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Settings</h3>
          
          <div className="space-y-4">
            {/* Sound Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-purple-300">Sound Effects</label>
              <button
                onClick={() => setSoundsEnabled(!soundsEnabled)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  soundsEnabled
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {soundsEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Haptics Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-purple-300">Haptic Feedback</label>
              <button
                onClick={() => setHapticsEnabled(!hapticsEnabled)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  hapticsEnabled
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {hapticsEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Volume Slider */}
            <div>
              <label className="text-purple-300 block mb-2">
                Volume: {volume}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Haptic Patterns */}
        <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Haptic Patterns</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => haptics.light()}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Light
            </button>
            <button
              onClick={() => haptics.medium()}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Medium
            </button>
            <button
              onClick={() => haptics.heavy()}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Heavy
            </button>
            <button
              onClick={() => haptics.success()}
              className="px-4 py-3 bg-green-700 hover:bg-green-600 rounded-lg transition-colors"
            >
              Success
            </button>
            <button
              onClick={() => haptics.error()}
              className="px-4 py-3 bg-red-700 hover:bg-red-600 rounded-lg transition-colors"
            >
              Error
            </button>
            <button
              onClick={() => haptics.selection()}
              className="px-4 py-3 bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Selection
            </button>
            <button
              onClick={() => haptics.notification()}
              className="px-4 py-3 bg-purple-700 hover:bg-purple-600 rounded-lg transition-colors"
            >
              Notification
            </button>
            <button
              onClick={() => haptics.reveal()}
              className="px-4 py-3 bg-pink-700 hover:bg-pink-600 rounded-lg transition-colors"
            >
              Reveal
            </button>
            <button
              onClick={() => haptics.thinking()}
              className="px-4 py-3 bg-indigo-700 hover:bg-indigo-600 rounded-lg transition-colors"
            >
              Thinking
            </button>
            <button
              onClick={() => haptics.celebration()}
              className="px-4 py-3 bg-yellow-700 hover:bg-yellow-600 rounded-lg transition-colors"
            >
              Celebration
            </button>
            <button
              onClick={() => haptics.sliderTick()}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Slider Tick
            </button>
            <button
              onClick={() => haptics.cardFlip()}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Card Flip
            </button>
            <button
              onClick={() => haptics.drawer()}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Drawer
            </button>
          </div>
        </div>

        {/* Sound Effects */}
        <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Sound Effects</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => sounds.click()}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Click
            </button>
            <button
              onClick={() => sounds.hover()}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Hover
            </button>
            <button
              onClick={() => sounds.success()}
              className="px-4 py-3 bg-green-700 hover:bg-green-600 rounded-lg transition-colors"
            >
              Success
            </button>
            <button
              onClick={() => sounds.error()}
              className="px-4 py-3 bg-red-700 hover:bg-red-600 rounded-lg transition-colors"
            >
              Error
            </button>
            <button
              onClick={() => sounds.whoosh()}
              className="px-4 py-3 bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Whoosh
            </button>
            <button
              onClick={() => sounds.pop()}
              className="px-4 py-3 bg-purple-700 hover:bg-purple-600 rounded-lg transition-colors"
            >
              Pop
            </button>
            <button
              onClick={() => sounds.shimmer()}
              className="px-4 py-3 bg-pink-700 hover:bg-pink-600 rounded-lg transition-colors"
            >
              Shimmer
            </button>
            <button
              onClick={() => sounds.cardFlip()}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Card Flip
            </button>
            <button
              onClick={() => sounds.drawerOpen()}
              className="px-4 py-3 bg-indigo-700 hover:bg-indigo-600 rounded-lg transition-colors"
            >
              Drawer Open
            </button>
            <button
              onClick={() => sounds.drawerClose()}
              className="px-4 py-3 bg-indigo-700 hover:bg-indigo-600 rounded-lg transition-colors"
            >
              Drawer Close
            </button>
            <button
              onClick={() => sounds.thinking()}
              className="px-4 py-3 bg-yellow-700 hover:bg-yellow-600 rounded-lg transition-colors"
            >
              Thinking
            </button>
            <button
              onClick={() => sounds.reveal()}
              className="px-4 py-3 bg-purple-700 hover:bg-purple-600 rounded-lg transition-colors"
            >
              Reveal
            </button>
            <button
              onClick={() => sounds.celebration()}
              className="px-4 py-3 bg-green-700 hover:bg-green-600 rounded-lg transition-colors"
            >
              Celebration
            </button>
            <button
              onClick={() => sounds.select()}
              className="px-4 py-3 bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Select
            </button>
            <button
              onClick={() => sounds.deselect()}
              className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              Deselect
            </button>
          </div>
        </div>

        {/* Animations */}
        <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Animations</h3>
          
          {/* Demo Box */}
          <div className="mb-6 flex justify-center">
            <div
              className={`w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center ${animationClass}`}
            >
              <span className="text-2xl">✨</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => triggerAnimation('animate-scale-pop')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Scale Pop
            </button>
            <button
              onClick={() => triggerAnimation('animate-shake')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Shake
            </button>
            <button
              onClick={() => triggerAnimation('animate-wiggle')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Wiggle
            </button>
            <button
              onClick={() => triggerAnimation('animate-heartbeat')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Heartbeat
            </button>
            <button
              onClick={() => triggerAnimation('animate-glow-pulse')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Glow Pulse
            </button>
            <button
              onClick={() => triggerAnimation('animate-float')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Float
            </button>
            <button
              onClick={() => triggerAnimation('animate-shimmer')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Shimmer
            </button>
            <button
              onClick={() => triggerAnimation('animate-slide-up-fade')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Slide Up Fade
            </button>
            <button
              onClick={() => triggerAnimation('animate-zoom-in')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Zoom In
            </button>
            <button
              onClick={() => triggerAnimation('animate-rotate-in')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Rotate In
            </button>
            <button
              onClick={() => triggerAnimation('animate-flip-in')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Flip In
            </button>
            <button
              onClick={() => triggerAnimation('animate-attention')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Attention
            </button>
          </div>
        </div>

        {/* Enhanced Components */}
        <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Enhanced Components</h3>
          
          {/* Buttons */}
          <div className="mb-6">
            <h4 className="text-purple-300 mb-3">Enhanced Buttons</h4>
            <div className="flex flex-wrap gap-3">
              <EnhancedOracleButton variant="primary">
                Primary
              </EnhancedOracleButton>
              <EnhancedOracleButton variant="cosmic">
                Cosmic
              </EnhancedOracleButton>
              <EnhancedOracleButton variant="success">
                Success
              </EnhancedOracleButton>
              <EnhancedOracleButton variant="danger">
                Danger
              </EnhancedOracleButton>
            </div>
          </div>

          {/* Slider */}
          <div className="mb-6">
            <h4 className="text-purple-300 mb-3">Enhanced Slider (Tick on 10% milestones)</h4>
            <EnhancedOracleSlider
              value={sliderValue}
              onChange={setSliderValue}
              label="Test Slider"
              emoji="🎚️"
            />
          </div>

          {/* Card */}
          <div>
            <h4 className="text-purple-300 mb-3">Enhanced Card</h4>
            <div className="max-w-sm">
              <EnhancedOracleCard
                question={{
                  id: 'test-1',
                  question: 'Is the enhanced card working with sound and haptics?',
                  category: 'Technology',
                  difficulty: 'medium',
                  spice: 3,
                  estimatedTime: 5,
                  tags: ['Testing', 'Polish']
                }}
                selected={selectedCard}
                onToggle={() => setSelectedCard(!selectedCard)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-purple-400 text-sm">
          <p>All features test on this page • Phase 5: Polish & Effects</p>
          <p className="mt-2">
            <button
              onClick={() => window.history.back()}
              className="text-purple-300 hover:text-white transition-colors"
            >
              ← Back to Game
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
