import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
} from 'react-native'
import { getBaseUrl } from '../lib/config'
import * as ImagePicker from 'expo-image-picker'

export default function AddCarForm() {
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [image, setImage] = useState<string | null>(null)

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const handleSubmit = async () => {
    if (!brand || !model) {
      Alert.alert('Ошибка', 'Марка и модель обязательны')
      return
    }

    const form = new FormData()
    form.append('brand', brand)
    form.append('model', model)

    if (image) {
      const filename = image.split('/').pop()
      const type = 'image/' + filename?.split('.').pop()
      form.append('photo', { uri: image, name: filename, type } as any)
    }

    try {
      const res = await fetch(`${getBaseUrl()}/api/car`, {
        method: 'POST',
        body: form,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (res.ok) {
        Alert.alert('✅ Успешно', 'Машина добавлена')
        setBrand('')
        setModel('')
        setImage(null)
      } else {
        Alert.alert('Ошибка', 'Не удалось добавить машину')
      }
    } catch (err) {
      console.error(err)
      Alert.alert('Ошибка', 'Ошибка сети')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={100}
      >
        <View style={styles.inner}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>🚗 Добавить авто</Text>

            <TextInput
              style={styles.input}
              placeholder="Марка"
              placeholderTextColor="#888"
              value={brand}
              onChangeText={setBrand}
            />

            <TextInput
              style={styles.input}
              placeholder="Модель"
              placeholderTextColor="#888"
              value={model}
              onChangeText={setModel}
            />

            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
              {image ? (
                <Image source={{ uri: image }} style={styles.imagePreview} />
              ) : (
                <Text style={styles.imagePlaceholder}>📸 Фото авто</Text>
              )}
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Добавить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const colors = {
  background: '#fff',
  border: '#E5E7EB',
  text: '#111827',
  grayText: '#6B7280',
  primary: '#3B82F6',
  primaryDark: '#2563EB',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    color: colors.text,
    backgroundColor: '#F9FAFB',
  },
  imageContainer: {
    height: 160,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imagePlaceholder: {
    color: colors.grayText,
    fontSize: 16,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
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
