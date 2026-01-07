import React, { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ACCENT = "#1eadff";

type NotificationType = "interview" | "connection";

type Notification = {
  id: string;
  type: NotificationType;
  read: boolean;
  companyName?: string;
  companyImage?: string;
  companyColor?: string;
  date?: string;
  userName?: string;
  userColor?: string;
  userIcon?: keyof typeof Ionicons.glyphMap;
};

type TabKey = "all" | "invitations";

const notificationsData: Notification[] = [
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

function TabButton({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count?: number;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={
        "flex-row items-center gap-2 px-4 py-3 border-b-2 " +
        (active ? "border-azure-radiance-500" : "border-transparent")
      }
    >
      <Text
        className={
          "text-base font-semibold " +
          (active ? "text-gray-900" : "text-gray-400")
        }
      >
        {label}
      </Text>
      {typeof count === "number" && count > 0 && (
        <View className="px-2 py-0.5 bg-azure-radiance-50 rounded-full border border-azure-radiance-100">
          <Text className="text-sm font-medium font-semibold text-azure-radiance-600">
            {count}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

function InterviewNotification({
  notification,
}: {
  notification: Notification;
}) {
  return (
    <View className="px-4 py-4 bg-white border-b border-gray-100">
      <View className="flex-row items-start gap-3">
        {!notification.read && (
          <View className="w-2 h-2 rounded-full bg-red-500 mt-3" />
        )}
        {!notification.read && (
          <View className="w-2 h-2 rounded-full bg-transparent mt-3" />
        )}

        <View
          className="w-11 h-11 rounded-full items-center justify-center flex-shrink-0"
          style={{ backgroundColor: notification.companyColor }}
        >
          {notification.companyImage ? (
            <Image
              source={{ uri: notification.companyImage }}
              className="w-11 h-11 rounded-full"
            />
          ) : (
            <Ionicons name="briefcase" size={20} color="white" />
          )}
        </View>

        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900">
            Job interview scheduled with{" "}
            <Text className="font-bold">{notification.companyName}</Text>
          </Text>
          <Text className="text-sm font-medium text-gray-500 mt-1">
            {notification.date}
          </Text>

          <Pressable className="flex-row items-center gap-2 mt-3 px-3 py-2 rounded-lg border border-azure-radiance-500 bg-azure-radiance-50 w-32 ">
            <Ionicons name="chatbubble-ellipses" size={16} color={ACCENT} />
            <Text className="text-sm font-medium font-semibold text-azure-radiance-600">
              Message
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function ConnectionNotification({
  notification,
}: {
  notification: Notification;
}) {
  const [status, setStatus] = useState<"pending" | "accepted" | "ignored">(
    "pending"
  );

  if (status === "accepted") {
    return (
      <View className="px-4 py-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center gap-3">
          {!notification.read && (
            <View className="w-2 h-2 rounded-full bg-red-500" />
          )}
          {!notification.read && (
            <View className="w-2 h-2 rounded-full bg-transparent" />
          )}

          <View
            className="w-11 h-11 rounded-full items-center justify-center flex-shrink-0"
            style={{ backgroundColor: notification.userColor }}
          >
            <Ionicons
              name={notification.userIcon || "person"}
              size={20}
              color="white"
            />
          </View>

          <Text className="text-sm font-medium text-gray-600">
            Connection request accepted
          </Text>
        </View>
      </View>
    );
  }

  if (status === "ignored") {
    return null;
  }

  return (
    <View className="px-4 py-4 bg-white border-b border-gray-100">
      <View className="flex-row items-start gap-3">
        {!notification.read && (
          <View className="w-2 h-2 rounded-full bg-red-500 mt-1" />
        )}
        {!notification.read && (
          <View className="w-2 h-2 rounded-full bg-transparent mt-1" />
        )}

        <View
          className="w-11 h-11 rounded-full items-center justify-center flex-shrink-0"
          style={{ backgroundColor: notification.userColor }}
        >
          <Ionicons
            name={notification.userIcon || "person"}
            size={20}
            color="white"
          />
        </View>

        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900">
            <Text className="font-bold">{notification.userName}</Text> wants to
            connect
          </Text>

          <View className="flex-row items-center gap-2 mt-3">
            <Pressable
              onPress={() => setStatus("accepted")}
              className="flex-row items-center px-4 py-2 rounded-lg bg-azure-radiance-500 gap-1"
            >
              <Ionicons name="checkmark" size={16} color="white" />
              <Text className="text-sm font-medium font-semibold text-white">
                Accept
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setStatus("ignored")}
              className="flex-row items-center px-4 py-2 rounded-lg border border-gray-300 gap-1"
            >
              <Ionicons name="close" size={16} color="#6B7280" />
              <Text className="text-sm font-medium font-semibold text-gray-700">
                Ignore
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function NotificationsContent({
  onClose,
}: {
  onClose: () => void;
}) {
  const [tab, setTab] = useState<TabKey>("all");

  const unreadCount = useMemo(
    () => notificationsData.filter((n) => !n.read).length,
    []
  );

  const invitationCount = useMemo(
    () =>
      notificationsData.filter((n) => n.type === "connection" && !n.read)
        .length,
    []
  );

  const filteredNotifications = useMemo(() => {
    if (tab === "all") {
      return notificationsData;
    }
    return notificationsData.filter((n) => n.type === "connection");
  }, [tab]);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <Text className="text-lg font-semibold text-gray-900">
          Notifications
        </Text>
        <Pressable onPress={onClose} className="p-2">
          <Ionicons name="close" size={24} color="#6B7280" />
        </Pressable>
      </View>

      <View className="flex-row bg-white border-b border-gray-200">
        <TabButton
          label="All"
          count={unreadCount}
          active={tab === "all"}
          onPress={() => setTab("all")}
        />
        <TabButton
          label="Invitations"
          count={invitationCount}
          active={tab === "invitations"}
          onPress={() => setTab("invitations")}
        />
      </View>

      {filteredNotifications.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
            <Ionicons
              name="notifications-off-outline"
              size={32}
              color="#9ca3af"
            />
          </View>
          <Text className="text-base font-semibold text-gray-900 mb-1 text-center">
            No notifications
          </Text>
          <Text className="text-sm font-medium text-gray-500 text-center">
            You're all caught up!
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <>
              {item.type === "interview" && (
                <InterviewNotification notification={item} />
              )}
              {item.type === "connection" && (
                <ConnectionNotification notification={item} />
              )}
            </>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
