import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function SearchNoResults({
  searchText,
}: {
  searchText: string;
}) {
  return (
    <View className="py-8 items-center">
      <Ionicons
        name="search-outline"
        size={48}
        color="#D1D5DB"
        style={{ marginBottom: 12 }}
      />
      <Text className="text-base text-gray-500 text-center">
        No job, person and company found for "{searchText}"
      </Text>
    </View>
  );
}
