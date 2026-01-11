import {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from "@/api/services/notificationSettingsApi";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import PasswordSection from "./PasswordSection";

type NotificationId =
  | "jobInterviewScheduled"
  | "connectionRequest"
  | "newJobOpening"
  | "interviewReminder";

interface NotificationSetting {
  id: NotificationId;
  label: string;
  system: boolean;
  email: boolean;
}

export default function SettingsContent() {
  const [notifications, setNotifications] = useState<NotificationSetting[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const { data, refetch } = useGetNotificationSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateNotificationSettingsMutation();

  const defaultNotifications: NotificationSetting[] = useMemo(
    () => [
      {
        id: "jobInterviewScheduled",
        label: "Someone scheduled a job interview with me",
        system: false,
        email: false,
      },
      {
        id: "connectionRequest",
        label: "Someone wants to connect",
        system: false,
        email: false,
      },
      {
        id: "newJobOpening",
        label: "New job opening from the company I follow",
        system: false,
        email: false,
      },
      {
        id: "interviewReminder",
        label: "Reminder about upcoming job interview",
        system: false,
        email: false,
      },
    ],
    []
  );

  useEffect(() => {
    if (!data) return;
    setNotifications([
      {
        id: "jobInterviewScheduled",
        label: "Someone scheduled a job interview with me",
        system: data.jobInterviewScheduledSystem,
        email: data.jobInterviewScheduledEmail,
      },
      {
        id: "connectionRequest",
        label: "Someone wants to connect",
        system: data.connectionRequestSystem,
        email: data.connectionRequestEmail,
      },
      {
        id: "newJobOpening",
        label: "New job opening from the company I follow",
        system: data.newJobOpeningSystem,
        email: data.newJobOpeningEmail,
      },
      {
        id: "interviewReminder",
        label: "Reminder about upcoming job interview",
        system: data.interviewReminderSystem,
        email: data.interviewReminderEmail,
      },
    ]);
  }, [data]);

  useEffect(() => {
    if (notifications.length === 0 && !data) {
      setNotifications(defaultNotifications);
    }
  }, [notifications, data, defaultNotifications]);

  const toPayload = useCallback(
    (items: NotificationSetting[]) => ({
      jobInterviewScheduledSystem:
        items.find((n) => n.id === "jobInterviewScheduled")?.system ?? false,
      jobInterviewScheduledEmail:
        items.find((n) => n.id === "jobInterviewScheduled")?.email ?? false,
      connectionRequestSystem:
        items.find((n) => n.id === "connectionRequest")?.system ?? false,
      connectionRequestEmail:
        items.find((n) => n.id === "connectionRequest")?.email ?? false,
      newJobOpeningSystem:
        items.find((n) => n.id === "newJobOpening")?.system ?? false,
      newJobOpeningEmail:
        items.find((n) => n.id === "newJobOpening")?.email ?? false,
      interviewReminderSystem:
        items.find((n) => n.id === "interviewReminder")?.system ?? false,
      interviewReminderEmail:
        items.find((n) => n.id === "interviewReminder")?.email ?? false,
    }),
    []
  );

  const toggleNotification = useCallback(
    async (id: NotificationId, type: "system" | "email") => {
      const previous = notifications;
      const updated = notifications.map((notif) =>
        notif.id === id ? { ...notif, [type]: !notif[type] } : notif
      );

      setNotifications(updated);
      try {
        await updateSettings(toPayload(updated)).unwrap();
      } catch (error) {
        setNotifications(previous);
        console.log("Failed to update notification settings", error);
      }
    },
    [notifications, toPayload, updateSettings]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.log("Failed to refresh notification settings", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-4 pt-4">
          {/* Password Section */}
          <PasswordSection />

          {/* Notification Settings */}
          <View className="px-4 py-6 border border-gray-700 bg-white dark:bg-black rounded-lg mb-4">
            <Text className="text-base font-semibold text-black dark:text-white mb-4">
              Notification settings
            </Text>

            {/* Table Header */}
            <View className="flex-row items-center mb-3">
              <View className="flex-1">
                <Text className="text-sm font-medium  text-gray-500 dark:text-gray-200  uppercase">
                  NOTIFICATION
                </Text>
              </View>
              <View className="w-20 items-center">
                <Text className="text-sm font-medium  text-gray-500 dark:text-gray-200  uppercase">
                  SYSTEM
                </Text>
              </View>
              <View className="w-20 items-center">
                <Text className="text-sm font-medium  text-gray-500 dark:text-gray-200  uppercase">
                  EMAIL
                </Text>
              </View>
            </View>

            {/* Table Rows */}
            {notifications.map((notification) => (
              <View
                key={notification.id}
                className="flex-row items-center py-4 border-b border-gray-100 dark:border-gray-700"
              >
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {notification.label}
                  </Text>
                </View>
                <View className="w-20 items-center">
                  <Pressable
                    disabled={isUpdating}
                    onPress={() =>
                      toggleNotification(notification.id, "system")
                    }
                    className={`w-6 h-6 rounded items-center justify-center ${
                      notification.system
                        ? "bg-azure-radiance-500"
                        : "border-2 border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {notification.system && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </Pressable>
                </View>
                <View className="w-20 items-center">
                  <Pressable
                    disabled={isUpdating}
                    onPress={() => toggleNotification(notification.id, "email")}
                    className={`w-6 h-6 rounded items-center justify-center ${
                      notification.email
                        ? "bg-azure-radiance-500"
                        : "border-2 border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {notification.email && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
