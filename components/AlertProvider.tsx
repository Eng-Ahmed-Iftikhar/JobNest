import ErrorToast from "@/components/ErrorToast";
import SuccessToast from "@/components/SuccessToast";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  disposeAlertResponseHandler,
  initAlertResponseHandler,
} from "@/store/middleware/alertMiddleware";

import {
  AlertType,
  removeAlert,
  selectAlerts,
} from "@/store/reducers/alertSlice";
import React, { useEffect } from "react";
import { View } from "react-native";

export default function NotificationProvider() {
  const alerts = useAppSelector(selectAlerts);
  const dispatch = useAppDispatch();
  console.log("Alerts:", alerts);

  // Register alert response listeners once
  useEffect(() => {
    initAlertResponseHandler();
    return () => {
      disposeAlertResponseHandler();
    };
  }, []);

  // Auto-remove alerts after their duration
  useEffect(() => {
    if (alerts.length === 0) return;

    const timers = alerts.map((alert) => {
      if (alert.duration) {
        return setTimeout(() => {
          dispatch(removeAlert(alert.id));
        }, alert.duration);
      }
      return null;
    });

    return () => {
      // Cleanup timers when notifications change or unmount
      timers.forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [alerts, dispatch]);

  return (
    <View className="absolute flex-1  bottom-0 top-0 left-0 right-0 z-50 pointer-events-none">
      {alerts.map((alert) => {
        if (alert.type === AlertType.ERROR) {
          return (
            <ErrorToast
              key={alert.id}
              visible={true}
              message={alert.message}
              onClose={() => dispatch(removeAlert(alert.id))}
            />
          );
        }

        if (alert.type === AlertType.SUCCESS) {
          return (
            <SuccessToast
              key={alert.id}
              visible={true}
              message={alert.message}
              onClose={() => dispatch(removeAlert(alert.id))}
            />
          );
        }

        return null;
      })}
    </View>
  );
}
