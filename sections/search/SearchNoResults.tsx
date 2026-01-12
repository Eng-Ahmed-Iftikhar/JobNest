import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, useColorScheme, View } from "react-native";

export default function SearchNoResults({
  searchText,
}: {
  searchText: string;
}) {
  const colorScheme = useColorScheme();
  return (
    <View className="py-8 items-center">
      <Ionicons
        name="search-outline"
        size={48}
        color={colorScheme === "dark" ? "#6B7280" : "#D1D5DB"}
        style={{ marginBottom: 12 }}
      />
      <Text className="text-base text-gray-500 dark:text-gray-400 text-center">
        No job, person and company found for "{searchText}"
      </Text>
    </View>
  );
}
