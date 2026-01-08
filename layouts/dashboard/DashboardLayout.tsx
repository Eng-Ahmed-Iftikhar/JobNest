import AppLoader from "@/components/AppLoader";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  selectIsLoggedIn,
  selectUser,
  selectUserProfile,
} from "@/store/reducers/userSlice";
import { Redirect, Slot } from "expo-router";
import React, { Suspense } from "react";

function DashboardLayout() {
  const user = useAppSelector(selectUser);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const userProfile = useAppSelector(selectUserProfile);

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  } else if (user && !user.email.isVerified) {
    return <Redirect href="/(profile)/verify-email" />;
  } else if (userProfile && !userProfile.isOnboarded) {
    return <Redirect href="/(onboarding)" />;
  }

  return (
    <Suspense fallback={<AppLoader />}>
      <Slot />
    </Suspense>
  );
}

export default DashboardLayout;
