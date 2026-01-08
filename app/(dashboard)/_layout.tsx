import DashboardLayout from "@/layouts/dashboard/DashboardLayout";
import { useAppNotificationSetup } from "@/utils/useAppNotificationSetup";
import React from "react";

function Layout() {
  useAppNotificationSetup();
  return <DashboardLayout />;
}

export default Layout;
