import Avatar from "@/components/ui/Avatar";
import { SearchUser } from "@/types/search";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

interface SearchUserCardProps {
  user: SearchUser;
}

export default function SearchUserCard({ user }: SearchUserCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/(dashboard)/(tabs)/profile-detail",
      params: { id: user.id },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} className=" items-center w-32">
      <Avatar
        imageUrl={user.pictureUrl}
        size={40}
        name={`${user.firstName} ${user.lastName}`}
      />
      <Text
        className="text-sm font-semibold text-gray-900 mt-3 text-center"
        numberOfLines={2}
      >
        {user.firstName} {user.lastName}
      </Text>
    </TouchableOpacity>
  );
}
