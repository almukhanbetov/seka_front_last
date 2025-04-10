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
import { Car } from '../lib/types'
import { getBaseUrl } from '../lib/config'

type Props = {
  car: Car
  onClose: () => void
}

export default function EditCarModal({ car, onClose }: Props) {
  const [brand, setBrand] = useState(car.brand)
  const [model, setModel] = useState(car.model)
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
      form.append('photo', {
        uri: image,
        name: filename,
        type,
      } as any)
    }

    try {
      const res = await fetch(`${getBaseUrl()}/api/car/${car.id}`, {
        method: 'PUT',
        body: form,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (res.ok) {
        Alert.alert('✅ Машина обновлена')
        onClose()
      } else {
        const error = await res.json()
        Alert.alert('Ошибка', error?.error || 'Что-то пошло не так')
      }
    } catch (err) {
      console.error(err)
      Alert.alert('Ошибка', 'Проверь подключение к серверу')
    }
  }

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>✏️ Редактировать машину</Text>

        <TouchableOpacity onPress={pickImage} style={styles.imageBox}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Image
              source={{ uri: `${getBaseUrl()}/${car.image}` }}
              style={styles.image}
            />
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Марка"
          value={brand}
          onChangeText={setBrand}
        />
        <TextInput
          style={styles.input}
          placeholder="Модель"
          value={model}
          onChangeText={setModel}
        />

        <View style={styles.buttons}>
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
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  imageBox: {
    height: 160,
    width: '100%',
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  cancel: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    flex: 1,
    marginRight: 8,
  },
  cancelText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#111',
  },
  save: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#22c55e',
    flex: 1,
    marginLeft: 8,
  },
  saveText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
})
