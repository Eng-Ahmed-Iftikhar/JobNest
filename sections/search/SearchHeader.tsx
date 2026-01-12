import LocationInput from "@/components/LocationInput";
import SearchInput from "@/components/ui/SearchInput";
import { useAsyncStorage } from "@/hooks/useAsyncStorage";
import { useSearch } from "@/hooks/useSearch";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, useColorScheme, View } from "react-native";

export default function SearchHeader() {
  const { searchText, setSearchText, location, setSearchQuery, setLocation } =
    useSearch();
  const colorScheme = useColorScheme();
  const { value: searchQueries, setItem: setSearchQueries } =
    useAsyncStorage<string>("searchQueries");
  const router = useRouter();

  const handleClose = useCallback(() => {
    setLocation("");
    setSearchQuery("");
    setSearchText("");
    router.back();
  }, [router, setLocation, setSearchQuery, setSearchText]);

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchText(text);
    },
    [setSearchText]
  );

  const handleSearchSubmit = useCallback(() => {
    if (!searchText) return;
    setSearchQuery(searchText);
    const queryList: string[] = JSON.parse(searchQueries || "[]");
    queryList.unshift(searchText);
    const uniqueQueries = Array.from(new Set(queryList));

    setSearchQueries(JSON.stringify(uniqueQueries));
    router.push("/search-suggestions");
  }, [router, searchQueries, searchText, setSearchQueries, setSearchQuery]);

  return (
    <View className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 px-4 pt-3 pb-3">
      <View className="mb-3">
        <SearchInput
          value={searchText}
          onChangeText={handleSearchChange}
          placeholder="Search"
        />
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-3">
          <LocationInput
            value={location}
            onChangeText={setLocation}
            placeholder="City, state or country"
          />
        </View>
        <Pressable onPress={handleSearchSubmit} className="p-2">
          <Ionicons
            name="search"
            size={24}
            color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          />
        </Pressable>
        <Pressable onPress={handleClose} className="p-2">
          <Ionicons
            name="close"
            size={24}
            color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          />
        </Pressable>
      </View>
    </View>
  );
}
