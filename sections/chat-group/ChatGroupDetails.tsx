import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { useDeleteChatGroupMutation } from "@/api/services/chatApi";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import useChat from "@/hooks/useChat";
import { showErrorAlert, showSuccessAlert } from "@/store/reducers/alertSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import GroupMemberList from "./GroupMemberList";
import GroupMenu from "./GroupMenu";
import ProfileImage from "./ProfileImage";

interface ChatGroupDetailsProps {
  // Add props as needed, e.g. group data
}

const ChatGroupDetails: React.FC<ChatGroupDetailsProps> = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const chatId = typeof params.id === "string" ? params.id : "";
  // Mock group data; replace with actual data fetching logic
  const [menuVisible, setMenuVisible] = useState(false);
  const { chatGroup = null, chatUsers = [] } = useChat(chatId);
  const [deleteChatGroup] = useDeleteChatGroupMutation();
  const dispatch = useAppDispatch();
  const handleBack = () => {
    router.back();
  };

  const handleDeleteGroup = async () => {
    try {
      await deleteChatGroup(chatId).unwrap();
      dispatch(showSuccessAlert("Group deleted successfully."));

      router.back();
    } catch (error) {
      console.error("Failed to delete group:", error);
      dispatch(showErrorAlert("Failed to delete group."));
    }
  };

  return (
    <FlatList
      data={chatUsers}
      keyExtractor={(item) => item.id.toString()}
      className="bg-white dark:bg-black p-6 pb-12"
      ListHeaderComponent={
        <>
          {/* Top bar with Back, Edit, and Menu buttons */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <TouchableOpacity className="p-2" onPress={handleBack}>
                <Ionicons name="arrow-back" size={18} color="#111827" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              className="p-2"
              onPress={() => setMenuVisible(true)}
            >
              <Ionicons name="ellipsis-vertical" size={18} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* Group Menu Component */}
          <GroupMenu
            visible={menuVisible}
            onClose={() => setMenuVisible(false)}
            onEdit={() => {
              router.push({
                pathname: "/messages/chat/group/edit",
                params: { id: chatId },
              });
            }}
            onBlock={() => {
              // TODO: Implement block group logic
            }}
            onDelete={handleDeleteGroup}
          />

          <View className="items-center mb-8">
            <ProfileImage imageUrl={chatGroup?.iconUrl as string} size={90} />
            <Text className="text-2xl font-bold mt-4 dark:bg-black">
              {chatGroup?.name}
            </Text>
            <Text className="text-base text-gray-500 mt-2 text-center max-w-xs">
              {chatGroup?.description?.trim()
                ? chatGroup.description
                : "No description yet. Add a group description to let members know what this group is about."}
            </Text>
          </View>
          <View className="mt-4">
            <Text className="text-lg font-semibold mb-3 dark:bg-black">
              Group Members
            </Text>
          </View>
        </>
      }
      renderItem={({ item }) => <GroupMemberList members={[item]} />}
      ListFooterComponent={<View style={{ height: 24 }} />}
    />
  );
};

export default ChatGroupDetails;
