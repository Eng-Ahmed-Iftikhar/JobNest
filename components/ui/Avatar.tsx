import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface AvatarProps {
  name?: string;
  imageUrl?: string;
  size?: number;
  onPress?: () => void;
}

function Avatar({ name, imageUrl, size = 36, onPress }: AvatarProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const dimensionStyle = { width: size, height: size, borderRadius: size / 2 };

  const content = imageUrl ? (
    <Image source={{ uri: imageUrl }} style={dimensionStyle} />
  ) : (
    <View
      className="bg-gray-200 dark:bg-gray-700 items-center justify-center"
      style={dimensionStyle}
    >
      {initials.length > 0 && (
        <Text className="text-gray-800 dark:text-white font-semibold">
          {initials.substring(0, 2)}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

export default Avatar;
