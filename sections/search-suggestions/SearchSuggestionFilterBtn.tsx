import React from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SearchSuggestionFilterBtnProps = {
  openFilters: () => void;
};

function SearchSuggestionFilterBtn({
  openFilters,
}: SearchSuggestionFilterBtnProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Pressable onPress={openFilters} className="p-2">
        <Ionicons name="options-outline" size={22} color="#6B7280" />
      </Pressable>
    </View>
  );
}

export default SearchSuggestionFilterBtn;
