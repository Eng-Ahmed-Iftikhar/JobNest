import Tabs from "@/components/ui/Tabs";
import { Slot, usePathname } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function ProfileLayout() {
  const pathname = usePathname();
  const path = pathname || "";
  const isSettings = path.endsWith("/settings");
  const activeTab = isSettings ? "settings" : "edit-profile";

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* Tab Navigation */}
      <Tabs
        className="border-b border-gray-200 dark:border-gray-700 px-4"
        activeKey={activeTab}
        items={[
          {
            key: "edit-profile",
            label: "Edit profile",
            href: "./edit-profile",
          },
          { key: "settings", label: "Settings", href: "./settings" },
        ]}
      />

      {/* Page Title */}
      <View className="px-4 py-4 border-b  border-gray-100 dark:border-gray-700">
        <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {activeTab === "edit-profile" ? "Edit profile" : "Settings"}
        </Text>
      </View>

      {/* Nested routes render here */}
      <Slot />
    </View>
  );
}
