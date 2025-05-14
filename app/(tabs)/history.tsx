import { useEffect, useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { useRouter } from 'expo-router'
import { getBaseUrl } from '../../lib/config'

type Trip = {
  id: number
  user_id: number
  start_time: string
  end_time: string
  duration: number
  distance: number
}
export default function HistoryScreen() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch(`${getBaseUrl()}/api/trips/history`)
      .then((res) => res.json())
      .then((json) => setTrips(json.trips || []))
      .catch(() => alert('Ошибка загрузки истории'))
      .finally(() => setLoading(false))
  }, [])

  const renderItem = ({ item }: { item: Trip }) => (
    <TouchableOpacity
      style={styles.tripItem}
     
      onPress={() =>
        router.push({
          pathname: '/trip/[id]',
          params: { id: String(item.id) },
        })
      }
    >
      <Text style={styles.tripTitle}>🚕 Поездка #{item.id}</Text>
      <Text style={styles.tripDetail}>Водитель: {item.user_id}</Text>
      <Text style={styles.tripDetail}>🕒 Длительность: {Math.floor(item.duration / 60)} мин</Text>
      <Text style={styles.tripDetail}>📍 Расстояние: {(item.distance / 1000).toFixed(2)} км</Text>
      <Text style={styles.tripDetail}>⏳ С: {item.start_time.split('T')[0]}</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📖 История поездок</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#22c55e" />
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
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
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  tripItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111827',
  },
  tripDetail: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 2,
  },
})
