import LocationInput from "@/components/LocationInput";
import SearchInput from "@/components/ui/SearchInput";
import { useAsyncStorage } from "@/hooks/useAsyncStorage";
import { useSearch } from "@/hooks/useSearch";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";

export default function SearchHeader() {
  const { searchText, setSearchText, location, setSearchQuery, setLocation } =
    useSearch();
  const { value: searchQueries, setItem: setSearchQueries } =
    useAsyncStorage<string>("searchQueries");
  const router = useRouter();

  const handleClose = () => {
    setLocation("");
    setSearchQuery("");
    setSearchText("");
    router.back();
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };
  const handleSearchSubmit = () => {
    setSearchQuery(searchText);
    const queryList: string[] = JSON.parse(searchQueries || "[]");
    queryList.unshift(searchText);
    setSearchQueries(JSON.stringify(Array.from(new Set(queryList))));
    router.push("/search-suggestions");
  };

  return (
    <View className="bg-white border-b border-gray-200 px-4 pt-3 pb-3">
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
          <Ionicons name="search" size={24} color="#6B7280" />
        </Pressable>
        <Pressable onPress={handleClose} className="p-2">
          <Ionicons name="close" size={24} color="#6B7280" />
        </Pressable>
      </View>
    </View>
  );
}
