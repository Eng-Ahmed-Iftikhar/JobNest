import {
  useCreateChatMutation,
  useLazyGetChatByUserIdQuery,
} from "@/api/services/chatApi";
import Button from "@/components/ui/Button";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectUser } from "@/store/reducers/userSlice";
import { CreateChatRequest } from "@/types/api/chat";
import { Chat, CHAT_TYPE } from "@/types/chat";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";

function MessageBtn({ userId }: { userId: string }) {
  const [getUserChat, { isLoading: isUserChatLoading }] =
    useLazyGetChatByUserIdQuery();
  const [createChat, { isLoading: isCreatingChat }] = useCreateChatMutation();
  const user = useAppSelector(selectUser);
  const router = useRouter();

  const handleCreateChat = useCallback(async () => {
    if (!user) return;
    const createChatPayload: CreateChatRequest = {
      userIds: [user.id, userId],
      type: CHAT_TYPE.PRIVATE,
    };
    const response = await createChat(createChatPayload).unwrap();
    return response;
  }, [user, userId, createChat]);

  const handleMessage = useCallback(async () => {
    let chat = await getUserChat({ userId }).unwrap();
    if (!chat) {
      chat = (await handleCreateChat()) as Chat;
    }
    router.push({
      pathname: "/messages/chat",
      params: { id: chat.id },
    });
  }, [userId, getUserChat, handleCreateChat, router]);

  return (
    <Button
      onPress={handleMessage}
      disabled={isUserChatLoading || isCreatingChat}
      loading={isUserChatLoading || isCreatingChat}
      variant="outline"
      icon="chatbubble-ellipses-outline"
      className="h-9 text-sm "
      textProps={{
        className: "text-sm text-azure-radiance-500 ",
      }}
    >
      Message
    </Button>
  );
}

export default MessageBtn;
