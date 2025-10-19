import React from 'react'

/**
 * BackgroundConstellation component - Animated constellation shapes for background
 * @param {string} className - Additional CSS classes
 * @param {object} animationStyle - CSS animation styles
 * @param {object} shape - Constellation shape data with stars and lines arrays
 * @param {string} id - Unique constellation identifier
 * @param {boolean} isHovered - Whether this constellation is being hovered
 * @param {function} setHoveredId - Callback to set hovered constellation
 */
const BackgroundConstellation = ({ 
  className, 
  animationStyle, 
  shape, 
  id, 
  isHovered, 
  setHoveredId 
}) => {
  if (!shape) return null // Safety check

  const { lines, stars } = shape

  return (
    <div
      className="absolute z-0 transition-all duration-300 ease-in-out"
      style={{ 
        ...animationStyle, 
        opacity: isHovered ? 1 : animationStyle.opacity, 
        transform: isHovered ? 'scale(1.1)' : 'scale(1)' 
      }}
      onMouseEnter={() => setHoveredId(id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-hover">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Lines connecting stars */}
        <g style={{ filter: isHovered ? 'url(#glow-hover)' : 'url(#glow)' }}>
          {lines.map(([p1, p2], i) => (
            <line
              key={`l-${i}`}
              x1={stars[p1].x} y1={stars[p1].y}
              x2={stars[p2].x} y2={stars[p2].y}
              stroke="#F59E0B"
              strokeWidth={1.5}
            />
          ))}
        </g>
        
        {/* Star points */}
        <g>
          {stars.map(({ x, y }, i) => (
            <circle
              key={`s-${i}`}
              cx={x} cy={y}
              r={2.5}
              fill="#FFFFFF"
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

export default BackgroundConstellation
