import React from "react";
import { View, Text } from "react-native";

interface BadgeProps {
  count?: number;
  showZero?: boolean;
  max?: number;
  size?: "small" | "medium";
}

function Badge({
  count = 0,
  showZero = false,
  max = 99,
  size = "medium",
}: BadgeProps) {
  if (count === 0 && !showZero) {
    return null;
  }

  const displayCount = count > max ? `${max}+` : count.toString();
  const isSmall = size === "small";

  return (
    <View
      className={
        " rounded-full bg-red-500 items-center justify-center border-2 border-white " +
        (isSmall ? "w-4 h-4" : "w-5 h-5 ")
      }
    >
      <Text
        className={
          "font-bold text-white " + (isSmall ? "text-[8px]" : "text-[10px]")
        }
      >
        {displayCount}
      </Text>
    </View>
  );
}

export default Badge;
