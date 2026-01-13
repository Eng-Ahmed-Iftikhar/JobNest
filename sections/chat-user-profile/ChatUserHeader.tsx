import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { TouchableOpacity, useColorScheme, View } from "react-native";

type ChatUserHeaderProps = {
  onMenuToggle: (visible: boolean) => void;
};
function ChatUserHeader({ onMenuToggle }: ChatUserHeaderProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const onPressBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <View className="flex-row items-center justify-between px-4 pt-8 pb-2 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-700">
      <TouchableOpacity
        className="p-2 "
        onPress={onPressBack}
        accessibilityLabel="Go back"
      >
        <Ionicons
          name="arrow-back"
          color={colorScheme === "dark" ? "#9CA3AF" : "#000"}
          size={20}
        />
      </TouchableOpacity>
      <TouchableOpacity
        className="p-2 "
        onPress={() => onMenuToggle(true)}
        accessibilityLabel="Open menu"
      >
        <Ionicons
          name="ellipsis-vertical"
          color={colorScheme === "dark" ? "#9CA3AF" : "#000"}
          size={20}
        />
      </TouchableOpacity>
    </View>
  );
}

export default ChatUserHeader;
