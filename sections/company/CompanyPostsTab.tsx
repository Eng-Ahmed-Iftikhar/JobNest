import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

interface CompanyPostsTabProps {
  posts: any[];
  isFetching: boolean;
  onEndReached: () => void;
}

export default function CompanyPostsTab({
  posts,
  isFetching,
  onEndReached,
}: CompanyPostsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const colorScheme = useColorScheme();
  const filteredPosts = posts.filter((post) =>
    post.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPostItem = ({ item }: { item: any }) => (
    <View className="bg-white dark:bg-black p-4 border-b border-gray-100 dark:border-gray-700">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-start gap-3 flex-1">
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: item.authorAvatar || "#38bdf8" }}
          >
            <Ionicons name="person" size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold dark:bg-black">
              {item.authorName}
            </Text>
            <Text className="text-sm font-medium text-gray-500">
              {item.timestamp}
              {item.location ? ` • ${item.location}` : ""}
            </Text>
          </View>
        </View>
        <Pressable className="p-1">
          <Ionicons name="share-outline" size={20} color="#6B7280" />
        </Pressable>
      </View>

      {item.content ? (
        <Text className="text-sm font-medium text-gray-700 mb-3">
          {item.content}
        </Text>
      ) : null}

      {item.imageUrl && (
        <View className="w-full h-64 bg-orange-500 rounded-lg overflow-hidden items-center justify-center">
          <Ionicons name="image" size={80} color="rgba(255,255,255,0.5)" />
        </View>
      )}
    </View>
  );

  const renderEmptyPosts = () => (
    <View className="flex-1 items-center justify-center py-16">
      <View className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center mb-4">
        <Ionicons name="image-outline" size={40} color="#9CA3AF" />
      </View>
      <Text className="text-base font-medium text-gray-600 dark:text-gray-200">
        No posts found
      </Text>
    </View>
  );

  return (
    <View className="flex-1">
      {/* Search Bar */}
      <View className="bg-white dark:bg-black px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <View className="flex-row items-center bg-gray-50 dark:bg-gray-800 rounded-lg px-3 h-10">
          <Ionicons
            name="search"
            size={18}
            color={colorScheme === "dark" ? "white" : "#9CA3AF"}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search posts"
            placeholderTextColor={
              colorScheme === "dark" ? "#9CA3AF" : "#9CA3AF"
            }
            className="flex-1 ml-2 text-sm font-medium dark:bg-gray-800 dark:text-gray-200"
          />
        </View>
      </View>

      {/* Posts Count */}
      <View className="bg-white dark:bg-black px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <Text className="text-sm font-medium text-gray-600 dark:text-gray-200">
          {filteredPosts.length} posts found
        </Text>
      </View>

      {/* Posts List */}

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderPostItem}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          isFetching ? (
            <View className="py-4 items-center">
              <Text className="text-gray-500 dark:text-gray-300">
                Loading more posts…
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={renderEmptyPosts()}
        className="flex-1 bg-gray-50 dark:bg-black"
      />
    </View>
  );
}
