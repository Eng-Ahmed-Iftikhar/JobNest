import VerifyEmailForm from "@/sections/auth/verify-email/VerifyEmailForm";
import VerifyEmailHeader from "@/sections/auth/verify-email/VerifyEmailHeader";
import React from "react";
import { ScrollView, View } from "react-native";

function VerifyEmailScreen() {
  return (
    <ScrollView className="flex-1  bg-white px-4">
      <View className="flex-1 mt-12">
        <VerifyEmailHeader />
        <VerifyEmailForm />
      </View>
    </ScrollView>
  );
}

export default VerifyEmailScreen;
