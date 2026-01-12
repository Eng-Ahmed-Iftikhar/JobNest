import { useAsyncStorage } from "@/hooks/useAsyncStorage";
import { useSearch } from "@/hooks/useSearch";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";

function PopluarSearch() {
  const { setSearchQuery } = useSearch();
  const colorScheme = useColorScheme();
  const { value: searchQueries, setItem: setSearchQueries } =
    useAsyncStorage<string>("searchQueries");
  const popularSearches: string[] = useMemo(
    () => JSON.parse(searchQueries || "[]"),
    [searchQueries]
  );

  const router = useRouter();

  const navigateToResults = useCallback(() => {
    router.push("/(dashboard)/(tabs)/search-suggestions");
  }, [router]);

  const handlePopularSearchClick = useCallback(
    (query: string) => {
      setSearchQuery(query);
      navigateToResults();
    },
    [navigateToResults, setSearchQuery]
  );

  const handleRemovePopularSearch = useCallback(
    (query: string) => {
      const updatedSearches = popularSearches.filter((item) => item !== query);
      setSearchQueries(JSON.stringify(updatedSearches));
    },
    [popularSearches, setSearchQueries]
  );

  if (!popularSearches.length) {
    return null;
  }
  return (
    <View className="px-4 pt-4">
      <Text className="text-sm font-medium  text-gray-500 dark:text-gray-400 mb-3">
        Popular searches
      </Text>
      {popularSearches.slice(0, 5).map((item) => (
        <View key={item} className="flex-row">
          <Pressable
            onPress={() => handlePopularSearchClick(item)}
            className="flex-row flex-1 items-center py-3 border-b border-gray-100 dark:border-gray-700"
          >
            <Ionicons
              name="search"
              size={18}
              color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
              style={{ marginRight: 12 }}
            />
            <Text className="text-base flex-1 font-medium text-gray-700 dark:text-gray-300">
              {item}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleRemovePopularSearch(item)}
            className="flex-row items-center py-3 border-b border-gray-100 dark:border-gray-700"
          >
            <Ionicons
              name="remove-circle-outline"
              size={18}
              color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
              style={{ marginRight: 12 }}
            />
          </Pressable>
        </View>
      ))}
    </View>
  );
}

export default PopluarSearch;
