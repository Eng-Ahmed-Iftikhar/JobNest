import AppLoader from "@/components/AppLoader";
import { SearchProvider } from "@/contexts/SearchContext";
import DashboardHeader from "@/sections/dashboard/Header";
import { Slot, useSegments } from "expo-router";
import React, { Suspense } from "react";

export default function TabLayout() {
  const segments = useSegments();
  // Check if current route is search page (not search-suggestions)
  const isSearchPage =
    segments.includes("search") && !segments.includes("search-suggestions");

  return (
    <SearchProvider>
      <Suspense fallback={<AppLoader />}>
        {!isSearchPage && <DashboardHeader />}
        <Slot />
      </Suspense>
    </SearchProvider>
  );
}
