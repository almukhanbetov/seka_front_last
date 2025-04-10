import { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { Car } from '../lib/types'
import { getBaseUrl } from '../lib/config'

type Props = {
  onEdit: (car: Car) => void
}

export default function CarList({ onEdit }: Props) {
  const [cars, setCars] = useState<Car[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const socketRef = useRef<WebSocket | null>(null)

  const fetchCars = async () => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/cars`)
      const json = await res.json()
      setCars(json.cars)
    } catch (err) {
      console.error('❌ Ошибка загрузки машин:', err)
      Alert.alert('Ошибка', 'Не удалось загрузить машины')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    Alert.alert('Удалить машину?', 'Это действие нельзя отменить.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${getBaseUrl()}/api/car/${id}`, {
              method: 'DELETE',
            })
            if (res.ok) {
              setCars((prev) => prev.filter((c) => c.id !== id))
            } else {
              Alert.alert('Ошибка', 'Не удалось удалить машину')
            }
          } catch {
            Alert.alert('Ошибка', 'Проверь подключение к серверу')
          }
        },
      },
    ])
  }

  const filteredCars = cars.filter((car) =>
    (car.brand + car.model).toLowerCase().includes(search.toLowerCase())
  )

  // 🔁 Auto-update via WebSocket
  const setupWebSocket = () => {
    const socket = new WebSocket(`ws://${getBaseUrl().replace('http://', '')}/ws`)

    socket.onopen = () => {
      console.log('🚗 WebSocket подключён (car list)')
    }

    socket.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data)
        if (data?.type === 'cars_updated') {
          console.log('♻️ Обновление машин по WebSocket')
          fetchCars()
        }
      } catch (err) {
        console.error('❌ Ошибка WebSocket:', err)
      }
    }

    socket.onerror = (err) => {
      console.error('❌ WebSocket ошибка:', err)
    }

    socket.onclose = () => {
      console.log('🔌 WebSocket отключён')
    }

    socketRef.current = socket
  }

  useEffect(() => {
    fetchCars()
    setupWebSocket()

    const interval = setInterval(fetchCars, 10000) // fallback polling

    return () => {
      clearInterval(interval)
      socketRef.current?.close()
    }
  }, [])

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loadingText}>Загрузка машин...</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={styles.search}
        placeholder="🔍 Поиск по марке или модели"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredCars}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item: car }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: `${getBaseUrl()}/${car.image}` }}
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.name}>{car.brand}</Text>
              <Text style={styles.model}>{car.model}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => onEdit(car)} style={styles.iconBtn}>
                <Text style={styles.icon}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(car.id)} style={styles.iconBtn}>
                <Text style={styles.icon}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Машины не найдены</Text>}
      />
    </View>
  )
}
const styles = StyleSheet.create({
    search: {
      margin: 16,
      padding: 12,
      borderRadius: 10,
      borderColor: '#ccc',
      borderWidth: 1,
      fontSize: 15,
      backgroundColor: '#f9f9f9',
    },
    list: {
      paddingHorizontal: 16,
      paddingBottom: 100,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#e5e7eb',
      backgroundColor: '#fff',
      marginBottom: 14,
      elevation: 1,
    },
    image: {
      width: 64,
      height: 64,
      borderRadius: 8,
      backgroundColor: '#f3f4f6',
    },
    info: {
      flex: 1,
      marginLeft: 12,
    },
    name: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111827',
    },
    model: {
      fontSize: 14,
      color: '#6b7280',
    },
    actions: {
      flexDirection: 'row',
      gap: 10,
    },
    iconBtn: {
      padding: 6,
    },
    icon: {
      fontSize: 18,
    },
    empty: {
      textAlign: 'center',
      color: '#9ca3af',
      marginTop: 32,
      fontSize: 16,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 80,
    },
    loadingText: {
      marginTop: 10,
      color: '#4B5563',
    },
  })
  