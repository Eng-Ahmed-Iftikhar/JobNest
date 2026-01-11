import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal as RNModal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeOnBackdropPress?: boolean;
  animationDuration?: number;
}

const { height: screenHeight } = Dimensions.get("window");

function Modal({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  closeOnBackdropPress = true,
  animationDuration = 200,
}: ModalProps) {
  const colorScheme = useColorScheme();
  const [shouldRender, setShouldRender] = useState(visible);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const openModal = useCallback(() => {
    setShouldRender(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animationDuration, fadeAnim, scaleAnim, slideAnim]);

  const animateClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShouldRender(false);
    });
  }, [animationDuration, fadeAnim, scaleAnim, slideAnim]);

  useEffect(() => {
    if (visible) openModal();
    else animateClose();
  }, [visible, openModal, animateClose]);

  const requestClose = useCallback(() => {
    onClose(); // parent controls `visible`
  }, [onClose]);

  const handleBackdropPress = useCallback(() => {
    if (closeOnBackdropPress) requestClose();
  }, [closeOnBackdropPress, requestClose]);

  if (!shouldRender) return null;

  return (
    <RNModal transparent visible animationType="none">
      <View className="flex-1 justify-center items-center">
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View
            className="absolute inset-0 bg-black/50"
            style={{ opacity: fadeAnim }}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          className="bg-white dark:bg-black border border-gray-700  rounded-2xl mx-4 max-w-sm w-full shadow-2xl"
          style={{
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          }}
        >
          {(title || showCloseButton) && (
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              {title && (
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {title}
                </Text>
              )}
              {showCloseButton && (
                <TouchableOpacity onPress={requestClose}>
                  <Icon
                    name="close"
                    size={16}
                    color={colorScheme === "dark" ? "#D1D5DB" : "#6B7280"}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
          <View>{children}</View>
        </Animated.View>
      </View>
    </RNModal>
  );
}

export default Modal;
