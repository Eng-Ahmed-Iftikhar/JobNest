import OnboardingProvider from "@/contexts/OnboardingContext";
import { useAppSelector } from "@/hooks/useAppSelector";

import OnboardingLayout from "@/sections/onboarding/OnboardingLayout";
import { selectIsLoggedIn } from "@/store/reducers/userSlice";
import { Redirect } from "expo-router";
import React from "react";

function Layout() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  if (!isLoggedIn) {
    return <Redirect href="/(auth)/" />;
  }

  return (
    <OnboardingProvider>
      <OnboardingLayout />
    </OnboardingProvider>
  );
}

export default Layout;
