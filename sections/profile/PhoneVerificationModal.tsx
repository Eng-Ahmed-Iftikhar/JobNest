import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import Modal from "@/components/ui/Modal";
import {
  useSendPhoneVerificationMutation,
  useVerifyPhoneCodeMutation,
} from "@/api/services/authApi";
import { OtpInput } from "react-native-otp-entry";
import CircularCountdown from "@/components/CircularCountdown";

interface PhoneVerificationModalProps {
  isVisible: boolean;
  phone: { countryCode: string; number: string };
  onClose: () => void;
  onVerified: () => void;
}

export const PhoneVerificationModal: React.FC<PhoneVerificationModalProps> = ({
  isVisible,
  phone,
  onClose,
  onVerified,
}) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSendAgain, setIsSendAgain] = useState(false);
  const [sendPhoneVerification, { isLoading: isSending }] =
    useSendPhoneVerificationMutation();
  const [verifyPhoneCode, { isLoading: isVerifying }] =
    useVerifyPhoneCodeMutation();

  const handleSendCode = async () => {
    if (!phone.number || !phone.countryCode) {
      setError("Phone number is missing");
      return;
    }
    try {
      setError("");
      await sendPhoneVerification().unwrap();
      setIsSendAgain(true);
    } catch (err: any) {
      const msg = Array.isArray(err?.data?.message)
        ? err.data.message[0]
        : err?.data?.message || "Failed to send verification code";
      setError(msg);
    }
  };

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
      onVerified();
      handleClose();
    } catch (err: any) {
      const msg = Array.isArray(err?.data?.message)
        ? err.data.message[0]
        : err?.data?.message || "Verification failed. Please try again.";
      setError(msg);
    }
  };

  const handleClose = () => {
    setCode("");
    setError("");
    setIsSendAgain(false);
    onClose();
  };

  useEffect(() => {
    if (isVisible) {
      handleSendCode();
    } else {
      setCode("");
      setError("");
      setIsSendAgain(false);
    }
  }, [isVisible]);

  return (
    <Modal visible={isVisible} onClose={handleClose}>
      <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <Text className="text-xl font-bold text-gray-800 mb-2">
          Verify Phone Number
        </Text>
        <Text className="text-sm font-medium text-gray-600 mb-6">
          Enter the 5-digit code sent to {phone.countryCode} {phone.number}
        </Text>

        <View className="mb-6 items-center">
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
        </View>

        <Pressable
          disabled={isVerifying}
          className="bg-azure-radiance-500 rounded-lg py-3 mb-3"
          onPress={handleVerifyCode}
        >
          {isVerifying ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-center">
              Verify Phone
            </Text>
          )}
        </Pressable>

        <Pressable
          disabled={isSending || isSendAgain}
          className="flex-row items-center justify-center gap-2"
          onPress={handleSendCode}
        >
          <Text
            className={`text-sm font-medium font-medium ${
              isSending || isSendAgain
                ? "text-gray-400"
                : "text-azure-radiance-500"
            }`}
          >
            {isSending
              ? "Sending..."
              : isSendAgain
                ? "Code is sent"
                : "Send code again"}
          </Text>
          {isSendAgain && (
            <CircularCountdown
              seconds={900}
              size={28}
              onComplete={() => setIsSendAgain(false)}
            />
          )}
        </Pressable>

        <Pressable
          onPress={handleClose}
          className="mt-4 border border-gray-300 rounded-lg py-3"
        >
          <Text className="text-gray-800 font-semibold text-center">
            Cancel
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
};
