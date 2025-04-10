import { Stack } from 'expo-router'
import "../global.css"
export default function RootLayout() {
  return (
    <Stack>
      {/* Все вне табов — например, экран активной поездки */}
      <Stack.Screen name="trip" options={{ title: 'Поездка', headerShown: false }} />
    </Stack>
  )
}