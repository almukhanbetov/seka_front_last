import { useEffect, useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { getBaseUrl } from '../../lib/config'

type TripSummary = {
  totalTrips: number
  totalDistance: number // в метрах
  totalDuration: number // в секундах
}

export default function AnalyticsScreen() {
  const [stats, setStats] = useState<TripSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${getBaseUrl()}/api/trips/summary`)
      .then((res) => res.json())
      .then((json) => setStats(json))
      .catch(() => alert('Ошибка загрузки аналитики'))
      .finally(() => setLoading(false))
  }, [])

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours} ч ${minutes} мин`
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📊 Аналитика поездок</Text>

      {loading || !stats ? (
        <ActivityIndicator size="large" color="#22c55e" />
      ) : (
        <View style={styles.content}>
          <View style={styles.statBox}>
            <Text style={styles.label}>Всего поездок</Text>
            <Text style={styles.value}>{stats.totalTrips}</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.label}>Общая дистанция</Text>
            <Text style={styles.value}>
              {(stats.totalDistance / 1000).toFixed(1)} км
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.label}>Общее время</Text>
            <Text style={styles.value}>
              {formatDuration(stats.totalDuration)}
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.label}>Средняя дистанция</Text>
            <Text style={styles.value}>
              {(stats.totalDistance / stats.totalTrips / 1000).toFixed(1)} км
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.label}>Средняя длительность</Text>
            <Text style={styles.value}>
              {formatDuration(stats.totalDuration / stats.totalTrips)}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 16,
    },
    content: {
      gap: 16,
    },
    statBox: {
      backgroundColor: '#f3f4f6',
      padding: 16,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    label: {
      fontSize: 14,
      color: '#6b7280',
      marginBottom: 4,
    },
    value: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#111827',
    },
  })
  