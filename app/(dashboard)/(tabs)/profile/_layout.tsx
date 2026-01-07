import React from "react";
import { View, Text } from "react-native";
import { Slot, usePathname } from "expo-router";
import Tabs from "@/components/ui/Tabs";

export default function ProfileLayout() {
  const pathname = usePathname();
  const path = pathname || "";
  const isSettings = path.endsWith("/settings");
  const activeTab = isSettings ? "settings" : "edit-profile";

  return (
    <View className="flex-1 bg-white">
      {/* Tab Navigation */}
      <Tabs
        className="border-b border-gray-200 px-4"
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
      <View className="px-4 py-4 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-900">
          {activeTab === "edit-profile" ? "Edit profile" : "Settings"}
        </Text>
      </View>

      {/* Nested routes render here */}
      <Slot />
    </View>
  );
}
