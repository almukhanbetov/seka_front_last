import { useEffect, useRef, useState } from 'react'
import React from 'react'
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'
import { useLocalSearchParams } from 'expo-router'
import { getTripRoute } from '../../lib/api'
import { TripRoutePoint } from '../../lib/types'
import { getDistance } from 'geolib'

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [route, setRoute] = useState<TripRoutePoint[]>([])
  const [loading, setLoading] = useState(true)
  const mapRef = useRef<MapView>(null)

  useEffect(() => {
    if (!id) return
    getTripRoute(Number(id))
      .then((points) => setRoute(points))
      .catch(() => alert('Ошибка загрузки маршрута'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (route.length > 0 && mapRef.current) {
      const first = route[0]
      mapRef.current.animateToRegion(
        {
          latitude: first.latitude,
          longitude: first.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      )
    }
  }, [route])

  const totalDistance = (): string => {
    let dist = 0
    for (let i = 1; i < route.length; i++) {
      const prev = route[i - 1]
      const curr = route[i]
      dist += getDistance(
        { latitude: prev.latitude, longitude: prev.longitude },
        { latitude: curr.latitude, longitude: curr.longitude }
      )
    }
    return (dist / 1000).toFixed(2) // км
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📍 Маршрут поездки #{id}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#22c55e" />
      ) : (
        <>
          <MapView ref={mapRef} style={styles.map}>
            {route.length > 0 && (
              <>
                <Marker
                  coordinate={{
                    latitude: route[0].latitude,
                    longitude: route[0].longitude,
                  }}
                  title="Старт"
                  pinColor="green"
                />
                <Marker
                  coordinate={{
                    latitude: route[route.length - 1].latitude,
                    longitude: route[route.length - 1].longitude,
                  }}
                  title="Финиш"
                  pinColor="red"
                />
                <Polyline
                  coordinates={route.map((p) => ({
                    latitude: p.latitude,
                    longitude: p.longitude,
                  }))}
                  strokeColor="#FFD900"
                  strokeWidth={4}
                />
              </>
            )}
          </MapView>

          <View style={styles.stats}>
            <Text style={styles.statText}>
              📏 Пройдено: {totalDistance()} км
            </Text>
            <Text style={styles.statText}>
              🗓️ Начало: {route[0]?.recorded_at?.split('T')[0] || '—'}
            </Text>
          </View>
        </>
      )}
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
      marginVertical: 12,
    },
    map: {
      flex: 1,
    },
    stats: {
      padding: 16,
      backgroundColor: '#f9fafb',
      borderTopWidth: 1,
      borderColor: '#eee',
    },
    statText: {
      fontSize: 16,
      color: '#111827',
      marginBottom: 4,
    },
  })
  

