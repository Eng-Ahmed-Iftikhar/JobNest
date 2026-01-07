import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "@/components/ui/Modal";
import { Ionicons } from "@expo/vector-icons";

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

function ConfirmationModal({
  visible,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonColor = "bg-azure-radiance-500",
  icon = "alert-circle-outline",
  iconColor = "#EF4444",
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      showCloseButton={false}
      closeOnBackdropPress={true}
    >
      <View className="items-center">
        {/* Icon */}
        <View className="w-16 h-16 rounded-full bg-red-50 items-center justify-center mb-4">
          <Ionicons name={icon} size={32} color={iconColor} />
        </View>

        {/* Message */}
        <Text className="text-base text-gray-700 text-center mb-6 leading-6">
          {message}
        </Text>

        {/* Buttons */}
        <View className="flex-row space-x-3 gap-2 w-full">
          <TouchableOpacity
            onPress={onClose}
            className="flex-1 py-3 px-4 rounded-lg border border-gray-300"
          >
            <Text className="text-gray-700 font-semibold text-center">
              {cancelText}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleConfirm}
            className={`flex-1 py-3 px-4 rounded-lg  ${confirmButtonColor}`}
          >
            <Text className="text-white font-semibold text-center">
              {confirmText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default ConfirmationModal;
