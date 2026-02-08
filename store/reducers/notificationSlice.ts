import { notificationApi } from "@/api/services/notificationApi";
import { Notification } from "@/types/notification";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as Notifications from "expo-notifications";

import { RootState } from ".";

// Define the initial state for the UI slice
interface NotificationState {
  notifications: Notification[];
  appNotifications: Notifications.Notification[];
  unreadCount?: number;
}

const initialState: NotificationState = {
  notifications: [],
  appNotifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    addAppNotification: (
      state,
      action: PayloadAction<Notifications.Notification>,
    ) => {
      state.appNotifications.push(action.payload);
    },
    removeAppNotification: (state, action: PayloadAction<string>) => {
      state.appNotifications = state.appNotifications.filter(
        (notification) => notification.request.identifier !== action.payload,
      );
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload,
      );
    },
    updateNotification: (
      state,
      action: PayloadAction<{
        id: string;
        notification: Partial<Notification>;
      }>,
    ) => {
      const { id, notification } = action.payload;
      const index = state.notifications.findIndex(
        (notification) => notification.id === id,
      );
      if (index !== -1) {
        state.notifications[index] = {
          ...state.notifications[index],
          ...notification,
        };
      }
    },
    updateUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    // You can add extra reducers here if needed
    builder.addMatcher(
      notificationApi.endpoints.getNotifications.matchFulfilled,
      (state, action) => {
        const payload = action.payload;
        const page = payload.page;
        state.unreadCount = payload.unreadCount;
        if (page && page === 1) {
          state.notifications = payload.data;

          return;
        }
        state.notifications = [...state.notifications, ...payload.data];
      },
    );
  },
});

export const {
  addNotification,
  removeNotification,
  updateNotification,
  updateUnreadCount,
} = notificationSlice.actions;

export const selectNotifications = (state: RootState) =>
  state.notification.notifications;
export const selectUnreadNotificationCount = (state: RootState) =>
  state.notification.unreadCount;

export default notificationSlice.reducer;
