import { SocketProvider } from "@/contexts/socketContext";
import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import { useAppNotificationSetup } from "@/utils/useAppNotificationSetup";
import React from "react";

function Layout() {
  useAppNotificationSetup();
  return (
    <SocketProvider>
      <DashboardLayout />
    </SocketProvider>
  );
}

export default Layout;
