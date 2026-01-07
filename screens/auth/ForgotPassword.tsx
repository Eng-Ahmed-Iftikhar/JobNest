import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import ForgotPasswordForm from "@/sections/auth/forgot-password/ForgotPasswordForm";

export default function ForgotPasswordScreen() {
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
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
      >
        <View className="flex-1 mt-12">
          <ForgotPasswordForm />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
