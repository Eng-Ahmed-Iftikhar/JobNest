import React, { useMemo, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Octicons"; // or 'react-native-vector-icons/Ionicons'

type InputProps = {
  label?: string;
  type?: "text" | "password";
  error?: string;
  isError?: boolean;
} & React.ComponentProps<typeof TextInput>;

export default function Input({
  label = "",
  type = "text",
  error = "",
  isError = false,
  ...props
}: InputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const colorScheme = useColorScheme();

  const input = useMemo(() => {
    switch (type) {
      case "text":
        return (
          <TextInput
            placeholderTextColor={colorScheme === "dark" ? "#d1d5db" : "gray"}
            className={`border dark:border-gray-600 min-h-12 dark:text-white  font-medium ${
              isError ? "border-red-500" : "border-gray-300"
            }  rounded-lg px-4 py-2 text-base`}
            {...props}
          />
        );

      case "password":
        return (
          <View
            className={`flex-row min-h-12 items-center border ${
              isError
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } rounded-lg px-3`}
          >
            <TextInput
              secureTextEntry={!passwordVisible}
              placeholderTextColor={colorScheme === "dark" ? "#d1d5db" : "gray"}
              className="flex-1 py-2 text-base font-medium dark:text-white "
              {...props}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Icon
                name={passwordVisible ? "eye-closed" : "eye"}
                size={16}
                color="#6B7280" // Tailwind's gray-500
              />
            </TouchableOpacity>
          </View>
        );

      default:
        return (
          <TextInput
            className="border min-h-12 font-medium border-gray-300 dark:border-gray-600 rounded-lg  text-base"
            {...props}
          />
        );
    }
  }, [colorScheme, isError, passwordVisible, props, type]);

  return (
    <View className=" flex-1">
      {label && (
        <Text className="text-sm font-medium :text-gray-600 dark:text-gray-300 mb-1  ">
          {label}
        </Text>
      )}
      {input}
      {isError && (
        <Text className="text-red-500 text-sm font-medium mt-1 ">{error}</Text>
      )}
    </View>
  );
}
