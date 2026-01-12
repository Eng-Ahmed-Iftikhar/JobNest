import AppLoader from "@/components/AppLoader";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { setNativeEvent } from "@/store/reducers/uiSlice";
import { selectIsLoggedIn } from "@/store/reducers/userSlice";
import { Stack } from "expo-router";
import { Suspense, useCallback } from "react";
import {
  GestureResponderEvent,
  Pressable,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();

  const isLogin = useAppSelector(selectIsLoggedIn);

  const handleOnPress = useCallback(
    (event: GestureResponderEvent) => {
      dispatch(setNativeEvent(event.nativeEvent));
    },
    [dispatch]
  );

  const AuthRoutes = () => {
    return (
      <View className="flex-1">
        <Suspense fallback={<AppLoader />}>
          <Stack
            initialRouteName="(auth)"
            screenOptions={{ headerShown: false, animation: "none" }}
          >
            <Stack.Screen name="(auth)" />
          </Stack>
        </Suspense>
      </View>
    );
  };

  const DashboardRoutes = () => {
    return (
      <View className="flex-1">
        <Suspense fallback={<AppLoader />}>
          <Stack
            initialRouteName="(dashboard)"
            screenOptions={{ headerShown: false, animation: "none" }}
          >
            <Stack.Screen name="(dashboard)" />
            <Stack.Screen name="(onboarding)" />
          </Stack>
        </Suspense>
      </View>
    );
  };

  return (
    <SafeAreaView
      className={
        "flex-1  dark:bg-black bg-white " +
        (colorScheme === "dark" ? "dark" : "")
      }
      onTouchEndCapture={handleOnPress}
    >
      <Pressable className="flex-1">
        <Suspense fallback={<AppLoader />}>
          {isLogin ? <DashboardRoutes /> : <AuthRoutes />}
        </Suspense>
      </Pressable>
    </SafeAreaView>
  );
}
