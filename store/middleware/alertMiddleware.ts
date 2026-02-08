import { authApi } from "@/api/services/authApi";
import { chatApi } from "@/api/services/chatApi";
import { connectionApi } from "@/api/services/connectionApi";
import { connectionRequestsApi } from "@/api/services/connectionRequestsApi";
import { createListenerMiddleware } from "@reduxjs/toolkit";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { showErrorAlert, showSuccessAlert } from "../reducers/alertSlice";
export const alertMiddleware = createListenerMiddleware();

const unReadAlerts: string[] = [];

// listen to me matchfilled to show welcome back notification
alertMiddleware.startListening({
  matcher: authApi.endpoints.me.matchFulfilled,
  effect: async (action, listenerApi) => {
    if (action.payload.profile.role !== "EMPLOYEE") {
      listenerApi.dispatch(showErrorAlert("Access denied: Unauthorized role"));
      return;
    }
    await listenerApi
      .dispatch(chatApi.endpoints.getAllUnreadMessage.initiate())
      .unwrap();
    await listenerApi
      .dispatch(connectionApi.endpoints.getMeConnectionsCount.initiate())
      .unwrap();
    await listenerApi
      .dispatch(
        connectionRequestsApi.endpoints.getMeConnectionRequestsCount.initiate(),
      )
      .unwrap();
  },
});

// Listen to logout success
alertMiddleware.startListening({
  matcher: authApi.endpoints.logout.matchFulfilled,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(showSuccessAlert("Logged out successfully"));
  },
});

// Listen to createChatMessage success
alertMiddleware.startListening({
  matcher: chatApi.endpoints.getAllUnreadMessage.matchFulfilled,
  effect: async (action, listenerApi) => {
    const unreadMessages = action.payload;

    if (Array.isArray(unreadMessages) && unreadMessages.length > 0) {
      // Show app-level notification for unread messages
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "New Unread Message",
          body: `You have ${unreadMessages.length} unread message${
            unreadMessages.length > 1 ? "s" : ""
          }.`,
          sound: "default",
        },
        trigger: null,
      });
      unReadAlerts.push(notificationId);
    }
  },
});

let alertResponseSubscription: Notifications.Subscription | null = null;

export const initAlertResponseHandler = () => {
  if (alertResponseSubscription) return;
  alertResponseSubscription =
    Notifications.addNotificationResponseReceivedListener((response) => {
      if (unReadAlerts.includes(response.notification.request.identifier)) {
        try {
          router.push("/messages");
        } finally {
          Notifications.dismissNotificationAsync(
            response.notification.request.identifier,
          );
        }
      }
    });
};

export const disposeAlertResponseHandler = () => {
  alertResponseSubscription?.remove();
  alertResponseSubscription = null;
};
