import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

interface MemberMenuProps {
  visible: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onMakeAdmin: () => void;
  onRemoveAdmin: () => void;
}

const MemberMenu: React.FC<MemberMenuProps> = ({
  visible,
  onClose,
  isAdmin,
  onMakeAdmin,
  onRemoveAdmin,
}) => {
  if (!visible) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 30,
        right: 40,
        backgroundColor: "#fff",
        borderRadius: 8,
        elevation: 4,
        minWidth: 160,
        zIndex: 100,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }}
    >
      {isAdmin ? (
        <TouchableOpacity
          style={{ paddingVertical: 12, paddingHorizontal: 16 }}
          onPress={() => {
            onRemoveAdmin();
            onClose();
          }}
        >
          <Text style={{ color: "#111827" }}>Remove Admin</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{ paddingVertical: 12, paddingHorizontal: 16 }}
          onPress={() => {
            onMakeAdmin();
            onClose();
          }}
        >
          <Text style={{ color: "#111827" }}>Make Admin</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MemberMenu;
