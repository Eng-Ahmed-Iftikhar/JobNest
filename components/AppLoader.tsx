import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Image, View } from "react-native";
import AppLogo from "../assets/images/Logo.png"; // Adjust the path as necessary
function AppLoader() {
  return (
    <View className="flex-1  items-center justify-center ">
      <Image className="h-32 w-32" source={AppLogo} />
      <View className="animate-spin">
        <AntDesign name="loading" size={18} color="blue" />
      </View>
    </View>
  );
}

export default AppLoader;
