import TextArea from "@/components/ui/TextArea";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { showErrorNotification } from "@/store/reducers/notificationSlice";
import { getMimeType } from "@/utils/files";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

import React from "react";
import { ActivityIndicator, Pressable, View } from "react-native";

const ACCENT = "#1eadff";

type ActionsProps = {
  loading?: boolean;
  onSendMessage?: (message: string) => void;
  onAttachFile?: (file: { uri: string; type: string; name: string }) => void;
  onSelectImage?: (image: { uri: string; type: string; name: string }) => void;
};

function SendActions({
  onSendMessage,
  onAttachFile,
  onSelectImage,
  loading,
}: ActionsProps) {
  const [message, setMessage] = React.useState("");
  const dispatch = useAppDispatch();

  const handleTextChange = (text: string) => {
    setMessage(text);
  };

  const handleSendMessage = () => {
    if (onSendMessage && message.trim().length > 0) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleFileAttach = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      copyToCacheDirectory: true,
    });
    if (result.canceled)
      return dispatch(showErrorNotification("File selection was canceled."));
    if (result.assets.length === 0)
      return dispatch(showErrorNotification("No file selected."));

    const file = result.assets[0];

    const fileObj = {
      uri: file.uri,
      type: getMimeType(file.name),
      name: file.name,
    };
    onAttachFile && onAttachFile(fileObj);
  };

  const handleImageSelect = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return dispatch(
        showErrorNotification("Permission to access media library is required!")
      );
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled)
      return dispatch(showErrorNotification("Image selection was canceled."));
    if (!result.assets.length)
      return dispatch(showErrorNotification("No image selected."));
    const image = result.assets[0];

    const imageObj = {
      uri: image.uri,
      type: "image/jpeg",
      name: `image_${Date.now()}.jpg`,
    };
    onSelectImage && onSelectImage(imageObj);
  };

  return (
    <View className="px-4 py-3 bg-white border-t border-gray-200">
      <View className="flex-row items-center gap-2 mb-2">
        <Pressable onPress={handleFileAttach} className="p-2">
          <Ionicons name="attach" size={20} color="#6B7280" />
        </Pressable>
        <Pressable onPress={handleImageSelect} className="p-2">
          <Ionicons name="image" size={20} color="#6B7280" />
        </Pressable>
      </View>
      <View className="flex-row items-center gap-2">
        <TextArea
          numberOfLines={2}
          className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-base text-gray-900 border border-gray-200"
          placeholder="Type a message"
          placeholderTextColor="#9CA3AF"
          onChangeText={handleTextChange}
          value={message}
        />
        {loading ? (
          <ActivityIndicator color={ACCENT} size={20} />
        ) : (
          <Pressable onPress={handleSendMessage} className="p-2">
            <Ionicons name="send" size={20} color={ACCENT} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default SendActions;
