import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, useColorScheme, View } from "react-native";

export default function SearchStartHint() {
  const colorScheme = useColorScheme();
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        minHeight: 220,
      }}
    >
      <Ionicons
        name="search-outline"
        size={56}
        color={colorScheme === "dark" ? "#6B7280" : "#D1D5DB"}
        style={{ marginBottom: 18 }}
      />
      <Text className="text-lg font-medium text-gray-600 dark:text-gray-300 text-center mb-2">
        Start your search
      </Text>
      <Text className="text-base text-gray-400 dark:text-gray-500 font-medium text-center max-w-xs">
        Type keywords above to find jobs, people, and companies.
      </Text>
    </View>
  );
}
