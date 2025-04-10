import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from 'react-native'
import AddDriverForm from '../../components/AddDriverForm'
import AddCarForm from '../../components/AddCarForm'
import AssignCarForm from '@/components/AssignCarForm'
import DriverList from '../../components/DriverList'
import CarList from '../../components/CarList'
import EditDriverModal from '../../components/EditDriverModal'
import EditCarModal from '../../components/EditCarModal'
import { Driver, Car } from '../../lib/types'

const MENU = [
  { key: 'addDriver', label: '➕ Добавить водителя' },
  { key: 'driverList', label: '📋 Водители' },
  { key: 'addCar', label: '➕ Добавить машину' },
  { key: 'carList', label: '📋 Машины' },
  { key: 'assignCars', label: '🔗 Назначить машины' }
]

export default function AdminScreen() {
  const [active, setActive] = useState('addDriver')

  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)
  const [editingCar, setEditingCar] = useState<Car | null>(null)

  const renderContent = () => {
    switch (active) {
      case 'addDriver':
        return <AddDriverForm />
      case 'driverList':
        return <DriverList onEdit={(d) => setEditingDriver(d)} />
      case 'addCar':
        return <AddCarForm />
      case 'carList':
        return <CarList onEdit={(c) => setEditingCar(c)} />
      case 'assignCars':
          return <AssignCarForm />  
      default:
        return null
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menu}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {MENU.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.menuItem,
                active === item.key && styles.menuItemActive,
              ]}
              onPress={() => setActive(item.key)}
            >
              <Text
                style={[
                  styles.menuText,
                  active === item.key && styles.menuTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>{renderContent()}</View>

      {editingDriver && (
        <EditDriverModal
          driver={editingDriver}
          onClose={() => setEditingDriver(null)}
        />
      )}

      {editingCar && (
        <EditCarModal
          car={editingCar}
          onClose={() => setEditingCar(null)}
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
  menu: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  menuItem: {
    marginRight: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  menuItemActive: {
    backgroundColor: '#22c55e',
  },
  menuText: {
    fontSize: 14,
    color: '#374151',
  },
  menuTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
})
