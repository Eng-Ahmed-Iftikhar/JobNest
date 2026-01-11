import AppLoader from "@/components/AppLoader";
import React from "react";
import { Text, View } from "react-native";

function OnboardingIndexScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-lg font-bold dark:bg-black">
        Welcome to the Onboarding Screen
      </Text>
      <AppLoader />
    </View>
  );
}

export default OnboardingIndexScreen;
