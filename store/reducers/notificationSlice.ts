import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum NotificationType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showSuccessNotification: (state, action: PayloadAction<string>) => {
      const id = Date.now().toString();
      state.notifications.push({
        id,
        type: NotificationType.SUCCESS,
        message: action.payload,
        duration: 3000,
      });
    },
    showErrorNotification: (state, action: PayloadAction<string>) => {
      const id = Date.now().toString();
      state.notifications.push({
        id,
        type: NotificationType.ERROR,
        message: action.payload,
        duration: 4000,
      });
    },
    showWarningNotification: (state, action: PayloadAction<string>) => {
      const id = Date.now().toString();
      state.notifications.push({
        id,
        type: NotificationType.WARNING,
        message: action.payload,
        duration: 3000,
      });
    },
    showInfoNotification: (state, action: PayloadAction<string>) => {
      const id = Date.now().toString();
      state.notifications.push({
        id,
        type: NotificationType.INFO,
        message: action.payload,
        duration: 3000,
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  showSuccessNotification,
  showErrorNotification,
  showWarningNotification,
  showInfoNotification,
  removeNotification,
  clearAllNotifications,
} = notificationSlice.actions;

export const selectNotifications = (state: {
  notification: NotificationState;
}) => state.notification.notifications;
export default notificationSlice.reducer;
