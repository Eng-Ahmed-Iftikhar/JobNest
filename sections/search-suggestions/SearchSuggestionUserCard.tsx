import {
  useAcceptConnectionRequestMutation,
  useCreateConnectionRequestMutation,
} from "@/api/services/connectionRequestsApi";
import LocationText from "@/components/LocationText";
import Avatar from "@/components/ui/Avatar";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectConnections } from "@/store/reducers/connectionSlice";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/store/reducers/notificationSlice";
import { selectUser } from "@/store/reducers/userSlice";
import { UserListItem } from "@/types/api/user";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

function SearchSuggestionUserCard({ item }: { item: UserListItem }) {
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const userConnections = useAppSelector(selectConnections);

  const [requestSent, setRequestSent] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [createConnectionRequest, { isLoading: isSending }] =
    useCreateConnectionRequestMutation();
  const [acceptConnectionRequest, { isLoading: isAccepting }] =
    useAcceptConnectionRequestMutation();

  const isConnected = userConnections.find(
    (connection) => connection.user?.id === item.id
  );

  const receiverIsUser = user?.id === item.connectionRequest?.receiverId;

  const handleSendConnectionRequest = async () => {
    if (isConnected) return;
    if (receiverIsUser && item.connectionRequest) {
      try {
        await acceptConnectionRequest(item.connectionRequest.id).unwrap();
        dispatch(showSuccessNotification("Connection request accepted"));
        return;
      } catch (error) {
        console.log(error);
        dispatch(showErrorNotification("Failed to accept connection request"));
        return;
      }
    }
    try {
      await createConnectionRequest({ receiverId: item.id }).unwrap();
      setRequestSent(true);
      dispatch(showSuccessNotification("Connection request sent successfully"));
    } catch (error) {
      console.log(error);
      dispatch(showErrorNotification("Failed to send connection request"));
    }
  };

  useEffect(() => {
    setRequestSent(Boolean(item.connectionRequest));
  }, [item]);

  return (
    <View className="flex-row justify-between items-center px-4 border-b border-gray-200">
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/(dashboard)/(tabs)/profile-detail",
            params: { id: item.id },
          })
        }
        className="flex-row items-center justify-between py-4  bg-white"
      >
        <View className="flex-row items-center gap-3">
          <View className="w-11 h-11 rounded-full items-center justify-center 0">
            <Avatar
              imageUrl={item.profile.pictureUrl as string}
              name={`${item.profile.firstName} ${item.profile.lastName}`}
            />
          </View>
          <View>
            <Text
              className="text-base font-semibold text-gray-900"
              numberOfLines={1}
            >
              {item.profile.firstName} {item.profile.lastName}
            </Text>

            <LocationText location={item.profile.location} />
            {item.mutualConnections > 0 && (
              <Text className="text-sm font-medium  text-azure-radiance-500 mt-1">
                {item.mutualConnections} mutual connections
              </Text>
            )}
          </View>
        </View>
      </Pressable>
      <Pressable
        onPress={handleSendConnectionRequest}
        disabled={isSending || isAccepting}
        className="px-4 py-2 flex-row items-center gap-2 rounded-lg bg-azure-radiance-50 border border-azure-radiance-200"
      >
        {isSending || isAccepting ? (
          <ActivityIndicator size="small" color="#3b82f6" />
        ) : (
          <>
            <Ionicons
              name={
                isConnected
                  ? "chatbubble"
                  : receiverIsUser
                    ? "checkmark"
                    : requestSent
                      ? "time"
                      : "person-add"
              }
              size={12}
              color="#3B82F6"
            />
            <Text className="text-sm font-medium  text-azure-radiance-500">
              {isConnected
                ? "Message"
                : receiverIsUser
                  ? "Accept"
                  : requestSent
                    ? "Pending"
                    : "Connect"}
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

export default SearchSuggestionUserCard;
