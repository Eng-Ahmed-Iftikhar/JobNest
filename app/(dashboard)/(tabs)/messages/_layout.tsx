import AppLoader from "@/components/AppLoader";
import { Stack } from "expo-router";
import { Suspense } from "react";

export default function MessagesLayout() {
  return (
    <Suspense fallback={<AppLoader />}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "Messages",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="new"
          options={{
            headerTitle: "New Message",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="chat"
          options={{
            headerTitle: "Chat Detail",
            headerShown: false,
          }}
        />
      </Stack>
    </Suspense>
  );
}
