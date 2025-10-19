import React, { useState } from 'react'
import Icon from './Icon'
import HexButton from './HexButton'

/**
 * PresetModal component - Save/Load decree presets
 * @param {string} mode - 'save' or 'load'
 * @param {function} onClose - Close modal callback
 * @param {object} presets - Saved presets object
 * @param {function} onSave - Save preset callback
 * @param {function} onLoad - Load preset callback
 * @param {function} onDelete - Delete preset callback
 */
const PresetModal = ({ mode, onClose, presets, onSave, onLoad, onDelete }) => {
  const [presetName, setPresetName] = useState('')

  const handleSave = () => {
    if (presetName.trim()) {
      onSave(presetName.trim())
      setPresetName('')
    }
  }

  const presetList = Object.keys(presets)

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 screen-enter">
      <div className="panel p-6 rounded-lg shadow-xl max-w-sm w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white transition"
        >
          <Icon name="X" className="w-5 h-5" />
        </button>
        
        {mode === 'save' && (
          <div>
            <h3 className="text-2xl text-center text-amber-500 title-font mb-4">
              Save Decree Preset
            </h3>
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Enter preset name..."
              className="w-full p-3 text-center text-lg input-field mb-4"
              maxLength={20}
            />
            <button 
              onClick={handleSave}
              disabled={!presetName.trim()}
              className="w-full p-3 button-primary rounded-md"
            >
              Save
            </button>
          </div>
        )}

        {mode === 'load' && (
          <div>
            <h3 className="text-2xl text-center text-amber-500 title-font mb-4">
              Load Decree Preset
            </h3>
            {presetList.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {presetList.map(name => (
                  <div 
                    key={name}
                    className="flex items-center justify-between p-2 bg-gray-900/50 rounded-md"
                  >
                    <span className="font-semibold truncate">{name}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onLoad(name)}
                        className="p-2 bg-green-600 hover:bg-green-500 rounded-md"
                      >
                        <Icon name="Download" className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(name)}
                        className="p-2 bg-red-600 hover:bg-red-500 rounded-md"
                      >
                        <Icon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center">No presets saved.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PresetModal
