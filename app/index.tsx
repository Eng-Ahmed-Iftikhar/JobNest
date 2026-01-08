import AppLoader from "@/components/AppLoader";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectIsLoggedIn } from "@/store/reducers/userSlice";
import { Stack } from "expo-router";
import { Suspense } from "react";
import { View } from "react-native";

function App() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  if (isLoggedIn) {
    return (
      <View className="flex-1">
        <Suspense fallback={<AppLoader />}>
          <Stack screenOptions={{ headerShown: false, animation: "none" }}>
            <Stack.Screen name="(dashboard)" />
            <Stack.Screen name="(onboarding)" />
          </Stack>
        </Suspense>
      </View>
    );
  }
  return (
    <View className="flex-1">
      <Suspense fallback={<AppLoader />}>
        <Stack screenOptions={{ headerShown: false, animation: "none" }}>
          <Stack.Screen name="(auth)" />
        </Stack>
      </Suspense>
    </View>
  );
}

export default App;
