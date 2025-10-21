import React from 'react'
import Icon from './Icon'

/**
 * ErrorBoundary - Catches React errors and displays fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.state = { hasError: true, error, errorInfo }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    // Try to reset to home screen
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="panel p-8 rounded-lg max-w-2xl w-full text-center">
            <Icon name="AlertTriangle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="title-font text-3xl text-red-500 mb-4">
              CRITICAL SYSTEM ANOMALY DETECTED
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              The Cosmic Council has encountered an unexpected disruption.
            </p>
            
            {this.state.error && (
              <div className="bg-gray-900/50 p-4 rounded-md mb-6 text-left">
                <p className="text-sm text-red-400 mb-2 font-mono">
                  Error: {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="text-xs text-gray-400 font-mono">
                    <summary className="cursor-pointer hover:text-gray-300">
                      Stack Trace
                    </summary>
                    <pre className="mt-2 overflow-auto max-h-40">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}
            
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={this.handleReset}
                className="button-primary px-6 py-3 rounded-md"
              >
                Reset to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="button-secondary px-6 py-3 rounded-md"
              >
                Reload Application
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-6">
              If this issue persists, please report it to the Council administrators.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
