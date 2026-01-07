import React from "react";
import { View } from "react-native";
import UploadCVForm from "@/sections/onboarding/UploadCVForm";

function UploadCVScreen() {
  return (
    <View className="flex-1 px-6 bg-white">
      <UploadCVForm />
    </View>
  );
}

export default UploadCVScreen;
