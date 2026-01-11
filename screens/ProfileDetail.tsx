import ProfileDetailContent from "@/sections/profile/ProfileDetailContent";
import { useLocalSearchParams } from "expo-router";
import React from "react";

function ProfileDetailScreen() {
  const params = useLocalSearchParams();
  const userId = typeof params.id === "string" ? params.id : undefined;
  return <ProfileDetailContent userId={userId} />;
}

export default ProfileDetailScreen;
