import LocationForm from "@/sections/onboarding/LocationForm";
import React from "react";
import { ScrollView, View } from "react-native";

function LocationScreen() {
  return (
    <ScrollView className="flex-1 bg-white px-4">
      <View className="flex-1 mt-12">
        <LocationForm />
      </View>
    </ScrollView>
  );
}

export default LocationScreen;
