import React, { useState, useEffect } from 'react'
import Icon from './Icon'
import { getGameStats, formatRelativeTime } from '../utils/helpers'

/**
 * StatsFooter component - Displays game statistics and version info
 * @param {string} className - Additional CSS classes
 */
const StatsFooter = ({ className = '' }) => {
  const [stats, setStats] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    setStats(getGameStats())
  }, [])

  if (!stats) return null

  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) 
    : 0

  const anomalyWinRate = stats.gamesAsAnomaly > 0
    ? Math.round((stats.anomalyWins / stats.gamesAsAnomaly) * 100)
    : 0

  return (
    <div className={`${className}`}>
      {/* Compact Stats Bar */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full flex items-center justify-between px-4 py-2 bg-gray-800/30 hover:bg-gray-800/50 backdrop-blur-sm border-t border-gray-700/50 transition-all text-xs text-gray-400 hover:text-gray-300"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Icon name="Gamepad2" className="w-3.5 h-3.5 text-amber-400" />
            <span>{stats.gamesPlayed} Games</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name="Trophy" className="w-3.5 h-3.5 text-yellow-400" />
            <span>{stats.gamesWon} Wins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name="Target" className="w-3.5 h-3.5 text-purple-400" />
            <span>{winRate}% Win Rate</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-500">v1.0.0</span>
          <Icon 
            name={showDetails ? "ChevronDown" : "ChevronUp"} 
            className="w-4 h-4 transition-transform" 
          />
        </div>
      </button>

      {/* Detailed Stats Panel */}
      {showDetails && (
        <div className="bg-gray-800/90 backdrop-blur-sm border-t border-gray-700/50 p-4 animate-slideIn">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-900/50 rounded-lg p-3">
              <Icon name="Gamepad2" className="w-5 h-5 mx-auto mb-1 text-amber-400" />
              <div className="text-2xl font-bold text-amber-400">{stats.gamesPlayed}</div>
              <div className="text-xs text-gray-400">Games Played</div>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-3">
              <Icon name="Trophy" className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
              <div className="text-2xl font-bold text-yellow-400">{stats.gamesWon}</div>
              <div className="text-xs text-gray-400">Victories</div>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-3">
              <Icon name="Zap" className="w-5 h-5 mx-auto mb-1 text-purple-400" />
              <div className="text-2xl font-bold text-purple-400">{stats.gamesAsAnomaly}</div>
              <div className="text-xs text-gray-400">As Anomaly</div>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-3">
              <Icon name="TrendingUp" className="w-5 h-5 mx-auto mb-1 text-green-400" />
              <div className="text-2xl font-bold text-green-400">{stats.totalRounds}</div>
              <div className="text-xs text-gray-400">Rounds Played</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
            <div className="bg-gray-900/50 rounded-lg p-2">
              <div className="text-gray-400">Win Rate (Overall)</div>
              <div className="text-lg font-bold text-amber-400">{winRate}%</div>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-2">
              <div className="text-gray-400">Win Rate (Anomaly)</div>
              <div className="text-lg font-bold text-purple-400">
                {stats.gamesAsAnomaly > 0 ? `${anomalyWinRate}%` : 'N/A'}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-700/50 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Icon name="Calendar" className="w-3 h-3" />
              <span>First played: {formatRelativeTime(stats.firstPlayed)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="Clock" className="w-3 h-3" />
              <span>Last played: {formatRelativeTime(stats.lastPlayed)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StatsFooter
