import React from 'react'

/**
 * Icon component - Wrapper for Lucide icons
 * Converts camelCase icon names to kebab-case for Lucide
 */
const Icon = ({ name, className = '' }) => {
  const iconName = name.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
  return <i data-lucide={iconName} className={className} />
}

export default Icon
