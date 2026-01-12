import AppLoader from "@/components/AppLoader";
import SearchInput from "@/components/ui/SearchInput";
import ConnectionsTabs from "@/sections/connections/ConnectionsTabs";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Suspense } from "react";
import { View } from "react-native";

export default function ConnectionLayout() {
  const searchParams = useLocalSearchParams();
  const router = useRouter();

  const handleSearchChange = (text: string) => {
    // add search to query params
    router.setParams({ ...searchParams, search: text });
  };
  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View className="pt-4">
        <ConnectionsTabs />
        <View className="mt-3 p-3 w-full border-b border-gray-200 dark:border-gray-700">
          <SearchInput
            textViewStyle={{ width: "70%" }}
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
