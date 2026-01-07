import React from "react";
import { Text, View } from "react-native";

type DividerProps = {
  text?: string;
};

function Divider({ text = "or" }: DividerProps) {
  return (
    <View className="flex-row items-center my-4">
      <View className="flex-1 h-px bg-gray-300" />
      <Text className="mx-2 text-gray-500 text-sm font-medium font-semibold">
        {text}
      </Text>
      <View className="flex-1 h-px bg-gray-300" />
    </View>
  );
}

export default Divider;
