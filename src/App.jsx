import React, { useState, useEffect, useRef } from 'react'
import { useGame } from './contexts/GameContext'
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut'
import Icon from './components/Icon'
import GlitchyLogo from './components/GlitchyLogo'
import ConfirmationModal from './components/ConfirmationModal'
import AnimatedCosmicBackground from './components/AnimatedCosmicBackground'
import CosmicScribblerCanvas from './components/CosmicScribblerCanvas'
import AdminPanelModal from './components/AdminPanelModal'
import HowToPlayModal from './components/HowToPlayModal'
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal'
import ErrorBoundary from './components/ErrorBoundary'
import HomeScreen from './components/HomeScreen'
import CustomizeGameScreen from './components/CustomizeGameScreen'
import LobbyScreen from './components/LobbyScreen'
import GameScreen from './components/GameScreen'
import DebateScreen from './components/DebateScreen'
import VotingScreen from './components/VotingScreen'
import ScoreboardScreen from './components/ScoreboardScreen'
import GameOverScreen from './components/GameOverScreen'
import FeatureFlagTest from './components/FeatureFlagTest'
import QuestionCardsTest from './components/QuestionCardsTest'
import OracleComponentsTest from './components/OracleComponentsTest'
import OracleAITest from './components/OracleAITest'

function App() {
  const { 
    gameState, 
    showHomeConfirm, 
    setShowHomeConfirm, 
    resetToHome, 
    showRules, 
    setShowRules, 
    showAdminLogin, 
    setShowAdminLogin, 
    handleAdminNavigate, 
    setForcedRole, 
    forcedRole, 
    handleAddBot, 
    handleKickPlayer, 
    me, 
    kickConfirmationTarget, 
    setKickConfirmationTarget, 
    handleReadyForVote 
  } = useGame()

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showScribbler, setShowScribbler] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const konamiCode = 'COSMIC'
  const [isKonamiArmed, setIsKonamiArmed] = useState(false)
  const konamiProgress = useRef('')

  // Keyboard shortcuts
  useKeyboardShortcut('?', () => setShowKeyboardShortcuts(true))
  useKeyboardShortcut('r', () => setShowRules(true))
  useKeyboardShortcut('Escape', () => {
    if (showKeyboardShortcuts) setShowKeyboardShortcuts(false)
    else if (showRules) setShowRules(false)
    else if (showAdminLogin) setShowAdminLogin(false)
    else if (showHomeConfirm) setShowHomeConfirm(false)
  })

  const triggerConsoleTakeover = () => {
    const asciiLogo = `
██╗   ██╗██████╗ ██╗   ██╗████████╗███████╗██╗██████╗ ███████╗
██║   ██║██╔══██╗██║   ██║╚══██╔══╝██╔════╝██║██╔══██╗██╔════╝
██║   ██║██████╔╝██║   ██║   ██║   █████╗  ██║██║  ██║█████╗  
██║   ██║██╔══██╗██║   ██║   ██║   ██╔══╝  ██║██║  ██║██╔══╝  
╚██████╔╝██║  ██║╚██████╔╝   ██║   ███████╗██║██████╔╝███████╗
 ╚═════╝ ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚══════╝╚═╝╚═════╝ ╚══════╝
`
    const styles = {
      'logo': 'font-family: monospace; color: #F59E0B;',
      'header': 'font-size: 1.2em; color: #A21CAF; font-weight: bold;',
      'text': 'color: #E5E7EB;',
      'stat': 'color: #34D399;'
    }
    console.log(`%c${asciiLogo}`, styles.logo)
    console.log('%c> ACCESSING COSMIC COUNCIL MAINFRAME...', styles.header)
    console.log('%c> Welcome, Outsider.', styles.text)
    console.log('%c> System Check:', styles.text)
    console.log('%c    > Bot Deception Probability: 78% (They\'re getting smarter).', styles.stat)
    console.log('%c    > Current Anomaly: [REDACTED_FOR_SESSION_INTEGRITY]', styles.stat)
    console.log('%c> END_OF_TRANSMISSION', styles.header)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      konamiProgress.current += e.key.toUpperCase()
      if (!konamiCode.startsWith(konamiProgress.current)) {
        konamiProgress.current = '' // Reset if wrong key
      }
      if (konamiProgress.current === konamiCode) {
        console.log('Konami code entered. Click logo to activate.')
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleTriggerKonami = () => {
    if (konamiProgress.current === konamiCode) {
      triggerConsoleTakeover()
      konamiProgress.current = '' // Reset after activation
    }
  }
  
  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientWidth, clientHeight } = document.documentElement
      if (clientWidth > 0 && clientHeight > 0) {
        const x = (event.clientX / clientWidth) - 0.5
        const y = (event.clientY / clientHeight) - 0.5
        setMousePosition({ x, y })
      }
    }

    const handleDeviceOrientation = (event) => {
      if (event.gamma === null || event.beta === null) return

      // Normalize gamma (left-right tilt) to our -0.5 to 0.5 range
      // Cap the effective tilt angle at 60 degrees for comfortable use
      const x = Math.max(-0.5, Math.min(0.5, event.gamma / 120))

      // Normalize beta (front-back tilt)
      const y = Math.max(-0.5, Math.min(0.5, event.beta / 120))

      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    // Add device orientation listener for mobile devices
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation)
      }
    }
  }, [])
  
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons()
    }
  }, [gameState.screen, showRules, showAdminLogin, showScribbler])
  
  const onTriggerScribbler = () => setShowScribbler(true)

  const screens = {
    home: <HomeScreen onTriggerScribbler={onTriggerScribbler} onTriggerKonami={handleTriggerKonami} isKonamiArmed={isKonamiArmed} />,
    customizeGame: <CustomizeGameScreen />,
    lobby: <LobbyScreen />,
    game: <GameScreen />,
    debate: <DebateScreen />,
    voting: <VotingScreen />,
    scoreboard: <ScoreboardScreen />,
    gameOver: <GameOverScreen />,
    // Test pages for development
    featureTest: <FeatureFlagTest />,
    questionCardsTest: <QuestionCardsTest />,
    oracleComponentsTest: <OracleComponentsTest />,
    oracleAITest: <OracleAITest />,
  }

  return (
    <ErrorBoundary onReset={resetToHome}>
      <div className="app-container">
        {/* Skip to content link for accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        <AnimatedCosmicBackground mousePosition={mousePosition} />
      
      <div className={`grid-container transition-opacity duration-500 ${showScribbler ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <header role="banner">
          {gameState.screen !== 'home' && (
            <div className="flex flex-col md:flex-row md:relative md:justify-center items-center py-4 max-w-md mx-auto gap-2 md:gap-0 px-4 md:px-0">
              {!showAdminLogin && (
                <div className="md:absolute md:left-0 w-full md:w-auto flex justify-center md:justify-start">
                  <button
                    onClick={() => setShowHomeConfirm(true)}
                    className="hex-button"
                    title="Return to Mainframe"
                    aria-label="Return to home screen"
                    style={{ padding: '0.5rem 1rem 0.5rem 1.5rem' }}
                  >
                    <svg className="hex-bg" viewBox="0 0 120 32" aria-hidden="true">
                      <path d="M20 0 L116 0 L120 16 L116 32 L20 32 L0 16 Z" />
                    </svg>
                    <span className="flex items-center gap-2">
                      <Icon name="Undo2" className="w-4 h-4" aria-hidden="true" />
                      Home
                    </span>
                  </button>
                </div>
              )}
              <GlitchyLogo 
                size="text-4xl"
                onTriggerScribbler={onTriggerScribbler}
                onTriggerKonami={handleTriggerKonami}
                isKonamiArmed={isKonamiArmed}
              />
            </div>
          )}
        </header>

        <main 
          id="main-content"
          key={gameState.screen} 
          className="screen-enter"
          role="main"
          aria-label={`${gameState.screen} screen`}
        >
          {screens[gameState.screen] || (
            <div className="text-center p-8" role="status">Loading...</div>
          )}
        </main>

        <footer role="contentinfo">
          <p className="text-center text-gray-500 text-sm py-4 flex items-center justify-center gap-3">
            <span>© 2025 Outsider: Cosmic Council. Created by John Coletti. All rights reserved.</span>
            <span className="hidden md:inline text-gray-600">•</span>
            <button
              onClick={() => setShowKeyboardShortcuts(true)}
              className="hidden md:flex items-center gap-1.5 text-gray-500 hover:text-amber-400 transition-colors"
            >
              <Icon name="Keyboard" className="w-3.5 h-3.5" />
              <span>Press <kbd className="kbd text-xs">?</kbd> for shortcuts</span>
            </button>
          </p>
        </footer>
      </div>

      {showScribbler && <CosmicScribblerCanvas onClose={() => setShowScribbler(false)} />}

      {showKeyboardShortcuts && (
        <KeyboardShortcutsModal
          isOpen={showKeyboardShortcuts}
          onClose={() => setShowKeyboardShortcuts(false)}
        />
      )}

      {showAdminLogin && (
        <AdminPanelModal
          onClose={() => setShowAdminLogin(false)}
          onNavigate={handleAdminNavigate}
          gameState={gameState}
          setForcedRole={setForcedRole}
          forcedRole={forcedRole}
          onAddBot={handleAddBot}
          setKickConfirmationTarget={setKickConfirmationTarget}
          me={me}
        />
      )}

      {showHomeConfirm && (
        <ConfirmationModal
          message="Are you sure you want to return to the home screen? All game progress will be lost."
          onConfirm={resetToHome}
          onCancel={() => setShowHomeConfirm(false)}
        />
      )}

      {kickConfirmationTarget && (
        <ConfirmationModal
          message={`Are you sure you want to remove ${kickConfirmationTarget.nickname} from the session?`}
          onConfirm={() => {
            handleKickPlayer(kickConfirmationTarget.id)
            setKickConfirmationTarget(null)
          }}
          onCancel={() => setKickConfirmationTarget(null)}
        />
      )}
      
      {showRules && <HowToPlayModal onClose={() => setShowRules(false)} />}
      </div>
    </ErrorBoundary>
  )
}

export default App
