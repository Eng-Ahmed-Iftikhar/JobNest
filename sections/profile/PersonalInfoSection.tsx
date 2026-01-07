import React, { useState, useCallback } from "react";
import { View, Text, Pressable, Alert, ActivityIndicator } from "react-native";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";
import { Country, State, City } from "country-state-city";
import { useFormikContext } from "formik";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import CircularCountdown from "@/components/CircularCountdown";
import { OtpInput } from "react-native-otp-entry";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  useSendEmailVerificationMutation,
  useVerifyEmailCodeMutation,
} from "@/api/services/authApi";
import { useLazyMeQuery } from "@/api/services/authApi";
import { PhoneVerificationModal } from "./PhoneVerificationModal";
import {
  selectUser,
  selectUserProfile,
  setUser,
  updateProfile,
} from "@/store/reducers/userSlice";
import { UserPhoneNumber } from "@/types/api/auth";

interface PersonalInfoSectionProps {
  onChangeEmail: () => void;
  onChangePhone: () => void;
}

interface FormValues {
  firstName: string;
  lastName: string;
  location: string;
  city: string;
  state: string;
  country: string;
  address: string;
  email: string;
  phoneNumber: {
    countryCode: string;
    number: number | string;
    isVerified?: boolean;
  };
  bio: string;
  [key: string]: any;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  onChangeEmail,
  onChangePhone,
}) => {
  const formik = useFormikContext<FormValues>();
  const user = useAppSelector(selectUser);
  const userProfile = useAppSelector(selectUserProfile);
  const dispatch = useAppDispatch();
  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false);
  const [isPhoneVerifyModalVisible, setIsPhoneVerifyModalVisible] =
    useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isSendAgain, setIsSendAgain] = useState(false);
  const [codeError, setCodeError] = useState("");

  const [sendEmailVerification, { isLoading: isSending }] =
    useSendEmailVerificationMutation();
  const [verifyEmailCode, { isLoading: isVerifying }] =
    useVerifyEmailCodeMutation();
  const [getMe] = useLazyMeQuery();

  const countryOptions = Country.getAllCountries().map((c) => ({
    label: c.name,
    value: c.name,
  }));
  console.log(formik.values);

  const stateOptions = (() => {
    const countryName = formik.values.country;
    if (!countryName) return [] as { label: string; value: string }[];
    const selectedCountry = Country.getAllCountries().find(
      (c) => c.name === countryName
    );
    if (!selectedCountry) return [] as { label: string; value: string }[];
    return State.getStatesOfCountry(selectedCountry.isoCode).map((s) => ({
      label: s.name,
      value: s.name,
    }));
  })();
  const cityOptions = (() => {
    const countryName = formik.values.country;
    const stateName = formik.values.state;
    if (!countryName || !stateName)
      return [] as { label: string; value: string }[];
    const selectedCountry = Country.getAllCountries().find(
      (c) => c.name === countryName
    );
    if (!selectedCountry) return [] as { label: string; value: string }[];
    const selectedState = State.getStatesOfCountry(
      selectedCountry.isoCode
    ).find((s) => s.name === stateName);
    if (!selectedState) return [] as { label: string; value: string }[];
    return City.getCitiesOfState(
      selectedCountry.isoCode,
      selectedState.isoCode
    ).map((city) => ({
      label: city.name,
      value: city.name,
    }));
  })();

  const handleSendCode = useCallback(async () => {
    try {
      await sendEmailVerification().unwrap();
      setIsSendAgain(true);
      setCodeError("");
    } catch (error: any) {
      const errorMessage = Array.isArray(error?.data?.message)
        ? error.data.message.join(", ")
        : error?.data?.message || "Failed to send verification code";
      Alert.alert("Error", errorMessage);
    }
  }, [sendEmailVerification]);

  const handleVerifyCode = useCallback(async () => {
    if (verificationCode.length !== 5) {
      setCodeError("Verification code must be 5 digits");
      return;
    }

    try {
      const response = await verifyEmailCode({
        verificationCode,
      }).unwrap();

      if (response.message) {
        Alert.alert("Success", response.message, [
          {
            text: "OK",
            onPress: async () => {
              await getMe();
              setIsVerifyModalVisible(false);
              setVerificationCode("");
              setCodeError("");
              setIsSendAgain(false);
            },
          },
        ]);
      }
    } catch (error: any) {
      let errorMessage = "Invalid verification code";

      if (error?.data?.message) {
        if (Array.isArray(error.data.message)) {
          errorMessage = error.data.message[0];
        } else {
          errorMessage = error.data.message;
        }
      }

      setCodeError(errorMessage);
    }
  }, [verificationCode, verifyEmailCode, getMe]);

  const handleCloseModal = () => {
    setIsVerifyModalVisible(false);
    setVerificationCode("");
    setCodeError("");
    setIsSendAgain(false);
  };

  const handleOpenModal = () => {
    setIsVerifyModalVisible(true);
    handleSendCode();
  };

  const handleClosePhoneModal = () => {
    setIsPhoneVerifyModalVisible(false);
  };

  const handleOpenPhoneModal = () => {
    setIsPhoneVerifyModalVisible(true);
  };

  const phoneForVerification = userProfile?.phoneNumber;

  return (
    <View className="px-4 py-6 bg-white rounded-lg mb-4">
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Personal Information
      </Text>

      <Input
        label="First Name"
        placeholder="Enter first name"
        value={formik.values.firstName}
        onChangeText={formik.handleChange("firstName")}
        onBlur={formik.handleBlur("firstName")}
        isError={
          !!formik.errors.firstName && (formik.touched.firstName as boolean)
        }
        error={
          formik.touched.firstName && formik.errors.firstName
            ? (formik.errors.firstName as string)
            : undefined
        }
      />

      <Input
        label="Last Name"
        placeholder="Enter last name"
        value={formik.values.lastName}
        onChangeText={formik.handleChange("lastName")}
        onBlur={formik.handleBlur("lastName")}
        isError={
          !!formik.errors.lastName && (formik.touched.lastName as boolean)
        }
        error={
          formik.touched.lastName && formik.errors.lastName
            ? (formik.errors.lastName as string)
            : undefined
        }
      />

      <Select
        placeholder="Select country"
        items={countryOptions}
        value={formik.values.country}
        onValueChange={(value) => {
          formik.setFieldValue("country", value);
          formik.setFieldValue("state", "");
          formik.setFieldValue("city", "");
        }}
        error={formik.errors.country as string}
        isError={!!formik.errors.country && (formik.touched.country as boolean)}
        label="Country"
      />

      <Select
        placeholder="Select state"
        items={stateOptions}
        value={formik.values.state}
        onValueChange={(value) => {
          formik.setFieldValue("state", value);
          formik.setFieldValue("city", "");
        }}
        error={formik.errors.state as string}
        isError={!!formik.errors.state && (formik.touched.state as boolean)}
        label="State"
        disabled={!formik.values.country}
      />

      <Select
        placeholder="Select city"
        items={cityOptions}
        value={formik.values.city}
        onValueChange={(value) => formik.setFieldValue("city", value)}
        error={formik.errors.city as string}
        isError={
          Boolean(formik.errors.city) && (formik.touched.city as boolean)
        }
        label="City"
        disabled={!formik.values.country || !formik.values.state}
      />

      <TextArea
        label="Address"
        placeholder="Enter your full address"
        value={formik.values.address}
        onChangeText={formik.handleChange("address")}
        onBlur={formik.handleBlur("address")}
        error={formik.errors.address as string}
        isError={!!formik.errors.address && (formik.touched.address as boolean)}
        numberOfLines={3}
      />

      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-gray-700 font-medium">Email</Text>
          <View className="flex-row gap-2">
            {!user?.email.isVerified && (
              <Pressable onPress={handleOpenModal}>
                <Text className="text-green-600 font-semibold">Verify</Text>
              </Pressable>
            )}
            <Pressable onPress={onChangeEmail}>
              <Text className="text-azure-radiance font-semibold">Change</Text>
            </Pressable>
          </View>
        </View>
        <View className="bg-gray-100 p-3 rounded-lg">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-800">{formik.values.email}</Text>
            {user?.email.email == formik.values.email && (
              <View>
                {!user?.email.isVerified ? (
                  <View className="bg-amber-100 px-2 py-1 rounded">
                    <Text className="text-amber-700 text-sm font-medium font-medium">
                      Not Verified
                    </Text>
                  </View>
                ) : (
                  <View className="bg-emerald-100 px-2 py-1 rounded">
                    <Text className="text-emerald-700 text-sm font-medium font-medium">
                      Verified
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </View>

      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-gray-700 font-medium">Phone Number</Text>
          <View className="flex-row gap-2">
            {!userProfile?.phoneNumber?.isVerified && (
              <Pressable onPress={handleOpenPhoneModal}>
                <Text className="text-green-600 font-semibold">Verify</Text>
              </Pressable>
            )}
            <Pressable onPress={onChangePhone}>
              <Text className="text-azure-radiance font-semibold">Change</Text>
            </Pressable>
          </View>
        </View>
        <View className="bg-gray-100 p-3 rounded-lg">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-800">
              {formik?.values?.phoneNumber?.countryCode}{" "}
              {formik?.values?.phoneNumber?.number}
            </Text>
            {userProfile?.phoneNumber?.countryCode ===
              formik?.values?.phoneNumber?.countryCode &&
              userProfile?.phoneNumber?.number ===
                formik?.values?.phoneNumber?.number && (
                <View>
                  {userProfile?.phoneNumber?.isVerified ? (
                    <View className="bg-emerald-100 px-2 py-1 rounded">
                      <Text className="text-emerald-700 text-sm font-medium font-medium">
                        Verified
                      </Text>
                    </View>
                  ) : (
                    <View className="bg-amber-100 px-2 py-1 rounded">
                      <Text className="text-amber-700 text-sm font-medium font-medium">
                        Not Verified
                      </Text>
                    </View>
                  )}
                </View>
              )}
          </View>
        </View>
      </View>

      {/* Email Verification Modal */}
      <Modal visible={isVerifyModalVisible} onClose={handleCloseModal}>
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          <Text className="text-xl font-bold text-gray-800 mb-2">
            Verify Email
          </Text>
          <Text className="text-sm font-medium text-gray-600 mb-6">
            Enter the 5-digit code sent to {formik.values.email}
          </Text>

          <View className="mb-6">
            <OtpInput
              numberOfDigits={5}
              type="numeric"
              focusColor={"#3b82f6"}
              theme={{
                pinCodeContainerStyle: {
                  borderWidth: 0,
                  borderBottomWidth: 1,
                  borderColor: codeError ? "#ef4444" : "#1eadff",
                  backgroundColor: "transparent",
                  borderRadius: 0,
                },
              }}
              onTextChange={(text) => {
                setVerificationCode(text);
                if (codeError) {
                  setCodeError("");
                }
              }}
              disabled={isVerifying}
            />

            {codeError && (
              <Text className="text-red-500 text-sm font-medium mt-2 text-center">
                {codeError}
              </Text>
            )}
          </View>

          <Button
            onPress={handleVerifyCode}
            disabled={isVerifying || verificationCode.length !== 5}
            className="mb-4"
          >
            {isVerifying ? "Verifying..." : "Verify Email"}
          </Button>

          <Pressable
            disabled={isSendAgain || isSending}
            className="gap-3 items-center justify-center"
            onPress={handleSendCode}
          >
            <Text
              className={`${
                isSendAgain || isSending
                  ? "text-gray-400"
                  : "text-azure-radiance-500"
              } text-sm font-medium font-medium`}
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
                size={40}
                onComplete={() => setIsSendAgain(false)}
              />
            )}
          </Pressable>

          <Pressable
            onPress={handleCloseModal}
            className="mt-4 border border-gray-300 rounded-lg py-3"
          >
            <Text className="text-gray-800 font-semibold text-center">
              Cancel
            </Text>
          </Pressable>
        </View>
      </Modal>

      {/* Phone Verification Modal */}
      <PhoneVerificationModal
        isVisible={isPhoneVerifyModalVisible}
        phone={{
          countryCode: phoneForVerification?.countryCode || "",
          number: phoneForVerification?.number || "",
        }}
        onClose={handleClosePhoneModal}
        onVerified={() => {
          formik.setFieldValue("phoneNumber", {
            ...(formik.values.phoneNumber || {}),
            isVerified: true,
          });
          if (user) {
            dispatch(
              updateProfile({
                ...(userProfile || {}),
                phoneNumber: {
                  ...(userProfile?.phoneNumber as UserPhoneNumber),
                  isVerified: true,
                },
              })
            );
          }
          handleClosePhoneModal();
        }}
      />
    </View>
  );
};
