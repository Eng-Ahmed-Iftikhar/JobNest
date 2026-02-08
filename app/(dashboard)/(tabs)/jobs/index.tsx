import { useLazyGetSuggestedJobsQuery } from "@/api/services/jobsApi";
import EmptyState from "@/components/EmptyState";
import { useAppSelector } from "@/hooks/useAppSelector";
import JobCard from "@/sections/dashboard/JobCard";
import { selectJobs } from "@/store/reducers/jobSlice";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

const PAGE_SIZE = 10;
export default function SuggestedJobsScreen() {
  const jobs = useAppSelector(selectJobs);
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [trigger, { isFetching, data }] = useLazyGetSuggestedJobsQuery();

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    if (page > 1) {
      setIsRefreshing(true);
      setPage(1);
    }
  }, [page, isRefreshing]);
  const dataPage = data?.page || 1;
  const dataPageSize = data?.pageSize || PAGE_SIZE;
  const dataTotal = data?.total || 0;

  const handleEndReached = useCallback(() => {
    if (dataPage * dataPageSize >= dataTotal) return;
    setPage((prevPage) => prevPage + 1);
  }, [dataPage, dataPageSize, dataTotal]);

  useEffect(() => {
    trigger({ page, pageSize: PAGE_SIZE }).finally(() => {
      setIsRefreshing(false);
    });
  }, [page, trigger]);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-black px-4 pt-4">
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <JobCard job={item} isSaved={item.isSaved} />}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          isFetching && page > 1 ? (
            <View className="py-4 items-center">
              <Text className="text-gray-500 dark:text-gray-300">
                Loading more jobs…
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            iconName="briefcase-outline"
            title="You haven't saved any jobs so far"
            description="Start your search and find a job you've been looking for!"
            buttonText="Search jobs"
            buttonIcon="search"
            onButtonPress={() => router.push("/search")}
          />
        }
      />
    </View>
  );
}
