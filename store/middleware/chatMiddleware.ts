import { createListenerMiddleware } from "@reduxjs/toolkit";
import { addMessage, updateMessage } from "../reducers/chatSlice";
import { chatApi } from "@/api/services/chatApi";
import { CHAT_MESSAGE_TYPE, CHAT_TYPE } from "@/types/chat";
import { fileApi } from "@/api/services/fileApi";
import { RootState } from "../reducers";

export const chatListenerMiddleware = createListenerMiddleware();

chatListenerMiddleware.startListening({
  actionCreator: addMessage,
  effect: async (action, listenerApi) => {
    const payload = action.payload;

    const state = listenerApi.getState() as RootState;
    const userId = state.user.user?.id || "";
    const chats = state.chats.chats || [];
    const chat = chats.find((c) => c.id === payload.chatId);
    const currentChatUser = chat?.users?.find((cu) => cu.userId === userId);
    const chatUser = chat?.users?.find((cu) => cu.id === payload.senderId);
    const blockedEntry = chat?.blocks?.find(
      (block) => block.chatUserId !== chatUser?.id && !block.deletedAt
    );
    if (
      payload.senderId !== currentChatUser?.id ||
      (blockedEntry && chat?.type === CHAT_TYPE.PRIVATE)
    ) {
      return;
    }
    let url = "";
    if (
      payload.messageType === CHAT_MESSAGE_TYPE.IMAGE ||
      payload.messageType === CHAT_MESSAGE_TYPE.FILE
    ) {
      const formData = new FormData();
      formData.append("file", (payload as any)?.file);
      formData.append("fileType", "image");
      formData.append("folderPath", "profile-images");
      formData.append("customFilename", `profile-${Date.now()}`);
      const fileUploadResponse = await listenerApi
        .dispatch(fileApi.endpoints.uploadFile.initiate(formData))
        .unwrap();
      url = fileUploadResponse.url;
    }

    const result = await listenerApi
      .dispatch(
        chatApi.endpoints.createChatMessage.initiate({
          id: payload.chatId,
          body: {
            senderId: payload.senderId,
            ...(url ? { fileUrl: url } : {}),
            ...(payload.text ? { text: payload.text } : {}),
            messageType: payload.messageType,
          },
        })
      )
      .unwrap();
    listenerApi.dispatch(updateMessage({ id: payload.id, message: result }));
  },
});
