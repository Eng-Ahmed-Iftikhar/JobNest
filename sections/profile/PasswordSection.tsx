import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import ChangePasswordModal from "./ChangePasswordModal";

export default function PasswordSection() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <View className="mb-8">
        <Text className="text-base font-semibold dark:bg-black mb-3">
          Password
        </Text>
        <Pressable onPress={() => setModalVisible(true)}>
          <Text className="text-base font-semibold text-azure-radiance-500">
            Change password
          </Text>
        </Pressable>
      </View>

      <ChangePasswordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}
