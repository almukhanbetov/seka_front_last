import { useEffect, useState } from 'react'
import * as Location from 'expo-location'
import { Alert } from 'react-native'
import type { Region } from 'react-native-maps'

export default function useInitialRegion() {
  const [region, setRegion] = useState<Region | null>(null)

  useEffect(() => {
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('❌ Нет доступа к геопозиции')
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      })
    }

    fetchLocation()
  }, [])

  return region
}
