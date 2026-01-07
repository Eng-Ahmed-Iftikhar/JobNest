import { useLazyMeQuery } from "@/api/services/authApi";
import {
  useGetCvDetailsQuery,
  useUpdateCvDetailsMutation,
} from "@/api/services/userApi";
import Button from "@/components/ui/Button";
import useOnboarding from "@/hooks/useOnboarding";
import { updateIsOnboarded } from "@/store/reducers/userSlice";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useCallback } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import BioSection from "./BioSection";
import EducationSection from "./EducationSection";
import ExperienceSection from "./ExperienceSection";
import SkillsSection from "./SkillsSection";

const formSchema = yup.object({
  experiences: yup.array().of(
    yup.object({
      position: yup.string().required("Position is required"),
      company: yup.string().required("Company is required"),
      startDate: yup.string().required("Start date is required"),
      endDate: yup.string().nullable(),
      isCurrent: yup.boolean(),
    })
  ),
  educations: yup.array().of(
    yup.object({
      school: yup.string().required("School is required"),
      degree: yup.string().required("Degree is required"),
      fieldOfStudy: yup.string().nullable(),
      yearStarted: yup.number().required("Year started is required"),
      yearGraduated: yup.number().nullable(),
      inProgress: yup.boolean(),
    })
  ),
  skillIds: yup
    .array()
    .of(yup.string())
    .min(1, "At least one skill is required"),
  bio: yup.string().max(1000, "Bio must be less than 1000 characters"),
});

type FormValues = yup.InferType<typeof formSchema>;

// Helper function to convert backend datetime to YYYY-MM format
const formatDateFromBackend = (dateStr?: string): string => {
  if (!dateStr) return "";
  // Extract YYYY-MM from "2020-09-01 00:00:00"
  const match = dateStr.match(/^(\d{4}-\d{2})/);
  return match ? match[1] : "";
};

// Helper function to convert YYYY-MM to backend datetime format
const formatDateForBackend = (dateStr?: string): string | undefined => {
  if (!dateStr) return undefined;
  // Convert "2020-09" to "2020-09-01 00:00:00"
  return `${dateStr}-01 00:00:00`;
};

function GenericApplicationForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [getCurrentUser] = useLazyMeQuery();
  const { handleUserProfile } = useOnboarding();
  const { data: cvDetails, isLoading: isLoadingCvDetails } =
    useGetCvDetailsQuery();
  const [updateCvDetails, { isLoading: isUpdatingCvDetails }] =
    useUpdateCvDetailsMutation();

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        console.log("Submitting CV details:", values);

        // Transform values: convert empty strings to undefined and filter empty entries
        const payload = {
          experiences: values.experiences
            ?.filter((exp) => exp.position && exp.company)
            .map((exp) => ({
              position: exp.position,
              company: exp.company,
              startDate: formatDateForBackend(exp.startDate) || exp.startDate,
              endDate:
                formatDateForBackend(exp.endDate as string) || exp.endDate,
              isCurrent: exp.isCurrent,
            })),
          educations: values.educations
            ?.filter((edu) => edu.school && edu.degree)
            .map((edu) => ({
              school: edu.school,
              degree: edu.degree,
              fieldOfStudy: edu.fieldOfStudy || undefined,
              yearStarted: edu.yearStarted,
              yearGraduated: edu.yearGraduated || undefined,
              inProgress: edu.inProgress,
            })),
          skillIds: values.skillIds?.filter(
            (skill): skill is string => skill != null && skill.trim().length > 0
          ),
          bio: values.bio || undefined,
        };

        // Call API to update CV details
        await updateCvDetails(payload as any).unwrap();

        // Update Redux store to mark as onboarded
        dispatch(updateIsOnboarded(true));
        await getCurrentUser();
        // Navigate to dashboard
        router.replace("/(dashboard)");
      } catch (error: any) {
        console.error("Failed to update CV details:", error);

        let errorMessage = "Failed to save CV details. Please try again.";

        if (error?.data?.message) {
          if (Array.isArray(error.data.message)) {
            errorMessage = error.data.message[0];
          } else {
            errorMessage = error.data.message;
          }
        }

        Alert.alert("Error", errorMessage);
      }
    },
    [updateCvDetails, handleUserProfile, router]
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
      >
        <Formik
          enableReinitialize
          initialValues={{
            experiences: cvDetails?.experiences?.length
              ? cvDetails.experiences.map((exp) => ({
                  ...exp,
                  startDate: formatDateFromBackend(exp.startDate),
                  endDate: exp.endDate
                    ? formatDateFromBackend(exp.endDate)
                    : undefined,
                }))
              : [
                  {
                    position: "",
                    company: "",
                    startDate: "",
                    endDate: undefined,
                    isCurrent: false,
                  },
                ],
            educations: cvDetails?.educations?.length
              ? cvDetails.educations
              : [
                  {
                    school: "",
                    degree: "",
                    fieldOfStudy: undefined,
                    yearStarted: new Date().getFullYear(),
                    yearGraduated: undefined,
                    inProgress: false,
                  },
                ],
            skillIds: cvDetails?.skillIds || [],
            bio: cvDetails?.bio || "",
          }}
          onSubmit={handleSubmit}
          validationSchema={formSchema}
        >
          {({
            handleSubmit,
            isSubmitting,
            values,
            setFieldValue,
            ...formik
          }) => (
            <View style={{ flex: 1 }}>
              <ExperienceSection
                values={values.experiences || []}
                setFieldValue={setFieldValue}
                formik={formik}
              />

              <View className="mt-4" />

              <EducationSection
                values={values.educations || []}
                setFieldValue={setFieldValue}
                formik={formik}
              />

              <View className="mt-4" />

              <SkillsSection
                values={values.skillIds || []}
                setFieldValue={setFieldValue}
                formik={formik}
              />

              <View className="mt-4" />

              <BioSection
                value={values.bio}
                onChangeText={(text) => setFieldValue("bio", text)}
              />

              <Button
                disabled={isSubmitting || isUpdatingCvDetails}
                loading={isSubmitting || isUpdatingCvDetails}
                onPress={(e) => handleSubmit()}
                className="mt-4 mb-4"
              >
                Save & Finish
              </Button>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default GenericApplicationForm;
