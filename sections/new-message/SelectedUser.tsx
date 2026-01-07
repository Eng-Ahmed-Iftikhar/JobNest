import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SelectedUserProps = {
  name: string;
  onRemove: () => void;
};
function SelectedUser(props: SelectedUserProps) {
  return (
    <View className="px-2 h-8 flex-row items-center  bg-azure-radiance-500  rounded-xl">
      <Text className="text-white font-medium ">{props.name}</Text>
      <TouchableOpacity onPress={props.onRemove}>
        <Ionicons name="close" size={16} color="#FFFFFF" className="ml-1" />
      </TouchableOpacity>
    </View>
  );
}

export default SelectedUser;
