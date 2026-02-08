import {
  useAcceptConnectionRequestMutation,
  useRejectConnectionRequestMutation,
} from "@/api/services/connectionRequestsApi";
import Button from "@/components/ui/Button";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { showErrorAlert, showSuccessAlert } from "@/store/reducers/alertSlice";
import { updateNotification } from "@/store/reducers/notificationSlice";
import { Notification as NotificationType } from "@/types/notification";
import { Ionicons } from "@expo/vector-icons";
import { useCallback } from "react";
import { Image, Text, View } from "react-native";

function ConnectionNotification({
  notification,
}: {
  notification: NotificationType;
}) {
  const [acceptConnection, { isLoading: isAccepting }] =
    useAcceptConnectionRequestMutation();
  const [rejectConnection, { isLoading: isRejecting }] =
    useRejectConnectionRequestMutation();
  const dispatch = useAppDispatch();

  const handleAcceptConnection = useCallback(async () => {
    try {
      await acceptConnection(
        notification.metaData?.connectionRequestId! as string,
      ).unwrap();
      dispatch(
        updateNotification({
          id: notification.id,
          notification: {
            text: "Connection request accepted",
            read: true,
            metaData: {
              ...notification.metaData,
              status: "ACCEPTED",
              texts: [
                ...(notification.metaData?.texts || []),
                notification.text,
              ],
            },
          },
        }),
      );
      dispatch(showSuccessAlert("Connection request accepted successfully"));
    } catch (error) {
      dispatch(showErrorAlert("Failed to accept connection request"));
      console.warn("Failed to accept connection request", error);
    }
  }, [acceptConnection, dispatch, notification]);

  const handleIgnoreConnection = useCallback(async () => {
    try {
      await rejectConnection(
        notification.metaData?.connectionRequestId! as string,
      ).unwrap();
      dispatch(
        updateNotification({
          id: notification.id,
          notification: {
            text: "Connection request rejected",
            read: true,
            metaData: {
              ...notification.metaData,
              status: "REJECTED",
              texts: [
                ...(notification.metaData?.texts || []),
                notification.text,
              ],
            },
          },
        }),
      );
      dispatch(showSuccessAlert("Connection request rejected successfully"));
    } catch (error) {
      dispatch(showErrorAlert("Failed to reject connection request"));
      console.warn("Failed to reject connection request", error);
    }
  }, [dispatch, notification, rejectConnection]);

  return (
    <View className="px-4 py-4 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-700  ">
      <View className="flex-row items-center  justify-center gap-3 ">
        {!notification.read && (
          <View className="w-2 h-2 rounded-full bg-red-500 " />
        )}

        <View className="flex-row items-start gap-3 ">
          {notification.imageUrl ? (
            <Image
              source={{ uri: notification.imageUrl }}
              className="w-11 h-11 rounded-full"
            />
          ) : (
            <Ionicons name={"person"} size={20} color="black" />
          )}

          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {notification.metaData.status === "ACCEPTED" ? (
                <Text>
                  Your accepted the connection request from{" "}
                  <Text className="font-bold">
                    {notification.metaData?.sender?.profile.firstName}{" "}
                    {notification.metaData?.sender?.profile.lastName}
                  </Text>
                </Text>
              ) : notification.metaData.status === "REJECTED" ? (
                <Text>
                  You rejected the connection request from{" "}
                  <Text className="font-bold">
                    {notification.metaData?.sender?.profile.firstName}{" "}
                    {notification.metaData?.sender?.profile.lastName}
                  </Text>
                </Text>
              ) : (
                <Text>
                  <Text>
                    {notification.metaData?.sender?.profile.firstName}{" "}
                    {notification.metaData?.sender?.profile.lastName}{" "}
                  </Text>{" "}
                  has sent you a connection request.
                </Text>
              )}
            </Text>
            {notification.metaData?.status !== "ACCEPTED" &&
              notification.metaData.status !== "REJECTED" && (
                <View className="flex-row items-center gap-2 mt-3">
                  <View className="w-32">
                    <Button
                      onPress={handleAcceptConnection}
                      loading={isAccepting}
                      disabled={isAccepting || isRejecting}
                      className="p-2 "
                    >
                      <Text className="text-base">Accept</Text>
                    </Button>
                  </View>
                  <View className="w-32">
                    <Button
                      variant="outline"
                      onPress={handleIgnoreConnection}
                      loading={isRejecting}
                      disabled={isAccepting || isRejecting}
                      className="p-2 "
                    >
                      <Text className="text-base">Ignore</Text>
                    </Button>
                  </View>
                </View>
              )}
          </View>
        </View>
      </View>
    </View>
  );
}

export default ConnectionNotification;
