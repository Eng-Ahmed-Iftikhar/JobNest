import GenericApplicationForm from "@/sections/onboarding/generic-application/GenericApplicationForm";
import React from "react";
import { View } from "react-native";

function GenericApplicationScreen() {
  return (
    <View className="flex-1 px-4 bg-white dark:bg-black">
      <GenericApplicationForm />
    </View>
  );
}

export default GenericApplicationScreen;
