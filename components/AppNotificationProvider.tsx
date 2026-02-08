import { initAppNotification } from "@/store/middleware/appNotificationMiddleware";
import { useEffect } from "react";

function AppNotificationProvider() {
  useEffect(() => {
    const cleanup = initAppNotification();
    return () => {
      // Cleanup if needed when the component unmounts
      cleanup.remove();
    };
  }, []);

  return null;
}

export default AppNotificationProvider;
