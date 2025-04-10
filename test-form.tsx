import { useState } from 'react'
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native'

export default function TestForm() {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    Alert.alert('Значение', value || 'Пусто')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              padding: 20,
              paddingBottom: 120, // ❗ отступ под кнопку
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
              Тест формы
            </Text>

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 12,
                borderRadius: 8,
                marginBottom: 20,
              }}
              placeholder="Введите что-то"
              value={value}
              onChangeText={setValue}
            />

            {Array.from({ length: 8 }).map((_, i) => (
              <View
                key={i}
                style={{
                  height: 60,
                  backgroundColor: '#eee',
                  marginBottom: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                }}
              >
                <Text>Контент {i + 1}</Text>
              </View>
            ))}
          </ScrollView>

          {/* КНОПКА — вне скролла, ВСЕГДА ВИДНА */}
          <View
            style={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              right: 20,
              backgroundColor: '#22c55e',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              elevation: 3,
            }}
          >
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                Добавить
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
