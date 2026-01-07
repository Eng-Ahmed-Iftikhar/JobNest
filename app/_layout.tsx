import "../global.css";
import AppLoader from "@/components/AppLoader";
import AuthGuard from "@/components/AuthGuard";
import GestureRoot from "@/components/GestureRoot";
import NotificationProvider from "@/components/NotificationProvider";
import { ReduxPersisted, store } from "@/store";
import { setNativeEvent } from "@/store/reducers/uiSlice";
import {
  DefaultTheme,
  ThemeProvider,
  DarkTheme,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Suspense, useCallback } from "react";
import { GestureResponderEvent, Pressable, useColorScheme } from "react-native";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const handleOnPress = useCallback((event: GestureResponderEvent) => {
    store.dispatch(setNativeEvent(event.nativeEvent));
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ReduxPersisted>
        <SafeAreaView
          className={
            "flex-1  dark:bg-black " + (colorScheme === "dark" ? "dark" : "")
          }
        >
          <Pressable className="flex-1" onPress={handleOnPress}>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            <NotificationProvider />
            <GestureRoot>
              <AuthGuard>
                <Suspense fallback={<AppLoader />}>
                  <Stack>
                    <Stack.Screen
                      name="index"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(auth)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(dashboard)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(profile)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(onboarding)"
                      options={{ headerShown: false }}
                    />
                  </Stack>
                </Suspense>
              </AuthGuard>
            </GestureRoot>
          </Pressable>
        </SafeAreaView>
      </ReduxPersisted>
    </ThemeProvider>
  );
}
