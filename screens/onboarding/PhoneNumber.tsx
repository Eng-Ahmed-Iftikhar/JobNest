import React from "react";
import { ScrollView, View } from "react-native";
import PhoneNumberForm from "@/sections/onboarding/PhoneNumberForm";

function PhoneNumberScreen() {

  return (
    <ScrollView className="flex-1 bg-white px-4">
      <View className="flex-1 mt-12">
        <PhoneNumberForm />
      </View>
    </ScrollView>
  );
}

export default PhoneNumberScreen;
