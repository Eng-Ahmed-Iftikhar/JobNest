import { NotificationTabKey } from "@/types/notification";
import React from "react";
import { View } from "react-native";
import TabButton from "../connections/TabButton";

const tabs: {
  key: NotificationTabKey;
  label: string;
}[] = [
  { key: "all", label: "All" },
  { key: "invitations", label: "Invitations" },
];
type Props = {
  activeTab: NotificationTabKey;
  onTabChange: (tab: NotificationTabKey) => void;
};
function NotificationTabs({ activeTab, onTabChange }: Props) {
  return (
    <View className="flex-row bg-white gap-4 px-3 pt-3 dark:bg-black border-b border-gray-200 dark:border-gray-700">
      {tabs.map((tab) => (
        <TabButton
          label={tab.label}
          key={tab.key}
          count={3}
          active={activeTab === tab.key}
          onPress={() => onTabChange(tab.key)}
        />
      ))}
    </View>
  );
}

export default NotificationTabs;
