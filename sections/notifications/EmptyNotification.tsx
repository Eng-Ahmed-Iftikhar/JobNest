import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, useColorScheme, View } from "react-native";

function EmptyNotification() {
  const colorScheme = useColorScheme();
  return (
    <View className="flex-1 items-center justify-center px-6 mt-20">
      <View className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-4">
        <Ionicons
          name="notifications-off-outline"
          size={32}
          color={colorScheme === "dark" ? "#374151" : "#9ca3af"}
        />
      </View>
      <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 text-center">
        No notifications
      </Text>
      <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center">
        You&apos;re all caught up!
      </Text>
    </View>
  );
}

export default EmptyNotification;
