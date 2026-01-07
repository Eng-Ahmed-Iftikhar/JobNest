import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ButtonProps = {
  children?: React.ReactNode;
  loading?: boolean;
  variant?: "primary" | "outline" | "text";
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconPosition?: "left" | "right";
  iconColor?: string;
  textProps?: React.ComponentProps<typeof Text>;
  text?: string;
} & React.ComponentProps<typeof TouchableOpacity>;

function Button({
  children = "button",
  className,
  disabled = false,
  loading = false,
  variant = "primary",
  icon,
  iconSize = 18,
  iconPosition = "left",
  iconColor,
  textProps,
  ...props
}: ButtonProps) {
  const isPrimary = variant === "primary";
  const isOutline = variant === "outline";
  const isText = variant === "text";

  return (
    <TouchableOpacity
      disabled={disabled}
      className={
        "flex  justify-center rounded-lg h-12 w-full" +
        (isText
          ? " bg-transparent border-0"
          : disabled
            ? " bg-gray-300"
            : isPrimary
              ? " bg-azure-radiance-500"
              : " bg-white border-2 border-azure-radiance-500") +
        (className ? ` ${className}` : "")
      }
      {...props}
    >
      {loading && (
        <View className="animate-spin">
          <Ionicons
            name="reload"
            size={16}
            color={iconColor ? iconColor : isOutline ? "#1eadff" : "white"}
          />
        </View>
      )}

      {!loading && (
        <View className="flex-row items-center justify-center gap-2">
          {icon && iconPosition === "left" && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={
                iconColor
                  ? iconColor
                  : isText
                    ? "#1eadff"
                    : isOutline
                      ? "#1eadff"
                      : "white"
              }
            />
          )}
          {props.text !== "" && (
            <Text
              className={
                "font-semibold text-lg " +
                (isText
                  ? " text-azure-radiance-500 "
                  : isOutline
                    ? " text-azure-radiance-500"
                    : " text-white") +
                (textProps?.className ? ` ${textProps.className}` : "")
              }
              {...textProps}
            >
              {children}
            </Text>
          )}

          {icon && iconPosition === "right" && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={
                iconColor
                  ? iconColor
                  : isText
                    ? "#1eadff"
                    : isOutline
                      ? "#1eadff"
                      : "white"
              }
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

export default Button;
