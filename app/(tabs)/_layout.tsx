import { Tabs } from 'expo-router'
import { Text } from 'react-native'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFD900',
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Главная', tabBarIcon: () => <Text>🚕</Text> }} />
      <Tabs.Screen name="search" options={{ title: 'Поиск', tabBarIcon: () => <Text>🔍</Text> }} />
      <Tabs.Screen name="history" options={{ title: 'История', tabBarIcon: () => <Text>🕒</Text> }} />
      <Tabs.Screen name="admin" options={{ title: 'Админ', tabBarIcon: () => <Text>⚙️</Text> }} />
    </Tabs>
  )
}
