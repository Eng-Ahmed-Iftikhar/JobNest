import AppLoader from "@/components/AppLoader";
import { Slot } from "expo-router";
import React, { Suspense } from "react";

function DashboardLayout() {
  return (
    <Suspense fallback={<AppLoader />}>
      <Slot />
    </Suspense>
  );
}

export default DashboardLayout;
