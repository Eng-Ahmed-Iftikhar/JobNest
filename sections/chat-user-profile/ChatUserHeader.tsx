import React, { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type ChatUserHeaderProps = {
  onMenuToggle: (visible: boolean) => void;
};
function ChatUserHeader({ onMenuToggle }: ChatUserHeaderProps) {
  const router = useRouter();

  const onPressBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <View className="flex-row items-center justify-between px-4 pt-8 pb-2 bg-white border-b border-gray-100">
      <TouchableOpacity
        className="p-2 "
        onPress={onPressBack}
        accessibilityLabel="Go back"
      >
        <Ionicons name="arrow-back" size={20} />
      </TouchableOpacity>
      <TouchableOpacity
        className="p-2 "
        onPress={() => onMenuToggle(true)}
        accessibilityLabel="Open menu"
      >
        <Ionicons name="ellipsis-vertical" size={20} />
      </TouchableOpacity>
    </View>
  );
}

export default ChatUserHeader;
