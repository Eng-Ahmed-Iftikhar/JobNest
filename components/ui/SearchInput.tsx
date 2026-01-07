import React from "react";
import { View, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface SearchInputProps extends React.ComponentProps<typeof TextInput> {
  placeholder?: string;
}

function SearchInput({
  placeholder = "Search",
  style,
  ...props
}: SearchInputProps) {
  return (
    <View
      className="flex-row items-center bg-gray-100 rounded-full px-3 h-11 border border-gray-200"
      style={style}
    >
      <Icon
        name="search"
        size={18}
        color="#9CA3AF"
        style={{ marginRight: 6 }}
      />
      <TextInput
        className="flex-1 text-base text-gray-800"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
    </View>
  );
}

export default SearchInput;
