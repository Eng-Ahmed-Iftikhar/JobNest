import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export interface SelectItem {
  label: string;
  value: any;
  key?: string | number;
}

type SelectProps = {
  label?: string;
  error?: string;
  isError?: boolean;
  placeholder?: string;
  value?: any;
  onValueChange?: (value: any) => void;
  items?: SelectItem[];
  disabled?: boolean;
};

function Select({
  label,
  isError,
  error,
  placeholder = "Search or select an option",
  value,
  onValueChange,
  items = [],
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const colorScheme = useColorScheme();
  const selectedItem = items.find((item) => item.value === value);

  // Filter items based on search text
  const filteredItems = useMemo(() => {
    if (!searchText.trim()) return items;
    const search = searchText.toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(search));
  }, [items, searchText]);

  const handleSelect = useCallback(
    (itemValue: any) => {
      onValueChange?.(itemValue);
      setSearchText("");
      setIsOpen(false);
    },
    [onValueChange]
  );
  const handleOpen = useCallback(() => {
    if (!disabled) {
      setSearchText("");
      setIsOpen(true);
    }
  }, [disabled]);

  const handleClose = useCallback(() => {
    setSearchText("");
    setIsOpen(false);
  }, []);

  return (
    <View className="flex-1">
      {label && (
        <Text className="text-sm font-medium text-gray-600 dark:text-gray-200 mb-1">
          {label}
        </Text>
      )}
      <TouchableOpacity
        onPress={handleOpen}
        disabled={disabled}
        className={`border h-12 border-gray-300 dark:border-gray-700 rounded-lg px-3 flex-row items-center justify-between ${
          disabled ? "bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-black"
        }`}
      >
        <Text
          className={`text-sm font-medium ${
            selectedItem
              ? "text-gray-800 dark:text-gray-200"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={
            disabled ? "#9CA3AF" : colorScheme === "dark" ? "white" : "#6B7280"
          }
        />
      </TouchableOpacity>
      {isError && (
        <Text className="text-red-500 text-sm font-medium mt-1">{error}</Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <Pressable
          className="flex-1 bg-black/50   justify-center items-center"
          onPress={handleClose}
        >
          <Pressable
            className="bg-white dark:bg-black border border-gray-500 dark:border-gray-700 overflow-hidden rounded-2xl w-11/12 max-h-96"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="p-4 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                {label}
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 bg-gray-50 dark:bg-gray-800 h-12">
                <Ionicons name="search" size={18} color="#6B7280" />
                <TextInput
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder="Search..."
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 ml-2 text-sm font-medium text-gray-800 dark:text-gray-200"
                  autoFocus
                />
                {searchText.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchText("")}>
                    <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <ScrollView className="max-h-80 ">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <TouchableOpacity
                    key={
                      item.key !== undefined
                        ? item.key
                        : `${item.value}-${index}`
                    }
                    onPress={() => handleSelect(item.value)}
                    className={`p-4 border-b border-gray-100  dark:border-gray-700 flex-row items-center justify-between ${
                      item.value === value ? "bg-azure-radiance-50" : ""
                    }`}
                  >
                    <Text
                      className={`text-base ${
                        item.value === value
                          ? "text-azure-radiance-600 font-semibold"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {item.label}
                    </Text>
                    {item.value === value && (
                      <Ionicons name="checkmark" size={24} color="#1eadff" />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View className="p-8 items-center">
                  <Text className="text-gray-500 text-sm font-medium">
                    No results found
                  </Text>
                </View>
              )}
            </ScrollView>
            <TouchableOpacity
              onPress={handleClose}
              className="p-4 border-t border-gray-200 dark:border-gray-700"
            >
              <Text className="text-center text-azure-radiance-600 font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export default Select;
