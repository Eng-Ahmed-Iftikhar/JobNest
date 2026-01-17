import { Notification } from "@/types/notification";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, useColorScheme, View } from "react-native";

function InterviewNotification({
  notification,
}: {
  notification: Notification;
}) {
  const colorScheme = useColorScheme();
  return (
    <View className="px-4 py-4 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-700">
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
            <Ionicons
              name="briefcase"
              size={20}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          )}
        </View>

        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Job interview scheduled with{" "}
            <Text className="font-bold">{notification.companyName}</Text>
          </Text>
          <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            {notification.date}
          </Text>

          <Pressable className="flex-row items-center gap-2 mt-3 px-3 py-2 rounded-lg border border-azure-radiance-500 bg-azure-radiance-50 w-32 ">
            <Ionicons
              name="chatbubble-ellipses"
              size={16}
              color={colorScheme === "dark" ? "#3B82F6" : "#3B82F6"}
            />
            <Text className="text-sm font-medium  text-azure-radiance-600">
              Message
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default InterviewNotification;
