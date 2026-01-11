import { useLazyGetAppliedJobsQuery } from "@/api/services/jobsApi";
import AppLoader from "@/components/AppLoader";
import EmptyState from "@/components/EmptyState";
import { useAppSelector } from "@/hooks/useAppSelector";
import JobCard from "@/sections/dashboard/JobCard";
import { selectAppliedJobs } from "@/store/reducers/jobSlice";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

const PAGE_SIZE = 10;

function AppliedJobsScreen() {
  const router = useRouter();
  const appliedJobs = useAppSelector(selectAppliedJobs);
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [trigger, { isFetching, data }] = useLazyGetAppliedJobsQuery();

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    if (page > 1) {
      setIsRefreshing(true);
      setPage(1);
    }
  }, [page, isRefreshing]);

  const handleEndReached = useCallback(() => {
    if (!data?.data?.length) return;
    setPage((prevPage) => prevPage + 1);
  }, [data]);

  useEffect(() => {
    trigger({ page, pageSize: PAGE_SIZE }).finally(() => {
      setIsRefreshing(false);
    });
  }, [page, trigger]);

  if (isFetching && page === 1) {
    return <AppLoader />;
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-black px-4 pt-4">
      <FlatList
        data={appliedJobs}
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
          <View className="mt-12">
            <EmptyState
              iconName="briefcase-outline"
              title="You haven't applied to any jobs yet"
              description="Start applying to jobs and track your progress here!"
              buttonText="Browse jobs"
              buttonIcon="search"
              onButtonPress={() => router.push("/(dashboard)/(tabs)/jobs")}
            />
          </View>
        }
      />
    </View>
  );
}

export default AppliedJobsScreen;
