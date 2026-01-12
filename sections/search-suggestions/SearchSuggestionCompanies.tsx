import { useGetSuggestedCompaniesQuery } from "@/api/services/companyApi";
import { useSearch } from "@/hooks/useSearch";
import React, { useEffect } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import SearchSuggestionCompanyCard from "./SearchSuggestionCompanyCard";

const PAGE_SIZE = 10;

function SearchSuggestionCompanies() {
  const { searchQuery, location } = useSearch();
  const [page, setPage] = React.useState(1);
  const [companies, setCompanies] = React.useState<any[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const { data, isLoading, refetch } = useGetSuggestedCompaniesQuery({
    search: searchQuery,
    location,
    page,
    pageSize: PAGE_SIZE,
  });

  const onEndReached = () => {
    if (companies.length) setPage((prev) => prev + 1);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await refetch().unwrap();
    setRefreshing(false);
  };

  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setCompanies(data.data);
        return;
      }
      setCompanies((prev) => {
        // Avoid duplicates
        const newCompanies = data.data.filter(
          (company) => !prev.find((c) => c.id === company.id)
        );
        return [...prev, ...newCompanies];
      });
    }
  }, [data, page]);

  return (
    <View className="flex-1">
      <View className="px-4 pt-4 flex-row justify-between items-center border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black">
        <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          {companies.length} companies found
        </Text>
      </View>
      <View className="bg-white dark:bg-black flex-1">
        <FlatList
          data={companies}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={onEndReached}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SearchSuggestionCompanyCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <View className="py-8 items-center">
              <Text className="text-base text-gray-500 dark:text-gray-400 text-center">
                {isLoading
                  ? "Loading companies..."
                  : `No companies found for "${searchQuery}"`}
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

export default SearchSuggestionCompanies;
