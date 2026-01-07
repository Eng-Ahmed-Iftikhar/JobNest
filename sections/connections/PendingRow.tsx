import React, { useCallback, useMemo } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Text } from "react-native";
import Avatar from "@/components/ui/Avatar";
import { ConnectionRequest } from "@/types/connection-request";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectUser } from "@/store/reducers/userSlice";
import LocationText from "@/components/LocationText";
import { Location } from "@/types/user";
import {
  useAcceptConnectionRequestMutation,
  useRejectConnectionRequestMutation,
} from "@/api/services/connectionRequestsApi";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/store/reducers/notificationSlice";
import { increaseConnectionsCount } from "@/store/reducers/connectionSlice";

export function PendingRow({ item }: { item: ConnectionRequest }) {
  const user = useAppSelector(selectUser);
  const isSender = item.senderId === user?.id;
  const [rejectConnectionRequest, { isLoading: isRejecting }] =
    useRejectConnectionRequestMutation();
  const [acceptConnectionRequest, { isLoading: isAccepting }] =
    useAcceptConnectionRequestMutation();
  const dispatch = useAppDispatch();
  const userName = useMemo(() => {
    return isSender
      ? `${item.receiver?.profile?.firstName || ""} ${
          item.receiver?.profile?.lastName || ""
        }`
      : `${item.sender?.profile?.firstName || ""} ${
          item.sender?.profile?.lastName || ""
        }`;
  }, [item, isSender]);

  const userImage = useMemo(() => {
    return isSender
      ? item.receiver?.profile?.pictureUrl || ""
      : item.sender?.profile?.pictureUrl || "";
  }, [item, isSender]);

  const location = useMemo(() => {
    return isSender
      ? item.receiver?.profile?.location || ""
      : item.sender?.profile?.location || "";
  }, [item, isSender]);

  const handleAccept = useCallback(async () => {
    try {
      await acceptConnectionRequest(item.id);
      dispatch(increaseConnectionsCount());
      dispatch(showSuccessNotification("Connection request accepted"));
    } catch (error) {
      console.log(error);
      dispatch(showErrorNotification("Failed to accept connection request"));
    }
  }, [acceptConnectionRequest, item.id]);

  const handleReject = useCallback(async () => {
    try {
      await rejectConnectionRequest(item.id);
      dispatch(showSuccessNotification("Connection request rejected"));
    } catch (error) {
      console.log(error);
      dispatch(showErrorNotification("Failed to reject connection request"));
    }
  }, [rejectConnectionRequest, item.id]);

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
      <View className="flex-row items-center gap-3 flex-1">
        <Avatar imageUrl={userImage} name={userName} />
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

      {isSender ? (
        <View>
          <Text className="text-sm text-gray-500">Pending</Text>
        </View>
      ) : (
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={handleAccept}
            className="w-9 h-9 rounded-full bg-emerald-100 items-center justify-center"
          >
            {isAccepting ? (
              <Ionicons name="hourglass" size={18} color="#16a34a" />
            ) : (
              <Ionicons name="checkmark" size={18} color="#16a34a" />
            )}
          </Pressable>
          <Pressable
            onPress={handleReject}
            className="w-9 h-9 rounded-full bg-red-100 items-center justify-center"
          >
            {isRejecting ? (
              <Ionicons name="hourglass" size={18} color="#ef4444" />
            ) : (
              <Ionicons name="close" size={18} color="#ef4444" />
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}
