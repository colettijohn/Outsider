import React from 'react'
import ReactDOM from 'react-dom/client'
import { GameProvider } from './contexts/GameContext.jsx'
import App from './App.jsx'
import './styles/main.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>,
)
