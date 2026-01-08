import { Slot } from "expo-router";
import React from "react";
import { View } from "react-native";

function UserProfileLayout() {
  return (
    <View className="flex-1">
      <Slot />
    </View>
  );
}

export default UserProfileLayout;
