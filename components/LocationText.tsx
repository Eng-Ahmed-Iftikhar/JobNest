import React from "react";
import { Text, TextProps } from "react-native";

type Props = {
  location?: {
    city: string;
    state: string;
    country: string;
  };
} & TextProps;

function LocationText({ location, ...props }: Props) {
  if (!location) return null;
  return (
    <Text className="text-sm font-medium text-gray-600" {...props}>
      {[location?.city, location?.state, location?.country]
        .filter(Boolean)
        .join(", ")}
    </Text>
  );
}

export default LocationText;
