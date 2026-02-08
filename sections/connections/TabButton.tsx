import React from "react";
import { Pressable, Text, View } from "react-native";
function TabButton({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count?: number;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <View className="flex-row items-center gap-2">
        <Text
          className={
            "text-base font-semibold " +
            (active
              ? "text-black dark:text-white"
              : "text-gray-500 dark:text-gray-400")
          }
        >
          {label}
        </Text>
        {typeof count === "number" && count > 0 && (
          <View className="h-5 w-5 items-center justify-center bg-azure-radiance-50 dark:bg-azure-radiance-500 rounded-full border border-azure-radiance-100 dark:border-azure-radiance-500">
            <Text className="text-xs font-semibold text-azure-radiance-600 dark:text-white">
              {count}
            </Text>
          </View>
        )}
      </View>
      <View
        className={
          "h-0.5 mt-1 rounded-full " +
          (active ? "bg-azure-radiance-500" : "bg-transparent")
        }
      />
    </Pressable>
  );
}

export default TabButton;
