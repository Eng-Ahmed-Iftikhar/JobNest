import AppLoader from "@/components/AppLoader";
import SearchInput from "@/components/ui/SearchInput";
import ConnectionsTabs from "@/sections/connections/ConnectionsTabs";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Suspense } from "react";
import { View } from "react-native";

export default function ConnectionsLayout() {
  const searchParams = useLocalSearchParams();
  const router = useRouter();

  const handleSearchChange = (text: string) => {
    // add search to query params
    router.setParams({ ...searchParams, search: text });
  };
  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-4">
        <ConnectionsTabs />
        <View className="mt-3 w-[65%]">
          <SearchInput
            value={searchParams.search as string}
            onChangeText={handleSearchChange}
            placeholder="Search"
          />
        </View>
      </View>

      <View className="flex-1 mt-3 ">
        <Suspense fallback={<AppLoader />}>
          <Stack>
            <Stack.Screen options={{ headerShown: false }} name="index" />
            <Stack.Screen options={{ headerShown: false }} name="following" />
            <Stack.Screen options={{ headerShown: false }} name="pending" />
          </Stack>
        </Suspense>
      </View>
    </View>
  );
}
