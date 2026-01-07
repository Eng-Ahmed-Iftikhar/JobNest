import React, { useCallback, useEffect, useMemo } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectConnectionRequests } from "@/store/reducers/connectionRequestSlice";
import { selectUser } from "@/store/reducers/userSlice";
import { EmptyState } from "./EmptyState";
import { PendingRow } from "./PendingRow";
import { useLazyGetMeConnectionRequestsQuery } from "@/api/services/connectionRequestsApi";

const PAGE_SIZE = 20;
const STATUS = "OUTBOUND";

function PendingOutbounds() {
  const connectionRequest = useAppSelector(selectConnectionRequests);
  const user = useAppSelector(selectUser);
  const [page, setPage] = React.useState(1);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [connectionRequests, { data }] = useLazyGetMeConnectionRequestsQuery();
  const handleFindPeople = () => {
    // Navigate to find people screen
  };

  const outboundRequests = useMemo(() => {
    return connectionRequest.filter((request) => request.senderId === user?.id);
  }, [connectionRequest, user]);
  const dataPage = data?.page || 1;
  const dataTotal = data?.total || 1;
  const dataPageSize = data?.pageSize || PAGE_SIZE;

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
    connectionRequests({ status: STATUS, page, pageSize: PAGE_SIZE }).finally(
      () => {
        setIsRefreshing(false);
      }
    );
  }, [connectionRequests, page]);

  return (
    <View className=" bg-white">
      <FlatList
        data={outboundRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PendingRow item={item} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleReachEnd}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <EmptyState
            icon="person"
            title="No pending outbound requests"
            description="You have no pending outbound connection requests at the moment."
            actionLabel="Find People"
            onAction={handleFindPeople}
          />
        }
      />
    </View>
  );
}

export default PendingOutbounds;
