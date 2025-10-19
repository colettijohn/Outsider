import React, { useState } from 'react'

/**
 * RandomSelectionModal component - Modal to randomly select decree categories
 * @param {function} onConfirm - Confirm callback with count parameter
 * @param {function} onCancel - Cancel callback
 * @param {number} maxCount - Maximum number of categories that can be selected
 */
const RandomSelectionModal = ({ onConfirm, onCancel, maxCount }) => {
  const [count, setCount] = useState(1)

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 screen-enter">
      <div className="panel p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h3 className="text-2xl text-center text-amber-500 title-font mb-2">
          Summon the Meteors
        </h3>
        <p className="text-gray-400 text-center mb-6">
          How many constellations should be struck by chance?
        </p>
        
        <div className="flex items-center justify-center gap-4 my-4">
          <button
            onClick={() => setCount(c => Math.max(1, c - 1))}
            disabled={count <= 1}
            className="p-2 w-12 h-12 flex items-center justify-center bg-gray-700 rounded-full font-bold text-2xl disabled:opacity-50 transition-transform active:scale-95"
          >
            -
          </button>
          <span className="text-5xl font-bold w-20 text-center title-font">
            {count}
          </span>
          <button
            onClick={() => setCount(c => Math.min(maxCount, c + 1))}
            disabled={count >= maxCount}
            className="p-2 w-12 h-12 flex items-center justify-center bg-gray-700 rounded-full font-bold text-2xl disabled:opacity-50 transition-transform active:scale-95"
          >
            +
          </button>
        </div>
        
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onCancel}
            className="w-full px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-md font-semibold transition-transform active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(count)}
            className="w-full px-6 py-2 button-primary rounded-md font-semibold"
          >
            Summon
          </button>
        </div>
      </div>
    </div>
  )
}

export default RandomSelectionModal
