import { useState, useMemo } from 'react'
import { useGame } from '../contexts/GameContext'
import Icon from './Icon'
import AnimatedCosmicBackground from './AnimatedCosmicBackground'
import TwinkleStar from './TwinkleStar'
import questionData from '../data/questions.json'
import { constellationLayouts } from '../data/constellationLayouts'

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

// Constellation mini component
const ConstellationMini = ({ categoryName, isSelected }) => {
  const layout = constellationLayouts[categoryName] || constellationLayouts['Default']
  
  return (
    <>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes constellation-glow {
          0%, 100% { 
            filter: drop-shadow(0 0 4px rgba(168,85,247,0.6));
          }
          50% { 
            filter: drop-shadow(0 0 12px rgba(168,85,247,1)) drop-shadow(0 0 20px rgba(236,72,153,0.8));
          }
        }
        @keyframes line-pulse {
          0%, 100% { 
            stroke-width: 0.5;
            opacity: 0.9;
          }
          50% { 
            stroke-width: 1.2;
            opacity: 1;
          }
        }
        @keyframes star-burst {
          0% { 
            r: 1.5;
            opacity: 1;
          }
          50% { 
            r: 2.5;
            opacity: 0.8;
          }
          100% { 
            r: 1.5;
            opacity: 1;
          }
        }
        @keyframes rotate-constellation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full transition-all duration-500"
        style={{ 
          filter: isSelected ? 'drop-shadow(0 0 12px rgba(168,85,247,0.9))' : 'none',
          animation: isSelected ? 'constellation-glow 3s ease-in-out infinite' : 'none'
        }}
      >
        {/* Outer glow ring when selected */}
        {isSelected && (
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#constellation-gradient)"
            strokeWidth="0.3"
            opacity="0.4"
            style={{
              animation: 'rotate-constellation 20s linear infinite'
            }}
          />
        )}
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="constellation-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="1" />
            <stop offset="100%" stopColor="#e879f9" stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id="star-gradient">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="50%" stopColor="#e0b3ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.7" />
          </radialGradient>
        </defs>
        
        {/* Connecting lines */}
        {layout.lines.map((line, idx) => {
          const start = layout.stars[line[0]]
          const end = layout.stars[line[1]]
          return (
            <line
              key={idx}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={isSelected ? 'url(#constellation-gradient)' : '#7c3aed'}
              strokeWidth={isSelected ? '0.8' : '0.5'}
              className="transition-all duration-500"
              opacity={isSelected ? 0.9 : 0.5}
              style={{
                animation: isSelected ? 'line-pulse 2s ease-in-out infinite' : 'none',
                animationDelay: `${idx * 0.15}s`
              }}
            />
          )
        })}
        
        {/* Stars */}
        {layout.stars.map((star, idx) => {
          const isMainStar = idx === 0
          return (
            <g key={idx}>
              {/* Outer pulse ring for selected state */}
              {isSelected && (
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={isMainStar ? 5 : 3.5}
                  fill="none"
                  stroke="#e0b3ff"
                  strokeWidth="0.3"
                  opacity="0.3"
                  style={{
                    animation: 'star-burst 2s ease-in-out infinite',
                    animationDelay: `${idx * 0.2}s`
                  }}
                />
              )}
              {/* Main star */}
              <circle
                cx={star.x}
                cy={star.y}
                r={isMainStar ? 2.5 : 1.5}
                fill={isSelected ? 'url(#star-gradient)' : '#a78bfa'}
                className="transition-all duration-500"
                style={{
                  filter: isSelected 
                    ? 'drop-shadow(0 0 6px rgba(224,179,255,1))' 
                    : 'drop-shadow(0 0 2px rgba(167,139,250,0.6))',
                  animation: isSelected ? 'twinkle 2s ease-in-out infinite' : 'none',
                  animationDelay: `${idx * 0.2}s`
                }}
              />
              {/* Star flare effect when selected */}
              {isSelected && (
                <>
                  <line
                    x1={star.x}
                    y1={star.y - (isMainStar ? 4 : 2.5)}
                    x2={star.x}
                    y2={star.y + (isMainStar ? 4 : 2.5)}
                    stroke="#ffffff"
                    strokeWidth="0.3"
                    opacity="0.6"
                    style={{
                      animation: 'twinkle 2s ease-in-out infinite',
                      animationDelay: `${idx * 0.2}s`
                    }}
                  />
                  <line
                    x1={star.x - (isMainStar ? 4 : 2.5)}
                    y1={star.y}
                    x2={star.x + (isMainStar ? 4 : 2.5)}
                    y2={star.y}
                    stroke="#ffffff"
                    strokeWidth="0.3"
                    opacity="0.6"
                    style={{
                      animation: 'twinkle 2s ease-in-out infinite',
                      animationDelay: `${idx * 0.2}s`
                    }}
                  />
                </>
              )}
            </g>
          )
        })}
      </svg>
    </>
  )
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
  const presetConfigs = [
    {
      name: 'Ice Breaker',
      emoji: '🧊',
      categories: ['Daily Routines', 'Food & Drink', 'Wild Cards'],
      color: 'from-cyan-500/40 to-blue-600/40 border-cyan-400/50 hover:from-cyan-400/50 hover:to-blue-500/50 hover:shadow-cyan-500/50',
      description: 'Light & fun - perfect for getting to know people',
      questionCount: 15
    },
    {
      name: 'Deep Dive',
      emoji: '🌊',
      categories: ['Deep Thoughts', 'Personality & Psyche', 'History & Mythology'],
      color: 'from-blue-600/40 to-indigo-700/40 border-blue-400/50 hover:from-blue-500/50 hover:to-indigo-600/50 hover:shadow-blue-500/50',
      description: 'Philosophical & introspective conversations',
      questionCount: 15
    },
    {
      name: 'Creative Minds',
      emoji: '🎨',
      categories: ['Arts & Literature', 'Hypotheticals', 'Science & Nature'],
      color: 'from-purple-600/40 to-pink-600/40 border-purple-400/50 hover:from-purple-500/50 hover:to-pink-500/50 hover:shadow-purple-500/50',
      description: 'Imagination, creativity & what-ifs',
      questionCount: 15
    },
    {
      name: 'Party Mode',
      emoji: '🎉',
      categories: ['Wild Cards', 'Food & Drink', 'Travel & Geography', 'Objects & Places'],
      color: 'from-yellow-500/40 to-orange-600/40 border-yellow-400/50 hover:from-yellow-400/50 hover:to-orange-500/50 hover:shadow-yellow-500/50',
      description: 'Energetic & entertaining - great for groups',
      questionCount: 20
    },
    {
      name: 'Future Forward',
      emoji: '🚀',
      categories: ['Technology & Future', 'Science & Nature', 'Hypotheticals'],
      color: 'from-emerald-500/40 to-teal-600/40 border-emerald-400/50 hover:from-emerald-400/50 hover:to-teal-500/50 hover:shadow-emerald-500/50',
      description: 'Technology, innovation & the future',
      questionCount: 15
    },
    {
      name: 'Full Experience',
      emoji: '⭐',
      categories: Object.keys(questionData).filter(cat => questionData[cat].length > 0),
      color: 'from-violet-600/40 to-fuchsia-600/40 border-violet-400/50 hover:from-violet-500/50 hover:to-fuchsia-500/50 hover:shadow-violet-500/50',
      description: 'Everything - maximum variety',
      questionCount: 'All'
    }
  ]

  const applyPreset = (preset) => {
    setSelectedConstellations(new Set(preset.categories))
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
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
            <Icon name="zap" size={20} />
            Quick Start Presets
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {presetConfigs.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className={`
                  relative group p-4 rounded-xl border-2 transition-all duration-300
                  bg-gradient-to-br backdrop-blur-md
                  hover:scale-105 shadow-lg
                  ${preset.color}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{preset.emoji}</div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-white text-lg mb-1">
                      {preset.name}
                    </div>
                    <div className="text-xs text-purple-200/80 mb-2">
                      {preset.description}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="bg-black/30 px-2 py-1 rounded text-purple-300">
                        {preset.categories.length} categories
                      </span>
                      <span className="bg-black/30 px-2 py-1 rounded text-purple-300">
                        ~{preset.questionCount} questions
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Hover indicator */}
                <div className="absolute inset-0 rounded-xl border-2 border-white/0 group-hover:border-white/30 transition-all duration-300 pointer-events-none" />
              </button>
            ))}
          </div>
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
                  backdrop-blur-md overflow-hidden
                  ${isSelected
                    ? 'bg-gradient-to-br from-purple-600/50 to-pink-600/50 border-purple-400 scale-105 shadow-2xl shadow-purple-500/50 animate-pulse'
                    : 'bg-black/30 border-purple-700/40 hover:border-purple-400 hover:bg-purple-900/30 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30'
                  }
                `}
                onClick={() => toggleConstellation(constellation.name)}
              >
                {/* Constellation Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <ConstellationMini categoryName={constellation.name} isSelected={isSelected} />
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50 animate-bounce z-10">
                    <Icon name="check" size={20} />
                  </div>
                )}

                {/* Icon */}
                <div className="flex justify-center mb-4 relative z-10">
                  <div className="relative w-24 h-24">
                    {/* Hexagonal cosmic frame */}
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                      {/* Outer hexagon with glow */}
                      <defs>
                        <linearGradient id={`hex-gradient-${constellation.name}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={isSelected ? "#a78bfa" : "#581c87"} stopOpacity="0.8" />
                          <stop offset="50%" stopColor={isSelected ? "#c084fc" : "#7c3aed"} stopOpacity="1" />
                          <stop offset="100%" stopColor={isSelected ? "#e879f9" : "#6b21a8"} stopOpacity="0.8" />
                        </linearGradient>
                        <filter id={`hex-glow-${constellation.name}`}>
                          <feGaussianBlur stdDeviation={isSelected ? "3" : "1.5"} result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      
                      {/* Rotating outer ring */}
                      <polygon
                        points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
                        fill="none"
                        stroke={`url(#hex-gradient-${constellation.name})`}
                        strokeWidth={isSelected ? "2" : "1.5"}
                        className="transition-all duration-500"
                        style={{
                          filter: `url(#hex-glow-${constellation.name})`,
                          animation: isSelected ? 'rotate-hex 8s linear infinite' : 'none',
                          transformOrigin: 'center',
                          opacity: isSelected ? 0.8 : 0.5
                        }}
                      />
                      
                      {/* Inner hexagon */}
                      <polygon
                        points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5"
                        fill={isSelected 
                          ? 'url(#hex-gradient-' + constellation.name + ')' 
                          : 'rgba(88, 28, 135, 0.3)'}
                        stroke={isSelected ? "#c084fc" : "#7c3aed"}
                        strokeWidth="1"
                        className="transition-all duration-500"
                        style={{
                          filter: isSelected ? 'drop-shadow(0 0 8px rgba(192,132,252,0.6))' : 'none'
                        }}
                      />
                      
                      {/* Corner accent dots */}
                      {[
                        { x: 50, y: 5 },
                        { x: 90, y: 27.5 },
                        { x: 90, y: 72.5 },
                        { x: 50, y: 95 },
                        { x: 10, y: 72.5 },
                        { x: 10, y: 27.5 }
                      ].map((point, idx) => (
                        <circle
                          key={idx}
                          cx={point.x}
                          cy={point.y}
                          r={isSelected ? "2.5" : "1.5"}
                          fill={isSelected ? "#e0b3ff" : "#a78bfa"}
                          className="transition-all duration-500"
                          style={{
                            filter: isSelected ? 'drop-shadow(0 0 4px rgba(224,179,255,0.9))' : 'none',
                            animation: isSelected ? `twinkle 2s ease-in-out infinite ${idx * 0.2}s` : 'none'
                          }}
                        />
                      ))}
                    </svg>
                    
                    {/* Icon centered */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon name={constellation.icon} size={36} className={`transition-all duration-500 ${isSelected ? 'scale-110' : ''}`} />
                    </div>
                  </div>
                </div>

                {/* Add rotation keyframe */}
                <style>{`
                  @keyframes rotate-hex {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                `}</style>

                {/* Name */}
                <h3 className="text-xl sm:text-2xl font-bold text-center mb-2 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent relative z-10">
                  {constellation.name}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-purple-300/80 text-center mb-4 min-h-[2.5rem] relative z-10">
                  {constellation.description}
                </p>

                {/* Question Count */}
                <div className="flex items-center justify-center gap-2 text-purple-400 mb-3 relative z-10">
                  <Icon name="list" size={16} />
                  <span className="font-semibold text-sm">{constellation.count} questions</span>
                </div>

                {/* Preview Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setPreviewConstellation(constellation)
                  }}
                  className="w-full py-2 bg-black/30 backdrop-blur-sm border border-purple-600/50 rounded-lg hover:bg-purple-800/50 hover:border-purple-400 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-purple-500/30 relative z-10"
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
