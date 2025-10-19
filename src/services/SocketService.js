import { io } from 'socket.io-client'

class SocketService {
  constructor(serverUrl) {
    this.serverUrl = serverUrl
    this.socket = io(serverUrl, { transports: ['websocket'] })
    this.id = null
    this.currentGameState = {}
    this.events = {}

    this.socket.on('connect', () => {
      this.id = this.socket.id
    })

    this.socket.on('connected', (payload) => {
      this.id = payload?.id || this.socket.id
    })

    this.socket.on('updateGameState', (state) => {
      this.currentGameState = state
      this.events['updateGameState']?.(state)
    })

    this.socket.on('error', (msg) => {
      this.events['error']?.(msg)
    })

    this.socket.on('kicked', () => {
      this.events['kicked']?.()
    })
  }

  on(event, cb) {
    this.events[event] = cb
  }

  emit(event, data) {
    this.socket.emit(event, data)
  }

  disconnect() {
    this.socket.disconnect()
  }
}

export default SocketService
