import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect } from "react";
import { Animated, Pressable, Text, View } from "react-native";

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

  const handleClose = useCallback(() => {
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
  }, [onClose, opacity, translateY]);

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
  }, [duration, handleClose, opacity, translateY, visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
      className="absolute top-8 left-4 right-4 z-50"
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
