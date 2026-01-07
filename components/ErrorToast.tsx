import React, { useEffect } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ErrorToastProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function ErrorToast({
  visible,
  message,
  onClose,
  duration = 3000,
}: ErrorToastProps) {
  const [opacity] = React.useState(new Animated.Value(0));
  const [translateY] = React.useState(new Animated.Value(-20));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
      className="absolute bottom-8 left-4 right-4 z-50"
    >
      <View className="bg-red-500 rounded-xl px-4 py-3 flex-row items-center justify-between shadow-lg">
        <View className="flex-row items-center flex-1">
          <Ionicons name="alert-circle" size={24} color="white" />
          <Text className="text-white font-semibold text-base ml-3 flex-1">
            {message}
          </Text>
        </View>
        <Pressable onPress={handleClose} className="ml-2 p-1">
          <Ionicons name="close" size={20} color="white" />
        </Pressable>
      </View>
    </Animated.View>
  );
}
