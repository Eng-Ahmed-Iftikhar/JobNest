import React, { Suspense } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppLoader from "@/components/AppLoader";

export default function DashboardTabsLayout() {
  return (
    <Suspense fallback={<AppLoader />}>
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
  );
}
