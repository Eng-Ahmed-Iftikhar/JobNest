import React from "react";
import { Image, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ProfileImageProps {
  imageUrl: string;
  size?: number;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ imageUrl, size = 80 }) => (
  <View
    className="overflow-hidden border-2 border-gray-200 bg-gray-100 justify-center items-center"
    style={{ width: size, height: size, borderRadius: size / 2 }}
  >
    {imageUrl?.trim() ? (
      <Image
        source={{ uri: imageUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    ) : (
      <Ionicons
        name="people-circle-outline"
        size={size * 0.7}
        color="#d1d5db"
      />
    )}
  </View>
);

export default ProfileImage;
