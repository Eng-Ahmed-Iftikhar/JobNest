import Logo from "@/assets/images/icon.png";
import AppLoader from "@/components/AppLoader";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectIsLoggedIn } from "@/store/reducers/userSlice";

import { Redirect, Stack } from "expo-router";
import React, { Suspense } from "react";
import { Image, View } from "react-native";

function AuthLayout() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  if (isLoggedIn) {
    return <Redirect href="/(dashboard)" />;
  }

  return (
    <View className="flex-1 ">
      <View className="h-[56px] items-center justify-center ">
        <Image source={Logo} className="h-[40px] w-[76px] " />
      </View>
      <Suspense fallback={<AppLoader />}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen
            name="forgot-password"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="verify-reset-code"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="reset-password"
            options={{ headerShown: false }}
          />
        </Stack>
      </Suspense>
    </View>
  );
}

export default AuthLayout;
