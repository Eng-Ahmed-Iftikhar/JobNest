import { Slot } from "expo-router";
import React from "react";
import { View } from "react-native";

function ChatGroupLayout() {
  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Slot />
    </View>
  );
}

export default ChatGroupLayout;
