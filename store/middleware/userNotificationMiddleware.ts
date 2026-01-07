import { authApi } from "@/api/services/authApi";
import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../reducers/notificationSlice";
import { chatApi } from "@/api/services/chatApi";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
export const userNotificationMiddleware = createListenerMiddleware();

const unReadNotifications: string[] = [];

// listen to me matchfilled to show welcome back notification
userNotificationMiddleware.startListening({
  matcher: authApi.endpoints.me.matchFulfilled,
  effect: async (action, listenerApi) => {
    if (action.payload.profile.role !== "EMPLOYEE") {
      listenerApi.dispatch(
        showErrorNotification("Access denied: Unauthorized role")
      );
      return;
    }
    await listenerApi
      .dispatch(chatApi.endpoints.getAllUnreadMessage.initiate())
      .unwrap();
  },
});

// Listen to logout success
userNotificationMiddleware.startListening({
  matcher: authApi.endpoints.logout.matchFulfilled,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(showSuccessNotification("Logged out successfully"));
  },
});

// Listen to createChatMessage success
userNotificationMiddleware.startListening({
  matcher: chatApi.endpoints.getAllUnreadMessage.matchFulfilled,
  effect: async (action, listenerApi) => {
    const unreadMessages = action.payload;

    if (Array.isArray(unreadMessages) && unreadMessages.length > 0) {
      // Show app-level notification for unread messages
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "New Unread Message",
          body: `You have ${unreadMessages.length} unread message${unreadMessages.length > 1 ? "s" : ""}.`,
          sound: "default",
        },
        trigger: null,
      });
      unReadNotifications.push(notificationId);
    }
  },
});

Notifications.addNotificationResponseReceivedListener((response) => {
  if (unReadNotifications.includes(response.notification.request.identifier)) {
    // redirect to messages screen
    router.push("/messages");
    //dismiss the notification
    Notifications.dismissNotificationAsync(
      response.notification.request.identifier
    );
  }
});
