import { Notification as NotificationType } from "@/types/notification";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

function ConnectionNotification({
  notification,
}: {
  notification: NotificationType;
}) {
  const [status, setStatus] = useState<"pending" | "accepted" | "ignored">(
    "pending",
  );

  if (status === "accepted") {
    return (
      <View className="px-4 py-4 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-700">
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

          <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 ">
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
    <View className="px-4 py-4 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-700  ">
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
          <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
            <Text className="font-bold">{notification.userName}</Text> wants to
            connect
          </Text>

          <View className="flex-row items-center gap-2 mt-3">
            <Pressable
              onPress={() => setStatus("accepted")}
              className="flex-row items-center px-4 py-2 rounded-lg bg-azure-radiance-500 gap-1"
            >
              <Ionicons name="checkmark" size={16} color="white" />
              <Text className="text-sm font-medium  text-white">Accept</Text>
            </Pressable>

            <Pressable
              onPress={() => setStatus("ignored")}
              className="flex-row items-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 gap-1"
            >
              <Ionicons name="close" size={16} color="#6B7280" />
              <Text className="text-sm font-medium  text-gray-700 dark:text-gray-400">
                Ignore
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

export default ConnectionNotification;
