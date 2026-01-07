import { useGetSuggestedJobsQuery } from "@/api/services/jobsApi";
import { useSearch } from "@/hooks/useSearch";
import { SearchJob } from "@/types/search";
import React, { useEffect } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import SearchJobResultCard from "../search/SearchJobResultCard";

const PAGE_SIZE = 10;

function SearchSuggestionJobs() {
  const { searchQuery, location } = useSearch();
  const [page, setPage] = React.useState(1);
  const [jobs, setJobs] = React.useState<SearchJob[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const { data, isLoading, refetch } = useGetSuggestedJobsQuery(
    {
      search: searchQuery,
      location,
      page,
      pageSize: PAGE_SIZE,
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  const onEndReached = () => {
    if (jobs.length) setPage((prev) => prev + 1);
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
        setJobs(data.data as SearchJob[]);
        return;
      }
      setJobs((prev) => {
        // Avoid duplicates
        const newJobs = data.data.filter(
          (job) => !prev.find((j) => j.id === job.id)
        );
        return [...prev, ...newJobs] as SearchJob[];
      });
    }
  }, [data, page]);

  return (
    <View className="flex-1 ">
      <View className="px-4 pt-4 flex-row justify-between items-center">
        <Text className="text-sm  font-medium text-gray-500 mb-3">
          {data ? data.data.length : 0} job`s found
        </Text>
      </View>
      <View className="bg-white flex-1">
        <FlatList
          data={jobs}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={onEndReached}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SearchJobResultCard job={item as SearchJob} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <View className="py-8 items-center">
              <Text className="text-base text-gray-500 text-center">
                {isLoading
                  ? "Loading jobs..."
                  : `No jobs found for "${searchQuery}"`}
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

export default SearchSuggestionJobs;
