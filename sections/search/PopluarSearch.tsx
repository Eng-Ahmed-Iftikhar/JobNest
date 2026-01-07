import { useSearch } from "@/hooks/useSearch";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAsyncStorage } from "@/hooks/useAsyncStorage";

function PopluarSearch() {
  const { setSearchQuery } = useSearch();
  const { value: searchQueries, setItem: setSearchQueries } =
    useAsyncStorage<string>("searchQueries");
  const popularSearches: string[] = JSON.parse(searchQueries || "[]");
  const router = useRouter();
  const navigateToResults = () => {
    router.push("/(dashboard)/(tabs)/search-suggestions");
  };

  const handlePopularSearchClick = (query: string) => {
    setSearchQuery(query);
    navigateToResults();
  };
  const handleRemovePopularSearch = (query: string) => {
    const updatedSearches = popularSearches.filter((item) => item !== query);
    setSearchQueries(JSON.stringify(updatedSearches));
  };
  if (!popularSearches.length) {
    return null;
  }
  return (
    <View className="px-4 pt-4">
      <Text className="text-sm font-medium  text-gray-500 mb-3">
        Popular searches
      </Text>
      {popularSearches.slice(0, 5).map((item) => (
        <View key={item} className="flex-row">
          <Pressable
            onPress={() => handlePopularSearchClick(item)}
            className="flex-row flex-1 items-center py-3 border-b border-gray-100"
          >
            <Ionicons
              name="search"
              size={18}
              color="#9CA3AF"
              style={{ marginRight: 12 }}
            />
            <Text className="text-base flex-1 text-gray-900">{item}</Text>
          </Pressable>
          <Pressable
            onPress={() => handleRemovePopularSearch(item)}
            className="flex-row items-center py-3 border-b border-gray-100"
          >
            <Ionicons
              name="remove-circle-outline"
              size={18}
              color="#9CA3AF"
              style={{ marginRight: 12 }}
            />
          </Pressable>
        </View>
      ))}
    </View>
  );
}

export default PopluarSearch;
