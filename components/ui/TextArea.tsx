import React from "react";
import { Text, TextInput, useColorScheme, View } from "react-native";

type TextAreaProps = {
  label?: string;
  error?: string;
  isError?: boolean;
  numberOfLines?: number;
} & React.ComponentProps<typeof TextInput>;

export default function TextArea({
  label,
  error = "",
  isError = false,
  numberOfLines = 4,
  ...props
}: TextAreaProps) {
  const colorScheme = useColorScheme();
  const minHeight = numberOfLines * 24 + 16; // 24px per line + padding

  return (
    <View style={{ flex: 1, minHeight }}>
      {label && (
        <Text className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
          {label}
        </Text>
      )}
      <TextInput
        className={`border dark:border-gray-600 ${
          isError ? "border-red-500" : "border-gray-300 dark:border-gray-600"
        } rounded-lg px-4 py-2 text-base text-gray-800 dark:text-white `}
        style={{ minHeight }}
        multiline
        numberOfLines={numberOfLines}
        placeholderClassName=" font-medium "
        placeholderTextColor={colorScheme === "dark" ? "#d1d5db" : "gray"}
        textAlignVertical="top"
        {...props}
      />
      {isError && error && (
        <Text className="text-red-500 text-sm font-medium mt-1">{error}</Text>
      )}
    </View>
  );
}
