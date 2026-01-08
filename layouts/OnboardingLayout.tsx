import { useLogoutMutation } from "@/api/services/authApi";
import Logo from "@/assets/images/icon.png";
import AppLoader from "@/components/AppLoader";
import ConfirmationModal from "@/components/ConfirmationModal";
import useOnboarding from "@/hooks/useOnboarding";
import StepIndicator from "@/sections/onboarding/StepIndicator";
import { Stack } from "expo-router";
import React, { Suspense, useCallback, useMemo, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

function OnboardingLayout() {
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const {
    currentStep = "",
    onboardingSteps,
    stepHeader,
    handleGoBack,
  } = useOnboarding();

  const currentIdx = useMemo(() => {
    return (
      onboardingSteps.findIndex(
        (onboardingStep) => onboardingStep === currentStep
      ) + 1
    );
  }, [onboardingSteps, currentStep]);

  const { title = "", description = "" } = stepHeader || {};
  const handleClickBack = useCallback(() => {
    handleGoBack();
  }, [handleGoBack]);

  const handleLogout = useCallback(() => {
    setShowLogoutModal(true);
  }, []);

  const handleConfirmLogout = useCallback(async () => {
    try {
      await logoutApi().unwrap();
      // The auth slice matcher will automatically clear the state
      // and the auth layout will redirect to auth screens
    } catch (error) {
      console.error("Logout API error:", error);
      // Even if API fails, we should still logout locally
      // The auth slice matcher will handle this
    }
  }, [logoutApi]);

  const isShowBackIcon = useMemo(() => {
    return currentIdx > 1;
  }, [currentIdx]);

  return (
    <View className="flex-1 bg-white">
      <View className="h-[56px] flex-row items-center justify-between px-4 ">
        <View className="w-6 h-6">
          {isShowBackIcon && (
            <TouchableOpacity onPress={handleClickBack}>
              <Icon name="arrowleft" size={16} color="black" />
            </TouchableOpacity>
          )}
        </View>

        <Image source={Logo} className="h-[40px] w-[76px]" />
        <TouchableOpacity onPress={handleLogout} disabled={isLoggingOut}>
          <Text
            className={`text-sm font-medium  ${
              isLoggingOut ? "text-gray-400" : "text-azure-radiance-500"
            }`}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Text>
        </TouchableOpacity>
      </View>
      <StepIndicator total={onboardingSteps.length} current={currentIdx} />
      <View className="w-[300px]  mx-auto  mt-3 ">
        <Text className=" font-semibold text-2xl text-center">{title}</Text>

        <Text className="text-sm font-medium text-gray-500 text-center mt-2 ">
          {description}
        </Text>
      </View>
      <Suspense fallback={<AppLoader />}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="general-info" />
          <Stack.Screen name="location" />
          <Stack.Screen name="phone-number" />
          <Stack.Screen name="phone-verification" />
          <Stack.Screen name="profile-image" />
          <Stack.Screen name="upload-cv" />
          <Stack.Screen name="generic-application" />
        </Stack>
      </Suspense>
      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        title="Logout"
        message="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        confirmButtonColor="bg-red-500"
        icon="log-out"
        iconColor="#EF4444"
      />
    </View>
  );
}

export default OnboardingLayout;
