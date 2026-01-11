import AppLoader from "@/components/AppLoader";
import { SearchProvider } from "@/contexts/SearchContext";
import DashboardHeader from "@/sections/dashboard/Header";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useSegments } from "expo-router";
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
        <Tabs
          initialRouteName="jobs"
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#1eadff",
            tabBarLabelStyle: { fontSize: 11, fontWeight: "bold" },
            tabBarIconStyle: { marginTop: 4 },
          }}
        >
          <Tabs.Screen
            name="jobs"
            options={{
              title: "Jobs",
              tabBarIcon: ({ color }) => (
                <Ionicons name="briefcase" size={20} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="connections"
            options={{
              title: "Connections",
              tabBarIcon: ({ color }) => (
                <Ionicons name="people" size={20} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="messages"
            options={{
              title: "Messages",
              tabBarIcon: ({ color }) => (
                <Ionicons name="chatbubbles" size={20} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="search-suggestions"
            options={{
              title: "Search Suggestions",
              href: null,
            }}
          />
          <Tabs.Screen
            name="job-detail"
            options={{
              title: "Job Details",
              href: null,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              href: null,
            }}
          />
          <Tabs.Screen
            name="profile-detail"
            options={{
              title: "Profile Detail",
              href: null,
            }}
          />
          <Tabs.Screen
            name="company-detail"
            options={{
              title: "Company Detail",
              href: null,
            }}
          />
        </Tabs>
      </Suspense>
    </SearchProvider>
  );
}
