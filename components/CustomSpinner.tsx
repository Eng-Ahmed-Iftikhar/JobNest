import React from "react";
import { View } from "react-native";

interface CustomSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

function CustomSpinner({
  size = "medium",
  color = "#3b82f6",
}: CustomSpinnerProps) {
  const sizeClasses = {
    small: "w-6 h-6 border-2",
    medium: "w-8 h-8 border-[3px]",
    large: "w-12 h-12 border-4",
  };

  return (
    <View
      className={`${sizeClasses[size]} rounded-full border-gray-300 dark:border-gray-600 animate-spin`}
      style={{
        borderTopColor: color,
      }}
    />
  );
}

export default CustomSpinner;
