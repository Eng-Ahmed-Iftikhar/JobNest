import Logo from "@/assets/images/Logo.png";
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
    <View className="flex-1 dark:bg-black bg-white ">
      <View className="items-center mt-4 justify-center  ">
        <Image style={{ height: 80, width: 80 }} source={Logo} />
      </View>
      <Suspense fallback={<AppLoader />}>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
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
