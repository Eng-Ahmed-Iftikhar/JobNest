import React from "react";
import { Image, useColorScheme, View } from "react-native";
import AppLogo from "../assets/images/Logo.png";
import CustomSpinner from "./CustomSpinner";
function AppLoader() {
  const colorScheme = useColorScheme();
  return (
    <View className="flex-1 bg-white dark:bg-black items-center justify-center ">
      <Image className="h-32 w-32" source={AppLogo} />
      <View className="mt-4">
        <CustomSpinner
          size="medium"
          color={colorScheme === "dark" ? "#ffffff" : "#3b82f6"}
        />
      </View>
    </View>
  );
}

export default AppLoader;
