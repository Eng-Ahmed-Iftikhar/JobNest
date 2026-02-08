import { useAppSelector } from "@/hooks/useAppSelector";
import { selectNotifications } from "@/store/reducers/notificationSlice";
import { NOTIFICATION_TAB, NOTIFICATION_TYPE } from "@/types/notification";
import React from "react";
import { View } from "react-native";
import TabButton from "../connections/TabButton";

const tabs: {
  key: NOTIFICATION_TAB;
  label: string;
}[] = [
  { key: NOTIFICATION_TAB.ALL, label: "All" },
  { key: NOTIFICATION_TAB.INVITATIONS, label: "Invitations" },
];
type Props = {
  activeTab: NOTIFICATION_TAB;
  onTabChange: (tab: NOTIFICATION_TAB) => void;
};
function NotificationTabs({ activeTab, onTabChange }: Props) {
  const notifications = useAppSelector(selectNotifications);
  return (
    <View className="flex-row bg-white gap-4 px-3 pt-3 dark:bg-black border-b border-gray-200 dark:border-gray-700">
      {tabs.map((tab) => {
        const invitationCounts = notifications.filter(
          (n) => n.type === NOTIFICATION_TYPE.INTERVIEW,
        ).length;
        const allOtherCounts = notifications.filter(
          (n) => n.type !== NOTIFICATION_TYPE.INTERVIEW,
        ).length;
        const count =
          tab.key === NOTIFICATION_TAB.ALL ? allOtherCounts : invitationCounts;
        return (
          <TabButton
            label={tab.label}
            key={tab.key}
            count={count}
            active={activeTab === tab.key}
            onPress={() => onTabChange(tab.key)}
          />
        );
      })}
    </View>
  );
}

export default NotificationTabs;
