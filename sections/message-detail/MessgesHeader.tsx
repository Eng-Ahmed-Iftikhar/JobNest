import moment from "moment";
import React from "react";
import { Text, View } from "react-native";

export default function MessgesHeader({ date }: { date: Date }) {
  return (
    <View className="items-center my-4">
      <View className="bg-gray-100 dark:bg-gray-700 px-4 py-1 rounded-full">
        <Text className="text-gray-700 dark:text-gray-100 font-medium">
          {moment(date).format("MMM D")}
        </Text>
      </View>
    </View>
  );
}
