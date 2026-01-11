import React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

interface BottomSheetProps {
  visible: boolean;
  title?: string;
  onClose: () => void;
  onClear?: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showHandle?: boolean;
}

export default function BottomSheet({
  visible,
  title,
  onClose,
  onClear,
  children,
  footer,
  showHandle = true,
}: BottomSheetProps) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="bg-white dark:bg-black rounded-t-3xl pt-3 pb-4 px-4 shadow-xl">
          {showHandle && (
            <View className="items-center mb-3">
              <View className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </View>
          )}

          {(title || onClear) && (
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-semibold dark:bg-black">
                {title}
              </Text>
              {onClear ? (
                <Pressable onPress={onClear} className="p-2">
                  <Text className="text-sm font-medium  text-gray-500 dark:text-gray-200">
                    Clear
                  </Text>
                </Pressable>
              ) : (
                <Pressable onPress={onClose} className="p-2">
                  <Text className="text-sm font-medium  text-gray-500 dark:text-gray-200">
                    Close
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          <ScrollView
            className="max-h-[60vh]"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>

          {footer && <View className="mt-4">{footer}</View>}
        </View>
      </View>
    </Modal>
  );
}
