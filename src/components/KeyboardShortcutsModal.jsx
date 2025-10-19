import React, { useEffect, useRef } from 'react'
import Icon from './Icon'

/**
 * KeyboardShortcutsModal component - Displays available keyboard shortcuts
 * @param {boolean} isOpen - Whether modal is visible
 * @param {function} onClose - Close handler
 */
const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)

  // Focus management
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [isOpen])

  // Trap focus within modal
  useEffect(() => {
    if (!isOpen) return

    const handleTab = (e) => {
      if (e.key !== 'Tab' || !modalRef.current) return

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [isOpen])

  if (!isOpen) return null

  const shortcuts = [
    {
      category: 'General',
      items: [
        { key: '?', description: 'Show keyboard shortcuts', icon: 'HelpCircle' },
        { key: 'R', description: 'Open rules / How to play', icon: 'BookOpen' },
        { key: 'ESC', description: 'Close modals', icon: 'X' },
        { key: 'CTRL+K', description: 'Focus search/input', icon: 'Search' },
      ]
    },
    {
      category: 'Navigation',
      items: [
        { key: 'Tab', description: 'Navigate between elements', icon: 'ArrowRight' },
        { key: 'Enter', description: 'Submit forms / Confirm actions', icon: 'Check' },
        { key: 'Space', description: 'Select / Toggle', icon: 'ToggleRight' },
      ]
    },
    {
      category: 'Lobby',
      items: [
        { key: 'C', description: 'Copy room code', icon: 'Copy' },
        { key: 'S', description: 'Start game (host only)', icon: 'Rocket' },
        { key: 'B', description: 'Add bot (host only)', icon: 'Bot' },
      ]
    },
    {
      category: 'Game',
      items: [
        { key: 'CTRL+Enter', description: 'Submit answer quickly', icon: 'Send' },
        { key: '1-9', description: 'Vote for player by number', icon: 'Hash' },
        { key: 'N', description: 'Next round (host only)', icon: 'SkipForward' },
      ]
    }
  ]

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div 
        ref={modalRef}
        className="panel rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-amber-500/30 p-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <Icon name="Keyboard" className="w-6 h-6 text-amber-400" aria-hidden="true" />
            <h2 id="shortcuts-title" className="text-2xl font-bold title-font text-amber-400">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Close keyboard shortcuts dialog"
          >
            <Icon name="X" className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-gray-400 text-sm">
            Press <kbd className="kbd">?</kbd> at any time to view this guide. 
            Many shortcuts work context-aware based on the current screen.
          </p>

          {shortcuts.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2">
                <Icon name="ChevronRight" className="w-4 h-4" />
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((item, itemIdx) => (
                  <div 
                    key={itemIdx}
                    className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon name={item.icon} className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{item.description}</span>
                    </div>
                    <kbd className="kbd">{item.key}</kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Tips */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-6">
            <div className="flex items-start gap-3">
              <Icon name="Lightbulb" className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-400 mb-1">Pro Tips</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Most shortcuts are case-insensitive</li>
                  <li>• Shortcuts won't work while typing in input fields</li>
                  <li>• Some shortcuts require host privileges in lobby</li>
                  <li>• Use Tab + Enter for keyboard-only navigation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-4 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-md font-semibold transition-colors flex items-center gap-2"
          >
            Got it!
            <Icon name="Check" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default KeyboardShortcutsModal
