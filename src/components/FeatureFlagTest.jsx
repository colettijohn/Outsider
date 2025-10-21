import React, { useState, useEffect } from 'react'
import { 
  isFeatureEnabled, 
  getEnabledFeatures,
  getFeatureStatus,
  enableFeature,
  disableFeature,
  FEATURES 
} from '../config/features'

/**
 * Feature Flag Testing Component
 * Use this to verify feature flags work correctly
 * Access at: /feature-test (add route in App.jsx)
 */
export const FeatureFlagTest = () => {
  const [features, setFeatures] = useState(FEATURES)
  const [testResults, setTestResults] = useState([])

  useEffect(() => {
    // Make features available in console for debugging
    window.features = {
      current: FEATURES,
      isEnabled: isFeatureEnabled,
      getEnabled: getEnabledFeatures,
      getStatus: getFeatureStatus,
      enable: (name) => {
        enableFeature(name)
        setFeatures({ ...FEATURES })
      },
      disable: (name) => {
        disableFeature(name)
        setFeatures({ ...FEATURES })
      }
    }

    console.log('🎯 Feature flags available in console as window.features')
    console.log('Try: window.features.enable("NEW_CUSTOMIZE_SCREEN")')
    
    return () => {
      delete window.features
    }
  }, [])

  const handleToggle = (featureName) => {
    if (FEATURES[featureName]) {
      disableFeature(featureName)
    } else {
      enableFeature(featureName)
    }
    setFeatures({ ...FEATURES })
    
    // Add test result
    const result = `${featureName}: ${FEATURES[featureName] ? 'ON' : 'OFF'}`
    setTestResults(prev => [...prev, result])
  }

  const runTests = () => {
    const results = []
    
    // Test 1: Master switch
    results.push('Test 1: Master switch controls sub-features')
    FEATURES.NEW_CUSTOMIZE_SCREEN = false
    const test1 = !isFeatureEnabled('ORACLE_AI') && !isFeatureEnabled('CARD_SYSTEM')
    results.push(`✅ Master OFF = Sub-features OFF: ${test1}`)
    
    // Test 2: Enable master
    FEATURES.NEW_CUSTOMIZE_SCREEN = true
    FEATURES.ORACLE_AI = true
    const test2 = isFeatureEnabled('ORACLE_AI')
    results.push(`✅ Master ON + Sub ON = Sub enabled: ${test2}`)
    
    // Test 3: Individual toggles
    FEATURES.CARD_SYSTEM = true
    const test3 = getEnabledFeatures().length > 0
    results.push(`✅ getEnabledFeatures() works: ${test3}`)
    
    setTestResults(results)
    setFeatures({ ...FEATURES })
  }

  const resetAll = () => {
    Object.keys(FEATURES).forEach(key => {
      FEATURES[key] = false
    })
    setFeatures({ ...FEATURES })
    setTestResults(['All features reset to OFF'])
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-purple-400 mb-2">
            🧪 Feature Flag Testing
          </h1>
          <p className="text-gray-400">
            Toggle features on/off to test the system. Check browser console for debugging tools.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={runTests}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            ▶ Run Tests
          </button>
          <button
            onClick={resetAll}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            🔄 Reset All
          </button>
          <button
            onClick={() => console.table(getFeatureStatus())}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            📊 Log Status
          </button>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="mb-8 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Test Results</h2>
            <div className="space-y-2">
              {testResults.map((result, i) => (
                <div key={i} className="text-gray-300 font-mono text-sm">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feature Toggles */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Feature Flags</h2>
          
          <div className="space-y-4">
            {Object.keys(FEATURES).map(featureName => {
              const isEnabled = features[featureName]
              const actuallyEnabled = isFeatureEnabled(featureName)
              const isMaster = featureName === 'NEW_CUSTOMIZE_SCREEN'
              
              return (
                <div
                  key={featureName}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${isEnabled 
                      ? 'bg-green-900/30 border-green-500' 
                      : 'bg-gray-700/30 border-gray-600'}
                    ${isMaster ? 'ring-2 ring-purple-500' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">
                          {featureName}
                        </h3>
                        {isMaster && (
                          <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                            MASTER SWITCH
                          </span>
                        )}
                      </div>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className={`
                          ${isEnabled ? 'text-green-400' : 'text-gray-500'}
                        `}>
                          Config: {isEnabled ? 'ON' : 'OFF'}
                        </span>
                        <span className={`
                          ${actuallyEnabled ? 'text-green-400' : 'text-gray-500'}
                        `}>
                          Actually: {actuallyEnabled ? 'ENABLED' : 'DISABLED'}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleToggle(featureName)}
                      className={`
                        px-8 py-3 rounded-lg font-medium transition-all
                        ${isEnabled
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'}
                      `}
                    >
                      {isEnabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 bg-purple-900/30 border-2 border-purple-500 rounded-lg p-6">
          <h2 className="text-xl font-bold text-purple-300 mb-4">
            📊 Current Status
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Master Switch</p>
              <p className={`text-2xl font-bold ${
                features.NEW_CUSTOMIZE_SCREEN ? 'text-green-400' : 'text-gray-500'
              }`}>
                {features.NEW_CUSTOMIZE_SCREEN ? '✅ ON' : '❌ OFF'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Enabled Features</p>
              <p className="text-2xl font-bold text-white">
                {getEnabledFeatures().length} / {Object.keys(FEATURES).length}
              </p>
            </div>
          </div>
          
          {getEnabledFeatures().length > 0 && (
            <div className="mt-4">
              <p className="text-gray-400 text-sm mb-2">Active Features:</p>
              <div className="flex flex-wrap gap-2">
                {getEnabledFeatures().map(name => (
                  <span
                    key={name}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-full"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Console Instructions */}
        <div className="mt-8 bg-gray-800 border-2 border-gray-600 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            💻 Console Commands
          </h2>
          <p className="text-gray-400 mb-4">
            Open browser console and try these commands:
          </p>
          <div className="space-y-2 font-mono text-sm">
            <div className="bg-gray-900 p-3 rounded">
              <span className="text-purple-400">window.features.getStatus()</span>
              <span className="text-gray-500"> // View all feature statuses</span>
            </div>
            <div className="bg-gray-900 p-3 rounded">
              <span className="text-purple-400">window.features.enable('ORACLE_AI')</span>
              <span className="text-gray-500"> // Enable a feature</span>
            </div>
            <div className="bg-gray-900 p-3 rounded">
              <span className="text-purple-400">window.features.disable('ORACLE_AI')</span>
              <span className="text-gray-500"> // Disable a feature</span>
            </div>
            <div className="bg-gray-900 p-3 rounded">
              <span className="text-purple-400">window.features.getEnabled()</span>
              <span className="text-gray-500"> // List enabled features</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeatureFlagTest
