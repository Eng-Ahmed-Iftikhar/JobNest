import {
  useBlockChatMutation,
  useMuteChatMutation,
  useUnblockChatMutation,
  useUnMuteChatMutation,
} from "@/api/services/chatApi";
import ConfirmationModal from "@/components/ConfirmationModal";
import LocationText from "@/components/LocationText";
import Avatar from "@/components/ui/Avatar";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import useChat from "@/hooks/useChat";
import ChatUserHeader from "@/sections/chat-user-profile/ChatUserHeader";
import MuteOptionModal from "@/sections/chat-user-profile/MuteOptionModal";
import SettingMenuModal from "@/sections/chat-user-profile/SettingMenuModal";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/store/reducers/notificationSlice";
import { selectUser } from "@/store/reducers/userSlice";
import { useLocalSearchParams } from "expo-router";
import moment from "moment";
import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";

const AVATAR_SIZE = 80;

function ChatUserProfile() {
  const params = useLocalSearchParams();
  const id = typeof params.id === "string" ? params.id : "";
  const user = useAppSelector(selectUser);
  const { chatUsers = [], chat, chatMutes = [] } = useChat(id);
  const chatUser = chatUsers.find((usr) => usr.userId !== user?.id);
  const [blockChat] = useBlockChatMutation();
  const [unblockChat] = useUnblockChatMutation();
  const [muteUser] = useMuteChatMutation();
  const [unMuteUser] = useUnMuteChatMutation();
  const name =
    chatUser?.user.profile.firstName + " " + chatUser?.user.profile.lastName ||
    "Unknown User";
  const image = chatUser?.user.profile.pictureUrl || undefined;
  const location = chatUser?.user.profile.location || "";
  const dispatch = useAppDispatch();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMuteModal, setShowMuteModal] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [userAction, setUserAction] = useState<"block" | "unmute">("block");
  const blockedUser = chat?.blocks?.find(
    (block) => block.chatUserId === chatUser?.id && !block.deletedAt
  );

  const mutedEntry = chatMutes.find(
    (mute) =>
      mute.chatUserId === chatUser?.id &&
      moment(mute.mutedTill).isAfter(moment())
  );

  const isMuted = Boolean(mutedEntry);

  const handleBlockUser = useCallback(async () => {
    try {
      if (!chat) return;
      if (blockedUser) {
        await unblockChat({
          chatId: chat.id,
          blockId: blockedUser.id,
        }).unwrap();
      } else {
        await blockChat({
          id: chat.id,
          body: { userId: chatUser?.userId || "" },
        }).unwrap();
      }
      setMenuVisible(false);
      setShowConfirmModal(false);
      dispatch(
        showSuccessNotification(
          blockedUser
            ? "User unblocked successfully"
            : "User blocked successfully"
        )
      );
    } catch (error) {
      dispatch(showErrorNotification("An error occurred. Please try again."));
    }
  }, [blockChat, chat, blockedUser]);

  const handleMuteUser = useCallback(
    async (date?: string) => {
      if (!chat) return;
      if (!chatUser) return;
      try {
        if (isMuted) {
          await unMuteUser({
            chatId: chat.id,
            muteId: mutedEntry?.id || "",
          }).unwrap();
        } else {
          await muteUser({
            chatId: chat.id,
            body: { chatUserId: chatUser.id, mutedTill: date || "" },
          }).unwrap();
        }
        setShowMuteModal(false);
        setMenuVisible(false);
        dispatch(
          showSuccessNotification(
            isMuted ? "User unmuted successfully" : "User muted successfully"
          )
        );
      } catch (error) {
        dispatch(showErrorNotification("An error occurred. Please try again."));
      }
    },
    [chat, chatUser, isMuted, muteUser, unMuteUser]
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Top bar with back and menu */}
      <ChatUserHeader onMenuToggle={setMenuVisible} />

      {/* Header with avatar, name, and info */}
      <View className="items-center pt-4 pb-6 bg-white">
        <Avatar imageUrl={image} name="" size={AVATAR_SIZE} />
        <Text className="text-xl font-bold text-gray-900 mb-1">{name}</Text>
        {location && <LocationText location={location} />}
      </View>

      {/* Divider */}
      <View className="h-px bg-gray-200 mx-4 mb-2" />

      {/* Menu Modal */}

      <SettingMenuModal
        blocked={Boolean(blockedUser)}
        visible={menuVisible}
        muted={isMuted}
        onBlockUser={() => {
          setConfirmationTitle(blockedUser ? "Unblock User" : "Block User");
          setConfirmationMessage(
            blockedUser
              ? "Are you sure you want to unblock this user?"
              : "Are you sure you want to block this user? You will not receive messages from them."
          );
          setUserAction("block");
          setShowConfirmModal(true);
        }}
        onMuteUser={() => {
          setConfirmationTitle(isMuted ? "Unmute User" : "Mute User");
          setConfirmationMessage(
            isMuted
              ? "Are you sure you want to unmute this user?"
              : "Are you sure you want to mute this user?"
          );
          setUserAction("unmute");
          if (isMuted) {
            setShowConfirmModal(true);
            return;
          }
          setShowMuteModal(true);
        }}
        onClose={() => setMenuVisible(false)}
      />

      <MuteOptionModal
        visible={showMuteModal}
        onClose={() => setShowMuteModal(false)}
        onSelect={handleMuteUser}
      />

      <ConfirmationModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={confirmationTitle}
        message={confirmationMessage}
        icon={
          userAction === "block"
            ? blockedUser
              ? "lock-open-outline"
              : "lock-closed-outline"
            : isMuted
              ? "volume-high-outline"
              : "volume-mute-outline"
        }
        onConfirm={userAction === "block" ? handleBlockUser : handleMuteUser}
      />
    </View>
  );
}

export default ChatUserProfile;
