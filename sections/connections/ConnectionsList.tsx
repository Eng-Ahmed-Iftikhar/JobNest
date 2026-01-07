import { useLazyGetMeConnectionsQuery } from "@/api/services/connectionApi";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectConnections } from "@/store/reducers/connectionSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo } from "react";
import { FlatList, RefreshControl } from "react-native";
import { ConnectionRow } from "./ConnectionRow";
import { EmptyState } from "./EmptyState";

const PAGE_SIZE = 10;

function Connections() {
  const connections = useAppSelector(selectConnections);
  const searchParams = useLocalSearchParams();
  const search = searchParams.search as string;
  const [page, setPage] = React.useState(1);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const [trigger, { data: dataResponse }] = useLazyGetMeConnectionsQuery();
  const router = useRouter();

  const handleFindPeople = () => {
    router.push("/search");
  };
  const dataPage = dataResponse?.page ?? 1;
  const dataTotal = dataResponse?.total ?? 0;
  const dataPageSize = dataResponse?.pageSize ?? PAGE_SIZE;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setPage(1);
  }, []);

  const handleReachEnd = useCallback(() => {
    if (dataPage * dataPageSize < dataTotal) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [dataPage, dataPageSize, dataTotal]);

  useEffect(() => {
    trigger({ params: { page, pageSize: PAGE_SIZE, search } }).finally(() => {
      setIsRefreshing(false);
    });
  }, [page, trigger, search]);

  return (
    <FlatList
      data={connections}
      className="flex-1"
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ConnectionRow item={item} />}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
      onEndReached={handleReachEnd}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
      ListEmptyComponent={
        <EmptyState
          icon="person"
          title="You don't have any connections"
          description="It's better when you have company! Find people to follow"
          actionLabel="Find people to connect with"
          onAction={handleFindPeople}
        />
      }
    />
  );
}
export default Connections;
