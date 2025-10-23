import { useState, useMemo } from 'react'
import { useGame } from '../contexts/GameContext'
import Icon from './Icon'
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

  // Build constellation objects from question data
  const constellations = useMemo(() => {
    return Object.keys(questionData.categories).map(categoryName => ({
      name: categoryName,
      questions: questionData.categories[categoryName],
      count: questionData.categories[categoryName].length,
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
      const questions = questionData.categories[constellationName]
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
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => setScreen('home')}
          className="mb-6 px-4 py-2 bg-purple-900/50 border border-purple-700 rounded-lg hover:bg-purple-800/50 transition-all"
        >
          ← Back to Home
        </button>
        
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Choose Your Constellations
        </h1>
        <p className="text-xl text-purple-300 mb-6">
          Select category packages to create your custom game experience
        </p>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="text-purple-400 font-semibold mr-2">Quick Presets:</span>
          <button
            onClick={() => applyPreset('quick')}
            className="px-4 py-2 bg-green-600/30 border border-green-500/50 rounded-lg hover:bg-green-600/50 transition-all"
          >
            ⚡ Quick (3)
          </button>
          <button
            onClick={() => applyPreset('deep')}
            className="px-4 py-2 bg-blue-600/30 border border-blue-500/50 rounded-lg hover:bg-blue-600/50 transition-all"
          >
            🌊 Deep (3)
          </button>
          <button
            onClick={() => applyPreset('party')}
            className="px-4 py-2 bg-yellow-600/30 border border-yellow-500/50 rounded-lg hover:bg-yellow-600/50 transition-all"
          >
            🎉 Party (4)
          </button>
          <button
            onClick={() => applyPreset('balanced')}
            className="px-4 py-2 bg-purple-600/30 border border-purple-500/50 rounded-lg hover:bg-purple-600/50 transition-all"
          >
            ⚖️ Balanced (4)
          </button>
        </div>

        {/* Selection Summary */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-purple-300">Selected Constellations: </span>
              <span className="text-2xl font-bold text-purple-400">
                {selectedConstellations.size}
              </span>
              <span className="text-purple-300 ml-4">Total Questions: </span>
              <span className="text-2xl font-bold text-purple-400">
                {getSelectedQuestions().length}
              </span>
            </div>
            <button
              onClick={handleCreateRoom}
              disabled={selectedConstellations.size === 0}
              className={`px-6 py-3 rounded-lg font-bold text-lg transition-all ${
                selectedConstellations.size > 0
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 animate-pulse'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue to Lobby →
            </button>
          </div>
        </div>
      </div>

      {/* Constellation Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {constellations.map(constellation => {
            const isSelected = selectedConstellations.has(constellation.name)
            
            return (
              <div
                key={constellation.name}
                className={`
                  relative group cursor-pointer
                  rounded-xl border-2 p-6 transition-all duration-300
                  ${isSelected
                    ? 'bg-purple-600/40 border-purple-400 scale-105 shadow-lg shadow-purple-500/50'
                    : 'bg-purple-900/20 border-purple-700/50 hover:border-purple-500 hover:bg-purple-800/30'
                  }
                `}
                onClick={() => toggleConstellation(constellation.name)}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center">
                    <Icon name="check" size={16} />
                  </div>
                )}

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center
                    ${isSelected ? 'bg-purple-500' : 'bg-purple-800/50'}
                    transition-all duration-300
                  `}>
                    <Icon name={constellation.icon} size={32} />
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-2xl font-bold text-center mb-2">
                  {constellation.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-purple-300 text-center mb-4">
                  {constellation.description}
                </p>

                {/* Question Count */}
                <div className="flex items-center justify-center gap-2 text-purple-400">
                  <Icon name="list" size={16} />
                  <span className="font-semibold">{constellation.count} questions</span>
                </div>

                {/* Preview Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setPreviewConstellation(constellation)
                  }}
                  className="mt-4 w-full py-2 bg-purple-800/50 border border-purple-600/50 rounded-lg hover:bg-purple-700/50 transition-all text-sm"
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
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8"
          onClick={() => setPreviewConstellation(null)}
        >
          <div
            className="bg-gradient-to-br from-purple-900 to-purple-950 border-2 border-purple-500 rounded-2xl p-8 max-w-4xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">{previewConstellation.name}</h2>
                <p className="text-purple-300">{previewConstellation.description}</p>
              </div>
              <button
                onClick={() => setPreviewConstellation(null)}
                className="w-10 h-10 bg-purple-800/50 rounded-full hover:bg-purple-700 transition-all"
              >
                ✕
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {previewConstellation.questions.map((question, index) => (
                <div
                  key={index}
                  className="bg-purple-800/30 border border-purple-700/50 rounded-lg p-4"
                >
                  <div className="mb-2">
                    <span className="text-sm text-purple-400 font-semibold">CREW VERSION:</span>
                    <p className="text-white mt-1">{question.crew}</p>
                  </div>
                  <div>
                    <span className="text-sm text-pink-400 font-semibold">IMPOSTOR VERSION:</span>
                    <p className="text-white mt-1">{question.impostor}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => {
                  toggleConstellation(previewConstellation.name)
                  setPreviewConstellation(null)
                }}
                className={`
                  flex-1 py-3 rounded-lg font-bold transition-all
                  ${selectedConstellations.has(previewConstellation.name)
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-purple-600 hover:bg-purple-500'
                  }
                `}
              >
                {selectedConstellations.has(previewConstellation.name)
                  ? 'Remove from Selection'
                  : 'Add to Selection'
                }
              </button>
              <button
                onClick={() => setPreviewConstellation(null)}
                className="px-6 py-3 bg-purple-900/50 border border-purple-700 rounded-lg hover:bg-purple-800/50 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
