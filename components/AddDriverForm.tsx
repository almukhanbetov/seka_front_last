import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { getBaseUrl } from '../lib/config'
import ImagePickerButton from './ImagePickerButton'

export default function AddDriverForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [file, setFile] = useState<any>(null)

  const handleSubmit = async () => {
    if (!name) {
      Alert.alert('Ошибка', 'Имя обязательно')
      return
    }

    const form = new FormData()
    form.append('name', name)
    form.append('email', email)

    if (file) {
      form.append('photo', file)
    }

    try {
      const res = await fetch(`${getBaseUrl()}/api/driver`, {
        method: 'POST',
        body: form,
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
      })

      if (res.ok) {
        Alert.alert('✅ Успешно', 'Водитель добавлен')
        setName('')
        setEmail('')
        setFile(null)
      } else {
        const err = await res.json()
        Alert.alert('Ошибка', err?.error || 'Что-то пошло не так')
      }
    } catch (err) {
      console.error(err)
      Alert.alert('Ошибка', 'Проверь подключение к серверу')
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.title}>🧑‍✈️ Добавить водителя</Text>

        <TextInput
          placeholder="Имя"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <ImagePickerButton label="📸 Фото водителя" onPick={setFile} />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Добавить</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
const styles = StyleSheet.create({
  form: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
})
