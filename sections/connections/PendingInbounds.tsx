import React, { useCallback, useEffect, useMemo } from "react";
import { FlatList, View } from "react-native";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectConnectionRequests } from "@/store/reducers/connectionRequestSlice";
import { selectUser } from "@/store/reducers/userSlice";
import { EmptyState } from "./EmptyState";
import { PendingRow } from "./PendingRow";
import { useLazyGetMeConnectionRequestsQuery } from "@/api/services/connectionRequestsApi";

const PAGE_SIZE = 20;
const STATUS = "INBOUND";

function PendingInbounds() {
  const connectionRequest = useAppSelector(selectConnectionRequests);
  const user = useAppSelector(selectUser);
  const [page, setPage] = React.useState(1);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [connectionRequests, { data }] = useLazyGetMeConnectionRequestsQuery();
  const handleFindPeople = () => {
    // Navigate to find people screen
  };

  const inboundRequests = useMemo(() => {
    return connectionRequest.filter(
      (request) => request.receiverId === user?.id
    );
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
    <View className="h-[320px] bg-white">
      <FlatList
        data={inboundRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PendingRow item={item} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        onEndReached={handleReachEnd}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <EmptyState
            icon="person"
            title="No pending inbound requests"
            description="You have no pending inbound connection requests at the moment."
            actionLabel="Find People"
            onAction={handleFindPeople}
          />
        }
      />
    </View>
  );
}

export default PendingInbounds;
