import React from "react";
import { Text, View } from "react-native";

function DeletedGroup() {
  return (
    <View className="p-4">
      <View className="bg-yellow-100 p-3 rounded">
        <Text className="text-yellow-800 text-center">
          This Chat has been deleted. You can no longer send or receive messages
          in this Chat.
        </Text>
      </View>
    </View>
  );
}

export default DeletedGroup;
