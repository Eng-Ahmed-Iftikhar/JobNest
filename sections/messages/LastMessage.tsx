import useChat from "@/hooks/useChat";
import {
  CHAT_MESSAGE_STATUS,
  CHAT_MESSAGE_TYPE,
  ChatMessage,
} from "@/types/chat";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

function LastMessage({
  lastMessage,
  chatId,
}: {
  lastMessage: ChatMessage;
  chatId: string;
}) {
  const { chatGroup, chatUsers = [], currentChatUser } = useChat(chatId);

  if (!lastMessage) {
    return (
      <Text className="text-sm font-medium text-gray-500 dark:text-gray-300">
        No messages yet.
      </Text>
    );
  }
  const isOwn = lastMessage.senderId === currentChatUser?.id;
  const chatUserWithoutSender = chatUsers.filter(
    (chatUser) => chatUser.id !== lastMessage?.senderId
  );
  const receivedUsers =
    lastMessage?.userStatuses?.filter((status) => status.receivedAt) || [];
  const seenUsers =
    lastMessage?.userStatuses?.filter((status) => status.seenAt) || [];

  const isSeen = chatUserWithoutSender.length === seenUsers.length;

  const currentUserInChat = chatUsers.find(
    (userInChat) => userInChat.id === lastMessage.senderId
  );

  const Icon = (
    <Ionicons
      name={
        lastMessage.status === CHAT_MESSAGE_STATUS.PENDING
          ? "time"
          : lastMessage.status === CHAT_MESSAGE_STATUS.SENT
          ? receivedUsers?.length > 0
            ? "checkmark-done"
            : "checkmark"
          : "checkmark"
      }
      size={16}
      color={isSeen ? "#1eadff" : "#9CA3AF"}
    />
  );
  if (lastMessage.messageType === CHAT_MESSAGE_TYPE.TEXT) {
    return (
      <View className="flex-row items-center gap-2">
        {isOwn && Icon}
        {chatGroup && (
          <Text className="text-sm ">
            {isOwn
              ? "me"
              : currentUserInChat?.user.profile.firstName +
                " " +
                currentUserInChat?.user.profile.lastName}
            {":"}
          </Text>
        )}
        <Text
          className="text-sm font-medium text-gray-500 dark:text-gray-200"
          numberOfLines={1}
        >
          {lastMessage?.text || "No messages yet."}
        </Text>
      </View>
    );
  }
  if (lastMessage.messageType === CHAT_MESSAGE_TYPE.IMAGE) {
    return (
      <View className="flex-row items-center  gap-2">
        {isOwn && Icon}

        {chatGroup && (
          <Text className="text-sm ">
            {isOwn
              ? "me"
              : currentUserInChat?.user.profile.firstName +
                " " +
                currentUserInChat?.user.profile.lastName}
            {":"}
          </Text>
        )}
        <Text className="text-sm font-medium text-gray-500 dark:text-gray-200">
          📷 Photo
        </Text>
      </View>
    );
  }
  return (
    <View className="flex-row items-center gap-2">
      {isOwn && Icon}
      {chatGroup && (
        <Text className="text-sm ">
          {isOwn
            ? "me"
            : currentUserInChat?.user.profile.firstName +
              " " +
              currentUserInChat?.user.profile.lastName}
          {":"}
        </Text>
      )}
      <Text className="text-sm font-medium text-gray-500 dark:text-gray-200">
        📎 File
      </Text>
    </View>
  );
}

export default LastMessage;
