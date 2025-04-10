import { Text, TouchableOpacity } from "react-native"

export default function Button({ title, onPress }: { title: string, onPress: () => void }) {
  return (
    <TouchableOpacity className="bg-taxi-yellow py-4 rounded-xl w-60 items-center" onPress={onPress}>
      <Text className="text-black font-bold text-base">{title}</Text>
    </TouchableOpacity>
  )
}
