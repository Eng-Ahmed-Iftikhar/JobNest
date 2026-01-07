import GoogleLogin from "@/components/GoogleLogin";
import Divider from "@/components/ui/Divider";
import RegisterForm from "@/sections/auth/register/RegisterForm";
import RegisterHeader from "@/sections/auth/register/RegisterHeader";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

function RegisterScreen() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        className="flex-1 bg-white px-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
      >
        <View className="mt-12">
          <RegisterHeader />
          <View className="mt-8 ">
            <GoogleLogin />
          </View>
          <Divider text="or" />
          <RegisterForm />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default RegisterScreen;
