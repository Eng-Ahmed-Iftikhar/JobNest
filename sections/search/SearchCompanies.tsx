import { useSearch } from "@/hooks/useSearch";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import SearchCompanyCard from "./SearchCompanyCard";

function SearchCompanies() {
  const { companies, companiesCount, setSearchQuery, searchText } = useSearch();
  const router = useRouter();

  const navigateToResults = useCallback(() => {
    setSearchQuery(searchText);
    router.push("/search-suggestions/companies");
  }, [router, searchText, setSearchQuery]);

  if (!companies.length) {
    return null;
  }

  return (
    <View className="pt-4">
      <View className="flex-row px-3">
        <Text className="text-sm flex-1 font-medium text-gray-500 mb-3">
          Companies
        </Text>
        {companiesCount && (
          <TouchableOpacity
            className="flex-row items-center gap-1"
            onPress={navigateToResults}
          >
            <Text className="text-sm font-medium text-blue-600 mb-3">
              See all companies ({companiesCount})
            </Text>
            <Ionicons
              name="chevron-forward"
              size={15}
              color="#3B82F6"
              style={{ marginBottom: 12 }}
            />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={companies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SearchCompanyCard company={item} />}
        horizontal
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 12,
          // width: "100%",
          backgroundColor: "white",
        }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="person-outline"
              size={28}
              color="#D1D5DB"
              style={{ marginBottom: 12 }}
            />
            <Text className="text-sm text-gray-500 text-center">
              No people found
            </Text>
          </View>
        }
      />
    </View>
  );
}

export default SearchCompanies;
