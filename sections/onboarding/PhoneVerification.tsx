import {
  useSendPhoneVerificationMutation,
  useVerifyPhoneCodeMutation,
} from "@/api/services/authApi";
import CircularCountdown from "@/components/CircularCountdown";
import Button from "@/components/ui/Button";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import useOnboarding from "@/hooks/useOnboarding";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/store/reducers/notificationSlice";
import { OnboardingSteps } from "@/types/onboarding";
import { PhoneNumber } from "@/types/user";
import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";

function PhoneVerificationScreen() {
  const { handleChangeCurrentStep, handleUserProfile, userProfile } =
    useOnboarding();
  const dispatch = useAppDispatch();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const [canResend, setCanResend] = useState(false);

  const [sendPhoneVerification, { isLoading: isSending }] =
    useSendPhoneVerificationMutation();
  const [verifyPhoneCode, { isLoading: isVerifying }] =
    useVerifyPhoneCodeMutation();

  const handleResendCode = useCallback(async () => {
    try {
      setError("");
      await sendPhoneVerification().unwrap();
      setCanResend(false);
      dispatch(showSuccessNotification("Verification code sent"));
    } catch (err: any) {
      const msg = Array.isArray(err?.data?.message)
        ? err.data.message[0]
        : err?.data?.message || "Failed to resend verification code";

      dispatch(showErrorNotification(msg));
    }
  }, [sendPhoneVerification]);

  const handleVerifyCode = async () => {
    if (!code.trim() || code.trim().length !== 5) {
      setError("Verification code must be 5 digits");
      return;
    }
    try {
      setError("");
      await verifyPhoneCode({
        verificationCode: code.trim(),
      }).unwrap();
      handleUserProfile({
        phoneNumber: {
          ...(userProfile?.phoneNumber as PhoneNumber),
          isVerified: true,
        },
      });
      dispatch(showSuccessNotification("Phone verified successfully!"));

      // Navigate to next step after a short delay
      setTimeout(() => {
        handleChangeCurrentStep(OnboardingSteps.PICTURE_URL);
      }, 1500);
    } catch (err: any) {
      const msg = Array.isArray(err?.data?.message)
        ? err.data.message[0]
        : err?.data?.message || "Verification failed. Please try again.";
      setError(msg);

      dispatch(showErrorNotification(msg));
    }
  };

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <View className="flex-1 justify-start">
        <View className="mb-6 flex-col gap-6 w-[80%]  mx-auto">
          <OtpInput
            numberOfDigits={5}
            type="numeric"
            focusColor={"#3b82f6"}
            theme={{
              pinCodeContainerStyle: {
                borderWidth: 0,
                borderBottomWidth: 1,
                borderColor: error ? "#ef4444" : "#1eadff",
                backgroundColor: "transparent",
                borderRadius: 0,
              },
            }}
            onTextChange={(text) => {
              setCode(text);
              if (error) setError("");
            }}
            disabled={isVerifying}
          />

          {error ? (
            <Text className="text-red-500 text-sm font-medium mt-2 text-center">
              {error}
            </Text>
          ) : null}

          <Button
            onPress={handleVerifyCode}
            disabled={isVerifying || code.length !== 5}
            loading={isVerifying}
            className="mb-4"
          >
            {isVerifying ? "Verifying..." : "Verify Phone"}
          </Button>
        </View>

        <View className="flex-row items-center justify-center gap-2 mt-4">
          <Button
            onPress={handleResendCode}
            disabled={isSending || !canResend}
            variant="outline"
            className="flex-row items-center gap-2 max-w-[150px]"
          >
            <Text
              className={`text-sm font-medium ${
                isSending || !canResend
                  ? "text-gray-400"
                  : "text-azure-radiance-500"
              }`}
            >
              {isSending ? "Sending..." : "Resend Code"}
            </Text>
          </Button>
          {!canResend && (
            <CircularCountdown
              seconds={60}
              size={28}
              onComplete={() => setCanResend(true)}
            />
          )}
        </View>
      </View>
    </View>
  );
}

export default PhoneVerificationScreen;
