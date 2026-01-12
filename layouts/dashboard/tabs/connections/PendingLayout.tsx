import PendingConnectionsTabs from "@/sections/connections/PendingTabs";
import { Slot } from "expo-router";
import React from "react";
import { View } from "react-native";

function PendingLayout() {
  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View className=" border-b border-gray-200 dark:border-gray-700 pt-2">
        <PendingConnectionsTabs />
      </View>
      <Slot />
    </View>
  );
}

export default PendingLayout;
