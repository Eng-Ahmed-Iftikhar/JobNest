import { useForgotPasswordMutation } from "@/api/services/authApi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default function ForgotPasswordForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmitForm = async (values: { email: string }) => {
    setServerError(null);
    setSuccess(null);
    try {
      await forgotPassword(values).unwrap();
      setSuccess("Reset code sent. Redirecting...");
      setTimeout(() => {
        router.push({
          pathname: "/(auth)/verify-reset-code",
          params: { email: values.email },
        });
      }, 1500);
    } catch (err: any) {
      setServerError(err?.data?.message || "Failed to send reset code");
    }
  };

  return (
    <View className="flex-1">
      <Text className="text-2xl font-semibold text-black dark:text-white mb-2">
        Forgot Password
      </Text>
      <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-6">
        Enter your email address and we&apos;ll send you a verification code to
        reset your password
      </Text>

      <Formik
        initialValues={{ email: "" }}
        validationSchema={forgotPasswordSchema}
        onSubmit={handleSubmitForm}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View className="flex-1">
            {serverError && (
              <View className="mb-4 p-3 bg-red-50 rounded-lg">
                <Text className="text-sm font-medium text-red-600">
                  {serverError}
                </Text>
              </View>
            )}

            {success && (
              <View className="mb-4 p-3 bg-green-50 rounded-lg">
                <Text className="text-sm font-medium text-green-600">
                  {success}
                </Text>
              </View>
            )}

            <View className="mb-6">
              <Input
                label="Email"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                isError={!!(touched.email && errors.email)}
                error={touched.email && errors.email ? errors.email : undefined}
              />
            </View>

            <Button
              onPress={() => handleSubmit()}
              disabled={isLoading}
              loading={isLoading}
              icon="arrow-forward"
              iconPosition="right"
            >
              Continue
            </Button>
            <View className="flex-row  mt-6 items-center gap-1">
              <Text className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Remember your password?
              </Text>
              <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
                <Text className="text-sm text-azure-radiance-500 font-medium">
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}
