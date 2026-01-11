import GeneralInfoForm from "@/sections/onboarding/GeneralInfoForm";
import React from "react";
import { ScrollView, View } from "react-native";

function GeneralInfoScreen() {
  return (
    <ScrollView className="flex-1 bg-white dark:bg-black px-4">
      <View className="flex-1 mt-12">
        <GeneralInfoForm />
      </View>
    </ScrollView>
  );
}

export default GeneralInfoScreen;
