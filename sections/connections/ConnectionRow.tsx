import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Connection } from "@/types/connection";
import Avatar from "@/components/ui/Avatar";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectUser } from "@/store/reducers/userSlice";
import LocationText from "@/components/LocationText";
import { Location } from "@/types/user";

const ACCENT = "#1eadff";

export function ConnectionRow({ item }: { item: Connection }) {
  const user = useAppSelector(selectUser);

  const handleMessage = () => {
    // Handle message action
  };

  const userName = useMemo(() => {
    const isSender = item.connectionRequest?.senderId === user?.id;

    return isSender
      ? `${item.connectionRequest?.receiver?.profile?.firstName || ""} ${
          item.connectionRequest?.receiver?.profile?.lastName || ""
        }`
      : `${item.connectionRequest?.sender?.profile?.firstName || ""} ${
          item.connectionRequest?.sender?.profile?.lastName || ""
        }`;
  }, [item, user]);

  const userPicture = useMemo(() => {
    const isSender = item.connectionRequest?.senderId === user?.id;
    return isSender
      ? item.connectionRequest?.receiver?.profile?.pictureUrl || ""
      : item.connectionRequest?.sender?.profile?.pictureUrl || "";
  }, [item, user]);

  const location = useMemo(() => {
    const isSender = item.connectionRequest?.senderId === user?.id;
    return isSender
      ? item.connectionRequest?.receiver?.profile?.location || ""
      : item.connectionRequest?.sender?.profile?.location || "";
  }, [item, user]);

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
      <View className="flex-row items-center gap-3 flex-1">
        <Avatar size={48} imageUrl={userPicture} name={userName} />
        <View className="flex-1">
          <Text
            className="text-base font-semibold text-gray-900"
            numberOfLines={1}
          >
            {userName}
          </Text>
          <LocationText location={location as Location} />
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={handleMessage}
          className="flex-row items-center px-3 py-2 rounded-lg border border-azure-radiance-500 bg-azure-radiance-50"
        >
          <Ionicons
            name="chatbubble-ellipses"
            size={16}
            color={ACCENT}
            style={{ marginRight: 6 }}
          />
          <Text className="text-sm font-medium text-azure-radiance-600">
            Message
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
