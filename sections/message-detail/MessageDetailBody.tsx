import {
  useGetChatMessagesQuery,
  useGetChatQuery,
} from "@/api/services/chatApi";
import AppLoader from "@/components/AppLoader";
import useChat from "@/hooks/useChat";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SectionList,
  Text,
  View,
} from "react-native";
import MessageBubble from "./MessageBubble";
import MessgesHeader from "./MessgesHeader";
import { ChatMessage } from "@/types/chat";

const PAGE_SIZE = 20;

const MessageDetailBody = () => {
  const param = useLocalSearchParams();
  const id = typeof param.id === "string" ? param.id : "";
  const { chat } = useChat(id);
  const { isLoading } = useGetChatQuery(id, {
    skip: chat ? true : false,
    refetchOnMountOrArgChange: true,
  });

  const [page, setPage] = useState<number>(1);

  const flatListRef = useRef<FlatList>(null);

  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    isFetching: isMessagesFetching,
  } = useGetChatMessagesQuery(
    {
      id: chat?.id || "",
      params: { page, pageSize: PAGE_SIZE },
    },
    { skip: !chat, refetchOnMountOrArgChange: true }
  );

  const totalMessages = messagesData?.total || 0;
  const resPage = messagesData?.page || 0;
  const resPageSize = messagesData?.pageSize || PAGE_SIZE;
  const receivedCount = Number(resPage) * Number(resPageSize);

  // Handler for when user scrolls to the top (onEndReached for inverted FlatList)
  const handleEndReached = useCallback(() => {
    if (receivedCount >= totalMessages) return;
    setPage((prevPage) => prevPage + 1);
  }, [receivedCount, totalMessages]);

  // Scroll to bottom when messagesByDate changes (new message)
  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 999999, animated: true });
      }, 100);
    }
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => (
      <MessageBubble key={item.id} message={item} />
    ),
    []
  );

  const renderSectionFooter = useCallback(
    ({ section: { date } }: { section: { date: Date } }) => (
      <MessgesHeader date={date} />
    ),
    []
  );

  if (isLoading) {
    return (
      <View className="flex-1 relative justify-center items-center">
        <AppLoader />
      </View>
    );
  }
  const messagesWithDates = chat?.messagesWithDates || [];

  return (
    <View className="flex-1 bg-white">
      {(isMessagesLoading || isMessagesFetching) && (
        <View className="flex-row items-center justify-center py-2 gap-3">
          <ActivityIndicator />
          <Text className="text-center text-gray-500 py-2">
            Loading new messages...
          </Text>
        </View>
      )}
      <SectionList
        className="flex-1"
        sections={
          messagesWithDates.filter((section) => section.data.length > 0) || []
        }
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionFooter={renderSectionFooter}
        inverted
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

export default MessageDetailBody;
