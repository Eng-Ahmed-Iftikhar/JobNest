import { useGetNotificationsQuery } from "@/api/services/notificationApi";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectNotifications } from "@/store/reducers/notificationSlice";
import { NOTIFICATION_TAB, NOTIFICATION_TYPE } from "@/types/notification";
import React, { useCallback, useMemo } from "react";
import { FlatList } from "react-native";
import EmptyNotification from "./EmptyNotification";
import Notification from "./Notification";

type Props = {
  activeTab: string;
};
const PAGE_SIZE = 10;

function Notifications({ activeTab }: Props) {
  const [page, setPage] = React.useState<number>(1);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const notifications = useAppSelector(selectNotifications);

  const { data } = useGetNotificationsQuery(
    {
      params: { page, pageSize: PAGE_SIZE },
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const dataPage = data?.page || 1;
  const dataPageSize = data?.pageSize || PAGE_SIZE;

  const filteredNotifications = useMemo(() => {
    if (activeTab === NOTIFICATION_TAB.INVITATIONS) {
      return notifications.filter(
        (notification) => notification.type === NOTIFICATION_TYPE.INTERVIEW,
      );
    }
    return notifications;
  }, [activeTab, notifications]);

  const handleLoadMore = useCallback(() => {
    if (dataPage * dataPageSize >= notifications.length) {
      setPage((prev) => prev + 1);
    }
  }, [dataPage, dataPageSize, notifications]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setRefreshing(false);
  }, []);

  return (
    <FlatList
      data={filteredNotifications}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Notification notification={item} />}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
      onEndReached={handleLoadMore}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={<EmptyNotification />}
    />
  );
}

export default Notifications;
