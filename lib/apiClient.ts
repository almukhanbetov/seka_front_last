import { Platform } from 'react-native'

const LOCAL_IP = '192.168.0.105'
const PROD_URL = 'https://steamtg.com'
const PORT = 8383

const BASE_URL =
  Platform.OS === 'web'
    ? `http://${LOCAL_IP}:${PORT}`
    : `${__DEV__ ? `http://${LOCAL_IP}:${PORT}` : `${PROD_URL}`}`

// Основной метод для запросов
async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: any
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(body && { body: JSON.stringify(body) }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Ошибка сети')
  }

  return await res.json()
}

// Экспортируемый api-клиент
export const api = {
  base: BASE_URL,
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: any) => request<T>('POST', path, body),
  put: <T>(path: string, body?: any) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
}
