import PendingConnectionsTabs from "@/sections/connections/PendingTabs";
import { Slot } from "expo-router";
import React from "react";
import { View } from "react-native";

function PendingLayout() {
  return (
    <View className="flex-1 bg-white">
      <View>
        <PendingConnectionsTabs />
      </View>
      <Slot />
    </View>
  );
}

export default PendingLayout;
