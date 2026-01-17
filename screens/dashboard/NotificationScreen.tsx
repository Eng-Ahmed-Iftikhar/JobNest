import EmptyNotification from "@/sections/notifications/EmptyNotification";
import NotificationHeader from "@/sections/notifications/NotificationHeader";
import Notifications from "@/sections/notifications/Notifications";
import NotificationTabs from "@/sections/notifications/NotificationTabs";
import {
  NotificationTabKey,
  Notification as NotificationType,
} from "@/types/notification";
import React, { useState } from "react";
import { View } from "react-native";

const notificationsData: NotificationType[] = [
  {
    id: "1",
    type: "interview",
    read: false,
    companyName: "BBQ Roadhouse",
    companyColor: "#6B7280",
    companyImage: "https://via.placeholder.com/44",
    date: "Mon, 30 Jan 5:30 PM",
  },
  {
    id: "2",
    type: "connection",
    read: false,
    userName: "Clarence Williams",
    userColor: "#a855f7",
    userIcon: "person",
  },
  {
    id: "3",
    type: "interview",
    read: true,
    companyName: "BBQ Roadhouse",
    companyColor: "#6B7280",
    companyImage: "https://via.placeholder.com/44",
    date: "Mon, 30 Jan 5:30 PM",
  },
  {
    id: "4",
    type: "interview",
    read: true,
    companyName: "BBQ Roadhouse",
    companyColor: "#6B7280",
    companyImage: "https://via.placeholder.com/44",
    date: "Mon, 30 Jan 5:30 PM",
  },
  {
    id: "5",
    type: "connection",
    read: true,
    userName: "Clarence Williams",
    userColor: "#a855f7",
    userIcon: "person",
  },
];

export default function NotificationScreen() {
  const [selectedTab, setSelectedTab] = useState<NotificationTabKey>("all");

  return (
    <View className="flex-1 bg-gray-50 dark:bg-black">
      <NotificationHeader />
      <NotificationTabs activeTab={selectedTab} onTabChange={setSelectedTab} />
      {notificationsData.length === 0 ? (
        <EmptyNotification />
      ) : (
        <Notifications activeTab={selectedTab} />
      )}
    </View>
  );
}
