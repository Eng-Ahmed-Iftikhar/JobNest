import * as Notifications from "expo-notifications";
import { router } from "expo-router";

export const initAppNotification = () => {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const notificationId = response.notification.request.identifier;

    const chatNotificationId = response.notification.request.content.data
      ?.chatId as string | undefined;

    if (chatNotificationId) {
      try {
        router.push({
          pathname: "/messages/chat",
          params: { id: chatNotificationId },
        });
      } finally {
        Notifications.dismissNotificationAsync(notificationId);
      }
    }
  });
};
