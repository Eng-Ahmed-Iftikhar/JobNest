import React from "react";
import { View } from "react-native";
import Button from "@/components/ui/Button";

interface PhoneNumberActionsProps {
  showVerification: boolean;
  isSubmitting: boolean;
  isVerifying: boolean;
  isUpdatingPhoneNumber?: boolean;
  verificationCode: string[];
  onBack: () => void;
  onVerify: () => void;
  onNext: (e?: any) => void;
}

function PhoneNumberActions({
  showVerification,
  isSubmitting,
  isVerifying,
  isUpdatingPhoneNumber = false,
  verificationCode,
  onBack,
  onVerify,
  onNext,
}: PhoneNumberActionsProps) {
  return (
    <View className="flex-row gap-3">
      {showVerification && (
        <Button onPress={onBack} className="flex-1 bg-gray-200">
          Back
        </Button>
      )}

      <Button
        disabled={
          isSubmitting ||
          isUpdatingPhoneNumber ||
          (showVerification && verificationCode.some((code) => !code))
        }
        loading={isSubmitting || isVerifying || isUpdatingPhoneNumber}
        onPress={showVerification ? onVerify : onNext}
        className={` mt-8 ${showVerification ? "flex-1" : "w-full"}`}
      >
        {showVerification ? (isVerifying ? "Verifying..." : "Verify") : "Next"}
      </Button>
    </View>
  );
}

export default PhoneNumberActions;
