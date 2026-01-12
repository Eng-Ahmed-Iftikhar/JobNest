import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, useColorScheme, View } from "react-native";

type SearchSuggestionFilterBtnProps = {
  openFilters: () => void;
};

function SearchSuggestionFilterBtn({
  openFilters,
}: SearchSuggestionFilterBtnProps) {
  const colorScheme = useColorScheme();
  return (
    <View className="flex-row items-center justify-between">
      <Pressable onPress={openFilters} className="p-2">
        <Ionicons
          name="options-outline"
          size={22}
          color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        />
      </Pressable>
    </View>
  );
}

export default SearchSuggestionFilterBtn;
