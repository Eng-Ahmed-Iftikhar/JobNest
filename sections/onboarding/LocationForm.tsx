import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import TextArea from "@/components/ui/TextArea";

import { useUpdateLocationMutation } from "@/api/services/userApi";
import useOnboarding from "@/hooks/useOnboarding";
import { OnboardingSteps } from "@/types/onboarding";
import { City, Country, State } from "country-state-city";
import { Formik } from "formik";
import React, { useCallback, useMemo } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import * as yup from "yup";

const formSchema = yup.object({
  country: yup.string().required("Country is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  address: yup
    .string()
    .required("Address is required")
    .min(4, "Address must be at least 4 characters"),
});

type FormValues = yup.InferType<typeof formSchema>;

function LocationForm() {
  const { handleUserProfile, handleChangeCurrentStep, userProfile } =
    useOnboarding();
  const [updateLocation, { isLoading: isUpdatingLocation }] =
    useUpdateLocationMutation();

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        // Update profile via API
        await updateLocation(values).unwrap();

        // Save to context and navigate
        handleUserProfile({ location: values });
        handleChangeCurrentStep(OnboardingSteps.PHONE_NUMBER);
      } catch (error) {
        console.error("Failed to update location:", error);
        // Handle error - you might want to show a toast
      }
    },
    [handleUserProfile, handleChangeCurrentStep, updateLocation]
  );

  // Memoize country options
  const countryOptions = useMemo(() => {
    return Country.getAllCountries().map((country) => ({
      label: country.name,
      value: country.name, // Use full name instead of isoCode
    }));
  }, []);

  // Memoize state options based on selected country
  const getStateOptions = useCallback((countryName: string) => {
    if (!countryName) return [];
    const selectedCountry = Country.getAllCountries().find(
      (c) => c.name === countryName
    );
    if (!selectedCountry) return [];

    return State.getStatesOfCountry(selectedCountry.isoCode).map((state) => ({
      label: state.name,
      value: state.name,
    }));
  }, []);

  // Memoize city options based on selected country and state
  const getCityOptions = useCallback(
    (countryName: string, stateName: string) => {
      if (!countryName || !stateName) return [];
      const selectedCountry = Country.getAllCountries().find(
        (c) => c.name === countryName
      );
      if (!selectedCountry) return [];

      const selectedState = State.getStatesOfCountry(
        selectedCountry.isoCode
      ).find((s) => s.name === stateName);
      if (!selectedState) return [];

      return City.getCitiesOfState(
        selectedCountry.isoCode,
        selectedState.isoCode
      ).map((city) => ({
        label: city.name,
        value: city.name,
      }));
    },
    []
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
    >
      <Formik
        initialValues={{
          country: userProfile?.location?.country || "",
          city: userProfile?.location?.city || "",
          state: userProfile?.location?.state || "",
          address: userProfile?.location?.address || "",
        }}
        onSubmit={handleSubmit}
        enableReinitialize
        validationSchema={formSchema}
      >
        {({
          handleSubmit,
          setFieldValue,
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
          isSubmitting,
        }) => {
          const stateOptions = getStateOptions(values.country);
          const cityOptions = getCityOptions(values.country, values.state);

          return (
            <View className="flex-1">
              <View className="mt-4 gap-6">
                <Select
                  placeholder="Select country"
                  items={countryOptions}
                  value={values.country}
                  onValueChange={(value) => {
                    setFieldValue("country", value);
                    // Reset state and city when country changes
                    setFieldValue("state", "");
                    setFieldValue("city", "");
                  }}
                  error={errors.country as string}
                  isError={!!errors.country && (touched.country as boolean)}
                  label="Country"
                />

                <Select
                  placeholder="Select state"
                  items={stateOptions}
                  value={values.state}
                  onValueChange={(value) => {
                    setFieldValue("state", value);
                    // Reset city when state changes
                    setFieldValue("city", "");
                  }}
                  error={errors.state as string}
                  isError={!!errors.state && (touched.state as boolean)}
                  label="State"
                  disabled={!values.country}
                />

                <Select
                  placeholder="Select city"
                  items={cityOptions}
                  value={values.city}
                  onValueChange={(value) => setFieldValue("city", value)}
                  error={errors.city as string}
                  isError={!!errors.city && (touched.city as boolean)}
                  label="City"
                  disabled={!values.country || !values.state}
                />

                <TextArea
                  label="Address"
                  placeholder="Enter your full address"
                  value={values.address}
                  onChangeText={handleChange("address")}
                  onBlur={handleBlur("address")}
                  error={errors.address as string}
                  isError={!!errors.address && (touched.address as boolean)}
                  numberOfLines={3}
                />
              </View>

              <Button
                disabled={isSubmitting || isUpdatingLocation}
                loading={isSubmitting || isUpdatingLocation}
                onPress={(e) => handleSubmit(e as any)}
                className="mt-8"
              >
                Next
              </Button>
            </View>
          );
        }}
      </Formik>
    </KeyboardAvoidingView>
  );
}

export default LocationForm;
