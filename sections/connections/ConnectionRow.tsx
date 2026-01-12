import LocationText from "@/components/LocationText";
import Avatar from "@/components/ui/Avatar";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectUser } from "@/store/reducers/userSlice";
import { Connection } from "@/types/connection";
import { Location } from "@/types/user";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import MessageBtn from "./MessageBtn";

export function ConnectionRow({ item }: { item: Connection }) {
  const user = useAppSelector(selectUser);

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

  const userId = useMemo(() => {
    const isSender = item.connectionRequest?.senderId === user?.id;
    return isSender
      ? item.connectionRequest?.receiverId || ""
      : item.connectionRequest?.senderId || "";
  }, [item, user]);

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-700">
      <View className="flex-row items-center gap-3 flex-1">
        <Avatar size={48} imageUrl={userPicture} name={userName} />
        <View className="flex-1">
          <Text
            className="text-base font-semibold dark:bg-black dark:text-gray-100"
            numberOfLines={1}
          >
            {userName}
          </Text>
          <LocationText location={location as Location} />
        </View>
      </View>

      <View style={{ width: 90, alignItems: "flex-end" }}>
        <MessageBtn userId={userId} />
      </View>
    </View>
  );
}
