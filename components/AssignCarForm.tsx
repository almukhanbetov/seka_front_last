import { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import Checkbox from 'expo-checkbox'
import { getBaseUrl } from '../lib/config'

type Driver = { id: number; name: string }
type Car = { id: number; brand: string; model: string }

export default function AssignCarForm() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [cars, setCars] = useState<Car[]>([])
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null)
  const [selectedCars, setSelectedCars] = useState<number[]>([])

  useEffect(() => {
    fetch(`${getBaseUrl()}/api/drivers`)
      .then((res) => res.json())
      .then((json) => setDrivers(json.drivers || []))

    fetch(`${getBaseUrl()}/api/cars`)
      .then((res) => res.json())
      .then((json) => setCars(json.cars || []))
  }, [])

  const toggleCar = (carId: number) => {
    setSelectedCars((prev) =>
      prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId]
    )
  }

  const handleAssign = async () => {
    if (!selectedDriver || selectedCars.length === 0) {
      Alert.alert('Заполните все поля')
      return
    }

    try {
      const res = await fetch(`${getBaseUrl()}/api/assign-car`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driver_id: selectedDriver,
          car_ids: selectedCars,
        }),
      })

      if (res.ok) {
        Alert.alert('✅ Успешно', 'Машины назначены водителю')
        setSelectedDriver(null)
        setSelectedCars([])
      } else {
        Alert.alert('Ошибка', 'Не удалось назначить машины')
      }
    } catch (err) {
      console.error(err)
      Alert.alert('Ошибка', 'Сервер недоступен')
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🚗 Назначить машины водителю</Text>

      <Text style={styles.label}>Водитель</Text>
      <Picker
        selectedValue={selectedDriver}
        onValueChange={(val) => setSelectedDriver(val)}
        style={styles.picker}
      >
        <Picker.Item label="-- Выберите --" value={null} />
        {drivers.map((d) => (
          <Picker.Item key={d.id} label={d.name} value={d.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Машины</Text>
      {cars.map((car) => (
        <View key={car.id} style={styles.checkboxRow}>
          <Checkbox
            value={selectedCars.includes(car.id)}
            onValueChange={() => toggleCar(car.id)}
          />
          <Text style={styles.carLabel}>{car.brand} {car.model}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleAssign}>
        <Text style={styles.buttonText}>Назначить</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
    container: {
      padding: 24,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      marginTop: 16,
      marginBottom: 8,
    },
    picker: {
      backgroundColor: '#f3f4f6',
      borderRadius: 8,
    },
    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
    },
    carLabel: {
      marginLeft: 12,
      fontSize: 16,
    },
    button: {
      backgroundColor: '#22c55e',
      paddingVertical: 16,
      borderRadius: 12,
      marginTop: 24,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  })
  