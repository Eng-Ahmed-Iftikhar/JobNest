import { useLazyGetChatsQuery } from "@/api/services/chatApi";
import SearchInput from "@/components/ui/SearchInput";
import { useAppSelector } from "@/hooks/useAppSelector";
import ConversationRow from "@/sections/messages/ConversationRow";
import EmptyMessages from "@/sections/messages/EmptyMessages";
import MessagesHeader from "@/sections/messages/MessagesHeader";
import { selectChats } from "@/store/reducers/chatSlice";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";

let PAGE_SIZE = 20;
function MessagesScreen() {
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const chats = useAppSelector(selectChats);

  const [page, setPage] = useState(1);

  const [trigger, { data: conversationsDataResponse }] = useLazyGetChatsQuery();
  const dataPage = conversationsDataResponse?.page || 1;
  const dataTotal = conversationsDataResponse?.total || 1;
  const dataPageSize = conversationsDataResponse?.pageSize || PAGE_SIZE;

  const handleReachedEnd = useCallback(() => {
    if (dataPage * dataPageSize < dataTotal) {
      setPage((prev) => prev + 1);
    }
  }, [dataPage, dataPageSize, dataTotal]);

  const handleOnRefresh = useCallback(() => {
    setIsRefreshing(true);
    trigger({
      page: 1,
      pageSize: PAGE_SIZE,
      search,
    }).finally(() => {
      setIsRefreshing(false);
    });
  }, [search, trigger]);

  useEffect(() => {
    trigger({
      page,
      pageSize: PAGE_SIZE,
      search,
    });
  }, [page, search, trigger]);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-black">
      <MessagesHeader />

      <View className="px-4 py-3 ">
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search"
        />
      </View>

      <FlatList
        data={chats || []}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleOnRefresh}
          />
        }
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => <ConversationRow item={item} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        onEndReached={handleReachedEnd}
        ListEmptyComponent={<EmptyMessages />}
      />
    </View>
  );
}

export default MessagesScreen;
