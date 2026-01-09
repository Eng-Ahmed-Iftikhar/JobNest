import AuthGuard from "@/components/AuthGuard";
import GestureRoot from "@/components/GestureRoot";
import NotificationProvider from "@/components/NotificationProvider";
import RootLayout from "@/layouts/RootLayout";
import { ReduxPersisted } from "@/store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import "../global.css";

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ReduxPersisted>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <NotificationProvider />
        <GestureRoot>
          <AuthGuard>
            <RootLayout />
          </AuthGuard>
        </GestureRoot>
      </ReduxPersisted>
    </ThemeProvider>
  );
}
