import { Ionicons } from "@expo/vector-icons";

export type NotificationType = "interview" | "connection";

export type Notification = {
  id: string;
  type: NotificationType;
  read: boolean;
  companyName?: string;
  companyImage?: string;
  companyColor?: string;
  date?: string;
  userName?: string;
  userColor?: string;
  userIcon?: keyof typeof Ionicons.glyphMap;
};

export type NotificationTabKey = "all" | "invitations";
