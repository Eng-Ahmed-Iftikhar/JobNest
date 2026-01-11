import {
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
} from "@/api/services/authApi";
import CircularCountdown from "@/components/CircularCountdown";
import Button from "@/components/ui/Button";
import VerificationCodeInput from "@/components/ui/VerificationCodeInput";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React, { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";

const verifyResetCodeSchema = Yup.object().shape({
  code: Yup.string()
    .required("Reset code is required")
    .length(5, "Reset code must be 5 digits"),
});

export default function VerifyResetCodeForm() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [verifyResetCode, { isLoading }] = useVerifyResetCodeMutation();
  const [forgotPassword, { isLoading: isResending }] =
    useForgotPasswordMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSendAgain, setIsSendAgain] = useState<boolean>(true);

  const handleSendCode = useCallback(async () => {
    try {
      await forgotPassword({ email }).unwrap();
      setIsSendAgain(true);
    } catch (error: any) {
      const errorMsg = Array.isArray(error?.data?.message)
        ? error.data.message.join(", ")
        : error?.data?.message || "Failed to send verification code";
      setServerError(errorMsg);
    }
  }, [forgotPassword, email]);

  const handleSubmitForm = useCallback(
    async (values: { code: string }) => {
      setServerError(null);
      try {
        await verifyResetCode({
          email,
          code: values.code,
        }).unwrap();
        setIsSendAgain(false);
        router.push({
          pathname: "/(auth)/reset-password",
          params: { email, code: values.code },
        });
      } catch (err: any) {
        setServerError(err?.data?.message || "Invalid or expired reset code");
      }
    },
    [email, verifyResetCode]
  );

  return (
    <View className="flex-1">
      <Text className="text-2xl font-semibold mb-2 text-gray-500 dark:text-white">
        Verify Reset Code
      </Text>
      <Text className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-6">
        We've sent a 5-digit verification code to {email}. Please enter it below
        to proceed.
      </Text>

      <Formik
        initialValues={{ code: "" }}
        validationSchema={verifyResetCodeSchema}
        onSubmit={handleSubmitForm}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <View className="flex-1">
            {serverError && (
              <View className="mb-4 p-3 bg-red-50 rounded-lg">
                <Text className="text-sm font-medium text-red-600">
                  {serverError}
                </Text>
              </View>
            )}

            <View className="mb-6">
              <VerificationCodeInput
                length={5}
                value={values.code.split("")}
                onChange={(codeArray) => {
                  const code = codeArray.join("");
                  handleChange("code")(code);
                  // Clear server error when user starts typing
                  if (serverError) {
                    setServerError(null);
                  }
                }}
                isError={!!(touched.code && errors.code)}
                error={touched.code && errors.code ? errors.code : undefined}
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

            <TouchableOpacity
              disabled={isSendAgain || isResending}
              className="mt-6 gap-3 items-center justify-center"
              onPress={handleSendCode}
            >
              <Text
                className={`${
                  isSendAgain || isResending
                    ? "text-gray-400"
                    : "text-azure-radiance-500"
                } text-sm font-medium `}
              >
                {isResending
                  ? "Sending..."
                  : isSendAgain
                  ? "Code is sent"
                  : "Send code again"}
              </Text>
              {isSendAgain && (
                <CircularCountdown
                  seconds={60}
                  size={40}
                  onComplete={() => setIsSendAgain(false)}
                />
              )}
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
}
