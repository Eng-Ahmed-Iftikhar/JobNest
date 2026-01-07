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
import { useFormikContext } from "formik";
import { useReauthenticateMutation } from "@/api/services/userApi";

interface EmailVerificationModalProps {
  isVisible: boolean;
  email: string;
  onClose: () => void;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isVisible,
  email,
  onClose,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"password" | "input">("password");
  const [newEmail, setNewEmail] = useState("");
  const [reauthenticate] = useReauthenticateMutation();
  const formik = useFormikContext<any>();

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

  const handleUpdateEmail = async () => {
    if (!newEmail) {
      setError("Please enter an email address");
      return;
    }
    const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/;
    if (!emailRegex.test(newEmail)) {
      setError("Please enter a valid email address");
      return;
    }
    try {
      setIsUpdating(true);
      setError("");
      // Update Formik email field directly
      formik.setFieldValue("email", newEmail);
      handleClose();
    } catch (e) {
      setError("Failed to update email. Please try again.");
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setNewEmail("");
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
              Please enter your password to change your email address
            </Text>

            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">Password</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 ">
                <TextInput
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#999"
                  className="flex-1 text-gray-800"
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  className="ml-2 "
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
            <Text className="text-xl font-bold text-gray-800 mb-2">
              Change Email
            </Text>
            <Text className="text-sm font-medium text-gray-600 mb-6">
              Enter your new email address
            </Text>

            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">
                Current Email
              </Text>
              <View className="bg-gray-100 p-3 rounded-lg">
                <Text className="text-gray-800">{email}</Text>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">New Email</Text>
              <TextInput
                placeholder="Enter new email address"
                value={newEmail}
                onChangeText={setNewEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
              />
            </View>

            {error && (
              <Text className="text-red-500 text-sm font-medium mb-4">
                {error}
              </Text>
            )}

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setStep("password")}
                className="flex-1 border border-gray-300 rounded-lg py-3"
              >
                <Text className="text-gray-800 font-semibold text-center">
                  Back
                </Text>
              </Pressable>
              <Pressable
                onPress={handleUpdateEmail}
                disabled={isUpdating}
                className="flex-1 bg-azure-radiance-500 rounded-lg py-3 flex-row items-center justify-center"
              >
                {isUpdating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold text-center">
                    Update Email
                  </Text>
                )}
              </Pressable>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};
