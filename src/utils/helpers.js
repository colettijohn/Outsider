// --- Helper Functions ---

/**
 * Get a text justification for why a player gained points
 */
export const getScoreJustification = (player, reveal, allVotes = []) => {
    const { anomalyId, anomalyWasVotedOut, scoreUpdates } = reveal
    const scoreGained = scoreUpdates[player.id] || 0

    if (scoreGained === 0) return "(No points this round)"

    if (player.role === 'The Anomaly') {
        if (!anomalyWasVotedOut) return "(Deception Bonus)"
    }

    if (player.role === 'Entity') {
        const myVote = allVotes.find(v => v.voterId === player.id)
        const votedForAnomaly = myVote?.votedPlayerId === anomalyId

        if (votedForAnomaly && anomalyWasVotedOut) return "(Correct Vote + Council Bonus)"
        if (votedForAnomaly) return "(Correct Vote)"
        if (anomalyWasVotedOut) return "(Council Bonus)"
    }

    return ""
}

/**
 * Fallback copy-to-clipboard using a temporary textarea
 */
export const fallbackCopy = (text, onSuccess, onError) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
        document.execCommand('copy')
        if (onSuccess) onSuccess()
    } catch (err) {
        console.error('Fallback copy failed:', err)
        if (onError) onError(err)
    }
    document.body.removeChild(textArea)
}

/**
 * Save a room code to recent rooms in localStorage
 * @param {string} roomCode - The room code to save
 * @param {string} nickname - The nickname used
 */
export const saveRecentRoom = (roomCode, nickname) => {
    try {
        const recent = getRecentRooms()
        const newEntry = {
            code: roomCode.toUpperCase(),
            nickname: nickname,
            timestamp: Date.now()
        }
        
        // Remove duplicate if exists
        const filtered = recent.filter(r => r.code !== roomCode.toUpperCase())
        
        // Add to front and limit to 5 most recent
        const updated = [newEntry, ...filtered].slice(0, 5)
        
        localStorage.setItem('outsider_recent_rooms', JSON.stringify(updated))
    } catch (err) {
        console.error('Failed to save recent room:', err)
    }
}

/**
 * Get recent rooms from localStorage
 * @returns {Array} Array of recent room objects
 */
export const getRecentRooms = () => {
    try {
        const stored = localStorage.getItem('outsider_recent_rooms')
        return stored ? JSON.parse(stored) : []
    } catch (err) {
        console.error('Failed to get recent rooms:', err)
        return []
    }
}

/**
 * Clear recent rooms from localStorage
 */
export const clearRecentRooms = () => {
    try {
        localStorage.removeItem('outsider_recent_rooms')
    } catch (err) {
        console.error('Failed to clear recent rooms:', err)
    }
}

/**
 * Generate a shareable lobby link with room code
 * @param {string} roomCode - The room code
 * @returns {string} Full URL with room code parameter
 */
export const generateLobbyLink = (roomCode) => {
    const baseUrl = window.location.origin + window.location.pathname
    return `${baseUrl}?join=${roomCode.toUpperCase()}`
}

/**
 * Get game statistics from localStorage
 * @returns {Object} Statistics object
 */
export const getGameStats = () => {
    try {
        const stored = localStorage.getItem('outsider_stats')
        return stored ? JSON.parse(stored) : {
            gamesPlayed: 0,
            gamesWon: 0,
            gamesAsAnomaly: 0,
            anomalyWins: 0,
            totalRounds: 0,
            firstPlayed: null,
            lastPlayed: null
        }
    } catch (err) {
        console.error('Failed to get game stats:', err)
        return {
            gamesPlayed: 0,
            gamesWon: 0,
            gamesAsAnomaly: 0,
            anomalyWins: 0,
            totalRounds: 0,
            firstPlayed: null,
            lastPlayed: null
        }
    }
}

/**
 * Update game statistics
 * @param {Object} updates - Stats to update
 */
export const updateGameStats = (updates) => {
    try {
        const current = getGameStats()
        const updated = { ...current, ...updates, lastPlayed: Date.now() }
        
        // Set firstPlayed if not set
        if (!updated.firstPlayed) {
            updated.firstPlayed = Date.now()
        }
        
        localStorage.setItem('outsider_stats', JSON.stringify(updated))
    } catch (err) {
        console.error('Failed to update game stats:', err)
    }
}

/**
 * Increment a stat counter
 * @param {string} statName - Name of the stat to increment
 */
export const incrementStat = (statName) => {
    try {
        const stats = getGameStats()
        stats[statName] = (stats[statName] || 0) + 1
        stats.lastPlayed = Date.now()
        localStorage.setItem('outsider_stats', JSON.stringify(stats))
    } catch (err) {
        console.error('Failed to increment stat:', err)
    }
}

/**
 * Format a timestamp to relative time
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted relative time
 */
export const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Never'
    
    const now = Date.now()
    const diff = now - timestamp
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    return 'Just now'
}
