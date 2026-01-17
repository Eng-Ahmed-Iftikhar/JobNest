import { Notification as NotificationType } from "@/types/notification";
import React, { useMemo } from "react";
import { FlatList } from "react-native";
import Notification from "./Notification";

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

type Props = {
  activeTab: string;
};

function Notifications({ activeTab }: Props) {
  const filteredNotifications = useMemo(() => {
    if (activeTab === "invitations") {
      return notificationsData.filter(
        (notification) => notification.type === "connection",
      );
    }
    return notificationsData;
  }, [activeTab]);

  return (
    <FlatList
      data={filteredNotifications}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Notification notification={item} />}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    />
  );
}

export default Notifications;
