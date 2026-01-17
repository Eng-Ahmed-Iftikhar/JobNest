import React, { useEffect, useMemo } from "react";
import { Animated, Pressable, Text, View } from "react-native";

type Props = {
  isSticky: boolean;
  activeTab?: "overview" | "jobs" | "posts";
  onTabChange?: (tab: "overview" | "jobs" | "posts") => void;
};

function StickyTabBar({ isSticky, activeTab, onTabChange }: Props) {
  const animatedRef = React.useRef<Animated.Value>(
    new Animated.Value(0),
  ).current;

  const containerClassNames = useMemo(
    () =>
      `bg-white flex-row dark:bg-black dark:border-gray-700 dark:border-b ` +
      (isSticky
        ? "absolute h-12 top-0 left-0 right-0 z-10"
        : "relative border-b border-gray-200 dark:border-gray-700"),
    [isSticky],
  );

  const translateY = useMemo(
    () =>
      animatedRef.interpolate({
        inputRange: [0, 1],
        outputRange: [isSticky ? -60 : 0, 0], // Adjust the -60 value based on the height of the tab bar
      }),
    [animatedRef, isSticky],
  );

  useEffect(() => {
    Animated.timing(animatedRef, {
      toValue: isSticky ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isSticky, animatedRef]);

  return (
    <Animated.View
      className={containerClassNames}
      style={{ transform: [{ translateY }] }}
    >
      <Pressable
        onPress={() => onTabChange && onTabChange("overview")}
        className="flex-1 py-3 items-center"
      >
        <Text
          className={`text-sm font-medium  ${
            activeTab === "overview"
              ? "text-azure-radiance-500"
              : "text-gray-500 dark:text-gray-300"
          } `}
        >
          Overview
        </Text>
        {activeTab === "overview" && (
          <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-azure-radiance-500" />
        )}
      </Pressable>

      <Pressable
        onPress={() => onTabChange && onTabChange("jobs")}
        className="flex-1 py-3 items-center"
      >
        <Text
          className={`text-sm font-medium  ${
            activeTab === "jobs"
              ? "text-azure-radiance-500"
              : "text-gray-500 dark:text-gray-300"
          }`}
        >
          Jobs
        </Text>
        {activeTab === "jobs" && (
          <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-azure-radiance-500" />
        )}
      </Pressable>

      <Pressable
        onPress={() => onTabChange && onTabChange("posts")}
        className="flex-1 py-3 items-center"
      >
        <Text
          className={`text-sm font-medium  ${
            activeTab === "posts"
              ? "text-azure-radiance-500"
              : "text-gray-500 dark:text-gray-300"
          }`}
        >
          Posts
        </Text>
        {activeTab === "posts" && (
          <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-azure-radiance-500" />
        )}
      </Pressable>
    </Animated.View>
  );
}

export default StickyTabBar;
