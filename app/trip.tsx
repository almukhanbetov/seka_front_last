import { useEffect, useRef } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'
import { getDistance } from 'geolib'
import { useRouter } from 'expo-router'

import { useAppStore } from '../lib/store'
import { connectWebSocket } from '../lib/ws'
import { endTrip } from '../lib/api'
import useLocationTracker from '../lib/hooks/useLocationTracker'
import useAutoCenterOnLocation from '../lib/hooks/useAutoCenterOnLocation'

export default function TripScreen() {
  const router = useRouter()
  const mapRef = useRef<MapView>(null)

  // 🧠 State из Zustand
  const tripId = useAppStore((s) => s.tripId)
  const setTripId = useAppStore((s) => s.setTripId)
  const route = useAppStore((s) => s.route)
  const location = useAppStore((s) => s.location)
  const startTime = useAppStore((s) => s.startTime)
  const setStartTime = useAppStore((s) => s.setStartTime)

  // 🚀 GPS и WebSocket
  useLocationTracker()
  useAutoCenterOnLocation(mapRef)

  // Установим стартовое время
  useEffect(() => {
    connectWebSocket()
    if (!startTime) {
      setStartTime(Date.now())
    }
  }, [])

  // 📍 Завершение поездки
  const handleEndTrip = async () => {
    if (!tripId || !startTime) return

    const duration = Math.floor((Date.now() - startTime) / 1000)
    const distance = calculateDistance()

    await endTrip(tripId, duration, distance)

    // Сброс состояния
    setTripId(null)
    setStartTime(null)
    router.replace('/')
  }

  // 📏 Расчёт пройденного расстояния
  const calculateDistance = (): number => {
    let total = 0
    for (let i = 1; i < route.length; i++) {
      const prev = route[i - 1]
      const curr = route[i]
      total += getDistance(
        { latitude: prev.lat, longitude: prev.lng },
        { latitude: curr.lat, longitude: curr.lng }
      )
    }
    return total
  }

  // ⏱ Расчёт времени
  const getDuration = (): string => {
    if (!startTime) return '0:00'
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    const minutes = Math.floor(elapsed / 60)
    const seconds = elapsed % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🚕 Поездка #{tripId ?? '...'}</Text>

      <View style={styles.analytics}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>⏱ Время</Text>
          <Text style={styles.statValue}>{getDuration()}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>📏 Расстояние</Text>
          <Text style={styles.statValue}>{(calculateDistance() / 1000).toFixed(2)} км</Text>
        </View>
      </View>

      <MapView ref={mapRef} provider="google" style={styles.map} showsUserLocation>
        {location && (
          <Marker
            coordinate={{ latitude: location.lat, longitude: location.lng }}
            title="Вы"
            pinColor="#FFD900"
          />
        )}

        {route.length > 1 && (
          <Polyline
            coordinates={route.map((p) => ({
              latitude: p.lat,
              longitude: p.lng,
            }))}
            strokeColor="#FFD900"
            strokeWidth={4}
          />
        )}
      </MapView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.endBtn} onPress={handleEndTrip}>
          <Text style={styles.endText}>Завершить поездку</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  analytics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 14,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  map: {
    flex: 1,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  endBtn: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  endText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

