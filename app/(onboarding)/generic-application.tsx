import React from "react";
import { View } from "react-native";
import GenericApplicationForm from "@/sections/onboarding/generic-application/GenericApplicationForm";

function GenericApplicationScreen() {
  return (
    <View className="flex-1 px-4 bg-white">
      <GenericApplicationForm />
    </View>
  );
}

export default GenericApplicationScreen;
