import { selectChats } from "@/store/reducers/chatSlice";
import { selectUser } from "@/store/reducers/userSlice";
import { useMemo } from "react";
import { useAppSelector } from "./useAppSelector";

const useChat = (chatId: string) => {
  const user = useAppSelector(selectUser) || null;

  const chats = useAppSelector(selectChats) || [];

  const chat = useMemo(
    () => chats?.find((ch) => ch?.id === chatId),
    [chats, chatId]
  );

  const chatGroup = chat?.group || null;
  const chatMutes = chat?.mutes || [];
  const chatUsers =
    chat?.users?.filter((chatsUser) => chatsUser.chatId === chatId) || [];
  const chatMembers = chatUsers?.filter(
    (chatsUser) => chatsUser.userId !== user?.id
  );
  const currentChatUser = chatUsers.find(
    (chatsUser) => chatsUser.userId === user?.id
  );

  const chatName = useMemo(() => {
    let name = "N/A";
    if (chatGroup) {
      name = chatGroup.name;
    } else {
      const chatUsersnames = chatMembers.map(
        (chatUser) =>
          chatUser.user.profile.firstName + " " + chatUser.user.profile.lastName
      );
      name = chatUsersnames.join(", ");
    }
    return name;
  }, [chatGroup, chatUsers]);

  const chatIconUrl = useMemo(() => {
    let icon = "";

    if (chatGroup) {
      icon = chatGroup?.iconUrl || "";
    } else {
      const chatUsersPics = chatMembers.map(
        (chatUser) => chatUser.user.profile.pictureUrl || ""
      );
      icon = chatUsersPics?.[0] || "";
    }
    return icon;
  }, [chatGroup, chatUsers]);

  const chatUnseenCounts = chat?.unseenMessageCounts || [];
  const currentUserUnseenCount = chatUnseenCounts.filter(
    (count) => count.senderId !== currentChatUser?.id
  );

  const unreedMessagesCount = useMemo(() => {
    if (!chat) return 0;
    return currentUserUnseenCount.reduce((acc, count) => acc + count.count, 0);
  }, [chat]);

  return {
    chatGroup,
    chatUsers,
    currentChatUser,
    chatMembers,
    chatName,
    chatIconUrl,
    chat,
    unreedMessagesCount,
    chatMutes,
  };
};

export default useChat;
