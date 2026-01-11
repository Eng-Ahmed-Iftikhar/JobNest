import CompanyDetailContent from "@/sections/company/CompanyDetailContent";
import React from "react";
import { View } from "react-native";

export default function CompanyDetailScreen() {
  return (
    <View className="flex-1 bg-white dark:bg-black">
      <CompanyDetailContent />
    </View>
  );
}
