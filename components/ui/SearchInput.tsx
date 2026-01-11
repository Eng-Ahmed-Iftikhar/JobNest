import React from "react";
import { TextInput, useColorScheme, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface SearchInputProps extends React.ComponentProps<typeof TextInput> {
  placeholder?: string;
  textViewStyle?: React.ComponentProps<typeof View>["style"];
}

function SearchInput({
  placeholder = "Search",
  textViewStyle,
  ...props
}: SearchInputProps) {
  const colorScheme = useColorScheme();
  return (
    <View
      className="flex-row items-center  dark:bg-gray-800 rounded-full px-3 h-11 border border-gray-200 dark:border-gray-700"
      style={textViewStyle}
    >
      <Icon
        name="search"
        size={18}
        color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        style={{ marginRight: 6 }}
      />
      <TextInput
        className="flex-1 text-base text-gray-800 dark:text-gray-200 py-2"
        placeholder={placeholder}
        placeholderTextColor={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        {...props}
      />
    </View>
  );
}

export default SearchInput;
