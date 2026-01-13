import React from "react";
import { TextInput, View } from "react-native";
import SelectedUser from "./SelectedUser";
type SelectedUserType = {
  id: string;
  firstName: string;
  lastName: string;
};

type SelectUsersProps = {
  onSearchChange: (text: string) => void;
  selectedUsers?: SelectedUserType[];
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
      className=" gap-1  flex-row px-2 bg-white dark:bg-black rounded-xl text-base  dark:text-gray-100 border-2 border-azure-radiance-500"
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

      <View className=" h-12 ">
        <TextInput
          placeholder="Type name of the user or business"
          placeholderTextColor="#9CA3AF"
          className="text-base dark:text-gray-100 min-w-[150px] max-w-[250px] flex-1 p-0 m-0"
          value={searchInput}
          onChangeText={handleSearchChange}
        />
      </View>
    </View>
  );
}

export default SelectUsers;
