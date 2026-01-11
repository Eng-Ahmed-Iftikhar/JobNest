import { useAppSelector } from "@/hooks/useAppSelector";
import useChat from "@/hooks/useChat";
import { selectUser } from "@/store/reducers/userSlice";
import { CHAT_USER_ROLE, ChatUser } from "@/types/chat";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import MemberMenu from "./MemberMenu";

interface GroupMemberListProps {
  members?: ChatUser[];
  onMemberPress?: (member: ChatUser) => void;
}

const GroupMemberList: React.FC<GroupMemberListProps> = ({
  onMemberPress,
  members,
}) => {
  const params = useLocalSearchParams();
  const chatId = typeof params.id === "string" ? params.id : "";
  const user = useAppSelector(selectUser);
  const { chatUsers = [] } = useChat(chatId);
  const currentUserInChat = chatUsers.find(
    (userInChat) => userInChat.user.id === user?.id
  );
  const isCurrentUserAdmin = currentUserInChat?.role === CHAT_USER_ROLE.ADMIN;
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleMenuOpen = (id: string) => {
    setOpenMenuId(id);
  };
  const handleMenuClose = () => {
    setOpenMenuId(null);
  };

  return (
    <FlatList
      data={members}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View className="flex-row items-center py-2 justify-between">
          <TouchableOpacity
            className="flex-row items-center flex-1"
            onPress={() => onMemberPress && onMemberPress(item)}
          >
            <Image
              source={{ uri: item.user.profile.pictureUrl as string }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
              className="mr-3 bg-gray-200"
            />
            <View>
              <Text className="text-base font-semibold dark:bg-black">
                {item.user.profile.firstName} {item.user.profile.lastName}
              </Text>
              <Text className="text-sm font-semibold text-gray-500 mt-0.5">
                {item.role === CHAT_USER_ROLE.ADMIN ? "Admin" : "Member"}
              </Text>
            </View>
          </TouchableOpacity>
          {isCurrentUserAdmin && (
            <View style={{ position: "relative" }}>
              <TouchableOpacity
                className="p-2"
                onPress={() => handleMenuOpen(item.id)}
              >
                <Ionicons name="settings-outline" size={20} color="#6b7280" />
              </TouchableOpacity>
              <MemberMenu
                visible={openMenuId === item.id}
                onClose={handleMenuClose}
                isAdmin={item.role === CHAT_USER_ROLE.ADMIN}
                onMakeAdmin={() => {
                  // TODO: Make admin logic
                }}
                onRemoveAdmin={() => {
                  // TODO: Remove admin logic
                }}
              />
            </View>
          )}
        </View>
      )}
      ItemSeparatorComponent={() => (
        <View className="h-px bg-gray-100 my-0.5" />
      )}
    />
  );
};

export default GroupMemberList;
