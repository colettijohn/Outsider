import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const TooltipPortal = ({ anchorRef, children, visible }) => {
  const [style, setStyle] = useState({})
  const tooltipRef = useRef(null)

  useEffect(() => {
    if (anchorRef.current && visible) {
      const rect = anchorRef.current.getBoundingClientRect()
      const tooltip = tooltipRef.current
      if (tooltip) {
        const tooltipRect = tooltip.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        // Always position above the anchor
        const top = rect.top - tooltipRect.height - 8
        let left = rect.left + rect.width / 2 - tooltipRect.width / 2
        // Clamp left/right to viewport
        left = Math.max(8, Math.min(left, viewportWidth - tooltipRect.width - 8))
        const clampedTop = Math.max(8, Math.min(top, viewportHeight - tooltipRect.height - 8))
        setStyle({
          position: 'fixed',
          top: clampedTop,
          left,
          zIndex: 99999,
          pointerEvents: 'none',
        })
      }
    }
  }, [anchorRef, visible, children])

  if (!visible) return null
  return createPortal(
    <div ref={tooltipRef} style={style}>
      {children}
    </div>,
    document.body
  )
}

export default TooltipPortal
