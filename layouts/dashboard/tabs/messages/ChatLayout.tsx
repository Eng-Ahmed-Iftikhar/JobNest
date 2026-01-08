import { Slot } from "expo-router";
import React from "react";
import { View } from "react-native";

function ChatLayout() {
  return (
    <View className="flex-1 bg-white">
      <Slot />
    </View>
  );
}

export default ChatLayout;
