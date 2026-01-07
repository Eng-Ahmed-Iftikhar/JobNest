import React, { forwardRef, useImperativeHandle } from "react";
import { View, Text } from "react-native";
import { OtpInput } from "react-native-otp-entry";

interface VerificationCodeInputProps {
  length: number;
  value: string[];
  onChange: (code: string[]) => void;
  error?: string;
  isError?: boolean;
}

export interface VerificationCodeInputRef {
  focus: (index?: number) => void;
  clear: () => void;
}

const VerificationCodeInput = forwardRef<
  VerificationCodeInputRef,
  VerificationCodeInputProps
>(({ length, value, onChange, error, isError }, ref) => {
  useImperativeHandle(ref, () => ({
    focus: (index = 0) => {
      // OtpInput handles focus internally
    },
    clear: () => {
      onChange(new Array(length).fill(""));
    },
  }));

  const handleTextChange = (text: string) => {
    const codeArray = text.split("").slice(0, length);
    // Pad with empty strings if needed
    while (codeArray.length < length) {
      codeArray.push("");
    }
    onChange(codeArray);
  };

  return (
    <View className="items-center">
      <OtpInput
        numberOfDigits={length}
        type="numeric"
        focusColor={isError ? "#ef4444" : "#10B981"}
        theme={{
          pinCodeContainerStyle: {
            borderWidth: 2,
            borderColor: isError
              ? "#ef4444"
              : value.some((digit) => digit)
                ? "#10B981"
                : "#d1d5db",
            backgroundColor: isError
              ? "#fef2f2"
              : value.some((digit) => digit)
                ? "#f0fdf4"
                : "#ffffff",
            borderRadius: 8,
            width: 56,
            height: 56,
          },
          pinCodeTextStyle: {
            fontSize: 24,
            fontWeight: "bold",
            color: "#111827",
          },
        }}
        onTextChange={handleTextChange}
      />

      {error && (
        <Text className="text-red-500 text-sm font-medium text-center mb-4">
          {error}
        </Text>
      )}
    </View>
  );
});

VerificationCodeInput.displayName = "VerificationCodeInput";

export default VerificationCodeInput;
