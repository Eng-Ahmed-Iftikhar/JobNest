import { useSearch } from "@/hooks/useSearch";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import SearchJobResultCard from "./SearchJobResultCard";

function SearchJobs() {
  const { jobs, setSearchQuery, jobsCount, searchText } = useSearch();
  const router = useRouter();

  const navigateToResults = useCallback(() => {
    console.log({ searchText });

    setSearchQuery(searchText);
    router.push("/(dashboard)/(tabs)/search-suggestions");
  }, [router, searchText, setSearchQuery]);

  if (!jobs.length) {
    return null;
  }
  return (
    <View className=" pt-4">
      <View className="flex-row px-3">
        <Text className="text-sm font-medium  text-gray-500 mb-3">Jobs</Text>
        {jobsCount && (
          <TouchableOpacity
            className="flex-row items-center gap-1 "
            onPress={navigateToResults}
          >
            <Text className="text-sm font-medium  text-blue-600 mb-3">
              See all jobs ({jobsCount})
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
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SearchJobResultCard job={item} onPress={navigateToResults} />
        )}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View className="py-8 items-center">
            <Ionicons
              name="search-outline"
              size={48}
              color="#D1D5DB"
              style={{ marginBottom: 12 }}
            />
            <Text className="text-base text-gray-500 text-center">
              No jobs found for "{searchText}"
            </Text>
          </View>
        }
      />
    </View>
  );
}

export default SearchJobs;
