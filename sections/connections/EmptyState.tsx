import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-3">
        <Ionicons name={icon} size={26} color="#9ca3af" />
      </View>
      <Text className="text-base font-semibold text-gray-900 mb-1 text-center">
        {title}
      </Text>
      <Text className="text-sm font-medium text-gray-500 text-center mb-4">
        {description}
      </Text>
      <Pressable
        onPress={onAction}
        className="flex-row items-center px-4 py-3 rounded-lg bg-azure-radiance-500"
      >
        <Ionicons
          name="search"
          size={18}
          color="white"
          style={{ marginRight: 8 }}
        />
        <Text className="text-sm font-medium text-white">{actionLabel}</Text>
      </Pressable>
    </View>
  );
}
