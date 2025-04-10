import { useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import useImagePicker from '../lib/hooks/useImagePicker'

type Props = {
  label?: string
  onPick: (file: { uri: string; name: string; type: string } | null) => void
  defaultUri?: string
}

export default function ImagePickerButton({ label, onPick, defaultUri }: Props) {
  const { image, pickFromGallery, pickFromCamera, clearImage } = useImagePicker()

  const handleSelect = () => {
    Alert.alert('Выбор изображения', 'Откуда загрузить фото?', [
      { text: 'Камера', onPress: pickFromCamera },
      { text: 'Галерея', onPress: pickFromGallery },
      { text: 'Отмена', style: 'cancel' },
    ])
  }

  // ✅ выносим onPick в useEffect
  useEffect(() => {
    onPick(image)
  }, [image])

  return (
    <TouchableOpacity onPress={handleSelect} style={styles.box}>
      {image ? (
        <Image source={{ uri: image.uri }} style={styles.image} />
      ) : defaultUri ? (
        <Image source={{ uri: defaultUri }} style={styles.image} />
      ) : (
        <Text style={styles.placeholder}>{label || '📷 Загрузить фото'}</Text>
      )}
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
    box: {
      height: 160,
      borderRadius: 12,
      backgroundColor: '#f3f4f6',
      borderWidth: 1,
      borderColor: '#e5e7eb',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      marginBottom: 20,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    placeholder: {
      color: '#6B7280',
      fontSize: 16,
    },
  })
  
