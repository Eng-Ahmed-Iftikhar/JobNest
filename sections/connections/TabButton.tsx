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
    <Pressable onPress={onPress} className="mr-6 pb-2">
      <View className="flex-row items-center gap-2">
        <Text
          className={
            "text-base font-semibold " +
            (active ? "text-gray-900" : "text-gray-500")
          }
        >
          {label}
        </Text>
        {typeof count === "number" && count > 0 && (
          <View className="px-2 py-0.5 bg-azure-radiance-50 rounded-full border border-azure-radiance-100">
            <Text className="text-sm font-semibold text-azure-radiance-600">
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
