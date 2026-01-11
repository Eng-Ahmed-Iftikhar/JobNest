import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const ACCENT = "#1eadff";

function MessagesHeader() {
  const router = useRouter();

  const onNewMessage = () => {
    router.push({
      pathname: "/messages/new",
    });
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700">
      <Text className="text-lg font-semibold dark:bg-black dark:text-gray-100">
        Messages
      </Text>
      <Pressable
        onPress={onNewMessage}
        className="w-10 h-10 rounded-full items-center justify-center"
      >
        <Ionicons name="add" size={28} color={ACCENT} />
      </Pressable>
    </View>
  );
}

export default MessagesHeader;
