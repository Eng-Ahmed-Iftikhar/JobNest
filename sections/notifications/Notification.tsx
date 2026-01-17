import { Notification as NotificationType } from "@/types/notification";
import React from "react";
import ConnectionNotification from "./ConnectionNotification";
import InterviewNotification from "./InterviewNotification";

type Props = {
  notification: NotificationType;
};

function Notification({ notification }: Props) {
  switch (notification.type) {
    case "interview":
      return <InterviewNotification notification={notification} />;
    case "connection":
      return <ConnectionNotification notification={notification} />;
    default:
      return null;
  }
}

export default Notification;
