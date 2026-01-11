import UploadCVForm from "@/sections/onboarding/UploadCVForm";
import React from "react";
import { View } from "react-native";

function UploadCVScreen() {
  return (
    <View className="flex-1 px-6 bg-white dark:bg-black">
      <UploadCVForm />
    </View>
  );
}

export default UploadCVScreen;
