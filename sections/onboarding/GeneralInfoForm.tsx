import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { useUpdateGeneralInfoMutation } from "@/api/services/userApi";
import useOnboarding from "@/hooks/useOnboarding";
import { OnboardingSteps } from "@/types/onboarding";
import { Formik } from "formik";
import React, { useCallback } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import * as yup from "yup";

const formSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
});

type FormValues = yup.InferType<typeof formSchema>;

function GeneralInfoForm() {
  const { handleUserProfile, handleChangeCurrentStep, userProfile } =
    useOnboarding();
  console.log("User Profile in GeneralInfoForm:", userProfile);
  const [updateGeneralInfo, { isLoading: isUpdatingGeneralInfo }] =
    useUpdateGeneralInfoMutation();

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        // Update profile via API
        await updateGeneralInfo(values).unwrap();

        // Save to context and navigate
        handleUserProfile({ generalInfo: values });
        handleChangeCurrentStep(OnboardingSteps.LOCATION);
      } catch (error) {
        console.error("Failed to update profile:", error);
        // Handle error - you might want to show a toast
      }
    },
    [handleUserProfile, handleChangeCurrentStep, updateGeneralInfo]
  );

  return (
    <Formik
      initialValues={{
        firstName: userProfile?.generalInfo?.firstName || "",
        lastName: userProfile?.generalInfo?.lastName || "",
      }}
      enableReinitialize
      onSubmit={handleSubmit}
      validationSchema={formSchema}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <View className="flex-1">
            <View className="mt-4 gap-6">
              <Input
                label="First name"
                placeholder="Enter your first name"
                value={values.firstName}
                onChangeText={handleChange("firstName")}
                onBlur={handleBlur("firstName")}
                error={errors.firstName as string}
                isError={!!errors.firstName && (touched.firstName as boolean)}
              />

              <Input
                label="Last name"
                placeholder="Enter your last name"
                value={values.lastName}
                onChangeText={handleChange("lastName")}
                onBlur={handleBlur("lastName")}
                error={errors.lastName as string}
                isError={!!errors.lastName && (touched.lastName as boolean)}
              />
            </View>

            <Button
              disabled={isSubmitting || isUpdatingGeneralInfo}
              loading={isSubmitting || isUpdatingGeneralInfo}
              onPress={(e) => handleSubmit(e as any)}
              className="mt-8"
            >
              Next
            </Button>
          </View>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
}

export default GeneralInfoForm;
