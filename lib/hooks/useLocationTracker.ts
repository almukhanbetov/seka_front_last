import { useEffect } from 'react'
import * as Location from 'expo-location'
import { useAppStore } from '../store'
import { sendCoordsToServer } from '../ws'

export default function useLocationTracker() {
  useEffect(() => {
    let subscriber: Location.LocationSubscription | null = null

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.warn('❌ Нет доступа к геолокации')
        return
      }

      subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          const { latitude, longitude } = location.coords

          // ✅ Обновляем состояние
          const store = useAppStore.getState()
          store.setLocation(latitude, longitude)
          store.addRoutePoint(latitude, longitude)

          // ✅ Отправляем на сервер
          sendCoordsToServer(latitude, longitude)
        }
      )
    }

    startTracking()

    return () => {
      subscriber?.remove()
    }
  }, [])
}
