import { useEffect } from 'react'
import MapView from 'react-native-maps'
import { useAppStore } from '../store'

export default function useAutoCenterOnLocation(mapRef: React.RefObject<MapView>) {
  const location = useAppStore((s) => s.location)

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        800
      )
    }
  }, [location])
}
