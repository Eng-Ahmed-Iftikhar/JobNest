import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";

function NewMessageHeader() {
  const router = useRouter();

  const onBack = () => {
    router.back();
  };
  return (
    <View className="flex-row items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
      <Pressable onPress={onBack} className="p-2 -ml-2">
        <Ionicons name="chevron-back" size={24} color="#1F2937" />
      </Pressable>
      <Text className="text-lg font-semibold text-gray-900">New message</Text>
    </View>
  );
}

export default NewMessageHeader;
