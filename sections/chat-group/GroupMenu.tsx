import ConfirmationButton from "@/components/ConfirmationButton";
import { useAppSelector } from "@/hooks/useAppSelector";
import useChat from "@/hooks/useChat";
import { selectUser } from "@/store/reducers/userSlice";
import { CHAT_USER_ROLE } from "@/types/chat";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, View, TouchableOpacity, Text } from "react-native";

interface GroupMenuProps {
  visible: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onBlock?: () => void;
  onLeave?: () => void;
  onDelete?: () => void;
}

const GroupMenu: React.FC<GroupMenuProps> = ({
  visible,
  onClose,
  onEdit,
  onBlock,
  onLeave,
  onDelete,
}) => {
  const user = useAppSelector(selectUser);
  const params = useLocalSearchParams();
  const chatId = typeof params.id === "string" ? params.id : "";

  const { chatUsers = [], chatGroup } = useChat(chatId);
  const currentUserInChat = chatUsers.find(
    (userInChat) => userInChat.user.id === user?.id
  );
  const deleteGroup = chatGroup?.deletedAt ? true : false;
  const isAdmin = currentUserInChat?.role === CHAT_USER_ROLE.ADMIN;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.2)" }}
        onPress={onClose}
      >
        <View
          style={{
            position: "absolute",
            top: 90,
            right: 50,
            backgroundColor: "#fff",
            borderRadius: 8,
            elevation: 4,
            minWidth: 180,
          }}
          className="p-2"
        >
          {isAdmin && (
            <TouchableOpacity
              className="py-3 px-4 flex-row items-center gap-2"
              onPress={() => {
                onEdit && onEdit();
                onClose();
              }}
            >
              <Ionicons name="pencil" size={16} color="#111827" />
              <Text className="text-gray-900">Edit Group</Text>
            </TouchableOpacity>
          )}
          {!isAdmin && (
            <>
              <ConfirmationButton
                variant="button"
                buttonProps={{
                  variant: "text",
                  icon: "lock-open-outline",
                  iconSize: 16,
                  iconPosition: "left",
                  iconColor: "red",
                  textProps: { className: "text-gray-900 text-start " },
                  text: "Block Group",
                  className: " py-3 px-4 w-full items-start ",
                }}
                modalProps={{
                  title: "Block Group",
                  icon: "lock-open-outline",
                  iconColor: "red",
                  message: "Are you sure you want to block this group?",
                  confirmText: "Block",
                }}
                onConfirm={() => {
                  onBlock && onBlock();
                  onClose();
                }}
              />
              <ConfirmationButton
                variant="button"
                buttonProps={{
                  variant: "text",
                  icon: "log-out-outline",
                  iconSize: 16,
                  iconPosition: "left",
                  iconColor: "red",
                  textProps: { className: "text-gray-900 text-start " },
                  text: "Leave Group",
                  className: " py-3 px-4 w-full items-start ",
                }}
                modalProps={{
                  title: "Leave Group",
                  icon: "log-out-outline",
                  iconColor: "red",
                  message: "Are you sure you want to leave this group?",
                  confirmText: "Leave",
                }}
                onConfirm={() => {
                  onLeave && onLeave();
                  onClose();
                }}
              />
            </>
          )}

          {isAdmin && !deleteGroup && (
            <ConfirmationButton
              variant="button"
              buttonProps={{
                variant: "text",
                icon: "trash",
                iconSize: 16,
                iconPosition: "left",
                iconColor: "red",
                textProps: { className: "text-gray-900 text-start " },
                text: "Delete Group",
                className: " py-3 px-4 w-full items-start ",
              }}
              modalProps={{
                title: "Delete Group",
                icon: "trash",
                iconColor: "red",
                message: "Are you sure you want to delete this group?",
                confirmText: "Delete",
              }}
              onConfirm={() => {
                onDelete && onDelete();
                onClose();
              }}
            />
          )}
        </View>
      </Pressable>
    </Modal>
  );
};

export default GroupMenu;
