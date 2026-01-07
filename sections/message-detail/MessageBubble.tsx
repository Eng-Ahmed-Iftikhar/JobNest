import {
  useCreateChatMessageMutation,
  useUpdateMessageStatusMutation,
} from "@/api/services/chatApi";
import { useUploadFileMutation } from "@/api/services/fileApi";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import useChat from "@/hooks/useChat";

import { selectUser } from "@/store/reducers/userSlice";
import { CHAT_MESSAGE_STATUS, ChatMessage } from "@/types/chat";
import { Ionicons } from "@expo/vector-icons";
import { usePathname } from "expo-router";
import moment from "moment";
import { useCallback, useEffect, useRef } from "react";
import { Image, Text, View } from "react-native";
import Message from "./Message";

type MessageBubbleProps = {
  message: ChatMessage;
};

const MessageBubble = ({ message }: MessageBubbleProps) => {
  // All hooks must be called unconditionally, before any return
  const user = useAppSelector(selectUser);
  const pathname = usePathname();
  const { chatUsers = [], currentChatUser } = useChat(message.chatId);

  const [updateMessageStatus] = useUpdateMessageStatusMutation();

  const statusControllerRef = useRef<AbortController | null>(null);

  const hasStatusRef = useRef(false);

  const isOwn = message?.senderId === currentChatUser?.id;
  const pictureUrl = currentChatUser?.user.profile.pictureUrl || "";

  // Seen/received logic
  const receivedUsers =
    message?.userStatuses?.filter((status) => status.receivedAt) || [];
  const seenUsers =
    message?.userStatuses?.filter((status) => status.seenAt) || [];

  const chatUserWithoutSender = chatUsers.filter(
    (chatUser) => chatUser.id !== message?.senderId
  );
  const isSeenByAllOthers = chatUserWithoutSender.length === seenUsers.length;

  const userStatus = message?.userStatuses?.find(
    (status) =>
      status.userId === user?.id && status.receivedAt && !status.seenAt
  );

  const handleMessageSeenStatusUpdate = useCallback(async () => {
    if (!userStatus) return;
    if (hasStatusRef.current) return;
    if (isOwn) return;
    hasStatusRef.current = true;

    statusControllerRef.current?.abort();
    statusControllerRef.current = new AbortController();
    try {
      const now = new Date();
      await updateMessageStatus({
        statusId: userStatus.id,
        seenAt: now,
        signal: statusControllerRef.current?.signal,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update message seen status", error);
    }
  }, [userStatus, updateMessageStatus, isOwn]);

  useEffect(() => {
    if (pathname !== `/messages/chat`) return;

    hasStatusRef.current = false;
    handleMessageSeenStatusUpdate();
  }, [handleMessageSeenStatusUpdate, userStatus?.id, pathname]);
  if (!message) {
    return null;
  }
  return (
    <View
      style={{
        marginBottom: 12,
        gap: 8,
        flexDirection: isOwn ? "row-reverse" : "row",
      }}
    >
      {/* Avatar */}
      <Image
        source={{ uri: pictureUrl }}
        style={{ width: 32, height: 32, borderRadius: 16, marginHorizontal: 4 }}
      />
      {/* Message bubble */}
      <View>
        <Message message={message} />
        <View
          className={
            `gap-3 flex-row items-center mt-2 ` +
            (isOwn ? "justify-end" : "justify-start")
          }
        >
          <Text className={"text-sm font-medium " + "text-gray-500"}>
            {moment(message?.createdAt).format("hh:mm A")}
          </Text>
          {/* Seen double tick for own messages */}
          {isOwn && (
            <View>
              {message.status === CHAT_MESSAGE_STATUS.PENDING ? (
                <Ionicons name="time" size={14} color="#6B7280" />
              ) : message.status === CHAT_MESSAGE_STATUS.SENT ? (
                <>
                  {receivedUsers.length > 0 ? (
                    <Ionicons
                      name={"checkmark-done"}
                      size={14}
                      color={isSeenByAllOthers ? "#1eadff" : "gray"}
                    />
                  ) : (
                    <Ionicons name="checkmark" size={14} color="#6B7280" />
                  )}
                </>
              ) : null}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default MessageBubble;
