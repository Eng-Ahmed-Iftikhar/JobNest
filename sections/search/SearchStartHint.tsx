import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SearchStartHint() {
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
        color="#D1D5DB"
        style={{ marginBottom: 18 }}
      />
      <Text className="text-lg font-medium text-gray-600 text-center mb-2">
        Start your search
      </Text>
      <Text className="text-base text-gray-400 text-center max-w-xs">
        Type keywords above to find jobs, people, and companies.
      </Text>
    </View>
  );
}
