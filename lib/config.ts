import { Platform } from 'react-native'

const PROD_URL = 'https://api.steamtg.com'
const LOCAL_IP = '192.168.0.105' // Только для локальной разработки
const PORT = 8383

export const getBaseUrl = () => {
  console.log('🔍 __DEV__:', __DEV__) // ✅ ДОБАВЬ СЮДА
  if (__DEV__) {
    if (Platform.OS === 'web') return `http://localhost:${PORT}`
    return `http://${LOCAL_IP}:${PORT}`
  }

  const baseUrl = PROD_URL
  console.log('📦 Base URL:', baseUrl) // ✅ безопасно
  return baseUrl
}
