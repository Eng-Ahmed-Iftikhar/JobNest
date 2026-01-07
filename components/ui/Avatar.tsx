import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

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
      className="bg-emerald-500 items-center justify-center"
      style={dimensionStyle}
    >
      <Text className="text-white font-semibold">
        {initials.substring(0, 2)}
      </Text>
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
