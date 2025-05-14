import { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps'
import { Picker } from '@react-native-picker/picker'
import type { ComponentRef } from 'react'
import { getBaseUrl } from '../../lib/config'
import useInitialRegion from '../../lib/hooks/useInitialRegion'

type Driver = {
  id: number
  name: string
  latitude: number
  longitude: number
  image: string
  car_brand: string
  car_model: string
  status: number
}

export default function SearchScreen() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [statusFilter, setStatusFilter] = useState<'all' | 0 | 1 | 2>('all')

  const region = useInitialRegion()
  const mapRef = useRef<MapView>(null)
  const markersRef = useRef<{ [key: number]: ComponentRef<typeof Marker> | null }>({})

  const fetchDrivers = async () => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/active-drivers`)
      const json = await res.json()

      if (!json || !Array.isArray(json.drivers)) {
        throw new Error('Неверный формат данных')
      }

      setDrivers(json.drivers)
    } catch (err) {
      console.error('❌ Ошибка загрузки водителей:', err)
      Alert.alert('Ошибка', 'Не удалось загрузить водителей')
      setDrivers([])
    }
  }

  useEffect(() => {
    fetchDrivers()
    const interval = setInterval(fetchDrivers, 5000)
    return () => clearInterval(interval)
  }, [])

  const filtered = drivers.filter((d) =>
    statusFilter === 'all' ? true : d.status === statusFilter
  )

  const focusDriver = (driver: Driver) => {
    mapRef.current?.animateToRegion(
      {
        latitude: driver.latitude,
        longitude: driver.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500
    )
    markersRef.current[driver.id]?.showCallout()
  }

  if (!region) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>📍 Получение текущей геолокации...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🗺 Водители на карте</Text>

      {/* Фильтр */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Фильтр по статусу:</Text>
        <Picker
          selectedValue={statusFilter}
          onValueChange={(v) => setStatusFilter(v)}
          style={styles.picker}
        >
          <Picker.Item label="Все" value="all" />
          <Picker.Item label="🟢 Свободные" value={0} />
          <Picker.Item label="🟠 Занятые" value={1} />
          <Picker.Item label="⚪️ Оффлайн" value={2} />
        </Picker>
      </View>

      {/* Карта */}
      <MapView 
        ref={mapRef} 
        provider="google"
        style={styles.map} 
        initialRegion={region} 
        showsUserLocation
       >
        {filtered.map((d) => (
          <Marker
            key={d.id}
            coordinate={{ latitude: d.latitude, longitude: d.longitude }}
            pinColor={getColorByStatus(d.status)}
            ref={(ref) => (markersRef.current[d.id] = ref)}
          >
            <Callout>
              <View style={styles.callout}>
                <Image
                  source={{ uri: `${getBaseUrl()}/${d.image}` }}
                  style={styles.avatar}
                />
                <Text style={styles.name}>{d.name}</Text>
                <Text>{d.car_brand} {d.car_model}</Text>
                <Text style={{ color: getColorByStatus(d.status), fontSize: 12 }}>
                  {getStatusLabel(d.status)}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Список */}
      {filtered.length === 0 ? (
        <Text style={styles.noDrivers}>🚫 Водителей не найдено</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => focusDriver(item)}>
              <Image
                source={{ uri: `${getBaseUrl()}/${item.image}` }}
                style={styles.cardImage}
              />
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardCar}>
                  {item.car_brand} {item.car_model}
                </Text>
                <Text style={{ color: getColorByStatus(item.status), fontSize: 12 }}>
                  {getStatusLabel(item.status)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  )
}

const getColorByStatus = (status: number) => {
  switch (status) {
    case 0: return '#22c55e'
    case 1: return '#f59e0b'
    case 2: return '#9ca3af'
    default: return '#000'
  }
}

const getStatusLabel = (status: number) => {
  switch (status) {
    case 0: return 'Свободен'
    case 1: return 'Занят'
    case 2: return 'Оффлайн'
    default: return 'Неизвестно'
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 6,
  },
  pickerContainer: {
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
  picker: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  map: { flex: 1 },
  callout: { alignItems: 'center', width: 180 },
  avatar: { width: 60, height: 60, borderRadius: 30, marginBottom: 6 },
  name: { fontWeight: 'bold', fontSize: 16 },
  noDrivers: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: '#888',
  },
  list: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardImage: { width: 50, height: 50, borderRadius: 25 },
  cardInfo: { marginLeft: 8 },
  cardName: { fontWeight: 'bold', fontSize: 14 },
  cardCar: { fontSize: 12, color: '#555' },
})
