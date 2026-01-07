import React from "react";
import { View } from "react-native";
import CompanyDetailContent from "@/sections/company/CompanyDetailContent";

export default function CompanyDetailScreen() {
  return (
    <View className="flex-1 bg-white">
      <CompanyDetailContent />
    </View>
  );
}
