// lib/ws.ts

import { useAppStore } from './store'

let socket: WebSocket | null = null

// ✅ Подключение и приём координат
export const connectWebSocket = () => {
  if (socket) return

  socket = new WebSocket('ws://62.72.23.250:8383/ws')

  socket.onopen = () => {
    console.log('✅ WebSocket подключён')
  }

  socket.onmessage = (message) => {
    try {
      const data = JSON.parse(message.data)
      const { latitude, longitude } = data

      if (latitude && longitude) {
        useAppStore.getState().setLocation(latitude, longitude)
        useAppStore.getState().addRoutePoint(latitude, longitude)
      }
    } catch (err) {
      console.error('❌ Ошибка в сообщении WebSocket:', err)
    }
  }

  socket.onerror = (err) => {
    console.error('❌ WebSocket ошибка:', err)
  }

  socket.onclose = () => {
    console.log('🔌 WebSocket отключён')
    socket = null
  }
}

// 🔼 Отправка координат на сервер
export const sendCoordsToServer = (lat: number, lng: number) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn('⚠️ WebSocket не подключён')
    return
  }

  const payload = JSON.stringify({ latitude: lat, longitude: lng })
  socket.send(payload)
  console.log('📤 Отправлены координаты:', payload)
}
