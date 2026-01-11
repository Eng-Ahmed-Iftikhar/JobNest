import GenericApplicationForm from "@/sections/onboarding/generic-application/GenericApplicationForm";
import React from "react";
import { ScrollView, View } from "react-native";

function GenericApplicationScreen() {
  return (
    <ScrollView className="flex-1 bg-white dark:bg-black px-4">
      <View className="flex-1 mt-12">
        <GenericApplicationForm />
      </View>
    </ScrollView>
  );
}

export default GenericApplicationScreen;
