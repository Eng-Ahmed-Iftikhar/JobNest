import { useCreatePhoneNumberMutation } from "@/api/services/userApi";
import PhoneNumberActions from "@/components/PhoneNumberActions";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import { useCountryOptions } from "@/hooks/useCountryOptions";
import useOnboarding from "@/hooks/useOnboarding";
import { OnboardingSteps } from "@/types/onboarding";
import { validatePhoneNumber } from "@/utils";
import { Formik } from "formik";
import React, { useCallback, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import * as yup from "yup";

const formSchema = yup.object({
  countryCode: yup
    .string()
    .required("Country code is required")
    .min(2, "Country code must be at least 2 characters"),
  number: yup
    .string()
    .required("Phone number is required")
    .min(2, "Phone number must be at least 2 characters")
    .when("countryCode", (phoneCode, schema) => {
      if (phoneCode && typeof phoneCode === "string") {
        return schema.test(
          "is-valid-phone-number",
          "Invalid phone number",
          (value) => validatePhoneNumber(value, phoneCode)
        );
      }
      return schema;
    }),
  isVerified: yup.boolean().default(false),
});

type FormValues = yup.InferType<typeof formSchema>;

function PhoneNumberForm() {
  const { handleUserProfile, handleChangeCurrentStep, userProfile } =
    useOnboarding();

  const [createPhoneNumber, { isLoading: isCreatingPhoneNumber }] =
    useCreatePhoneNumberMutation();
  const [apiError, setApiError] = useState<string | null>(null);

  const countryOptions = useCountryOptions();

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        await createPhoneNumber({
          countryCode: values.countryCode,
          number: values.number,
        }).unwrap();
      } catch (error: any) {
        console.error("Failed to send verification code:", error);
        if (Array.isArray(error?.data?.message)) {
          setApiError(error.data.message[0]);
        } else {
          setApiError(
            error?.data?.message || "Failed to send verification code"
          );
        }
        return;
      }

      handleUserProfile({ phoneNumber: values });
      handleChangeCurrentStep(OnboardingSteps.PHONE_VERIFICATION);
    },
    [handleUserProfile, handleChangeCurrentStep, createPhoneNumber]
  );

  return (
    <Formik
      initialValues={{
        countryCode: userProfile?.phoneNumber?.countryCode || "+92",
        number: userProfile?.phoneNumber?.number || "",
        isVerified: userProfile?.phoneNumber?.isVerified || false,
      }}
      onSubmit={handleSubmit}
      enableReinitialize
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
      }) => {
        return (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          >
            <View className="flex-1">
              <PhoneNumberInput
                label=""
                countryCodeValue={values.countryCode}
                countryCodeItems={countryOptions}
                countryCodePlaceholder="Code"
                onCountryCodeChange={(value) => {
                  setApiError(null);
                  handleChange("countryCode")(value);
                }}
                inputNumberProps={{
                  value: values.number,
                  onChangeText: (value: string) => {
                    setApiError(null);
                    handleChange("number")(value);
                  },
                  onBlur: handleBlur("number"),
                  placeholder: "Enter phone number",
                  keyboardType: "phone-pad",
                }}
                error={apiError || (errors.number as string)}
                isError={
                  !!apiError || (!!errors.number && (touched.number as boolean))
                }
              />

              <PhoneNumberActions
                showVerification={false}
                isSubmitting={isSubmitting}
                isVerifying={false}
                isUpdatingPhoneNumber={isCreatingPhoneNumber}
                verificationCode={[]}
                onBack={() => {}}
                onVerify={() => {}}
                onNext={(e) => handleSubmit(e as any)}
              />
            </View>
          </KeyboardAvoidingView>
        );
      }}
    </Formik>
  );
}

export default PhoneNumberForm;
