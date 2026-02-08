import {
  NOTIFICATION_TYPE,
  Notification as NotificationType,
} from "@/types/notification";
import React from "react";
import ConnectionNotification from "./ConnectionNotification";
import InterviewNotification from "./InterviewNotification";

type Props = {
  notification: NotificationType;
};

function Notification({ notification }: Props) {
  switch (notification.type) {
    case NOTIFICATION_TYPE.INTERVIEW:
      return <InterviewNotification notification={notification} />;
    case NOTIFICATION_TYPE.CONNECTION:
      return <ConnectionNotification notification={notification} />;
    default:
      return null;
  }
}

export default Notification;
