// Edit Chat Group
export interface EditChatGroupRequest {
  name?: string;
  description?: string;
  iconUrl?: string;
}

export interface EditChatGroupResponse {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  // Add other fields as needed
}
import {
  Chat,
  CHAT_MESSAGE_TYPE,
  CHAT_TYPE,
  ChatGroup,
  ChatMessage,
  ChatMessagesByDate,
  ChatUser,
} from "../chat";

export type GetMessagesResponse = {
  data: ChatMessage[];
  page: number;
  pageSize: number;
  total: number;
};

export type GetChatsResponse = {
  data: Chat[];
  page: number;
  pageSize: number;
  total: number;
};

export type GetChatMessagesResponse = {
  data: ChatMessagesByDate[];
  page: number;
  chatId: string;
  pageSize: number;
  total: number;
};

export type GetChatsRequest = {
  page: number;
  pageSize: number;
  search: string;
};

export type GetChatMessageRequest = {
  id: string;
  params: {
    page: number;
    pageSize: number;
  };
};

export type CreateChatRequest = {
  type: CHAT_TYPE;
  userIds: string[];
  groupName?: string;
  groupIcon?: string;
};

export type CreateChatMessageRequest = {
  senderId: string;
  text?: string | null;
  fileUrl?: string | null;
  messageType: CHAT_MESSAGE_TYPE;
};
