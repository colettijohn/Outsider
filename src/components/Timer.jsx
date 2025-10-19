import React, { useState, useEffect } from 'react'

/**
 * Timer component - Animated countdown timer with circular progress
 * @param {number} initialTime - Starting time in seconds
 * @param {function} onTimeOut - Callback when timer reaches 0
 */
const Timer = ({ initialTime, onTimeOut }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const strokeDasharray = 2 * Math.PI * 18

  // This useEffect hook sets up a robust, one-time timer that is immune to re-renders.
  useEffect(() => {
    // If the timer has already hit zero, do nothing.
    if (timeLeft <= 0) return

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => {
        // Using a functional update ensures we have the latest state.
        const newTime = prevTime - 1
        if (newTime < 0) {
          // This check prevents the onTimeOut from firing multiple times
          // if the component somehow re-renders after time is up.
          clearInterval(intervalId)
          return 0
        }
        if (newTime === 0) {
          onTimeOut()
        }
        return newTime
      })
    }, 1000)

    // Cleanup function to clear the interval when the component unmounts.
    return () => clearInterval(intervalId)
  }, [onTimeOut]) // We only need onTimeOut here as initialTime is only used once.

  const percentage = (timeLeft / initialTime)
  const strokeDashoffset = strokeDasharray * (1 - percentage)
  const colorClass = percentage < 0.25 ? 'text-red-500' : (percentage < 0.5 ? 'text-yellow-500' : 'text-amber-500')

  return (
    <div className={`relative w-12 h-12 ${colorClass}`}>
      <svg className="w-full h-full" viewBox="0 0 40 40">
        <circle 
          className="text-gray-700" 
          stroke="currentColor" 
          strokeWidth="4" 
          fill="transparent" 
          r="18" 
          cx="20" 
          cy="20" 
        />
        <circle
          className="transform -rotate-90 origin-center transition-all duration-1000 linear"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          r="18"
          cx="20"
          cy="20"
        />
      </svg>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg">
        {timeLeft}
      </span>
    </div>
  )
}

export default Timer
