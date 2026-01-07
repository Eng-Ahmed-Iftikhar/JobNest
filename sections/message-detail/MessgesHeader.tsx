import React from "react";
import { Text, View } from "react-native";
import moment from "moment";

export default function MessgesHeader({ date }: { date: Date }) {
  return (
    <View className="items-center my-4">
      <View className="bg-gray-100 px-4 py-1 rounded-full">
        <Text className="text-gray-700 font-medium">
          {moment(date).format("MMM D")}
        </Text>
      </View>
    </View>
  );
}
