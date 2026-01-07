import * as Notifications from "expo-notifications";
import { useEffect } from "react";

export function useAppNotificationSetup() {
  useEffect(() => {
    // Set notification handler to show notifications in foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // Request notification permissions on app start
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
    })();
  }, []);
}
