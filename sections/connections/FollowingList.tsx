import { useLazyGetFollowedCompaniesQuery } from "@/api/services/companyApi";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectCompanyFollowers } from "@/store/reducers/companySlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { FlatList, RefreshControl } from "react-native";
import { EmptyState } from "./EmptyState";
import { FollowRow } from "./FollowRow";

const PAGE_SIZE = 10;
export function FollowingList() {
  const searchParams = useLocalSearchParams();
  const search = (searchParams.search as string) || "";
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const followedCompanies = useAppSelector(selectCompanyFollowers);
  const [trigger, result] = useLazyGetFollowedCompaniesQuery();

  const dataPage = result.data?.page ?? 1;
  const dataTotal = result.data?.total ?? 0;
  const dataPageSize = result.data?.pageSize ?? PAGE_SIZE;

  const handleFindBusinesses = useCallback(() => {
    router.push("/search");
  }, [router]);

  const handleReachEnd = useCallback(() => {
    if (dataPage * dataPageSize < dataTotal) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [dataPage, dataPageSize, dataTotal]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setPage(1);
  }, []);

  useEffect(() => {
    trigger({ params: { search, page, pageSize: PAGE_SIZE } });
  }, [search, page, trigger]);

  return (
    <FlatList
      data={followedCompanies}
      className="flex-1 bg-white dark:bg-gray-900 px-4"
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FollowRow item={item} />}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
      onEndReached={handleReachEnd}
      ListEmptyComponent={
        <EmptyState
          icon="business"
          title="You don't follow any businesses"
          description="It's better when you have company! Find businesses to follow"
          actionLabel="Find businesses to follow"
          onAction={handleFindBusinesses}
        />
      }
    />
  );
}
