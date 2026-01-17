import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";

function NotificationHeader() {
  const router = useRouter();

  const onClose = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(dashboard)/(tabs)/jobs");
    }
  }, [router]);

  return (
    <View className="flex-row items-center justify-between p-3 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700">
      <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Notifications
      </Text>
      <Pressable onPress={onClose}>
        <Ionicons name="close" size={24} color="#6B7280" />
      </Pressable>
    </View>
  );
}

export default NotificationHeader;
