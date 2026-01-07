import React from "react";
import { Text, View } from "react-native";

function BlockedChat() {
  return (
    <View className="p-4">
      <View className="mb-2">
        <View className="bg-red-100 p-3 rounded">
          <Text className="text-red-800 text-center">
            You have blocked this chat. You cannot send or receive messages.
            Unblock the chat to resume messaging.
          </Text>
        </View>
      </View>
    </View>
  );
}

export default BlockedChat;
