import Avatar from "@/components/ui/Avatar";
import { SearchUser } from "@/types/search";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Text, TouchableOpacity } from "react-native";

interface SearchUserCardProps {
  user: SearchUser;
}

export default function SearchUserCard({ user }: SearchUserCardProps) {
  const router = useRouter();

  const handlePress = useCallback(() => {
    router.push({
      pathname: "/(dashboard)/(tabs)/profile-detail",
      params: { id: user.id },
    });
  }, [router, user]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      className=" items-center border bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 mx-2 rounded-xl p-2 w-32"
    >
      <Avatar
        imageUrl={user.pictureUrl}
        size={40}
        name={`${user.firstName} ${user.lastName}`}
      />
      <Text
        className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-3 text-center"
        numberOfLines={2}
      >
        {user.firstName} {user.lastName}
      </Text>
    </TouchableOpacity>
  );
}
