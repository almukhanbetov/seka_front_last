import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  StyleSheet,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Driver } from '../lib/types'
import { getBaseUrl } from '../lib/config'

type Props = {
  driver: Driver
  onClose: () => void
}

export default function EditDriverModal({ driver, onClose }: Props) {
  const [name, setName] = useState(driver.name)
  const [email, setEmail] = useState(driver.email)
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

  const handleSave = async () => {
    const form = new FormData()
    form.append('name', name)
    form.append('email', email)

    if (image) {
      const filename = image.split('/').pop()
      const type = 'image/' + filename?.split('.').pop()
      form.append('photo', {
        uri: image,
        name: filename,
        type,
      } as any)
    }

    const res = await fetch(`${getBaseUrl()}/api/driver/${driver.id}`, {
      method: 'PUT',
      body: form,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (res.ok) {
      Alert.alert('✅ Водитель обновлён')
      onClose()
    } else {
      const err = await res.json()
      Alert.alert('Ошибка', err?.error || 'Ошибка при обновлении')
    }
  }

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>✏️ Редактировать водителя</Text>

        <TouchableOpacity onPress={pickImage} style={styles.imageBox}>
          <Image
            source={{ uri: image || `${getBaseUrl()}/${driver.image}` }}
            style={styles.image}
          />
        </TouchableOpacity>

        <TextInput style={styles.input} value={name} onChangeText={setName} />
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />

        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={onClose} style={styles.cancel}>
            <Text style={styles.cancelText}>Отмена</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={styles.save}>
            <Text style={styles.saveText}>Сохранить</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  imageBox: {
    height: 160,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#f3f3f3',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  cancel: {
    flex: 1,
    padding: 14,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
  },
  cancelText: { textAlign: 'center', fontSize: 16, color: '#111' },
  save: {
    flex: 1,
    padding: 14,
    backgroundColor: '#22c55e',
    borderRadius: 10,
  },
  saveText: { textAlign: 'center', fontSize: 16, color: '#fff', fontWeight: '600' },
})
