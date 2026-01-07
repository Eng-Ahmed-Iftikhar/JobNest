import React from "react";
import { Modal, View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FullScreenImageModalProps {
  visible: boolean;
  imageUrl: string;
  onClose: () => void;
}

const FullScreenImageModal: React.FC<FullScreenImageModalProps> = ({
  visible,
  imageUrl,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.95)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 10,
            padding: 8,
          }}
        >
          <Ionicons name="close" size={25} color="#fff" />
        </TouchableOpacity>
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: "90%",
            height: "80%",
            borderRadius: 12,
            resizeMode: "contain",
          }}
        />
      </View>
    </Modal>
  );
};

export default FullScreenImageModal;
