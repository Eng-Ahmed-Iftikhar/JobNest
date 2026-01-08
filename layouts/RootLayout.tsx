import AppLoader from "@/components/AppLoader";
import AuthGuard from "@/components/AuthGuard";
import GestureRoot from "@/components/GestureRoot";
import NotificationProvider from "@/components/NotificationProvider";
import { ReduxPersisted, store } from "@/store";
import { setNativeEvent } from "@/store/reducers/uiSlice";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Suspense, useCallback } from "react";
import { GestureResponderEvent, Pressable, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

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
                  <Slot />
                </Suspense>
              </AuthGuard>
            </GestureRoot>
          </Pressable>
        </SafeAreaView>
      </ReduxPersisted>
    </ThemeProvider>
  );
}
