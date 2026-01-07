import AppLoader from "@/components/AppLoader";
import { SearchProvider } from "@/contexts/SearchContext";
import { useAppSelector } from "@/hooks/useAppSelector";

import DashboardHeader from "@/sections/dashboard/Header";
import {
  selectIsLoggedIn,
  selectUser,
  selectUserProfile,
} from "@/store/reducers/userSlice";

import { Redirect, Slot, useSegments } from "expo-router";
import React, { Suspense } from "react";

function DashboardLayout() {
  const segments = useSegments();
  const user = useAppSelector(selectUser);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const userProfile = useAppSelector(selectUserProfile);

  // Check if current route is search page (not search-suggestions)
  const isSearchPage =
    segments.includes("search") && !segments.includes("search-suggestions");

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  } else if (user && !user.email.isVerified) {
    return <Redirect href="/(profile)/verify-email" />;
  } else if (userProfile && !userProfile.isOnboarded) {
    return <Redirect href="/(onboarding)/" />;
  }

  return (
    <SearchProvider>
      {!isSearchPage && <DashboardHeader />}
      <Suspense fallback={<AppLoader />}>
        <Slot />
      </Suspense>
    </SearchProvider>
  );
}

export default DashboardLayout;
