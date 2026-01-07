import Logo from "@/assets/images/icon.png";
import { Stack } from "expo-router";
import React from "react";
import { Image, View } from "react-native";

function ProfileLayout() {
  return (
    <View className="flex-1 bg-white">
      <View className="h-[56px] items-center justify-center ">
        <Image source={Logo} className="h-[40px] w-[76px]" />
      </View>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="verify-email" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

export default ProfileLayout;
