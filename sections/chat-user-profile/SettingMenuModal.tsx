import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type SettingMenuProps = {
  visible: boolean;
  onClose: () => void;
  onBlockUser: () => void;
  onMuteUser: () => void;
  blocked?: boolean;
  muted?: boolean;
};

function SettingMenuModal({
  visible,
  onClose,
  onBlockUser,
  onMuteUser,
  blocked = false,
  muted = false,
}: SettingMenuProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.2)" }}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View className="absolute right-10 top-36 w-48 bg-white dark:bg-black rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2">
          <TouchableOpacity
            className="flex-row items-center px-3 py-3 rounded-lg hover:bg-gray-100 border-b border-gray-200 dark:border-gray-700"
            onPress={onBlockUser}
          >
            <Ionicons
              name={blocked ? "lock-open-outline" : "lock-closed-outline"}
              size={20}
              color="#ef4444"
              className="mr-2"
            />
            <Text className="text-base text-black dark:text-white ml-2">
              {blocked ? "Unblock User" : "Block User"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center px-3 py-3 rounded-lg hover:bg-gray-100"
            onPress={onMuteUser}
          >
            <Ionicons
              name={muted ? "volume-high-outline" : "volume-mute-outline"}
              size={20}
              color="#f59e42"
              className="mr-2"
            />
            <Text className="text-base text-black dark:text-white ml-2">
              {muted ? "Unmute User" : "Mute User"}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default SettingMenuModal;
