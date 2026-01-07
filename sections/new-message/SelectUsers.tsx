import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import SelectedUser from "./SelectedUser";
type SelectedUserType = {
  id: string;
  firstName: string;
  lastName: string;
};

type SelectUsersProps = {
  onSearchChange: (text: string) => void;
  selectedUsers?: Array<SelectedUserType>;
  onRemoveUser: (userId: string) => void;
};

function SelectUsers({
  onSearchChange,
  selectedUsers = [],
  onRemoveUser,
}: SelectUsersProps) {
  const [searchInput, setSearchInput] = React.useState("");

  const handleSearchChange = (text: string) => {
    setSearchInput(text);
    onSearchChange(text);
  };

  return (
    <View
      style={{ flexWrap: "wrap" }}
      className=" gap-1  flex-row p-2 bg-white rounded-xl text-base text-gray-900 border-2 border-azure-radiance-500"
    >
      {selectedUsers.map((user) => {
        return (
          <SelectedUser
            key={user.id}
            name={`${user.firstName} ${user.lastName}`}
            onRemove={() => onRemoveUser(user.id as string)}
          />
        );
      })}

      <View className=" h-10 ">
        <TextInput
          placeholder="Type name of the user or business"
          placeholderTextColor="#9CA3AF"
          value={searchInput}
          onChangeText={handleSearchChange}
        />
      </View>
    </View>
  );
}

export default SelectUsers;
