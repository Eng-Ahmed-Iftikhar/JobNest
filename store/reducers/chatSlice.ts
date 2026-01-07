import { chatApi } from "@/api/services/chatApi";
import { GetChatsResponse, GetMessagesResponse } from "@/types/api/chat";
import { Chat, ChatGroup, ChatMessage } from "@/types/chat";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import _, { update } from "lodash";
import { RootState } from ".";
import moment from "moment";

// Enable Map/Set support for Immer (required for Map usage in state)
enableMapSet();

// Define the initial state for the UI slice
interface ChatState {
  chats: Chat[];
  newMessages: ChatMessage[];
}

const initialState: ChatState = {
  chats: [],
  newMessages: [],
};

const chatSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<ChatMessage>) {
      const message = action.payload;
      const chatIndex = state.chats.findIndex(
        (chat) => chat.id === message.chatId
      );
      if (chatIndex !== -1) {
        const chat = state.chats[chatIndex];
        // Update messagesWithDates
        const messageDate = moment(message.createdAt);
        const messagesWithDates = chat.messagesWithDates || [];
        let dateGroup = messagesWithDates.find((mg) =>
          moment(mg.date).isSame(messageDate, "day")
        );
        if (!dateGroup) {
          dateGroup = { date: messageDate.toDate(), data: [] };
          messagesWithDates.push(dateGroup);
        }
        dateGroup.data.push(message);
        // Sort messages in the date group
        dateGroup.data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // Sort messagesWithDates by date
        messagesWithDates.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        state.chats[chatIndex] = {
          ...chat,
          messagesWithDates,
        };
      }
    },
    addUnreadCount(
      state,
      action: PayloadAction<{ chatId: string; senderId: string }>
    ) {
      const { chatId, senderId } = action.payload;
      const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
      if (chatIndex !== -1) {
        const chat = state.chats[chatIndex];
        const unseenCounts = chat.unseenMessageCounts || [];
        const countEntry = unseenCounts.find(
          (count) => count.senderId === senderId
        );
        if (countEntry) {
          countEntry.count += 1;
        } else {
          unseenCounts.push({ senderId, count: 1 });
        }
        state.chats[chatIndex] = {
          ...chat,
          unseenMessageCounts: unseenCounts,
        };
      }
    },
    upsertMessage(state, action: PayloadAction<ChatMessage>) {
      const message = action.payload;
      const chatIndex = state.chats.findIndex(
        (chat) => chat.id === message.chatId
      );
      if (chatIndex !== -1) {
        const chat = state.chats[chatIndex];
        // Update messagesWithDates
        const messagesWithDates = chat.messagesWithDates || [];
        const messageDate = moment(message.createdAt).toDate();
        let dateGroupIndex = messagesWithDates.findIndex((mg) =>
          moment(mg.date).isSame(messageDate, "day")
        );
        if (dateGroupIndex === -1) {
          const dateGroup = { date: messageDate, data: [] };
          messagesWithDates.push(dateGroup);
        }

        const messageIndex = messagesWithDates[dateGroupIndex].data.findIndex(
          (m) => m.id === message.id
        );
        if (messageIndex !== -1) {
          messagesWithDates[dateGroupIndex].data[messageIndex] = message;
        } else {
          messagesWithDates[dateGroupIndex].data.push(message);
        }
        // Sort messages in the date group
        messagesWithDates[dateGroupIndex].data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // Sort messagesWithDates by date
        messagesWithDates.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        state.chats[chatIndex] = {
          ...chat,
          messagesWithDates,
        };
      }
    },
    updateMessage(
      state,
      action: PayloadAction<{ id: string; message: ChatMessage }>
    ) {
      const { id, message } = action.payload;
      const chatId = message.chatId;
      const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
      if (chatIndex !== -1) {
        const chat = state.chats[chatIndex];
        // Update messagesWithDates
        const messagesWithDates = chat.messagesWithDates || [];
        const messageDate = moment(message.createdAt).toDate();

        let dateGroupIndex = messagesWithDates.findIndex((mg) =>
          moment(mg.date).isSame(messageDate, "day")
        );
        if (dateGroupIndex !== -1) {
          const data = messagesWithDates[dateGroupIndex].data || [];
          const messageIndex = data.findIndex((m) => m.id === id);
          if (messageIndex !== -1) {
            data[messageIndex] = message;
          } else {
            data.push(message);
          }

          messagesWithDates[dateGroupIndex]["data"] = data;
        }
        state.chats[chatIndex] = {
          ...chat,
          messagesWithDates,
        };
      }
    },
    removeMessage(state, action: PayloadAction<string>) {
      const messageId = action.payload;
      state.chats.forEach((chat) => {
        chat.messagesWithDates.forEach((dateGroup) => {
          dateGroup.data = dateGroup.data.filter((msg) => msg.id !== messageId);
        });
        // Remove empty date groups
        chat.messagesWithDates = chat.messagesWithDates.filter(
          (dateGroup) => dateGroup.data.length > 0
        );
      });
    },
    setChats(state, action: PayloadAction<GetChatsResponse>) {
      const response = action.payload;
      const page = response.page ?? 1;

      if (page === 1) {
        state.chats = response.data;

        return;
      }
      state.chats = [...state.chats, ...response.data];
    },
    updateChat(state, action: PayloadAction<Chat>) {
      const updatedChat = action.payload;
      const index = state.chats.findIndex((chat) => chat.id === updatedChat.id);
      if (index !== -1) {
        state.chats[index] = {
          ...state.chats[index],
          ...updatedChat,
        };
      }
    },
    addChat(state, action: PayloadAction<Chat>) {
      if (state.chats.find((chat) => chat.id === action.payload.id)) {
        return;
      }
      state.chats.unshift(action.payload);
    },
    removeChat(state, action: PayloadAction<string>) {
      state.chats = state.chats.filter((chat) => chat.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      chatApi.endpoints.createChat.matchFulfilled,
      (state, action) => {
        const newChat = action.payload;

        const exists = state.chats.some((chat) => chat.id === newChat.id);
        if (!exists) {
          state.chats.unshift(newChat);
        }
      }
    );
    builder.addMatcher(
      chatApi.endpoints.getChats.matchFulfilled,
      (state, action) => {
        const response = action.payload;

        const page = response.page ?? 1;
        if (page === 1) {
          state.chats = response.data;

          return;
        }
        state.chats = _.uniqBy([...state.chats, ...response.data], "id");
      }
    );
    builder.addMatcher(
      chatApi.endpoints.getChat.matchFulfilled,
      (state, action) => {
        const chat = action.payload;
        const exists = state.chats.some((c) => c.id === chat.id);
        if (!exists) {
          state.chats.unshift(chat);
        }
      }
    );

    // Update chatGroups on editChatGroup
    builder.addMatcher(
      chatApi.endpoints.editChatGroup.matchFulfilled,
      (state, action) => {
        const updatedGroup = action.payload;
        const chatIndex = state.chats.findIndex(
          (chat) => chat.id === updatedGroup.id
        );
        if (chatIndex !== -1) {
          state.chats[chatIndex] = {
            ...state.chats[chatIndex],
            group: {
              ...state.chats[chatIndex].group,
              ...(updatedGroup as ChatGroup),
            },
          };
        }
      }
    );
    builder.addMatcher(
      chatApi.endpoints.getChatMessages.matchFulfilled,
      (state, action) => {
        const response = action.payload;
        const chatId = response.chatId;
        const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
        if (chatIndex === -1) return;

        const chat = state.chats[chatIndex];
        state.chats[chatIndex] = {
          ...chat,
          messagesWithDates: response.data,
        };
      }
    );
    builder.addMatcher(
      chatApi.endpoints.blockChat.matchFulfilled,
      (state, action) => {
        const blockChat = action.payload;
        const chatId = blockChat.chatId;
        const chatIdx = state.chats.findIndex((chat) => chat.id === chatId);
        if (chatIdx === -1) return;

        const chat = state.chats[chatIdx];
        const blocks = chat.blocks || [];
        const blockIdx = blocks.findIndex((block) => block.id === blockChat.id);
        if (blockIdx !== -1) {
          // Update existing block
          state.chats[chatIdx] = {
            ...chat,
            blocks: blocks.map((block) =>
              block.id === blockChat.id ? blockChat : block
            ),
          };
        } else {
          // Add new block
          state.chats[chatIdx] = {
            ...chat,
            blocks: [...blocks, blockChat],
          };
        }
      }
    );
    builder.addMatcher(
      chatApi.endpoints.unblockChat.matchFulfilled,
      (state, action) => {
        const unblockChat = action.payload;
        const chatId = unblockChat.chatId;
        const chatIdx = state.chats.findIndex((chat) => chat.id === chatId);
        if (chatIdx === -1) return;
        const chat = state.chats[chatIdx];
        state.chats[chatIdx] = {
          ...chat,
          blocks: chat.blocks.map((block) =>
            block.id === unblockChat.id ? unblockChat : block
          ),
        };
      }
    );
    builder.addMatcher(
      chatApi.endpoints.muteChat.matchFulfilled,
      (state, action) => {
        const chatMute = action.payload;

        const chatId = chatMute.chatId;
        const chatIdx = state.chats.findIndex((chat) => chat.id === chatId);
        if (chatIdx === -1) return;
        const chat = state.chats[chatIdx];
        const mutes = chat.mutes || [];
        const chatMuteIndex = mutes.findIndex(
          (mute) => mute.id === chatMute.id
        );
        if (chatMuteIndex !== -1) {
          // Update existing mute
          state.chats[chatIdx] = {
            ...chat,
            mutes: mutes.map((mute) =>
              mute.id === chatMute.id ? chatMute : mute
            ),
          };
        } else {
          // Add new mute
          state.chats[chatIdx] = {
            ...chat,
            mutes: [...mutes, chatMute],
          };
        }
      }
    );
    builder.addMatcher(
      chatApi.endpoints.unMuteChat.matchFulfilled,
      (state, action) => {
        const unMuteChat = action.payload;
        const chatId = unMuteChat.chatId;
        const chatIdx = state.chats.findIndex((chat) => chat.id === chatId);
        if (chatIdx === -1) return;
        const chat = state.chats[chatIdx];
        state.chats[chatIdx] = {
          ...chat,
          mutes: chat.mutes.filter((mute) => mute.id !== unMuteChat.id),
        };
      }
    );
    builder.addMatcher(
      chatApi.endpoints.deleteChatGroup.matchFulfilled,
      (state, action) => {
        const deletedGroup = action.payload;
        const chats = state.chats;
        const chatIndex = chats.findIndex(
          (chat) => chat.id === deletedGroup.chatId
        );
        if (chatIndex !== -1) {
          state.chats[chatIndex] = {
            ...chats[chatIndex],
            group: {
              ...chats[chatIndex].group,
              ...(deletedGroup as ChatGroup),
            },
          };
        }
      }
    );
    builder.addMatcher(
      chatApi.endpoints.deleteChat.matchFulfilled,
      (state, action) => {
        const chat = action.payload;
        console.log("Deleted chat:", chat);

        state.chats = state.chats.filter((c) => c.id !== chat.chatId);
      }
    );
  },
});

export const {
  setChats,
  updateChat,
  addChat,
  addMessage,
  removeChat,
  removeMessage,
  upsertMessage,
  addUnreadCount,
  updateMessage,
} = chatSlice.actions;

export const selectChats = (state: RootState) => state.chats.chats;

export default chatSlice.reducer;
