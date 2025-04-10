import { Platform } from 'react-native'
import { getBaseUrl } from './lib/config'

export default function runDiagnostics() {
  console.log('🚀 Диагностика приложения')
  console.log('🔍 __DEV__:', __DEV__)
  console.log('💻 Платформа:', Platform.OS)
  console.log('🌐 Базовый URL:', getBaseUrl())

  // Пробуем обратиться к API
  fetch(`${getBaseUrl()}/ping`)
    .then((res) => {
      if (res.ok) {
        console.log('✅ Сервер отвечает /ping')
      } else {
        console.log('⚠️ Сервер ответил, но не OK:', res.status)
      }
    })
    .catch((err) => {
      console.log('❌ Ошибка подключения к серверу:', err.message)
    })
}
