import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

type EmptyStateProps = {
  iconName: string;
  title: string;
  description: string;
  buttonText?: string;
  onButtonPress?: () => void;
  buttonIcon?: string;
};

export default function EmptyState({
  iconName,
  title,
  description,
  buttonText,
  onButtonPress,
  buttonIcon = "search",
}: EmptyStateProps) {
  return (
    <View className="flex-1 bg-gray-50 dark:bg-black items-center justify-center px-4">
      <View className="bg-gray-200 dark:bg-gray-700 rounded-full p-6 mb-6">
        <Icon name={iconName} size={48} color="#9CA3AF" />
      </View>

      {title && (
        <Text className="dark:bg-black dark:text-gray-100 text-xl font-bold text-center mb-3">
          {title}
        </Text>
      )}

      {description && (
        <Text className="text-gray-500 dark:text-gray-300 text-base text-center mb-8 px-4">
          {description}
        </Text>
      )}
      {buttonText && onButtonPress && (
        <TouchableOpacity
          className="bg-azure-radiance-500 flex-row items-center px-6 py-3 rounded-lg"
          onPress={onButtonPress}
        >
          <Icon name={buttonIcon} size={20} color="white" />
          {buttonText && (
            <Text className="text-white dark:text-gray-100 text-base font-semibold ml-2">
              {buttonText}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
