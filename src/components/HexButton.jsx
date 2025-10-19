import React from 'react'

/**
 * HexButton component - Custom hexagonal button with SVG background
 * @param {ReactNode} children - Button content
 * @param {function} onClick - Click handler
 * @param {boolean} disabled - Whether button is disabled
 * @param {boolean} isActive - Whether button is in active state
 */
const HexButton = ({ children, onClick, disabled = false, isActive = false }) => {
  const className = `hex-button ${isActive ? 'active' : ''}`
  
  return (
    <button onClick={onClick} disabled={disabled} className={className}>
      <svg className="hex-bg" viewBox="0 0 104 32">
        <path d="M4 0 L100 0 L104 16 L100 32 L4 32 L0 16 Z" />
      </svg>
      <span>{children}</span>
    </button>
  )
}

export default HexButton
