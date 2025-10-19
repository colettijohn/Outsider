import React, { useState, useEffect, useCallback } from 'react'
import { useGame } from '../contexts/GameContext'
import Icon from './Icon'
import HexButton from './HexButton'
import PresetModal from './PresetModal'
import RandomSelectionModal from './RandomSelectionModal'
import MeteorShowerOverlay from './MeteorShowerOverlay'
import AdvancedSettingsPanel from './AdvancedSettingsPanel'
import TooltipPortal from './TooltipPortal'
import { constellationLayouts } from '../data/constellationLayouts'

/**
 * CustomizeGameScreen component - Constellation-based decree selector
 */
const CustomizeGameScreen = () => {
  const { handleConfirmCustomization, questionData } = useGame()
  const [activeCategory, setActiveCategory] = useState(null)
  const [selectedQuestions, setSelectedQuestions] = useState(() => new Set())
  const [undoStack, setUndoStack] = useState([])
  const [redoStack, setRedoStack] = useState([])
  const [gameSettings, setGameSettings] = useState({ winCondition: 'score', winValue: 5 })
  const [showRandomModal, setShowRandomModal] = useState(false)
  const [activatedCategory, setActivatedCategory] = useState(null)
  const [isDecoding, setIsDecoding] = useState(false)
  const [meteorShowerTargets, setMeteorShowerTargets] = useState([])
  
  // Presets and advanced settings
  const [presets, setPresets] = useState({})
  const [showPresetModal, setShowPresetModal] = useState(null)
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [advancedSettings, setAdvancedSettings] = useState({
    customTimers: { answer: 60, debate: 60, vote: 45 },
    customDecrees: []
  })
  
  // Question preview
  const [previewCategory, setPreviewCategory] = useState(null)
  const [longPressTimer, setLongPressTimer] = useState(null)
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const hoverTimer = React.useRef(null)
  
  // Search/filter
  const [searchQuery, setSearchQuery] = useState('')

  // Keyboard navigation
  const [focusedIndex, setFocusedIndex] = useState(0)

  const { categories: questionCategories, all: allQuestions } = questionData

  const ATLAS_CATEGORIES = [
    "Deep Thoughts", "Hypotheticals", "Wild Cards", "Daily Routines",
    "Objects & Places", "History & Mythology", "Science & Nature",
    "Arts & Literature", "Food & Drink", "Travel & Geography",
    "Technology & Future", "Personality & Psyche"
  ]

  if (!questionCategories) {
    return <div className="text-center">Loading Celestial Atlas...</div>
  }
  
  const constellationCategories = ATLAS_CATEGORIES.filter(
    cat => questionCategories[cat] && questionCategories[cat].length > 0
  )

  useEffect(() => {
    try {
      const savedPresets = localStorage.getItem('outsider_presets')
      if (savedPresets) {
        setPresets(JSON.parse(savedPresets))
      }
    } catch (error) {
      console.error("Failed to load presets:", error)
    }
  }, [questionCategories])
  
  const handleSavePreset = (name) => {
    const selectedCategories = constellationCategories.filter(cat => isCategorySelected(cat))
    const newPresets = { ...presets, [name]: selectedCategories }
    setPresets(newPresets)
    localStorage.setItem('outsider_presets', JSON.stringify(newPresets))
    setShowPresetModal(null)
  }

  const handleLoadPreset = (presetName) => {
    const presetCategories = presets[presetName]
    if (presetCategories) {
      const newSelected = new Set()
      presetCategories.forEach(catName => {
        questionCategories[catName].forEach(q => newSelected.add(q.crew))
      })
      setSelectedQuestions(newSelected)
    }
    setShowPresetModal(null)
  }

  const handleDeletePreset = (presetName) => {
    const newPresets = { ...presets }
    delete newPresets[presetName]
    setPresets(newPresets)
    localStorage.setItem('outsider_presets', JSON.stringify(newPresets))
  }
  
  const isCategorySelected = (catName) => {
    const categoryQuestions = questionCategories[catName]
    if (!categoryQuestions || categoryQuestions.length === 0) return false
    return categoryQuestions.every(q => selectedQuestions.has(q.crew))
  }

  const handleConstellationClick = (catName) => {
    setActivatedCategory(catName)
    setTimeout(() => setActivatedCategory(null), 1200)
    setIsDecoding(true)
    setTimeout(() => {
      setActiveCategory(catName)
      setIsDecoding(false)
    }, 300)

    // Save current state for undo
    setUndoStack(prev => [...prev, new Set(selectedQuestions)])
    setRedoStack([])

    const categoryQuestions = questionCategories[catName].map(q => q.crew)
    const allCurrentlySelected = isCategorySelected(catName)
    const newSelected = new Set(selectedQuestions)
    if (allCurrentlySelected) {
      categoryQuestions.forEach(q => newSelected.delete(q))
    } else {
      categoryQuestions.forEach(q => newSelected.add(q))
    }
    setSelectedQuestions(newSelected)
  }

  const handleGeneralSelect = () => {
    setUndoStack(prev => [...prev, new Set(selectedQuestions)])
    setRedoStack([])
    if (selectedQuestions.size === allQuestions.length) {
      setSelectedQuestions(new Set())
    } else {
      setSelectedQuestions(new Set(allQuestions.map(q => q.crew)))
    }
  }
  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const prev = undoStack[undoStack.length - 1]
      setRedoStack(r => [...r, new Set(selectedQuestions)])
      setSelectedQuestions(new Set(prev))
      setUndoStack(u => u.slice(0, u.length - 1))
    }
  }, [undoStack, selectedQuestions])

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const next = redoStack[redoStack.length - 1]
      setUndoStack(u => [...u, new Set(selectedQuestions)])
      setSelectedQuestions(new Set(next))
      setRedoStack(r => r.slice(0, r.length - 1))
    }
  }, [redoStack, selectedQuestions])

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault()
        handleUndo()
      } else if (((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z')))) {
        e.preventDefault()
        handleRedo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleUndo, handleRedo])

  // Keyboard navigation for constellations
  useEffect(() => {
    const availableCategories = constellationCategories
      .filter(cat => !isCategorySelected(cat))
      .filter(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const handleKeyDown = (e) => {
      // Don't interfere if user is typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      
      // Don't handle if modals are open
      if (previewCategory || showPresetModal || showRandomModal || showAdvancedSettings) {
        // Allow Esc to close modals
        if (e.key === 'Escape') {
          e.preventDefault()
          setPreviewCategory(null)
          setShowPresetModal(null)
          setShowRandomModal(false)
        }
        return
      }

      switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex(prev => (prev + 1) % Math.max(availableCategories.length, 1))
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex(prev => (prev - 1 + availableCategories.length) % Math.max(availableCategories.length, 1))
          break
        case ' ':
        case 'Spacebar':
          e.preventDefault()
          if (availableCategories[focusedIndex]) {
            handleConstellationClick(availableCategories[focusedIndex])
          }
          break
        case 'Enter':
          e.preventDefault()
          if (availableCategories[focusedIndex]) {
            setPreviewCategory(availableCategories[focusedIndex])
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [focusedIndex, constellationCategories, searchQuery, previewCategory, showPresetModal, showRandomModal, showAdvancedSettings, handleConstellationClick])

  // Reset focused index when search changes
  useEffect(() => {
    setFocusedIndex(0)
  }, [searchQuery])
  
  const handleRandomSelect = (count) => {
    const shuffled = [...constellationCategories].sort(() => 0.5 - Math.random())
    const randomCategories = shuffled.slice(0, count)
    const newSelectedQuestions = new Set()
    
    const targetElements = randomCategories.map(catName => {
      questionCategories[catName].forEach(q => newSelectedQuestions.add(q.crew))
      return document.querySelector(`[data-constellation-id="${catName}"]`)
    }).filter(Boolean)

    setSelectedQuestions(newSelectedQuestions)
    setMeteorShowerTargets(targetElements)
    setShowRandomModal(false)

    setTimeout(() => {
      setMeteorShowerTargets([])
    }, 2000)
  }

  const handleQuickPreset = (presetType) => {
    const presetMap = {
      quickGame: ["Deep Thoughts", "Wild Cards", "Daily Routines"],
      brainTeasers: ["Deep Thoughts", "Hypotheticals", "Personality & Psyche"],
      partyMix: ["Wild Cards", "Food & Drink", "Daily Routines", "Objects & Places"],
      cosmicJourney: ["Science & Nature", "History & Mythology", "Technology & Future", "Travel & Geography"]
    }

    const selectedCategories = presetMap[presetType].filter(cat => 
      constellationCategories.includes(cat)
    )

    const newSelectedQuestions = new Set()
    const targetElements = selectedCategories.map(catName => {
      questionCategories[catName]?.forEach(q => newSelectedQuestions.add(q.crew))
      return document.querySelector(`[data-constellation-id="${catName}"]`)
    }).filter(Boolean)

    setSelectedQuestions(newSelectedQuestions)
    setMeteorShowerTargets(targetElements)

    setTimeout(() => {
      setMeteorShowerTargets([])
    }, 2000)
  }

  const handlePreviewCategory = (catName, e) => {
    e.preventDefault()
    e.stopPropagation()
    setPreviewCategory(catName)
  }

  const handleLongPressStart = (catName, e) => {
    const timer = setTimeout(() => {
      setPreviewCategory(catName)
    }, 500) // 500ms long press
    setLongPressTimer(timer)
  }

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }

  const handleSelectFromPreview = () => {
    if (previewCategory) {
      handleConstellationClick(previewCategory)
      setPreviewCategory(null)
    }
  }

  const handleConfirm = () => {
    const customQuestions = Array.from(selectedQuestions)
      .map(crew => allQuestions.find(q => q.crew === crew) || advancedSettings.customDecrees.find(q => q.crew === crew))
      .filter(Boolean)

    const finalQuestions = [...customQuestions, ...advancedSettings.customDecrees]
    const finalGameSettings = { ...gameSettings, customTimers: advancedSettings.customTimers }
    
    handleConfirmCustomization(finalQuestions.length > 0 ? finalQuestions : [], finalGameSettings)
  }

  const minQuestions = 3
  const canContinue = selectedQuestions.size >= minQuestions

  // Selected category card component
  const SelectedCategoryCard = ({ catName, onRemove }) => {
    const layout = constellationLayouts[catName] || constellationLayouts["Default"]
    return (
      <div className="flex items-center gap-3 p-2 bg-gray-900/50 rounded-md">
        <svg viewBox="0 0 100 100" className="w-10 h-10 flex-shrink-0">
          <g>
            {layout.lines.map(([p1, p2], i) => (
              <line
                key={i}
                x1={layout.stars[p1].x}
                y1={layout.stars[p1].y}
                x2={layout.stars[p2].x}
                y2={layout.stars[p2].y}
                className="constellation-line selected"
              />
            ))}
            {layout.stars.map((star, i) => (
              <circle
                key={i}
                cx={star.x}
                cy={star.y}
                r={4}
                className="constellation-star selected"
              />
            ))}
          </g>
        </svg>
        <span className="font-semibold flex-grow truncate">{catName}</span>
        <button
          onClick={() => onRemove(catName)}
          className="p-1 bg-red-800/50 hover:bg-red-700 rounded"
        >
          <Icon name="X" className="w-4 h-4" />
        </button>
      </div>
    )
  }
  
  const availableCategories = constellationCategories
    .filter(cat => !isCategorySelected(cat))
    .filter(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
  const selectedCategories = constellationCategories.filter(cat => isCategorySelected(cat))

  const constellationRefs = React.useRef({})

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-6 max-w-screen-2xl mx-auto">
      {/* LEFT COLUMN: CELESTIAL ATLAS */}
      <div className="flex-grow flex flex-col min-h-0 lg:w-3/5" style={{ overflow: 'visible' }}>
        <div className="panel rounded-lg p-4 flex flex-col h-full" style={{ overflow: 'visible' }}>
          <div className="flex-shrink-0 flex flex-col gap-3 p-2 mb-2 bg-gray-900/50 rounded-md">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h2 className="title-font text-3xl text-amber-500 uppercase">Celestial Atlas</h2>
                <p className="text-gray-400 text-sm">Select decrees to add to the manifest.</p>
              </div>
              <div className="flex flex-col gap-2">
                {/* Undo/Redo Buttons */}
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                    className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition text-xs flex items-center gap-1"
                    title="Undo (Ctrl+Z)"
                  >
                    <Icon name="Undo" className="w-3 h-3" />
                    <span className="hidden sm:inline">Undo</span>
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={redoStack.length === 0}
                    className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition text-xs flex items-center gap-1"
                    title="Redo (Ctrl+Y)"
                  >
                    <Icon name="Redo" className="w-3 h-3" />
                    <span className="hidden sm:inline">Redo</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                <button
                  onClick={handleGeneralSelect}
                  className="flex items-center gap-2 p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition"
                >
                  <img src="imgs/galaxy.png" alt="" className="w-8 h-8 galaxy-core" />
                  <div>
                    <span className="title-font text-amber-500">Galactic Core</span>
                    <p className="text-xs text-gray-400">Select All/None</p>
                  </div>
                </button>
                <button
                  onClick={() => setShowRandomModal(true)}
                  className="flex items-center gap-2 p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition"
                >
                  <Icon name="Zap" className="w-8 h-8 text-amber-500" />
                  <div>
                    <span className="title-font text-amber-500">Meteor Shower</span>
                    <p className="text-xs text-gray-400">Select Random</p>
                  </div>
                </button>
                </div>
              </div>
            </div>
            
            {/* Quick Presets */}
            <div className="border-t border-gray-700 pt-3">
              <p className="text-xs text-gray-400 mb-2 text-center">Quick Presets:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  onClick={() => handleQuickPreset('quickGame')}
                  className="flex flex-col items-center gap-1 p-2 rounded-md bg-purple-900/30 hover:bg-purple-800/50 transition border border-purple-700/30"
                >
                  <Icon name="Dices" className="w-5 h-5 text-purple-400" />
                  <span className="text-xs font-semibold text-purple-300">Quick Game</span>
                  <span className="text-[10px] text-gray-400">3 categories</span>
                </button>
                <button
                  onClick={() => handleQuickPreset('brainTeasers')}
                  className="flex flex-col items-center gap-1 p-2 rounded-md bg-blue-900/30 hover:bg-blue-800/50 transition border border-blue-700/30"
                >
                  <Icon name="Brain" className="w-5 h-5 text-blue-400" />
                  <span className="text-xs font-semibold text-blue-300">Brain Teasers</span>
                  <span className="text-[10px] text-gray-400">3 categories</span>
                </button>
                <button
                  onClick={() => handleQuickPreset('partyMix')}
                  className="flex flex-col items-center gap-1 p-2 rounded-md bg-pink-900/30 hover:bg-pink-800/50 transition border border-pink-700/30"
                >
                  <Icon name="PartyPopper" className="w-5 h-5 text-pink-400" />
                  <span className="text-xs font-semibold text-pink-300">Party Mix</span>
                  <span className="text-[10px] text-gray-400">4 categories</span>
                </button>
                <button
                  onClick={() => handleQuickPreset('cosmicJourney')}
                  className="flex flex-col items-center gap-1 p-2 rounded-md bg-green-900/30 hover:bg-green-800/50 transition border border-green-700/30"
                >
                  <Icon name="Rocket" className="w-5 h-5 text-green-400" />
                  <span className="text-xs font-semibold text-green-300">Cosmic Journey</span>
                  <span className="text-[10px] text-gray-400">4 categories</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex-shrink-0 px-2 mb-2">
            <div className="relative">
              <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search constellations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
                >
                  <Icon name="X" className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-xs text-gray-400 mt-1">
                Found {availableCategories.length} constellation{availableCategories.length !== 1 ? 's' : ''}
              </p>
            )}
            {!searchQuery && availableCategories.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                💡 Tip: Use arrow keys to navigate, Space to select, Enter to preview
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 flex-grow bg-gray-900 rounded-md pt-16 px-2 pb-2 overflow-y-auto content-start">
            {availableCategories.length > 0 ? (
              availableCategories.map((cat, idx) => {
                const layout = constellationLayouts[cat] || constellationLayouts["Default"]
                const isFocused = idx === focusedIndex
                return (
                  <div
                    key={cat}
                    data-constellation-id={cat}
                    ref={el => {
                      constellationRefs.current[cat] = el
                      // Scroll focused item into view
                      if (isFocused && el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                      }
                    }}
                    onClick={() => handleConstellationClick(cat)}
                    onContextMenu={(e) => handlePreviewCategory(cat, e)}
                    onTouchStart={(e) => handleLongPressStart(cat, e)}
                    onTouchEnd={handleLongPressEnd}
                    onTouchMove={handleLongPressEnd}
                    onMouseEnter={() => {
                      if (hoverTimer.current) clearTimeout(hoverTimer.current)
                      hoverTimer.current = setTimeout(() => {
                        setHoveredCategory(cat)
                      }, 2000) // 2000ms (2s) delay
                      setFocusedIndex(idx)
                    }}
                    onMouseLeave={() => {
                      if (hoverTimer.current) clearTimeout(hoverTimer.current)
                      setHoveredCategory(null)
                    }}
                    className={`constellation relative cursor-pointer aspect-square bg-gray-800/50 rounded-md p-1 w-[calc(33.33%-0.5rem)] md:w-[calc(25%-0.5rem)] lg:w-[calc(20%-0.5rem)] ${
                      activatedCategory === cat ? 'activated-genesis' : ''
                    } ${isFocused ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-gray-900' : ''}`}
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ overflow: 'visible' }}>
                      <text x={50} y={98} textAnchor="middle" fill="#FBBF24" className="title-font text-sm">
                        {layout.name}
                      </text>
                      <g>
                        {Array.from({ length: 20 }).map((_, i) => (
                          <circle
                            key={`dust-${i}`}
                            cx={50 + (Math.random() * 50 - 25)}
                            cy={50 + (Math.random() * 50 - 25)}
                            r={Math.random() * 1.5}
                            fill="#FBBF24"
                            className="stardust-particle"
                            style={{ animationDelay: `${Math.random() * 0.2}s` }}
                          />
                        ))}
                        {layout.lines.map(([p1, p2], i) => (
                          <line
                            key={i}
                            x1={layout.stars[p1].x}
                            y1={layout.stars[p1].y}
                            x2={layout.stars[p2].x}
                            y2={layout.stars[p2].y}
                            className="constellation-line"
                            style={{ animationDelay: `${0.35 + i * 0.05}s` }}
                          />
                        ))}
                        {layout.stars.map((star, i) => (
                          <circle
                            key={i}
                            cx={star.x}
                            cy={star.y}
                            r={3}
                            className="constellation-star"
                            style={{ animationDelay: `${0.15 + i * 0.1}s` }}
                          />
                        ))}
                      </g>
                    </svg>
                    {/* Portal-based Tooltip */}
                    <TooltipPortal anchorRef={{ current: constellationRefs.current[cat] }} visible={hoveredCategory === cat}>
                      <div className="bg-gray-900 border border-amber-500 rounded-md px-3 py-2 shadow-lg whitespace-nowrap">
                        <p className="text-amber-400 font-semibold text-sm">{cat}</p>
                        <p className="text-gray-300 text-xs">
                          {questionCategories[cat]?.length || 0} decrees
                        </p>
                        <p className="text-gray-500 text-[10px] mt-1">Right-click to preview</p>
                      </div>
                    </TooltipPortal>
                  </div>
                )
              })
            ) : (
              <p className="w-full text-center text-gray-400 p-8">
                {searchQuery 
                  ? `No constellations match "${searchQuery}"`
                  : 'All available decrees have been added to the manifest.'}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* RIGHT COLUMN: DECREE MANIFEST */}
      <div className="flex-shrink-0 lg:w-2/5 flex flex-col gap-4">
        <div className="panel rounded-md p-4 flex-grow flex flex-col min-h-0">
          <h3 className="title-font text-2xl text-amber-500 mb-2 flex-shrink-0 text-center">
            Decree Manifest
          </h3>
          
          {/* Progress Indicator */}
          <div className="flex-shrink-0 mb-3 px-2">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-400">
                {selectedCategories.length} / {minQuestions} minimum
              </span>
              {selectedCategories.length >= minQuestions && (
                <span className="text-green-400 flex items-center gap-1">
                  <Icon name="CheckCircle2" className="w-4 h-4" />
                  Ready
                </span>
              )}
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  selectedCategories.length >= minQuestions 
                    ? 'bg-green-500' 
                    : selectedCategories.length >= minQuestions - 1
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
                style={{ 
                  width: `${Math.min((selectedCategories.length / minQuestions) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
          
          <div className="space-y-2 overflow-y-auto flex-grow bg-gray-900/50 p-2 rounded-md">
            {selectedCategories.length > 0 ? (
              selectedCategories.map(cat => (
                <SelectedCategoryCard
                  key={cat}
                  catName={cat}
                  onRemove={handleConstellationClick}
                />
              ))
            ) : (
              <p className="text-gray-400 text-center p-4">
                Select decrees from the Celestial Atlas to add them here.
              </p>
            )}
          </div>
        </div>
        
        <div className="panel rounded-md p-4 flex-shrink-0">
          <h3 className="title-font text-xl text-amber-500 mb-3 text-center">Win Condition</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <HexButton
              onClick={() => setGameSettings({ winCondition: 'score', winValue: 5 })}
              isActive={gameSettings.winCondition === 'score'}
            >
              First to 5
            </HexButton>
            <HexButton
              onClick={() => setGameSettings({ winCondition: 'rounds', winValue: 3 })}
              isActive={gameSettings.winCondition === 'rounds'}
            >
              Best of 3
            </HexButton>
          </div>
        </div>
        
        <div className="flex gap-2">
          <HexButton
            onClick={() => setShowPresetModal('save')}
            disabled={selectedQuestions.size === 0}
          >
            Save Preset
          </HexButton>
          <HexButton onClick={() => setShowPresetModal('load')}>
            Load Preset
          </HexButton>
        </div>
        
        <HexButton onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}>
          Advanced Settings
        </HexButton>
        
        <div className="text-center flex-shrink-0 flex flex-col items-center space-y-2">
          <p className="text-sm text-gray-400">
            {selectedQuestions.size} of {allQuestions.length} decrees selected.
          </p>
          <HexButton
            onClick={handleConfirm}
            disabled={!canContinue}
            isActive={canContinue}
          >
            Confirm & Enter Lobby
          </HexButton>
          {!canContinue && (
            <p className="text-yellow-400 text-sm mt-2">
              Select at least {minQuestions} decrees.
            </p>
          )}
        </div>
      </div>

      {/* Modals and Overlays */}
      <div className="relative z-20">
        <div className={`advanced-panel ${showAdvancedSettings ? 'open' : ''}`}>
          {showAdvancedSettings && (
            <AdvancedSettingsPanel
              settings={advancedSettings}
              onSettingsChange={setAdvancedSettings}
            />
          )}
        </div>

        {showPresetModal && (
          <PresetModal
            mode={showPresetModal}
            onClose={() => setShowPresetModal(null)}
            presets={presets}
            onSave={handleSavePreset}
            onLoad={handleLoadPreset}
            onDelete={handleDeletePreset}
          />
        )}
        
        {showRandomModal && (
          <RandomSelectionModal
            onConfirm={handleRandomSelect}
            onCancel={() => setShowRandomModal(false)}
            maxCount={constellationCategories.length}
          />
        )}
        
        {meteorShowerTargets.length > 0 && (
          <MeteorShowerOverlay targets={meteorShowerTargets} />
        )}

        {/* Question Preview Modal */}
        {previewCategory && (
          <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 screen-enter"
            onClick={() => setPreviewCategory(null)}
          >
            <div 
              className="panel rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="title-font text-2xl text-amber-500 flex items-center gap-2">
                    <Icon name="Scroll" className="w-6 h-6" />
                    {previewCategory}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {questionCategories[previewCategory]?.length || 0} decrees in this constellation
                  </p>
                </div>
                <button
                  onClick={() => setPreviewCategory(null)}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md transition"
                >
                  <Icon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {questionCategories[previewCategory]?.map((q, idx) => (
                  <div key={idx} className="bg-gray-900/50 rounded-md p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <Icon name="Users" className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-blue-300 font-semibold mb-1">Entity Question:</p>
                        <p className="text-gray-200">{q.crew}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Icon name="Skull" className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-red-300 font-semibold mb-1">Anomaly Question:</p>
                        <p className="text-gray-200">{q.impostor}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSelectFromPreview}
                  className={`flex-1 button-primary px-6 py-3 rounded-md font-semibold flex items-center justify-center gap-2 ${
                    isCategorySelected(previewCategory) ? 'opacity-50' : ''
                  }`}
                >
                  <Icon name={isCategorySelected(previewCategory) ? "CheckCircle2" : "Plus"} className="w-5 h-5" />
                  {isCategorySelected(previewCategory) ? 'Remove Category' : 'Add Category'}
                </button>
                <button
                  onClick={() => setPreviewCategory(null)}
                  className="px-6 py-3 rounded-md bg-gray-700 hover:bg-gray-600 font-semibold transition"
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

export default CustomizeGameScreen
