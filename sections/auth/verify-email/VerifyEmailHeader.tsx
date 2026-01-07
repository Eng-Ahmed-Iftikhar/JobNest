import { useAppSelector } from "@/hooks/useAppSelector";
import { selectUser } from "@/store/reducers/userSlice";
import React from "react";
import { Text, View } from "react-native";

function VerifyEmailHeader() {
  const user = useAppSelector(selectUser);

  return (
    <View className="flex items-center w-3/4 mx-auto">
      <Text className=" text-2xl font-semibold ">Confirm your email</Text>
      <Text className="text-sm font-medium text-gray-400 text-center  mt-2">
        Please enter the code we've sent to {user?.email.email || "your email"}
      </Text>
    </View>
  );
}

export default VerifyEmailHeader;
