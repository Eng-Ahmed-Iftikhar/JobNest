import { useDeleteChatMutation } from "@/api/services/chatApi";
import ConfirmationButton from "@/components/ConfirmationButton";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import useChat from "@/hooks/useChat";
import { showErrorAlert, showSuccessAlert } from "@/store/reducers/alertSlice";
import { Chat } from "@/types/chat";
import { useRouter } from "expo-router";
import moment from "moment";
import { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import SwipeableItem from "react-native-swipeable-item";
import LastMessage from "./LastMessage";

function ConversationRow({ item }: { item: Chat }) {
  const {
    chat,
    chatName,
    chatIconUrl,
    unreedMessagesCount = 0,
  } = useChat(item?.id);
  const router = useRouter();
  const [deleteChat, { isLoading: deleting }] = useDeleteChatMutation();
  const dispatch = useAppDispatch();

  const chatMessages =
    chat?.messagesWithDates?.flatMap((section) => section.data) || [];
  const sortedMessages = [...chatMessages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  const lastMessage = sortedMessages[sortedMessages.length - 1];

  const handlePress = useCallback(() => {
    router.push({
      pathname: "/messages/chat",
      params: { id: item.id },
    });
  }, [router, item]);

  const handleDeleteChat = useCallback(async () => {
    if (!item?.id) return;
    try {
      await deleteChat(item.id).unwrap();
      dispatch(showSuccessAlert("Chat deleted successfully"));
    } catch (error) {
      console.error("Failed to delete chat:", error);
      dispatch(showErrorAlert("Failed to delete chat"));
    }
  }, [deleteChat, dispatch, item.id]);

  const rightContent = (
    <View className="  h-full pr-2">
      <ConfirmationButton
        onConfirm={handleDeleteChat}
        variant="button"
        buttonProps={{
          loading: deleting,
          className:
            "bg-red-600 h-full  w-[23%] justify-center items-center rounded-none",
          iconColor: "white",
          icon: "trash",
          iconSize: 24,
          text: "",
        }}
        modalProps={{
          title: "Delete Chat",
          message: "Are you sure you want to delete this chat?",
        }}
      />
    </View>
  );

  return (
    <SwipeableItem
      key={item.id}
      item={item}
      overSwipe={60}
      renderUnderlayRight={() => rightContent}
      snapPointsRight={[80]}
    >
      <Pressable
        onPress={handlePress}
        className="flex-row items-center gap-3 px-4 py-3 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-700"
      >
        <Avatar name={chatName} imageUrl={chatIconUrl} />
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text
              className="text-base font-semibold text-gray-900 dark:text-gray-100"
              numberOfLines={1}
            >
              {chatName}
            </Text>
            {unreedMessagesCount > 0 && <Badge count={unreedMessagesCount} />}
          </View>

          <LastMessage chatId={item?.id} lastMessage={lastMessage} />
        </View>
        <Text className="text-sm font-medium text-gray-500 dark:text-gray-200">
          {lastMessage ? moment(lastMessage.createdAt).format("hh:mm A") : ""}
        </Text>
      </Pressable>
    </SwipeableItem>
  );
}

export default ConversationRow;
