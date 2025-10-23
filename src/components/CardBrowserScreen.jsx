import { useState, useMemo } from 'react'
import { useGame } from '../contexts/GameContext'
import Icon from './Icon'
import AnimatedCosmicBackground from './AnimatedCosmicBackground'
import TwinkleStar from './TwinkleStar'
import questionData from '../data/questions.json'

// Helper function to get icon for each constellation category
const getCategoryIcon = (categoryName) => {
  const iconMap = {
    'Fears': 'skull',
    'Memories': 'brain',
    'Beliefs': 'star',
    'Desires': 'heart',
    'Secrets': 'lock',
    'Dreams': 'moon',
    'Regrets': 'hourglass',
    'Relationships': 'users',
    'Identity': 'user',
    'Morality': 'scales',
    'Future': 'rocket',
    'Past': 'clock'
  }
  return iconMap[categoryName] || 'question'
}

// Helper function to get description for each constellation
const getCategoryDescription = (categoryName) => {
  const descMap = {
    'Fears': 'Explore what terrifies us',
    'Memories': 'Revisit moments that shaped us',
    'Beliefs': 'Challenge our core convictions',
    'Desires': 'Reveal what we truly want',
    'Secrets': 'Uncover hidden truths',
    'Dreams': 'Share our aspirations',
    'Regrets': 'Confront what we wish we could change',
    'Relationships': 'Navigate connections with others',
    'Identity': 'Question who we really are',
    'Morality': 'Examine our ethical boundaries',
    'Future': 'Envision what lies ahead',
    'Past': 'Reflect on where we came from'
  }
  return descMap[categoryName] || 'A collection of thought-provoking questions'
}

export default function CardBrowserScreen() {
  const { setScreen } = useGame()
  const [selectedConstellations, setSelectedConstellations] = useState(new Set())
  const [previewConstellation, setPreviewConstellation] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Track mouse for parallax effect
  const handleMouseMove = (e) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: (e.clientY / window.innerHeight) * 2 - 1
    })
  }

  // Build constellation objects from question data
  const constellations = useMemo(() => {
    return Object.keys(questionData).map(categoryName => ({
      name: categoryName,
      questions: questionData[categoryName],
      count: questionData[categoryName].length,
      icon: getCategoryIcon(categoryName),
      description: getCategoryDescription(categoryName)
    }))
  }, [])

  // Toggle constellation selection
  const toggleConstellation = (constellationName) => {
    setSelectedConstellations(prev => {
      const newSet = new Set(prev)
      if (newSet.has(constellationName)) {
        newSet.delete(constellationName)
      } else {
        newSet.add(constellationName)
      }
      return newSet
    })
  }

  // Quick preset configurations
  const applyPreset = (presetName) => {
    const presets = {
      'quick': ['Desires', 'Relationships', 'Identity'],
      'deep': ['Fears', 'Regrets', 'Morality'],
      'party': ['Dreams', 'Memories', 'Future', 'Beliefs'],
      'balanced': ['Fears', 'Desires', 'Relationships', 'Identity']
    }
    setSelectedConstellations(new Set(presets[presetName] || []))
  }

  // Gather all questions from selected constellations
  const getSelectedQuestions = () => {
    const allQuestions = []
    selectedConstellations.forEach(constellationName => {
      const questions = questionData[constellationName]
      if (questions) {
        allQuestions.push(...questions)
      }
    })
    return allQuestions
  }

  // Handle creating room with selected questions
  const handleCreateRoom = () => {
    const questions = getSelectedQuestions()
    if (questions.length === 0) {
      alert('Please select at least one constellation!')
      return
    }
    
    // Store selected questions in localStorage or context
    // Then navigate to lobby
    localStorage.setItem('selectedQuestions', JSON.stringify(questions))
    setScreen('lobby')
  }

  return (
    <div 
      className="min-h-screen text-white relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Cosmic Background */}
      <div className="fixed inset-0 z-0">
        <AnimatedCosmicBackground mousePosition={mousePosition} />
      </div>

      {/* Twinkling Stars Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <TwinkleStar
            key={i}
            size={Math.random() * 3 + 1}
            top={`${Math.random() * 100}%`}
            left={`${Math.random() * 100}%`}
            delay={Math.random() * 3}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen p-4 sm:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => setScreen('home')}
          className="mb-6 px-4 py-2 bg-black/40 backdrop-blur-md border border-purple-500/50 rounded-lg hover:bg-purple-900/50 hover:border-purple-400 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
        >
          <span className="flex items-center gap-2">
            <Icon name="arrow-left" size={20} />
            <span>Back to Home</span>
          </span>
        </button>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.5)] animate-pulse">
            Choose Your Constellations
          </h1>
          <p className="text-lg sm:text-xl text-purple-200/80 mb-2">
            Select category packages to create your custom game experience
          </p>
          <p className="text-sm text-purple-300/60">
            Each constellation contains multiple thought-provoking questions
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          <span className="text-purple-300 font-semibold self-center mr-2">Quick Presets:</span>
          <button
            onClick={() => applyPreset('quick')}
            className="px-4 py-2 bg-gradient-to-br from-green-600/40 to-green-700/40 backdrop-blur-md border border-green-400/50 rounded-lg hover:from-green-500/50 hover:to-green-600/50 hover:border-green-300 transition-all duration-300 shadow-lg hover:shadow-green-500/50 hover:scale-105"
          >
            ⚡ Quick
            <span className="ml-1 text-xs opacity-70">(3 categories)</span>
          </button>
          <button
            onClick={() => applyPreset('deep')}
            className="px-4 py-2 bg-gradient-to-br from-blue-600/40 to-blue-700/40 backdrop-blur-md border border-blue-400/50 rounded-lg hover:from-blue-500/50 hover:to-blue-600/50 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:scale-105"
          >
            🌊 Deep
            <span className="ml-1 text-xs opacity-70">(3 categories)</span>
          </button>
          <button
            onClick={() => applyPreset('party')}
            className="px-4 py-2 bg-gradient-to-br from-yellow-600/40 to-orange-600/40 backdrop-blur-md border border-yellow-400/50 rounded-lg hover:from-yellow-500/50 hover:to-orange-500/50 hover:border-yellow-300 transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 hover:scale-105"
          >
            🎉 Party
            <span className="ml-1 text-xs opacity-70">(4 categories)</span>
          </button>
          <button
            onClick={() => applyPreset('balanced')}
            className="px-4 py-2 bg-gradient-to-br from-purple-600/40 to-pink-600/40 backdrop-blur-md border border-purple-400/50 rounded-lg hover:from-purple-500/50 hover:to-pink-500/50 hover:border-purple-300 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:scale-105"
          >
            ⚖️ Balanced
            <span className="ml-1 text-xs opacity-70">(4 categories)</span>
          </button>
        </div>

        {/* Selection Summary */}
        <div className="bg-black/40 backdrop-blur-md border border-purple-500/50 rounded-xl p-5 shadow-2xl shadow-purple-500/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-center sm:text-left">
              <div>
                <span className="text-purple-300/80 text-sm">Selected: </span>
                <span className="text-3xl font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
                  {selectedConstellations.size}
                </span>
                <span className="text-purple-300/80 text-sm ml-1">constellation{selectedConstellations.size !== 1 ? 's' : ''}</span>
              </div>
              <div className="h-8 w-px bg-purple-500/30 hidden sm:block" />
              <div>
                <span className="text-purple-300/80 text-sm">Questions: </span>
                <span className="text-3xl font-bold text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">
                  {getSelectedQuestions().length}
                </span>
              </div>
            </div>
            <button
              onClick={handleCreateRoom}
              disabled={selectedConstellations.size === 0}
              className={`px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                selectedConstellations.size > 0
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:scale-105 shadow-purple-500/50 animate-pulse'
                  : 'bg-gray-800/50 text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              <span className="flex items-center gap-2">
                Continue to Lobby
                <Icon name="arrow-right" size={20} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Constellation Grid */}
      <div className="max-w-7xl mx-auto pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {constellations.map(constellation => {
            const isSelected = selectedConstellations.has(constellation.name)
            
            return (
              <div
                key={constellation.name}
                className={`
                  relative group cursor-pointer
                  rounded-2xl border-2 p-6 transition-all duration-300 transform
                  backdrop-blur-md
                  ${isSelected
                    ? 'bg-gradient-to-br from-purple-600/50 to-pink-600/50 border-purple-400 scale-105 shadow-2xl shadow-purple-500/50 animate-pulse'
                    : 'bg-black/30 border-purple-700/40 hover:border-purple-400 hover:bg-purple-900/30 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30'
                  }
                `}
                onClick={() => toggleConstellation(constellation.name)}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50 animate-bounce">
                    <Icon name="check" size={20} />
                  </div>
                )}

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className={`
                    w-20 h-20 rounded-full flex items-center justify-center
                    transition-all duration-300 transform
                    ${isSelected 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50 scale-110' 
                      : 'bg-purple-900/40 group-hover:bg-purple-800/60 group-hover:scale-110'
                    }
                  `}>
                    <Icon name={constellation.icon} size={36} />
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-xl sm:text-2xl font-bold text-center mb-2 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                  {constellation.name}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-purple-300/80 text-center mb-4 min-h-[2.5rem]">
                  {constellation.description}
                </p>

                {/* Question Count */}
                <div className="flex items-center justify-center gap-2 text-purple-400 mb-3">
                  <Icon name="list" size={16} />
                  <span className="font-semibold text-sm">{constellation.count} questions</span>
                </div>

                {/* Preview Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setPreviewConstellation(constellation)
                  }}
                  className="w-full py-2 bg-black/30 backdrop-blur-sm border border-purple-600/50 rounded-lg hover:bg-purple-800/50 hover:border-purple-400 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-purple-500/30"
                >
                  Preview Questions
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Preview Modal */}
      {previewConstellation && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-8"
          onClick={() => setPreviewConstellation(null)}
        >
          <div
            className="bg-gradient-to-br from-purple-900/95 to-purple-950/95 backdrop-blur-xl border-2 border-purple-500/50 rounded-3xl p-6 sm:p-8 max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl shadow-purple-500/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6 gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <Icon name={getCategoryIcon(previewConstellation.name)} size={24} />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                    {previewConstellation.name}
                  </h2>
                </div>
                <p className="text-purple-300/80 text-sm sm:text-base">{previewConstellation.description}</p>
                <p className="text-purple-400/60 text-xs mt-2">{previewConstellation.count} questions in this constellation</p>
              </div>
              <button
                onClick={() => setPreviewConstellation(null)}
                className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full hover:bg-purple-700/50 transition-all border border-purple-500/30 hover:border-purple-400 flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-3 sm:space-y-4 mb-6">
              {previewConstellation.questions.map((question, index) => (
                <div
                  key={index}
                  className="bg-black/30 backdrop-blur-sm border border-purple-700/40 rounded-xl p-4 hover:border-purple-500/60 transition-all"
                >
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-purple-400 bg-purple-900/50 px-2 py-1 rounded">CREW</span>
                      <span className="text-xs text-purple-500/60">What crew members see</span>
                    </div>
                    <p className="text-white text-sm sm:text-base leading-relaxed">{question.crew}</p>
                  </div>
                  <div className="h-px bg-purple-500/20 my-3" />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-pink-400 bg-pink-900/50 px-2 py-1 rounded">IMPOSTOR</span>
                      <span className="text-xs text-pink-500/60">What the impostor sees</span>
                    </div>
                    <p className="text-white text-sm sm:text-base leading-relaxed">{question.impostor}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  toggleConstellation(previewConstellation.name)
                  setPreviewConstellation(null)
                }}
                className={`
                  flex-1 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg
                  ${selectedConstellations.has(previewConstellation.name)
                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-red-500/50'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-500/50'
                  }
                `}
              >
                {selectedConstellations.has(previewConstellation.name)
                  ? '✓ Remove from Selection'
                  : '+ Add to Selection'
                }
              </button>
              <button
                onClick={() => setPreviewConstellation(null)}
                className="px-6 py-3 bg-black/40 backdrop-blur-sm border border-purple-500/50 rounded-xl hover:bg-purple-900/50 hover:border-purple-400 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
