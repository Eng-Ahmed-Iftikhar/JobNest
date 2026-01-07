import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import useChat from "@/hooks/useChat";
import BlockedChat from "@/sections/message-detail/BlockedChat";
import DeletedGroup from "@/sections/message-detail/DeletedGroup";
import MessageDetailBody from "@/sections/message-detail/MessageDetailBody";
import MessageDetailHeader from "@/sections/message-detail/MessageDetailHeader";
import SendActions from "@/sections/new-message/SendActions";
import { addMessage } from "@/store/reducers/chatSlice";
import { selectUser } from "@/store/reducers/userSlice";
import { CreateChatMessageRequest } from "@/types/api/chat";
import {
  CHAT_MESSAGE_STATUS,
  CHAT_MESSAGE_TYPE,
  ChatMessageFile,
} from "@/types/chat";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
} from "react-native";

type MessagePayload = CreateChatMessageRequest & {
  id: string;
  createdAt: Date;
  status: CHAT_MESSAGE_STATUS;
  chatId: string;
  file?: ChatMessageFile;
};

function ChatDetailScreen() {
  const param = useLocalSearchParams();
  const user = useAppSelector(selectUser);
  const id = typeof param.id === "string" ? param.id : "";
  const dispatch = useAppDispatch();
  const { chat, chatGroup, currentChatUser } = useChat(id);
  const blockedUser = chat?.blocks?.find(
    (block) => block.chatUserId !== currentChatUser?.id && !block.deletedAt
  );

  const youBlockedChat = useMemo(() => {
    if (chatGroup) return false;
    return Boolean(blockedUser);
  }, [blockedUser, chatGroup]);

  const chatGroupDeleted = useMemo(() => {
    if (!chatGroup) return false;
    return Boolean(chatGroup.deletedAt);
  }, [chatGroup]);

  const handleSendMessage = useCallback(
    (text: string) => {
      const newMessage: MessagePayload = {
        id: Math.random().toString(36).substring(7),
        text,
        messageType: CHAT_MESSAGE_TYPE.TEXT,
        createdAt: new Date(),
        status: CHAT_MESSAGE_STATUS.PENDING,
        chatId: id,
        senderId: currentChatUser?.id || "",
      };
      dispatch(addMessage(newMessage));
    },
    [dispatch, id, currentChatUser]
  );

  const handleSelectImage = useCallback(
    async (image: { uri: string; type: string; name: string }) => {
      const newMessage: MessagePayload = {
        id: Math.random().toString(36).substring(7),
        file: image,
        messageType: CHAT_MESSAGE_TYPE.IMAGE,
        createdAt: new Date(),
        status: CHAT_MESSAGE_STATUS.PENDING,
        chatId: id,
        senderId: currentChatUser?.id || "",
      };

      dispatch(addMessage(newMessage));
    },
    [dispatch, id, currentChatUser]
  );

  const handleSelectFile = useCallback(
    async (file: { uri: string; type: string; name: string }) => {
      const newMessage: MessagePayload = {
        id: Math.random().toString(36).substring(7),
        file,
        messageType: CHAT_MESSAGE_TYPE.FILE,
        createdAt: new Date(),
        status: CHAT_MESSAGE_STATUS.PENDING,
        chatId: id,
        senderId: currentChatUser?.id || "",
      };

      dispatch(addMessage(newMessage));
    },
    [dispatch, id, currentChatUser]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 100}
      >
        <MessageDetailHeader />
        <MessageDetailBody />
        {youBlockedChat ? (
          <BlockedChat />
        ) : chatGroupDeleted ? (
          <DeletedGroup />
        ) : (
          <SendActions
            onSendMessage={handleSendMessage}
            onSelectImage={handleSelectImage}
            onAttachFile={handleSelectFile}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default ChatDetailScreen;
