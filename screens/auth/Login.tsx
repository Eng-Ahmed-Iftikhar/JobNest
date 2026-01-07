import GoogleLogin from "@/components/GoogleLogin";
import Divider from "@/components/ui/Divider";
import LoginForm from "@/sections/auth/login/LoginForm";
import LoginHeader from "@/sections/auth/login/LoginHeader";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

function LoginScreen() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        className="flex-1  px-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
      >
        <View className="flex-1 mt-12">
          <LoginHeader />
          <View className="mt-8 ">
            <GoogleLogin />
          </View>
          <Divider text="or" />
          <LoginForm />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
