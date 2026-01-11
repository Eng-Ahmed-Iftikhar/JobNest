import ErrorToast from "@/components/ErrorToast";
import SuccessToast from "@/components/SuccessToast";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  disposeSocketNotificationResponseHandler,
  initSocketNotificationResponseHandler,
} from "@/store/middleware/socketMiddleware";
import {
  disposeUserNotificationResponseHandler,
  initUserNotificationResponseHandler,
} from "@/store/middleware/userNotificationMiddleware";
import {
  NotificationType,
  removeNotification,
  selectNotifications,
} from "@/store/reducers/notificationSlice";
import React, { useEffect } from "react";
import { View } from "react-native";

export default function NotificationProvider() {
  const notifications = useAppSelector(selectNotifications);
  const dispatch = useAppDispatch();
  console.log("Notifications:", notifications);

  // Register notification response listeners once
  useEffect(() => {
    initUserNotificationResponseHandler();
    initSocketNotificationResponseHandler();
    return () => {
      disposeUserNotificationResponseHandler();
      disposeSocketNotificationResponseHandler();
    };
  }, []);

  // Auto-remove notifications after their duration
  useEffect(() => {
    if (notifications.length === 0) return;

    const timers = notifications.map((notification) => {
      if (notification.duration) {
        return setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, notification.duration);
      }
      return null;
    });

    return () => {
      // Cleanup timers when notifications change or unmount
      timers.forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [notifications, dispatch]);

  return (
    <View className="absolute flex-1  bottom-0 top-0 left-0 right-0 z-50 pointer-events-none">
      {notifications.map((notification) => {
        if (notification.type === NotificationType.ERROR) {
          return (
            <ErrorToast
              key={notification.id}
              visible={true}
              message={notification.message}
              onClose={() => dispatch(removeNotification(notification.id))}
            />
          );
        }

        if (notification.type === NotificationType.SUCCESS) {
          return (
            <SuccessToast
              key={notification.id}
              visible={true}
              message={notification.message}
              onClose={() => dispatch(removeNotification(notification.id))}
            />
          );
        }

        return null;
      })}
    </View>
  );
}
