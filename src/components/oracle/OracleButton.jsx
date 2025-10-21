import React from 'react'

/**
 * Get the triggerHaptic function from helpers
 * Provides haptic feedback on mobile devices
 */
const triggerHaptic = (style = 'medium') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30,
      success: [10, 50, 10],
      error: [20, 100, 20],
      warning: [15, 75, 15]
    }
    navigator.vibrate(patterns[style] || 20)
  }
}

/**
 * OracleButton - Mystical button component with particle effects and haptics
 * 
 * A touch-friendly button designed for the Oracle interface with:
 * - Haptic feedback on interaction
 * - Smooth animations and transitions
 * - Multiple visual variants
 * - Accessibility features
 * - Mobile-optimized touch targets (minimum 44px)
 * 
 * @example
 * <OracleButton 
 *   variant="primary" 
 *   size="large"
 *   icon="✨"
 *   onClick={handleClick}
 * >
 *   Begin Ritual
 * </OracleButton>
 */
export const OracleButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon = null,
  loading = false,
  className = '',
  ariaLabel,
  ...props
}) => {
  const handleClick = (e) => {
    if (disabled || loading) return
    triggerHaptic('medium')
    onClick?.(e)
  }

  const variantStyles = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/50 border-2 border-purple-400',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white shadow-lg shadow-gray-700/30 border-2 border-gray-500',
    ghost: 'bg-transparent hover:bg-white/10 text-purple-300 border-2 border-purple-500/50 hover:border-purple-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 border-2 border-red-400',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30 border-2 border-green-400',
    cosmic: 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white shadow-xl shadow-purple-500/50 border-2 border-purple-300 animate-gradient'
  }

  const sizeStyles = {
    small: 'px-4 py-2 text-sm min-h-[44px] min-w-[80px]',
    medium: 'px-6 py-3 text-base min-h-[48px] min-w-[100px]',
    large: 'px-8 py-4 text-lg min-h-[56px] min-w-[120px]',
    xl: 'px-10 py-5 text-xl min-h-[64px] min-w-[140px]'
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel || (typeof children === 'string' ? children : 'Oracle button')}
      aria-busy={loading}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        rounded-lg font-medium
        transition-all duration-200
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        flex items-center justify-center gap-2
        relative overflow-hidden
        focus:outline-none focus:ring-4 focus:ring-purple-500/50
        ${className}
      `}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
        </div>
      )}
      
      {/* Content */}
      <div className={`flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {icon && <span className="text-xl" aria-hidden="true">{icon}</span>}
        {children}
      </div>

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
    </button>
  )
}

export default OracleButton
