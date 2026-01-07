import React from "react";
import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

type TabItem = {
  key: string;
  label: string;
  href?: string;
  onPress?: () => void;
};

type TabsProps = {
  items: TabItem[];
  activeKey?: string;
  className?: string;
};

export default function Tabs({ items, activeKey, className }: TabsProps) {
  return (
    <View className={`flex-row ${className ?? ""}`.trim()}>
      {items.map((item, index) => {
        const pressableClasses = `${index !== items.length - 1 ? "mr-6 " : ""}py-3`;
        const textClasses = `text-sm font-medium font-semibold ${
          activeKey === item.key ? "text-azure-radiance-500" : "text-gray-500"
        }`;
        const underline = activeKey === item.key;

        const content = (
          <Pressable className={pressableClasses} onPress={item.onPress}>
            <Text className={textClasses}>{item.label}</Text>
            {underline && (
              <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-azure-radiance-500" />
            )}
          </Pressable>
        );

        return item.href ? (
          <Link href={item.href} asChild key={item.key}>
            {content}
          </Link>
        ) : (
          <React.Fragment key={item.key}>{content}</React.Fragment>
        );
      })}
    </View>
  );
}
