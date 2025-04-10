import { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker'

type ImageFile = {
  uri: string
  name: string
  type: string
}

export default function useImagePicker() {
  const [image, setImage] = useState<ImageFile | null>(null)

  // ⛔ Проверка разрешений на запуске
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        alert('Нужен доступ к галерее!')
      }
    })()
  }, [])

  // 📸 Галерея
  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    })

    if (!result.canceled) {
      const uri = result.assets[0].uri
      const name = uri.split('/').pop() || 'image.jpg'
      const type = `image/${name.split('.').pop()}`
      setImage({ uri, name, type })
    }
  }

  // 🤳 Камера
  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      alert('Нужен доступ к камере!')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    })

    if (!result.canceled) {
      const uri = result.assets[0].uri
      const name = uri.split('/').pop() || 'photo.jpg'
      const type = `image/${name.split('.').pop()}`
      setImage({ uri, name, type })
    }
  }

  return {
    image,             // 👈 готово для FormData
    pickFromGallery,
    pickFromCamera,
    clearImage: () => setImage(null),
  }
}
