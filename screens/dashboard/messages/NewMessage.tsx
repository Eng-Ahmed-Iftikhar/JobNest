import { useCreateChatMutation } from "@/api/services/chatApi";
import { useLazyGetMeConnectionsQuery } from "@/api/services/connectionApi";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import ContactSuggestItem from "@/sections/new-message/ContactSuggestItem";
import NewMessageHeader from "@/sections/new-message/NewMessageHeader";
import SelectUsers from "@/sections/new-message/SelectUsers";
import SendActions from "@/sections/new-message/SendActions";
import { showErrorAlert } from "@/store/reducers/alertSlice";
import { addMessage, selectChats } from "@/store/reducers/chatSlice";
import { selectConnections } from "@/store/reducers/connectionSlice";
import { selectUser } from "@/store/reducers/userSlice";
import { CreateChatRequest } from "@/types/api/chat";
import {
  Chat,
  CHAT_MESSAGE_STATUS,
  CHAT_MESSAGE_TYPE,
  CHAT_TYPE,
} from "@/types/chat";
import { Connection } from "@/types/connection";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, View } from "react-native";

let PAGE_SIZE = 20;
function NewMessageScreen() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const chats = useAppSelector(selectChats);
  const connections = useAppSelector(selectConnections);
  const [page, setPage] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [trigger, { data: dataResponse }] = useLazyGetMeConnectionsQuery();
  const user = useAppSelector(selectUser);
  const [createChat, { isLoading: creatingChat }] = useCreateChatMutation();
  const [selectedUsers, setSelectedUsers] = useState<
    { id: string; firstName: string; lastName: string; pictureUrl: string }[]
  >([]);

  const onSelectContact = useCallback(
    (item: Connection) => {
      const isSender = item.connectionRequest?.senderId === user?.id;
      const contactUser = isSender
        ? item.connectionRequest?.receiver
        : item.connectionRequest?.sender;
      if (!contactUser) return;
      const isAlreadySelected = selectedUsers.some(
        (user) => user.id === contactUser.profile.userId,
      );
      if (!isAlreadySelected) {
        setSelectedUsers((prevUsers) => [
          ...prevUsers,
          {
            id: contactUser.profile.userId,
            firstName: contactUser.profile.firstName,
            lastName: contactUser.profile.lastName,
            pictureUrl: contactUser.profile.pictureUrl || "",
          },
        ]);
      }
    },
    [selectedUsers, user],
  );

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== userId),
    );
  };

  const handleCreateChat = useCallback(async () => {
    const createChatPayload: CreateChatRequest = {
      userIds: selectedUsers.map((user) => user.id),
      type: selectedUsers.length > 1 ? CHAT_TYPE.GROUP : CHAT_TYPE.PRIVATE,
      ...(selectedUsers.length > 1 && { groupName: "untitled" }),
    };
    const response = await createChat(createChatPayload).unwrap();
    return response;
  }, [selectedUsers, createChat]);

  const handleExistingChat = useCallback(async () => {
    let newChat: Chat | null = null;
    if (selectedUsers.length === 1) {
      const chat = chats.find(
        (c) =>
          c.users.find((chatUser) => chatUser.userId === selectedUsers[0].id) &&
          c.type === CHAT_TYPE.PRIVATE,
      );

      newChat = chat as Chat;
    }
    return newChat;
  }, [selectedUsers, chats]);

  const handleSendMessage = useCallback(
    async (message: string) => {
      try {
        const newMessage = {
          id: Math.random().toString(36).substring(7),
          text: message,
          messageType: CHAT_MESSAGE_TYPE.TEXT,
          createdAt: new Date(),
          status: CHAT_MESSAGE_STATUS.PENDING,
          chatId: "",
          senderId: "",
        };
        const chat = await handleExistingChat();
        if (chat) {
          Object.assign(newMessage, {
            chatId: chat.id,
            senderId: chat.users.find((u) => u.userId === user?.id)?.id || "",
          });
          router.push({
            pathname: "/messages/chat",
            params: { id: chat.id },
          });
          dispatch(addMessage(newMessage));
          return;
        }

        const response = await handleCreateChat();
        const chatId = response.id;
        Object.assign(newMessage, {
          chatId: chatId,
          senderId: response.users.find((u) => u.userId === user?.id)?.id || "",
        });
        dispatch(addMessage(newMessage));
        router.push({ pathname: "/messages/chat", params: { id: chatId } });
      } catch (error) {
        console.log(error);

        dispatch(showErrorAlert("Failed to create chat. Please try again."));
      }
    },
    [handleExistingChat, handleCreateChat, dispatch, router, user],
  );

  const handleSelectImage = useCallback(
    async (image: { uri: string; type: string; name: string }) => {
      try {
        const newChat = await handleExistingChat();
        const newMessage = {
          id: Math.random().toString(36).substring(7),
          file: image,
          messageType: CHAT_MESSAGE_TYPE.IMAGE,
          createdAt: new Date(),
          status: CHAT_MESSAGE_STATUS.PENDING,
          chatId: newChat?.id || "",
          senderId: newChat?.users.find((u) => u.userId === user?.id)?.id || "",
        };

        if (newChat) {
          router.push({
            pathname: "/messages/chat",
            params: { id: newChat.id },
          });
          dispatch(addMessage(newMessage));

          return;
        }

        const response = await handleCreateChat();
        Object.assign(newMessage, {
          chatId: response.id,
          senderId: response.users.find((u) => u.userId === user?.id)?.id || "",
        });

        dispatch(addMessage(newMessage));
      } catch (error) {
        console.log(error);
        dispatch(showErrorAlert("Failed to create chat. Please try again."));
      }
    },
    [handleExistingChat, handleCreateChat, dispatch, user, router],
  );

  const handleSelectFile = useCallback(
    async (file: { uri: string; type: string; name: string }) => {
      try {
        const newMessage = {
          id: Math.random().toString(36).substring(7),
          file,
          messageType: CHAT_MESSAGE_TYPE.FILE,
          createdAt: new Date(),
          status: CHAT_MESSAGE_STATUS.PENDING,
          senderId: "",
          chatId: "",
        };
        const newChat = await handleExistingChat();

        if (newChat) {
          Object.assign(newMessage, {
            chatId: newChat.id,
            senderId:
              newChat.users.find((u) => u.userId === user?.id)?.id || "",
          });
          router.push({
            pathname: "/messages/chat",
            params: { id: newChat.id },
          });
          dispatch(addMessage(newMessage));
          return;
        }

        const response = await handleCreateChat();
        Object.assign(newMessage, {
          chatId: response.id,
          senderId: response.users.find((u) => u.userId === user?.id)?.id || "",
        });

        dispatch(addMessage(newMessage));
      } catch (error) {
        console.log(error);
        dispatch(showErrorAlert("Failed to create chat. Please try again."));
      }
    },
    [handleExistingChat, handleCreateChat, dispatch, router, user],
  );
  const dataPage = dataResponse?.page || 1;
  const dataTotal = dataResponse?.total || 0;
  const dataPageSize = dataResponse?.pageSize || PAGE_SIZE;

  const handleReachedEnd = useCallback(() => {
    if (dataPage * dataPageSize >= dataTotal) {
      setPage((prev) => prev + 1);
    }
  }, [dataPage, dataPageSize, dataTotal]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setPage(1);
  }, []);

  useEffect(() => {
    trigger({ params: { page, pageSize: PAGE_SIZE, search } }).then(() => {
      setIsRefreshing(false);
    });
  }, [page, search, trigger]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 100}
    >
      <NewMessageHeader />
      <View className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black">
        <SelectUsers
          onSearchChange={setSearch}
          selectedUsers={selectedUsers}
          onRemoveUser={handleRemoveUser}
        />
      </View>

      <FlatList
        data={connections}
        keyExtractor={(item) => item.id}
        refreshing={isRefreshing}
        renderItem={({ item }) => (
          <ContactSuggestItem
            item={item}
            onPress={() => onSelectContact(item)}
          />
        )}
        onRefresh={handleRefresh}
        onEndReached={handleReachedEnd}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
      <SendActions
        loading={creatingChat}
        onSelectImage={handleSelectImage}
        onAttachFile={handleSelectFile}
        onSendMessage={handleSendMessage}
      />
    </KeyboardAvoidingView>
  );
}
export default NewMessageScreen;
