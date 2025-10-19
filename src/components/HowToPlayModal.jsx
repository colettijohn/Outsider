import React, { useState, useEffect } from 'react'
import GlitchyArchiveText from './GlitchyArchiveText'

/**
 * HowToPlayModal component - Multi-step tutorial modal with animated transitions
 * @param {function} onClose - Close modal callback
 */
const HowToPlayModal = ({ onClose }) => {
  const [step, setStep] = useState(0)
  const [archiveState, setArchiveState] = useState('opening') // opening -> active -> closing
  const [transitionClass, setTransitionClass] = useState('data-slate-enter')
  
  useEffect(() => {
    const openTimer = setTimeout(() => {
      setArchiveState('active')
    }, 1800)
    return () => clearTimeout(openTimer)
  }, [])

  const handleClose = () => {
    setArchiveState('closing')
    setTimeout(onClose, 500)
  }
  
  const handleNav = (direction) => {
    const isNext = direction === 'next'
    const animationOutClass = isNext ? 'slide-out-left' : 'slide-out-right'
    const animationInClass = isNext ? 'slide-in-right' : 'slide-in-left'

    setTransitionClass(animationOutClass)

    setTimeout(() => {
      setStep(s => isNext ? Math.min(s + 1, tutorialSteps.length - 1) : Math.max(s - 1, 0))
      setTransitionClass(animationInClass)
    }, 300)
  }
  
  const tutorialSteps = [
    {
      title: 'The Cosmic Imbalance',
      content: (
        <div>
          <p className="mb-4">
            Among the beings of the Cosmic Council, a dissonant frequency has emerged—
            <strong className="text-red-400">
              <GlitchyArchiveText text={'"The Anomaly."'} />
            </strong>
            {' '}The loyal{' '}
            <strong className="text-fuchsia-400">
              <GlitchyArchiveText text="'Entities'" />
            </strong>
            {' '}must unite to identify this discordant signal.
          </p>
          <div className="p-3 bg-gray-900/50 rounded-md text-sm text-left">
            <strong className="text-amber-500">Gameplay Objective:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>
                <strong className="text-fuchsia-400">Entities</strong>: Find and vote out The Anomaly.
              </li>
              <li>
                <strong className="text-red-400">The Anomaly</strong>: Survive and deceive the Entities.
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'Know Your Nature',
      content: (
        <div className="space-y-4 text-left">
          <div>
            <p>
              <strong className="text-fuchsia-400">As an Entity: </strong>
              You are a pillar of cosmic order. Your purpose is clarity. Interpret the Council's decree with precision.
            </p>
            <p className="text-xs text-gray-400 mt-1 pl-4 border-l-2 border-fuchsia-500">
              <strong>Your Task: </strong>
              Your prompt is the "normal" one. Give a clear answer to help your fellow Entities. Figure out whose answer doesn't match.
            </p>
          </div>
          <div>
            <p>
              <strong className="text-red-400">As The Anomaly: </strong>
              You are chaos given a voice. Your decree is a warped reflection of the truth. Weave a web of subtle falsehoods.
            </p>
            <p className="text-xs text-gray-400 mt-1 pl-4 border-l-2 border-red-500">
              <strong>Your Task: </strong>
              Your prompt is slightly different. Give a vague answer that could fit with the others without giving yourself away.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'The Ritual of Consensus',
      content: (
        <div className="text-left">
          <p className="mb-3">
            Each round follows a sacred ritual where truths are tested and allegiances are questioned.
          </p>
          <ol className="list-decimal list-inside space-y-2 text-base">
            <li><strong>Receive Prompt: </strong>Everyone gets a secret prompt.</li>
            <li><strong>Submit Answer: </strong>Write an answer based on your prompt.</li>
            <li><strong>Debate: </strong>All answers are shown anonymously. Discuss who you suspect.</li>
            <li><strong>Vote: </strong>Everyone votes for one player.</li>
          </ol>
        </div>
      )
    },
    {
      title: 'Casting the Stasis Field',
      content: (
        <div>
          <p className="mb-4">
            When the debate concludes, cast your vote. This is your power to temporarily silence a voice you deem deceptive.
          </p>
          <div className="p-3 bg-gray-900/50 rounded-md text-sm">
            <strong className="text-amber-500">How It Works:</strong>
            <p className="mt-1">
              The player with the most votes is eliminated for the round, whether they were The Anomaly or not. In case of a tie, one of the tied players is chosen at random.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Shifting Cosmic Influence',
      content: (
        <div className="text-left">
          <p className="mb-3">
            Influence is the measure of your success. The winner is the first to reach the score goal or the player with the most influence after all rounds.
          </p>
          <ul className="space-y-2 text-base">
            <li className="p-2 bg-fuchsia-900/30 rounded-md">
              <strong className="text-fuchsia-400">Entities</strong> get +1 Point if The Anomaly is voted out.
            </li>
            <li className="p-2 bg-fuchsia-900/30 rounded-md">
              <strong className="text-fuchsia-400">Entities</strong> also get a +1 BONUS Point for personally voting for The Anomaly.
            </li>
            <li className="p-2 bg-red-900/30 rounded-md">
              <strong className="text-red-400">The Anomaly</strong> gets +2 Points if they are NOT voted out.
            </li>
          </ul>
        </div>
      )
    }
  ]
  
  const currentStep = tutorialSteps[step]
  const isFirstStep = step === 0
  const isLastStep = step === tutorialSteps.length - 1
  
  const archiveClass = archiveState === 'opening' ? 'archive-backdrop-enter' : (archiveState === 'closing' ? 'archive-backdrop-exit' : '')

  return (
    <div className={`fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${archiveClass}`}>
      {archiveState === 'opening' && (
        <p className="text-2xl title-font text-amber-500 archive-text-enter">
          Accessing the council's restricted data vault...
        </p>
      )}
      
      {archiveState !== 'opening' && (
        <div className="w-full h-full flex flex-col items-center justify-center relative data-slate-enter">
          {/* Close Button Rune */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </button>
        
          {/* Central Nexus Orb & Progress Indicator */}
          <div className="relative mb-8 flex items-center justify-center">
            {tutorialSteps.map((_, index) => {
              const angle = (index / tutorialSteps.length) * 2 * Math.PI - (Math.PI / 2)
              const radius = 60
              const x = radius * Math.cos(angle)
              const y = radius * Math.sin(angle)
              return (
                <div
                  key={index}
                  className={`absolute h-2 rounded-full transition-all duration-300 ${
                    index === step ? 'w-4 bg-amber-500 shadow-lg' : 'w-2 bg-gray-600'
                  }`}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                />
              )
            })}
            <div
              className="w-20 h-20 rounded-full bg-gray-900 border-2 border-amber-500 shadow-lg"
              style={{
                animation: 'nexus-pulse 4s infinite ease-in-out',
                background: 'radial-gradient(ellipse at center, #432201 0%, #110900 70%)'
              }}
            >
              <img src="imgs/how_to_play.png" alt="How to Play Icon" className="w-full h-full p-4" />
            </div>
          </div>
          
          {/* Data Slate Content */}
          <div className={`w-full max-w-lg text-center p-6 bg-black/20 rounded-lg border border-amber-500/30 ${transitionClass}`}>
            <div>
              <h2 className="text-3xl text-amber-500 title-font mb-4">{currentStep.title}</h2>
              <div className="text-gray-300 text-lg leading-relaxed min-h-[10rem]">
                {currentStep.content}
              </div>
            </div>
          </div>
          
          {/* Navigation Runes */}
          <div className="flex justify-between w-full max-w-2xl mt-8 px-4">
            <button
              onClick={() => handleNav('back')}
              disabled={isFirstStep}
              className="text-gray-400 hover:text-white transition-opacity disabled:opacity-0"
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
              </svg>
            </button>
            
            {isLastStep ? (
              <button
                onClick={handleClose}
                className="px-6 py-2 text-lg button-primary rounded-md font-semibold"
              >
                Enter the Council
              </button>
            ) : (
              <button
                onClick={() => handleNav('next')}
                className="text-gray-400 hover:text-white transition-opacity"
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default HowToPlayModal
