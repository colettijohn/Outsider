import React, { useState } from 'react'
import Icon from './Icon'

/**
 * AdvancedSettingsPanel component - Configure custom timers and decrees
 * @param {object} settings - Current settings { customTimers, customDecrees }
 * @param {function} onSettingsChange - Settings update callback
 */
const AdvancedSettingsPanel = ({ settings, onSettingsChange }) => {
  const { customTimers, customDecrees } = settings
  const [crewPrompt, setCrewPrompt] = useState('')
  const [impostorPrompt, setImpostorPrompt] = useState('')

  const handleTimerChange = (timer, value) => {
    onSettingsChange({ 
      ...settings, 
      customTimers: { ...customTimers, [timer]: Number(value) } 
    })
  }

  const handleAddDecree = () => {
    if (crewPrompt.trim() && impostorPrompt.trim()) {
      const newDecree = { 
        crew: crewPrompt, 
        impostor: impostorPrompt, 
        isCustom: true 
      }
      onSettingsChange({ 
        ...settings, 
        customDecrees: [...customDecrees, newDecree] 
      })
      setCrewPrompt('')
      setImpostorPrompt('')
    }
  }

  const handleRemoveDecree = (index) => {
    const newDecrees = [...customDecrees]
    newDecrees.splice(index, 1)
    onSettingsChange({ ...settings, customDecrees: newDecrees })
  }

  return (
    <div className="panel rounded-lg p-4 mt-4">
      <h3 className="title-font text-xl text-amber-500 mb-4 text-center">
        Advanced Game Modifiers
      </h3>
      
      {/* Timer Controls */}
      <div className="mb-4 border-b border-amber-500/20 pb-4">
        <h4 className="font-semibold text-lg mb-2 text-fuchsia-400">
          Session Timers
        </h4>
        <div className="space-y-2">
          <div>
            <label className="flex justify-between items-center">
              <span>Answer Time</span>
              <span className="font-bold text-amber-500">
                {customTimers.answer}s
              </span>
            </label>
            <input
              type="range"
              min={15}
              max={120}
              step={5}
              value={customTimers.answer}
              onChange={(e) => handleTimerChange('answer', e.target.value)}
              className="slider"
            />
          </div>
          <div>
            <label className="flex justify-between items-center">
              <span>Debate Time</span>
              <span className="font-bold text-amber-500">
                {customTimers.debate}s
              </span>
            </label>
            <input
              type="range"
              min={15}
              max={90}
              step={5}
              value={customTimers.debate}
              onChange={(e) => handleTimerChange('debate', e.target.value)}
              className="slider"
            />
          </div>
          <div>
            <label className="flex justify-between items-center">
              <span>Vote Time</span>
              <span className="font-bold text-amber-500">
                {customTimers.vote}s
              </span>
            </label>
            <input
              type="range"
              min={15}
              max={90}
              step={5}
              value={customTimers.vote}
              onChange={(e) => handleTimerChange('vote', e.target.value)}
              className="slider"
            />
          </div>
        </div>
      </div>

      {/* Custom Decrees */}
      <div className="mb-4">
        <h4 className="font-semibold text-lg mb-2 text-fuchsia-400">
          Custom Decrees
        </h4>
        <div className="space-y-3">
          <input
            type="text"
            value={crewPrompt}
            onChange={(e) => setCrewPrompt(e.target.value)}
            placeholder="Entity (Normal) Prompt..."
            className="w-full p-2 input-field text-sm"
          />
          <input
            type="text"
            value={impostorPrompt}
            onChange={(e) => setImpostorPrompt(e.target.value)}
            placeholder="Anomaly (Twist) Prompt..."
            className="w-full p-2 input-field text-sm"
          />
          <button
            onClick={handleAddDecree}
            disabled={!crewPrompt.trim() || !impostorPrompt.trim()}
            className="w-full p-2 bg-blue-800 hover:bg-blue-700 rounded-md transition disabled:bg-gray-600"
          >
            Add Custom Decree
          </button>
        </div>
        
        {customDecrees.length > 0 && (
          <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
            <h5 className="text-md font-semibold text-gray-300">
              Added Decrees:
            </h5>
            {customDecrees.map((decree, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 bg-gray-900/50 rounded-md"
              >
                <div className="truncate">
                  <p className="text-sm truncate">
                    <strong className="text-fuchsia-400">E: </strong>
                    {decree.crew}
                  </p>
                  <p className="text-sm truncate">
                    <strong className="text-red-400">A: </strong>
                    {decree.impostor}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveDecree(index)}
                  className="p-1 bg-red-800/50 hover:bg-red-700 rounded-full flex-shrink-0 ml-2"
                >
                  <Icon name="X" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdvancedSettingsPanel
