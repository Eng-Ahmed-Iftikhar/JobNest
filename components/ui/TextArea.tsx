import React from "react";
import { View, Text, TextInput } from "react-native";

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
  const minHeight = numberOfLines * 24 + 16; // 24px per line + padding

  return (
    <View style={{ flex: 1, minHeight }}>
      {label && (
        <Text className="text-sm font-medium text-gray-600 mb-1">{label}</Text>
      )}
      <TextInput
        className={`border ${isError ? "border-red-500" : "border-gray-300"} rounded-lg px-4 py-2 text-base`}
        style={{ minHeight }}
        multiline
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        {...props}
      />
      {isError && error && (
        <Text className="text-red-500 text-sm font-medium mt-1">{error}</Text>
      )}
    </View>
  );
}
