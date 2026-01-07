import FullScreenImageModal from "@/components/FullScreenImageModal";
import useChat from "@/hooks/useChat";
import { CHAT_MESSAGE_TYPE, ChatMessage, ChatMessageFile } from "@/types/chat";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type MessageProps = {
  message: ChatMessage & { file?: ChatMessageFile | null };
  loading?: boolean;
};

function Message({ message, loading = false }: MessageProps) {
  const { currentChatUser } = useChat(message.chatId);
  const isOwn = message.senderId === currentChatUser?.id;
  const [showImageModal, setShowImageModal] = useState(false);

  if (message.messageType === CHAT_MESSAGE_TYPE.IMAGE) {
    const imageUrl = message.fileUrl || message.file?.uri || "";
    return (
      <>
        <View className="mb-2 relative h-[200px] w-[200px] justify-center items-center rounded-lg overflow-hidden p-1 bg-azure-radiance-500">
          {loading && (
            <View
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.55)",
              }}
              className="absolute z-50 top-0 left-0 right-0 bottom-0 justify-center items-center"
            >
              <ActivityIndicator size="small" color="#fff" />
            </View>
          )}
          <TouchableOpacity
            style={{ width: "100%", height: "100%" }}
            activeOpacity={0.85}
            onPress={() => setShowImageModal(true)}
          >
            <Image
              source={{ uri: imageUrl }}
              style={{ width: "100%", height: "100%", borderRadius: 8 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
        <FullScreenImageModal
          visible={showImageModal}
          imageUrl={imageUrl}
          onClose={() => setShowImageModal(false)}
        />
      </>
    );
  }

  if (message.messageType === CHAT_MESSAGE_TYPE.FILE) {
    const fileName = message.fileUrl?.split("/").pop() || "File";
    const fileExt = fileName.split(".").pop()?.toLowerCase() || "file";
    const fileIcon =
      fileExt === "pdf"
        ? "document"
        : fileExt === "doc" || fileExt === "docx"
          ? "document-text"
          : fileExt === "xls" || fileExt === "xlsx"
            ? "document"
            : fileExt === "ppt" || fileExt === "pptx"
              ? "document"
              : "attach";

    const handleOpenFile = async () => {
      if (Platform.OS === "android" && message.fileUrl) {
        try {
          await Linking.openURL(message.fileUrl);
        } catch (e) {
          // Optionally show error toast
        }
      }
    };

    return (
      <TouchableOpacity
        className="mb-2 p-3 bg-white rounded-lg border border-gray-300 flex-row items-center gap-3"
        activeOpacity={0.8}
        onPress={handleOpenFile}
      >
        <View className="bg-gray-100 rounded-full p-2">
          <Ionicons name={fileIcon} size={28} color="#3b82f6" />
        </View>
        <View className="flex-1">
          <Text
            numberOfLines={1}
            className="text-base font-medium text-gray-900"
          >
            {fileName}
          </Text>
          <Text className="text-xs text-gray-400 mt-1">Tap to open file</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View
      className={
        "px-4 py-3 rounded-2xl max-w-xs " +
        (isOwn ? "bg-azure-radiance-500 self-end " : "bg-gray-100 self-start ")
      }
    >
      <Text className={"text-base " + (isOwn ? "text-white" : "text-gray-900")}>
        {message.text}
      </Text>
    </View>
  );
}

export default Message;
