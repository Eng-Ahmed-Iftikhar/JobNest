import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

function NewMessageHeader() {
  const router = useRouter();

  const onBack = () => {
    router.back();
  };
  return (
    <View className="flex-row items-center gap-3 px-4 py-3 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700">
      <Pressable onPress={onBack} className="p-2 -ml-2">
        <Ionicons name="chevron-back" size={24} color="#1F2937" />
      </Pressable>
      <Text className="text-lg font-semibold dark:bg-black dark:text-gray-100">
        New message
      </Text>
    </View>
  );
}

export default NewMessageHeader;
