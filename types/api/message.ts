import { Ionicons } from "@expo/vector-icons";

export type ContactItem = {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    pictureUrl?: string;
  };
};

export type Message = {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
};

export type ConversationListItem = {
  id: string;
  name: string;
  avatar: string;
  color: string;
  lastMessage: string;
  timestamp: string;
  icon?: keyof typeof Ionicons.glyphMap;
};
