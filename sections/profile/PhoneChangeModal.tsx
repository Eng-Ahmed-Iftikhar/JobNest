import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Modal from "@/components/ui/Modal";
import { useReauthenticateMutation } from "@/api/services/userApi";
import { useCountryOptions } from "@/hooks/useCountryOptions";
import { validatePhoneNumber } from "@/utils";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";

interface PhoneChangeModalProps {
  isVisible: boolean;
  phone: string;
  onClose: () => void;
  onPhoneUpdated: ({
    countryCode,
    number,
    isVerified,
  }: {
    countryCode: string;
    number: string;
    isVerified: boolean;
  }) => void;
}

export const PhoneChangeModal: React.FC<PhoneChangeModalProps> = ({
  isVisible,
  phone,
  onClose,
  onPhoneUpdated,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"password" | "input">("password");
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reauthenticate] = useReauthenticateMutation();
  const countryOptions = useCountryOptions();

  const handleReauthenticate = async () => {
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }
    try {
      setIsAuthenticating(true);
      setError("");
      const result = await reauthenticate({ password }).unwrap();
      if (result.isAuthenticated) {
        setStep("input");
        setPassword("");
      } else {
        setError("Authentication failed. Please try again.");
      }
    } catch (e) {
      setError("Authentication failed. Please check your password.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleUpdatePhone = () => {
    const trimmedNumber = phoneNumber.toString().trim();
    if (!trimmedNumber) {
      setError("Please enter a phone number");
      return;
    }

    if (!validatePhoneNumber(trimmedNumber, countryCode)) {
      setError("Invalid phone number");
      return;
    }

    onPhoneUpdated({
      countryCode,
      number: trimmedNumber,
      isVerified: false,
    });
    handleClose();
  };

  const handleClose = () => {
    setPassword("");
    setPhoneNumber("");
    setCountryCode("+1");
    setError("");
    setStep("password");
    onClose();
  };

  return (
    <Modal visible={isVisible} onClose={handleClose}>
      <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
        {step === "password" ? (
          <>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              Verify Your Identity
            </Text>
            <Text className="text-sm font-medium text-gray-600 mb-6">
              Please enter your password to change your phone number
            </Text>

            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">Password</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4">
                <TextInput
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#999"
                  className="flex-1 text-gray-800 py-3"
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  className="ml-2"
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#6B7280"
                  />
                </Pressable>
              </View>
              {password && (
                <Text className="text-gray-500 text-sm font-medium mt-2">
                  ✓ Password entered
                </Text>
              )}
            </View>

            {error && (
              <Text className="text-red-500 text-sm font-medium mb-4">
                {error}
              </Text>
            )}

            <View className="flex-row gap-3">
              <Pressable
                onPress={handleClose}
                className="flex-1 border border-gray-300 rounded-lg py-3"
              >
                <Text className="text-gray-800 font-semibold text-center">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleReauthenticate}
                disabled={isAuthenticating}
                className="flex-1 bg-azure-radiance-500 rounded-lg py-3 flex-row items-center justify-center"
              >
                {isAuthenticating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold text-center">
                    Continue
                  </Text>
                )}
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">
                Current Phone
              </Text>
              <View className="bg-gray-100 p-3 rounded-lg">
                <Text className="text-gray-800">{phone}</Text>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">
                New Phone Number
              </Text>
              <PhoneNumberInput
                label="Phone Number"
                countryCodeValue={countryCode}
                countryCodeItems={countryOptions}
                countryCodePlaceholder="Code"
                onCountryCodeChange={setCountryCode}
                inputNumberProps={{
                  value: phoneNumber,
                  onChangeText: setPhoneNumber,
                  onBlur: () => setError(""),
                  placeholder: "Enter phone number",
                  keyboardType: "phone-pad",
                }}
                error={error}
                isError={!!error}
              />
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={handleClose}
                className="flex-1 border border-gray-300 rounded-lg py-3"
              >
                <Text className="text-gray-800 font-semibold text-center">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleUpdatePhone}
                className="flex-1 bg-azure-radiance-500 rounded-lg py-3 flex-row items-center justify-center"
              >
                <Text className="text-white font-semibold text-center">
                  Update
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};
