import React from 'react'

/**
 * ConfirmationModal component - Simple yes/no confirmation dialog
 * @param {string} message - Confirmation message to display
 * @param {function} onConfirm - Callback when user confirms
 * @param {function} onCancel - Callback when user cancels
 */
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="panel p-6 rounded-lg shadow-xl max-w-sm w-full">
        <p className="text-lg text-gray-200 mb-6 text-center">{message}</p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={onCancel} 
            className="w-full px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-md font-semibold transition-transform active:scale-95"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="w-full px-6 py-2 bg-red-600 hover:bg-red-500 rounded-md font-semibold transition-transform active:scale-95"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
