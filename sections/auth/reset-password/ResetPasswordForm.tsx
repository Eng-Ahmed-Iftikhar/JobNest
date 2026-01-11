import { useResetPasswordMutation } from "@/api/services/authApi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import * as Yup from "yup";

const resetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function ResetPasswordForm() {
  const { code } = useLocalSearchParams<{
    code: string;
  }>();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmitForm = useCallback(
    async (values: { newPassword: string; confirmPassword: string }) => {
      setServerError(null);
      setSuccess(null);
      try {
        await resetPassword({
          code,
          newPassword: values.newPassword,
        }).unwrap();
        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          router.replace("/(auth)/login");
        }, 2000);
      } catch (err: any) {
        setServerError(err?.data?.message || "Failed to reset password");
      }
    },
    [code, resetPassword]
  );

  return (
    <View className="flex-1">
      <Text className="text-2xl font-semibold mb-2 text-gray-500 dark:text-white">
        Reset Password
      </Text>
      <Text className="text-sm font-medium text-gray-600 mb-6 dark:text-gray-400">
        Choose a strong password for your account. Make sure it's at least 6
        characters long.
      </Text>

      <Formik
        initialValues={{ newPassword: "", confirmPassword: "" }}
        validationSchema={resetPasswordSchema}
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
          <View className="flex-1 flex-col">
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

            <View className="mb-4 ">
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                value={values.newPassword}
                onChangeText={handleChange("newPassword")}
                onBlur={handleBlur("newPassword")}
                isError={!!(touched.newPassword && errors.newPassword)}
                error={
                  touched.newPassword && errors.newPassword
                    ? errors.newPassword
                    : undefined
                }
              />
            </View>

            <View className="mb-6 ">
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm new password"
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                isError={!!(touched.confirmPassword && errors.confirmPassword)}
                error={
                  touched.confirmPassword && errors.confirmPassword
                    ? errors.confirmPassword
                    : undefined
                }
              />
            </View>

            <Button
              onPress={() => handleSubmit()}
              disabled={isLoading}
              loading={isLoading}
            >
              Reset Password
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
}
