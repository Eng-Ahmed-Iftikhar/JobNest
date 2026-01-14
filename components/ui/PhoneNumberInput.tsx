import React from "react";
import { Text, TextInput, useColorScheme, View } from "react-native";
import Select, { SelectItem } from "./Select";

type PhoneNumberInputProps = {
  label?: string;
  error?: string;
  isError?: boolean;
  countryCodeValue?: string;
  countryCodeItems?: SelectItem[];
  countryCodePlaceholder?: string;
  onCountryCodeChange?: (value: any) => void;
  inputNumberProps?: React.ComponentProps<typeof TextInput>;
  disabled?: boolean;
};

function PhoneNumberInput({
  label,
  isError,
  error,
  countryCodeValue,
  countryCodeItems = [],
  countryCodePlaceholder = "Code",
  onCountryCodeChange,
  inputNumberProps,
  disabled = false,
}: PhoneNumberInputProps) {
  const colorScheme = useColorScheme();
  return (
    <View>
      {label && (
        <Text className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
          {label}
        </Text>
      )}
      <View className="flex-row items-center gap-2">
        <View className="w-[30%]">
          <Select
            placeholder={countryCodePlaceholder}
            items={countryCodeItems}
            value={countryCodeValue}
            onValueChange={onCountryCodeChange}
            disabled={disabled}
          />
        </View>
        <View className="border flex justify-center h-12 w-[68%] border-gray-300 dark:border-gray-700 rounded-lg px-3">
          <TextInput
            className="text-sm font-medium dark:bg-black text-gray-900 dark:text-white p-0 m-0"
            placeholderTextColor={
              colorScheme === "dark" ? "#9ca3af" : "#6b7280"
            }
            editable={!disabled}
            {...inputNumberProps}
          />
        </View>
      </View>
      {isError && (
        <Text className="text-red-500 text-sm font-medium mt-1">{error}</Text>
      )}
    </View>
  );
}

export default PhoneNumberInput;
