import React from "react";
import ProfileDetailScreen from "@/screens/ProfileDetail";
import { useLocalSearchParams } from "expo-router";

export default function ProfileDetailRoute() {
  const params = useLocalSearchParams();
  const userId = typeof params.id === "string" ? params.id : undefined;

  return <ProfileDetailScreen />;
}
