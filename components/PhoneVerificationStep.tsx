import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import VerificationCodeInput from "@/components/ui/VerificationCodeInput";

interface PhoneVerificationStepProps {
  countryCode: string;
  phoneNumber: string;
  verificationCode: string[];
  onVerificationCodeChange: (code: string[]) => void;
  onResendCode: () => void;
  error?: string | null;
  isError?: boolean;
}

function PhoneVerificationStep({
  countryCode,
  phoneNumber,
  verificationCode,
  onVerificationCodeChange,
  onResendCode,
  error = null,
  isError = false,
}: PhoneVerificationStepProps) {
  return (
    <View className="mt-4 gap-6">
      <View className="items-center">
        <Text className="text-gray-600 text-center mb-4">
          We've sent a verification code to{" "}
          <Text className="font-semibold">
            {countryCode} {phoneNumber}
          </Text>
        </Text>

        <VerificationCodeInput
          length={5}
          value={verificationCode}
          onChange={onVerificationCodeChange}
          error={error || ""}
          isError={isError}
        />

        <TouchableOpacity onPress={onResendCode} className="mt-4">
          <Text className="text-blue-500 text-sm font-medium">
            Didn't receive code? Resend
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default PhoneVerificationStep;
