import { Notification } from "../notification";

export type GetNotificationsResponse = {
  data: Notification[];
  page: number;
  pageSize: number;
  total: number;
  unreadCount: number;
};

export type GetNotificationsRequest = {
  params: {
    page: number;
    pageSize: number;
  };
};
