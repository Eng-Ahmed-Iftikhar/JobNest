import React, { useEffect } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import SearchSuggestionUserCard from "./SearchSuggestionUserCard";
import { useGetUsersQuery } from "@/api/services/userApi";
import { useSearch } from "@/hooks/useSearch";

const PAGE_SIZE = 10;

function SearchSugesstionUsers() {
  const { searchQuery, location } = useSearch();
  const [page, setPage] = React.useState(1);
  const [users, setUsers] = React.useState<any[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const { data, isLoading, refetch } = useGetUsersQuery({
    search: searchQuery,
    location,
    page,
    pageSize: PAGE_SIZE,
  });

  const onEndReached = () => {
    if (users.length) setPage((prev) => prev + 1);
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
        setUsers(data.data);
        return;
      }
      setUsers((prev) => {
        // Avoid duplicates
        const newUsers = data.data.filter(
          (user) => !prev.find((u) => u.id === user.id)
        );
        return [...prev, ...newUsers];
      });
    }
  }, [data, page]);

  return (
    <View className="flex-1">
      <View className="px-4 pt-4 flex-row justify-between items-center">
        <Text className="text-sm font-medium text-gray-500 mb-3">
          {users.length} user`s found
        </Text>
      </View>
      <View className="bg-white flex-1">
        <FlatList
          data={users}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={onEndReached}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SearchSuggestionUserCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <View className="py-8 items-center">
              <Text className="text-base text-gray-500 text-center">
                {isLoading
                  ? "Loading users..."
                  : `No users found for "${searchQuery}"`}
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

export default SearchSugesstionUsers;
