import { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { Driver } from '../lib/types'
import { getBaseUrl } from '../lib/config'

type Props = {
  onEdit: (driver: Driver) => void
}

export default function DriverList({ onEdit }: Props) {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDrivers = async () => {
    try {
      console.log('📡 Загружаю:', `${getBaseUrl()}/api/drivers`)
      const res = await fetch(`${getBaseUrl()}/api/drivers`)
      const json = await res.json()
      setDrivers(json.drivers)
    } catch (err) {
      console.error('❌ Ошибка загрузки водителей:', err)
      Alert.alert('Ошибка', 'Не удалось загрузить водителей')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    Alert.alert('Удалить водителя?', 'Это действие нельзя отменить.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${getBaseUrl()}/api/driver/${id}`, {
              method: 'DELETE',
            })
            if (res.ok) {
              setDrivers((prev) => prev.filter((d) => d.id !== id))
            } else {
              Alert.alert('Ошибка', 'Не удалось удалить')
            }
          } catch {
            Alert.alert('Ошибка', 'Проверь подключение к серверу')
          }
        },
      },
    ])
  }

  useEffect(() => {
    fetchDrivers()
  }, [])

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={drivers}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item: driver }) => (
        <View style={styles.card}>
          <Image
            source={{ uri: `${getBaseUrl()}/${driver.image}` }}
            style={styles.image}
          />
          <View style={styles.info}>
            <Text style={styles.name}>{driver.name}</Text>
            <Text style={styles.email}>{driver.email || '—'}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => onEdit(driver)} style={styles.iconBtn}>
              <Text style={styles.icon}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(driver.id)} style={styles.iconBtn}>
              <Text style={styles.icon}>🗑</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>Водители не найдены</Text>}
    />
  )
}

const styles = StyleSheet.create({
    list: {
      padding: 16,
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
    email: {
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
  