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
    'Deep Thoughts': 'brain',
    'Hypotheticals': 'lightbulb',
    'Wild Cards': 'zap',
    'Daily Routines': 'coffee',
    'Objects & Places': 'map-pin',
    'History & Mythology': 'book',
    'Science & Nature': 'leaf',
    'Arts & Literature': 'palette',
    'Food & Drink': 'utensils',
    'Travel & Geography': 'globe',
    'Technology & Future': 'rocket',
    'Personality & Psyche': 'heart'
  }
  return iconMap[categoryName] || 'question'
}

// Helper function to get description for each constellation
const getCategoryDescription = (categoryName) => {
  const descMap = {
    'Deep Thoughts': 'Philosophical questions that challenge your worldview',
    'Hypotheticals': 'Imaginative scenarios and what-if situations',
    'Wild Cards': 'Unexpected and quirky questions for fun surprises',
    'Daily Routines': 'Everyday habits and personal rituals',
    'Objects & Places': 'Stories about things and locations that matter',
    'History & Mythology': 'Tales from the past and legendary stories',
    'Science & Nature': 'The wonders of the natural and scientific world',
    'Arts & Literature': 'Creative expression and cultural appreciation',
    'Food & Drink': 'Culinary experiences and taste preferences',
    'Travel & Geography': 'Adventures and places around the world',
    'Technology & Future': 'Innovation, progress, and what\'s to come',
    'Personality & Psyche': 'Self-discovery and understanding human nature'
  }
  return descMap[categoryName] || 'A collection of thought-provoking questions'
}

// Unique theme configuration for each category
const getCategoryTheme = (categoryName) => {
  const themes = {
    'Deep Thoughts': {
      gradients: 'from-indigo-600/30 via-purple-600/20 to-violet-700/30',
      borderColor: 'border-indigo-400/40',
      hoverGradients: 'hover:from-indigo-500/40 hover:via-purple-500/30 hover:to-violet-600/40',
      shadowColor: 'shadow-indigo-500/30 hover:shadow-indigo-400/50',
      selectedGlow: 'shadow-indigo-400/60',
      hexGradient: ['#818cf8', '#a78bfa'],  // Much brighter: indigo-400 → violet-400
      accentColor: '#c4b5fd',                // Much brighter: violet-300
      pattern: 'brain-waves',
      animation: 'bounce-subtle'
    },
    'Hypotheticals': {
      gradients: 'from-yellow-600/30 via-amber-500/20 to-orange-600/30',
      borderColor: 'border-yellow-400/40',
      hoverGradients: 'hover:from-yellow-500/40 hover:via-amber-400/30 hover:to-orange-500/40',
      shadowColor: 'shadow-yellow-500/30 hover:shadow-yellow-400/50',
      selectedGlow: 'shadow-yellow-400/60',
      hexGradient: ['#f59e0b', '#f97316'],  // amber-500 → orange-500
      accentColor: '#fbbf24',                // yellow-400
      pattern: 'question-marks',
      animation: 'bounce-subtle'
    },
    'Wild Cards': {
      gradients: 'from-fuchsia-600/30 via-pink-600/20 to-rose-600/30',
      borderColor: 'border-fuchsia-400/40',
      hoverGradients: 'hover:from-fuchsia-500/40 hover:via-pink-500/30 hover:to-rose-500/40',
      shadowColor: 'shadow-fuchsia-500/30 hover:shadow-fuchsia-400/50',
      selectedGlow: 'shadow-fuchsia-400/60',
      hexGradient: ['#e879f9', '#f9a8d4'],  // Much brighter: fuchsia-400 → pink-300
      accentColor: '#fae8ff',                // Much brighter: fuchsia-100
      pattern: 'lightning',
      animation: 'bounce-subtle'
    },
    'Daily Routines': {
      gradients: 'from-blue-600/30 via-sky-500/20 to-cyan-600/30',
      borderColor: 'border-blue-400/40',
      hoverGradients: 'hover:from-blue-500/40 hover:via-sky-400/30 hover:to-cyan-500/40',
      shadowColor: 'shadow-blue-500/30 hover:shadow-blue-400/50',
      selectedGlow: 'shadow-blue-400/60',
      hexGradient: ['#60a5fa', '#22d3ee'],  // Much brighter: blue-400 → cyan-400
      accentColor: '#bae6fd',                // Much brighter: sky-200
      pattern: 'circles',
      animation: 'bounce-subtle'
    },
    'Objects & Places': {
      gradients: 'from-slate-600/30 via-gray-500/20 to-zinc-600/30',
      borderColor: 'border-slate-400/40',
      hoverGradients: 'hover:from-slate-500/40 hover:via-gray-400/30 hover:to-zinc-500/40',
      shadowColor: 'shadow-slate-500/30 hover:shadow-slate-400/50',
      selectedGlow: 'shadow-slate-400/60',
      hexGradient: ['#cbd5e1', '#d4d4d8'],  // Much brighter: slate-300 → zinc-300
      accentColor: '#f1f5f9',                // Much brighter: slate-100
      pattern: 'grid',
      animation: 'bounce-subtle'
    },
    'History & Mythology': {
      gradients: 'from-amber-700/30 via-yellow-700/20 to-orange-800/30',
      borderColor: 'border-amber-500/40',
      hoverGradients: 'hover:from-amber-600/40 hover:via-yellow-600/30 hover:to-orange-700/40',
      shadowColor: 'shadow-amber-600/30 hover:shadow-amber-500/50',
      selectedGlow: 'shadow-amber-500/60',
      hexGradient: ['#f59e0b', '#f97316'],  // Brighter: amber-500 → orange-500
      accentColor: '#fcd34d',                // Brighter: amber-300
      pattern: 'scroll',
      animation: 'bounce-subtle'
    },
    'Science & Nature': {
      gradients: 'from-emerald-600/30 via-green-600/20 to-teal-700/30',
      borderColor: 'border-emerald-400/40',
      hoverGradients: 'hover:from-emerald-500/40 hover:via-green-500/30 hover:to-teal-600/40',
      shadowColor: 'shadow-emerald-500/30 hover:shadow-emerald-400/50',
      selectedGlow: 'shadow-emerald-400/60',
      hexGradient: ['#34d399', '#2dd4bf'],  // Much brighter: emerald-400 → teal-400
      accentColor: '#a7f3d0',                // Much brighter: emerald-200
      pattern: 'organic',
      animation: 'bounce-subtle'
    },
    'Arts & Literature': {
      gradients: 'from-purple-600/30 via-fuchsia-500/20 to-pink-600/30',
      borderColor: 'border-purple-400/40',
      hoverGradients: 'hover:from-purple-500/40 hover:via-fuchsia-400/30 hover:to-pink-500/40',
      shadowColor: 'shadow-purple-500/30 hover:shadow-purple-400/50',
      selectedGlow: 'shadow-purple-400/60',
      hexGradient: ['#c084fc', '#e879f9'],  // Much brighter: purple-400 → fuchsia-400
      accentColor: '#e9d5ff',                // Much brighter: purple-200
      pattern: 'brush-strokes',
      animation: 'bounce-subtle'
    },
    'Food & Drink': {
      gradients: 'from-red-600/30 via-rose-500/20 to-pink-600/30',
      borderColor: 'border-red-400/40',
      hoverGradients: 'hover:from-red-500/40 hover:via-rose-400/30 hover:to-pink-500/40',
      shadowColor: 'shadow-red-500/30 hover:shadow-red-400/50',
      selectedGlow: 'shadow-red-400/60',
      hexGradient: ['#f87171', '#fb7185'],  // Much brighter: red-400 → rose-400
      accentColor: '#fecaca',                // Much brighter: red-200
      pattern: 'food-dots',
      animation: 'bounce-subtle'
    },
    'Travel & Geography': {
      gradients: 'from-cyan-600/30 via-blue-500/20 to-indigo-600/30',
      borderColor: 'border-cyan-400/40',
      hoverGradients: 'hover:from-cyan-500/40 hover:via-blue-400/30 hover:to-indigo-500/40',
      shadowColor: 'shadow-cyan-500/30 hover:shadow-cyan-400/50',
      selectedGlow: 'shadow-cyan-400/60',
      hexGradient: ['#22d3ee', '#60a5fa'],  // Much brighter: cyan-400 → blue-400
      accentColor: '#a5f3fc',                // Much brighter: cyan-200
      pattern: 'waves',
      animation: 'bounce-subtle'
    },
    'Technology & Future': {
      gradients: 'from-violet-600/30 via-purple-500/20 to-fuchsia-600/30',
      borderColor: 'border-violet-400/40',
      hoverGradients: 'hover:from-violet-500/40 hover:via-purple-400/30 hover:to-fuchsia-500/40',
      shadowColor: 'shadow-violet-500/30 hover:shadow-violet-400/50',
      selectedGlow: 'shadow-violet-400/60',
      hexGradient: ['#a78bfa', '#e879f9'],  // Much brighter: violet-400 → fuchsia-400
      accentColor: '#ddd6fe',                // Much brighter: violet-200
      pattern: 'circuit',
      animation: 'bounce-subtle'
    },
    'Personality & Psyche': {
      gradients: 'from-rose-600/30 via-pink-500/20 to-fuchsia-600/30',
      borderColor: 'border-rose-400/40',
      hoverGradients: 'hover:from-rose-500/40 hover:via-pink-400/30 hover:to-fuchsia-500/40',
      shadowColor: 'shadow-rose-500/30 hover:shadow-rose-400/50',
      selectedGlow: 'shadow-rose-400/60',
      hexGradient: ['#fb7185', '#f472b6'],  // Much brighter: rose-400 → pink-400
      accentColor: '#fecdd3',                // Much brighter: rose-200
      pattern: 'hearts',
      animation: 'bounce-subtle'
    }
  }
  return themes[categoryName] || themes['Deep Thoughts']
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
  const [showRandomModal, setShowRandomModal] = useState(false)
  const [randomCount, setRandomCount] = useState(5)
  const [showGameSettings, setShowGameSettings] = useState(false)
  
  // Game settings state
  const [gameSettings, setGameSettings] = useState({
    winCondition: 'score', // 'score' or 'rounds'
    winValue: 5, // points to win or number of rounds
    customTimers: {
      answer: 60,
      debate: 60,
      vote: 45
    }
  })

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
      name: 'Full Experience',
      emoji: '⭐',
      categories: Object.keys(questionData).filter(cat => questionData[cat].length > 0),
      color: 'from-violet-600/40 to-fuchsia-600/40 border-violet-400/50 hover:from-violet-500/50 hover:to-fuchsia-500/50 hover:shadow-violet-500/50',
      description: 'Select all categories for maximum variety and endless possibilities',
      questionCount: 'All'
    },
    {
      name: 'Random Mix',
      emoji: '🎲',
      categories: [], // Will be filled dynamically
      color: 'from-pink-500/40 to-rose-600/40 border-pink-400/50 hover:from-pink-400/50 hover:to-rose-500/50 hover:shadow-pink-500/50',
      description: 'Let fate decide - choose how many random categories you want',
      questionCount: 'Custom',
      isRandom: true
    }
  ]

  const applyPreset = (preset) => {
    if (preset.isRandom) {
      setShowRandomModal(true)
    } else {
      setSelectedConstellations(new Set(preset.categories))
    }
  }

  // Apply random selection
  const applyRandomSelection = () => {
    const allCategories = Object.keys(questionData).filter(cat => questionData[cat].length > 0)
    const count = Math.min(randomCount, allCategories.length)
    
    // Shuffle and select
    const shuffled = [...allCategories].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, count)
    
    setSelectedConstellations(new Set(selected))
    setShowRandomModal(false)
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
    
    // Store selected questions and game settings in localStorage
    localStorage.setItem('selectedQuestions', JSON.stringify(questions))
    localStorage.setItem('gameSettings', JSON.stringify(gameSettings))
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
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
            <Icon name="zap" size={20} />
            Quick Start
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {presetConfigs.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className={`
                  relative group p-6 rounded-2xl border-2 transition-all duration-300
                  bg-gradient-to-br backdrop-blur-md
                  hover:scale-[1.02] shadow-xl
                  ${preset.color}
                `}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="text-5xl mb-2">{preset.emoji}</div>
                  <div className="font-bold text-white text-2xl">
                    {preset.name}
                  </div>
                  <div className="text-sm text-purple-100/90 leading-relaxed px-4">
                    {preset.description}
                  </div>
                  <div className="flex items-center justify-center gap-3 text-sm mt-2">
                    <span className="bg-black/40 px-3 py-1.5 rounded-full text-purple-200 font-medium">
                      {preset.isRandom ? '🎲 Custom' : `${preset.categories.length} Categories`}
                    </span>
                    <span className="bg-black/40 px-3 py-1.5 rounded-full text-purple-200 font-medium">
                      {preset.questionCount === 'All' ? '⭐ All Questions' : `${preset.questionCount} Questions`}
                    </span>
                  </div>
                </div>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-white/0 group-hover:border-white/40 transition-all duration-300 pointer-events-none" />
              </button>
            ))}
          </div>
        </div>

        {/* Selection Summary */}
        <div className="bg-black/40 backdrop-blur-md border border-purple-500/50 rounded-xl p-5 shadow-2xl shadow-purple-500/20">
          <div className="flex flex-col gap-4">
            {/* Stats Row */}
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
                <div className="h-8 w-px bg-purple-500/30 hidden sm:block" />
                <div>
                  <span className="text-purple-300/80 text-sm">Win Goal: </span>
                  <span className="text-2xl font-bold text-cyan-400">
                    {gameSettings.winCondition === 'score' ? `${gameSettings.winValue} Points` : `${gameSettings.winValue} Rounds`}
                  </span>
                </div>
              </div>
              
              {/* Game Settings Button */}
              <button
                onClick={() => setShowGameSettings(true)}
                className="px-4 py-2 bg-cyan-600/30 backdrop-blur-sm border border-cyan-400/50 rounded-lg hover:bg-cyan-500/40 hover:border-cyan-300 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 flex items-center gap-2"
              >
                <Icon name="settings" size={20} />
                <span className="font-semibold">Game Settings</span>
              </button>
            </div>

            {/* Continue Button Row */}
            <button
              onClick={handleCreateRoom}
              disabled={selectedConstellations.size === 0}
              className={`w-full px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                selectedConstellations.size > 0
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:scale-105 shadow-purple-500/50 animate-pulse'
                  : 'bg-gray-800/50 text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
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
            const theme = getCategoryTheme(constellation.name)
            
            return (
              <div
                key={constellation.name}
                className={`
                  relative group cursor-pointer
                  rounded-2xl border-2 p-6 transition-all duration-300 transform
                  backdrop-blur-md overflow-hidden
                  ${isSelected
                    ? `bg-gradient-to-br ${theme.gradients} ${theme.borderColor} scale-105 shadow-2xl ${theme.selectedGlow}`
                    : `bg-black/30 ${theme.borderColor} hover:border-opacity-80 ${theme.hoverGradients} hover:scale-105 hover:shadow-xl ${theme.shadowColor}`
                  }
                `}
                onClick={() => toggleConstellation(constellation.name)}
                style={{
                  animation: isSelected ? `${theme.animation} 3s ease-in-out infinite` : 'none'
                }}
              >
                {/* Constellation Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <ConstellationMini categoryName={constellation.name} isSelected={isSelected} />
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div 
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg animate-bounce z-10"
                    style={{
                      background: `linear-gradient(135deg, ${theme.hexGradient[0]}, ${theme.hexGradient[1]})`,
                      boxShadow: `0 4px 20px ${theme.accentColor}80`
                    }}
                  >
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
                          <stop offset="0%" stopColor={theme.hexGradient[0]} stopOpacity="0.8" />
                          <stop offset="50%" stopColor={theme.accentColor} stopOpacity="1" />
                          <stop offset="100%" stopColor={theme.hexGradient[1]} stopOpacity="0.8" />
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
                        strokeWidth={isSelected ? "2.5" : "1.5"}
                        className="transition-all duration-500"
                        style={{
                          filter: `url(#hex-glow-${constellation.name})`,
                          animation: isSelected ? 'rotate-hex 8s linear infinite' : 'none',
                          transformOrigin: 'center',
                          opacity: isSelected ? 0.9 : 0.5
                        }}
                      />
                      
                      {/* Inner hexagon */}
                      <polygon
                        points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5"
                        fill={`url(#hex-gradient-${constellation.name})`}
                        stroke={isSelected ? theme.accentColor : theme.hexGradient[0]}
                        strokeWidth="1"
                        className="transition-all duration-500"
                        style={{
                          opacity: isSelected ? 1 : 0.15,
                          filter: isSelected ? `drop-shadow(0 0 10px ${theme.accentColor})` : 'none'
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
                          fill={isSelected ? theme.accentColor : theme.hexGradient[0]}
                          className="transition-all duration-500"
                          style={{
                            filter: isSelected ? `drop-shadow(0 0 4px ${theme.accentColor})` : 'none',
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
                <h3 
                  className="text-xl sm:text-2xl font-bold text-center mb-2 bg-clip-text text-transparent relative z-10"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${theme.hexGradient[0]}, ${theme.accentColor}, ${theme.hexGradient[1]})`,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text'
                  }}
                >
                  {constellation.name}
                </h3>

                {/* Description */}
                <p 
                  className="text-xs sm:text-sm text-center mb-4 min-h-[2.5rem] relative z-10"
                  style={{ color: `${theme.accentColor}cc` }}
                >
                  {constellation.description}
                </p>

                {/* Question Count Badge */}
                <div 
                  className="flex items-center justify-center gap-2 mb-3 relative z-10 px-3 py-1.5 rounded-full mx-auto w-fit border"
                  style={{
                    backgroundColor: `${theme.hexGradient[0]}20`,
                    borderColor: `${theme.accentColor}40`,
                    color: theme.accentColor
                  }}
                >
                  <Icon name="list" size={16} />
                  <span className="font-semibold text-sm">{constellation.count} questions</span>
                </div>

                {/* Preview Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setPreviewConstellation(constellation)
                  }}
                  className="w-full py-2 backdrop-blur-sm border rounded-lg transition-all duration-300 text-sm font-medium shadow-lg relative z-10"
                  style={{
                    backgroundColor: `${theme.hexGradient[0]}20`,
                    borderColor: `${theme.accentColor}40`,
                    color: theme.accentColor
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${theme.hexGradient[0]}40`
                    e.currentTarget.style.borderColor = theme.accentColor
                    e.currentTarget.style.boxShadow = `0 4px 20px ${theme.accentColor}50`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${theme.hexGradient[0]}20`
                    e.currentTarget.style.borderColor = `${theme.accentColor}40`
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                  }}
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

      {/* Random Selection Modal */}
      {showRandomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-purple-900/95 to-black/95 backdrop-blur-xl border border-purple-500/50 rounded-2xl shadow-2xl shadow-purple-500/30 max-w-md w-full p-6 sm:p-8">
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="text-6xl mb-3">🎲</div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Random Mix
              </h2>
              <p className="text-purple-300/80 text-sm">
                Let fate decide your constellations
              </p>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4">
                <label className="block text-sm font-semibold text-purple-300 mb-3">
                  How many categories to select?
                </label>
                
                {/* Slider */}
                <div className="space-y-3">
                  <input
                    type="range"
                    min="1"
                    max={Object.keys(questionData).length}
                    value={randomCount}
                    onChange={(e) => setRandomCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-purple-900/50 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    style={{
                      background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(168 85 247) ${(randomCount / Object.keys(questionData).length) * 100}%, rgb(88 28 135 / 0.5) ${(randomCount / Object.keys(questionData).length) * 100}%, rgb(88 28 135 / 0.5) 100%)`
                    }}
                  />
                  
                  {/* Number Display */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-purple-400/60">1 category</span>
                    <div className="bg-purple-500/20 border border-purple-400/50 rounded-lg px-4 py-2">
                      <span className="text-3xl font-bold text-purple-300">{randomCount}</span>
                    </div>
                    <span className="text-xs text-purple-400/60">{Object.keys(questionData).length} categories</span>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-4 text-center text-xs text-purple-300/60">
                  {randomCount === Object.keys(questionData).length 
                    ? '✨ Selecting all categories'
                    : `🎲 Will randomly select ${randomCount} out of ${Object.keys(questionData).length} categories`
                  }
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRandomModal(false)}
                className="flex-1 px-6 py-3 bg-black/40 backdrop-blur-sm border border-purple-500/50 rounded-xl hover:bg-purple-900/50 hover:border-purple-400 transition-all duration-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={applyRandomSelection}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-pink-500/50 font-bold"
              >
                🎲 Randomize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Settings Modal */}
      {showGameSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-purple-900/95 to-black/95 backdrop-blur-xl border border-purple-500/50 rounded-2xl shadow-2xl shadow-purple-500/30 max-w-2xl w-full p-6 sm:p-8">
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="text-6xl mb-3">⚙️</div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Game Settings
              </h2>
              <p className="text-purple-300/80 text-sm">
                Customize win conditions and phase timers
              </p>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Win Condition Section */}
              <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5">
                <h3 className="text-lg font-bold text-purple-300 mb-4 flex items-center gap-2">
                  <Icon name="trophy" size={20} />
                  Victory Condition
                </h3>
                
                {/* Win Condition Type */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <button
                    onClick={() => setGameSettings(prev => ({ ...prev, winCondition: 'score', winValue: 5 }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      gameSettings.winCondition === 'score'
                        ? 'bg-gradient-to-br from-purple-600/50 to-pink-600/50 border-purple-400 shadow-lg shadow-purple-500/50 scale-105'
                        : 'bg-black/30 border-purple-700/40 hover:border-purple-400 hover:bg-purple-900/30'
                    }`}
                  >
                    <div className="text-3xl mb-2">🏆</div>
                    <div className="font-bold text-white">Score Goal</div>
                    <div className="text-xs text-purple-300/80 mt-1">First to reach points wins</div>
                  </button>
                  
                  <button
                    onClick={() => setGameSettings(prev => ({ ...prev, winCondition: 'rounds', winValue: 3 }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      gameSettings.winCondition === 'rounds'
                        ? 'bg-gradient-to-br from-purple-600/50 to-pink-600/50 border-purple-400 shadow-lg shadow-purple-500/50 scale-105'
                        : 'bg-black/30 border-purple-700/40 hover:border-purple-400 hover:bg-purple-900/30'
                    }`}
                  >
                    <div className="text-3xl mb-2">🔄</div>
                    <div className="font-bold text-white">Best of Rounds</div>
                    <div className="text-xs text-purple-300/80 mt-1">Highest score after X rounds</div>
                  </button>
                </div>

                {/* Win Value Selection */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                      <span className="text-xl">{gameSettings.winCondition === 'score' ? '🎯' : '🔢'}</span>
                      {gameSettings.winCondition === 'score' ? 'Points to Win' : 'Number of Rounds'}
                    </label>
                    <div className="bg-purple-500/20 border border-purple-400/50 rounded-lg px-3 py-1">
                      <span className="text-xl font-bold text-purple-300">{gameSettings.winValue}</span>
                    </div>
                  </div>
                  
                  {gameSettings.winCondition === 'score' ? (
                    <div className="grid grid-cols-5 gap-2">
                      {[3, 5, 7, 10, 15].map(points => (
                        <button
                          key={points}
                          onClick={() => setGameSettings(prev => ({ ...prev, winValue: points }))}
                          className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                            gameSettings.winValue === points
                              ? 'bg-gradient-to-br from-purple-500/60 to-pink-500/60 border-2 border-purple-300 text-white shadow-lg shadow-purple-500/50 scale-105'
                              : 'bg-black/40 border border-purple-700/30 text-purple-400/70 hover:bg-purple-900/40 hover:border-purple-500/50 hover:text-purple-300'
                          }`}
                        >
                          {points}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 3, 5, 7, 10].map(rounds => (
                        <button
                          key={rounds}
                          onClick={() => setGameSettings(prev => ({ ...prev, winValue: rounds }))}
                          className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                            gameSettings.winValue === rounds
                              ? 'bg-gradient-to-br from-purple-500/60 to-pink-500/60 border-2 border-purple-300 text-white shadow-lg shadow-purple-500/50 scale-105'
                              : 'bg-black/40 border border-purple-700/30 text-purple-400/70 hover:bg-purple-900/40 hover:border-purple-500/50 hover:text-purple-300'
                          }`}
                        >
                          {rounds}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Timers Section */}
              <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5">
                <h3 className="text-lg font-bold text-purple-300 mb-4 flex items-center gap-2">
                  <Icon name="clock" size={20} />
                  Phase Timers
                </h3>
                
                <div className="space-y-5">
                  {/* Answer Timer */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                        <span className="text-xl">✍️</span>
                        Answer Phase
                      </label>
                      <div className="bg-cyan-500/20 border border-cyan-400/50 rounded-lg px-3 py-1">
                        <span className="text-xl font-bold text-cyan-300">{gameSettings.customTimers.answer}s</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {[30, 45, 60, 90, 120].map(seconds => (
                        <button
                          key={seconds}
                          onClick={() => setGameSettings(prev => ({
                            ...prev,
                            customTimers: { ...prev.customTimers, answer: seconds }
                          }))}
                          className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                            gameSettings.customTimers.answer === seconds
                              ? 'bg-gradient-to-br from-cyan-500/60 to-blue-500/60 border-2 border-cyan-300 text-white shadow-lg shadow-cyan-500/50 scale-105'
                              : 'bg-black/40 border border-cyan-700/30 text-cyan-400/70 hover:bg-cyan-900/40 hover:border-cyan-500/50 hover:text-cyan-300'
                          }`}
                        >
                          {seconds}s
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Debate Timer */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                        <span className="text-xl">💬</span>
                        Debate Phase
                      </label>
                      <div className="bg-emerald-500/20 border border-emerald-400/50 rounded-lg px-3 py-1">
                        <span className="text-xl font-bold text-emerald-300">{gameSettings.customTimers.debate}s</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {[30, 45, 60, 90, 120].map(seconds => (
                        <button
                          key={seconds}
                          onClick={() => setGameSettings(prev => ({
                            ...prev,
                            customTimers: { ...prev.customTimers, debate: seconds }
                          }))}
                          className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                            gameSettings.customTimers.debate === seconds
                              ? 'bg-gradient-to-br from-emerald-500/60 to-green-500/60 border-2 border-emerald-300 text-white shadow-lg shadow-emerald-500/50 scale-105'
                              : 'bg-black/40 border border-emerald-700/30 text-emerald-400/70 hover:bg-emerald-900/40 hover:border-emerald-500/50 hover:text-emerald-300'
                          }`}
                        >
                          {seconds}s
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vote Timer */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                        <span className="text-xl">🗳️</span>
                        Voting Phase
                      </label>
                      <div className="bg-rose-500/20 border border-rose-400/50 rounded-lg px-3 py-1">
                        <span className="text-xl font-bold text-rose-300">{gameSettings.customTimers.vote}s</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {[20, 30, 45, 60, 90].map(seconds => (
                        <button
                          key={seconds}
                          onClick={() => setGameSettings(prev => ({
                            ...prev,
                            customTimers: { ...prev.customTimers, vote: seconds }
                          }))}
                          className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                            gameSettings.customTimers.vote === seconds
                              ? 'bg-gradient-to-br from-rose-500/60 to-pink-500/60 border-2 border-rose-300 text-white shadow-lg shadow-rose-500/50 scale-105'
                              : 'bg-black/40 border border-rose-700/30 text-rose-400/70 hover:bg-rose-900/40 hover:border-rose-500/50 hover:text-rose-300'
                          }`}
                        >
                          {seconds}s
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowGameSettings(false)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-pink-500/50 font-bold"
              >
                ✓ Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
