import { useEffect, useState } from 'react'
import runDiagnostics from '../../diagnose'
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { useRouter } from 'expo-router'
import { useAppStore } from '../../lib/store'
import { startTrip } from '../../lib/api'
import { getBaseUrl } from '../../lib/config'

export default function HomeScreen() {
  const [drivers, setDrivers] = useState<{ id: number; name: string }[]>([])
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const setUserId = useAppStore((s) => s.setUserId)
  const setTripId = useAppStore((s) => s.setTripId)
  const router = useRouter()
  useEffect(() => {
    runDiagnostics()
  }, [])
  const fetchDrivers = async () => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/drivers`)
      const json = await res.json()
      setDrivers(Array.isArray(json.drivers) ? json.drivers : [])
    } catch (err) {
      Alert.alert('Ошибка', 'Не удалось загрузить водителей')
    } finally {
      setLoading(false)
    }
  }

  const handleStart = async () => {
    if (!selectedDriver) {
      Alert.alert('Выберите водителя')
      return
    }

    setUserId(selectedDriver)
    const tripId = await startTrip(selectedDriver)
    setTripId(tripId)
    router.push('/trip')
  }

  useEffect(() => {
    fetchDrivers()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🚖 Выбор водителя</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#22c55e" />
      ) : (
        <Picker
          selectedValue={selectedDriver}
          onValueChange={(itemValue) => setSelectedDriver(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="-- Выберите водителя --" value={null} />
          {drivers.map((d) => (
            <Picker.Item key={d.id} label={d.name} value={d.id} />
          ))}
        </Picker>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleStart}
        disabled={!selectedDriver}
      >
        <Text style={styles.buttonText}>🚀 Поехали!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  picker: {
    marginBottom: 24,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
