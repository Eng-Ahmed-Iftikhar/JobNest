import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

function EmptyMessages() {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={32}
          color="#9ca3af"
        />
      </View>
      <Text className="text-base font-semibold dark:bg-black mb-1 text-center">
        No messages yet
      </Text>
      <Text className="text-sm font-medium text-gray-500 text-center mb-4">
        Click + icon to write a new message
      </Text>
    </View>
  );
}

export default EmptyMessages;
