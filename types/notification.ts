import { Ionicons } from "@expo/vector-icons";
import { USER_ROLE } from "./user";

// ---- Enums ----
export enum NOTIFICATION_TYPE {
  CONNECTION = "CONNECTION",
  INTERVIEW = "INTERVIEW",
  FOLLOW = "FOLLOW",
  MESSAGE = "MESSAGE",
}
export enum NOTIFICATION_TAB {
  ALL = "ALL",
  INVITATIONS = "INVITATIONS",
}

// ---- Common ----
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// ---- Profile ----
export interface Profile extends BaseEntity {
  userId: string;
  firstName: string;
  lastName: string;
  isOnboarded: boolean;
  role: USER_ROLE;
  locationId: string;
  address: string;
  pictureUrl: string | null;
  bio: string | null;
  resumeUrl: string | null;
}

// ---- User ----
export interface User extends BaseEntity {
  isActive: boolean;
  emailId: string;
  profile: Profile;
}

// ---- Metadata ----
export interface NotificationMetaData {
  senderId: string;
  connectionRequestId: string;
  sender: User;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  texts?: string[];
}

// ---- Notification ----
export interface Notification extends BaseEntity {
  text: string;
  type: NOTIFICATION_TYPE;
  metaData: NotificationMetaData;
  userId: string;
  read: boolean;
  icon: typeof Ionicons;
  imageUrl: string | null;
  podcast: boolean;
  user: User;
}

// ---- API Response ----
export interface NotificationsResponse {
  data: Notification[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  unreadCount: number;
}
