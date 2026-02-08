import NotificationHeader from "@/sections/notifications/NotificationHeader";
import Notifications from "@/sections/notifications/Notifications";
import NotificationTabs from "@/sections/notifications/NotificationTabs";
import { NOTIFICATION_TAB } from "@/types/notification";
import React, { useState } from "react";
import { View } from "react-native";

export default function NotificationScreen() {
  const [selectedTab, setSelectedTab] = useState<NOTIFICATION_TAB>(
    NOTIFICATION_TAB.ALL,
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-black">
      <NotificationHeader />
      <NotificationTabs activeTab={selectedTab} onTabChange={setSelectedTab} />

      <Notifications activeTab={selectedTab} />
    </View>
  );
}
