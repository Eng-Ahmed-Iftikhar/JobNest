import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function SearchLoading() {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        minHeight: 220,
      }}
    >
      <ActivityIndicator
        size="large"
        color="#3B82F6"
        style={{ marginBottom: 18 }}
      />
      <Text className="text-base text-gray-500 text-center">
        Searching for results...
      </Text>
    </View>
  );
}
