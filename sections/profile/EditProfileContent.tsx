import {
  useGetCvDetailsQuery,
  useUpdateCvDetailsMutation,
  useUpdateGeneralInfoMutation,
  useUpdateLocationMutation,
  useUpdatePhoneNumberMutation,
  useUpdateProfilePictureMutation,
} from "@/api/services/userApi";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/store/reducers/notificationSlice";
import { selectUser, selectUserProfile } from "@/store/reducers/userSlice";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Formik, FormikHelpers } from "formik";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BioSection } from "./BioSection";
import { CVSection } from "./CVSection";
import { EducationSection } from "./EducationSection";
import { EmailVerificationModal } from "./EmailVerificationModal";
import { ExperienceSection } from "./ExperienceSection";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { PhoneChangeModal } from "./PhoneChangeModal";
import { SkillsSection } from "./SkillsSection";
import { editProfileValidationSchema } from "./validationSchema";

interface EditProfileFormValues {
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
    number: string;
    isVerified?: boolean;
  };
  profilePicture: string | null;
  cvFile: string | null;
  experiences: Array<{
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
  }>;
  educations: Array<{
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
  }>;
  skillIds: string[];
  bio: string;
}

const FloatingActions: React.FC<{
  visible: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  disabled: boolean;
  isSubmitting: boolean;
}> = ({ visible, onSubmit, onCancel, disabled, isSubmitting }) => {
  const translateY = React.useRef(new Animated.Value(80)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 80,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, translateY]);

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        transform: [{ translateY }],
        opacity,
      }}
    >
      <View className="px-4 py-4 bg-white border-t border-gray-200">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={onSubmit}
            // disabled={disabled}
            className="bg-azure-radiance-500 h-12 rounded-xl flex-1 items-center justify-center"
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Save changes
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onCancel}
            className="border-2 border-gray-200 bg-white h-12 rounded-xl flex-1 items-center justify-center"
            activeOpacity={0.8}
          >
            <Text className="text-gray-700 font-semibold text-base">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default function EditProfileContent() {
  const user = useAppSelector(selectUser);
  const userProfile = useAppSelector(selectUserProfile);

  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [isPhoneModalVisible, setIsPhoneModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<EditProfileFormValues>({
    firstName: "",
    lastName: "",
    location: "",
    city: "",
    state: "",
    country: "",
    address: "",
    email: "",
    phoneNumber: {
      countryCode: "+1",
      number: "",
      isVerified: false,
    },
    profilePicture: null,
    cvFile: null,
    experiences: [],
    educations: [],
    skillIds: [],
    bio: "",
  });
  const {
    data: cvDetails,
    isLoading: isCvDetailsLoading,
    refetch: refetchCvDetails,
  } = useGetCvDetailsQuery();
  const dispatch = useAppDispatch();
  const [updateCvDetails] = useUpdateCvDetailsMutation();
  const [updateGeneralInfo] = useUpdateGeneralInfoMutation();
  const [updateLocation] = useUpdateLocationMutation();
  const [updatePhoneNumber] = useUpdatePhoneNumberMutation();
  const [updateProfilePicture] = useUpdateProfilePictureMutation();

  const [refreshing, setRefreshing] = useState(false);

  const formatYearMonth = (value: any): string => {
    if (!value) return "";

    if (typeof value === "string") {
      if (/^\d{4}-\d{2}$/.test(value)) return value;

      const parsedFromString = new Date(value);
      if (!Number.isNaN(parsedFromString.getTime())) {
        return `${parsedFromString.getFullYear()}-${String(
          parsedFromString.getMonth() + 1
        ).padStart(2, "0")}`;
      }

      if (/^\d{4}$/.test(value)) return `${value}-01`;

      return "";
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";

    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    if (!userProfile) return;

    setInitialValues((prev) => {
      return {
        ...prev,
        firstName: userProfile?.generalInfo?.firstName || "",
        lastName: userProfile?.generalInfo?.lastName || "",
        location: userProfile?.location?.address || "",
        city: userProfile?.location?.city || "",
        state: userProfile?.location?.state || "",
        country: userProfile?.location?.country || "",
        address: userProfile?.location?.address || "",
        phoneNumber: {
          countryCode: userProfile?.phoneNumber?.countryCode || "+1",
          number: userProfile?.phoneNumber?.number || "",
          isVerified: userProfile?.phoneNumber?.isVerified || false,
        },
        profilePicture: userProfile?.pictureUrl || null,
        cvFile: userProfile?.resumeUrl || null,
      };
    });
  }, [userProfile, cvDetails]);

  useEffect(() => {
    if (!cvDetails) return;
    setInitialValues((prev) => ({
      ...prev,
      experiences:
        cvDetails?.experiences?.map((exp: any) => ({
          position: exp.position || "",
          company: exp.company || "",
          startDate: formatYearMonth(exp.startDate),
          endDate: formatYearMonth(exp.endDate),
          current: exp.isCurrent || false,
        })) || [],
      educations:
        cvDetails?.educations?.map((edu: any) => ({
          degree: edu.degree || "",
          institution: edu.school || "",
          startDate: edu.yearStarted?.toString() || "",
          endDate: edu.yearGraduated?.toString() || "",
        })) || [],
      skillIds: cvDetails?.skillIds || [],
      bio: cvDetails?.bio || "",
    }));
  }, [cvDetails]);

  useEffect(() => {
    if (!user) return;
    setInitialValues((prev) => ({
      ...prev,
      email: user.email?.email || "",
    }));
  }, [user]);

  const handleSubmit = async (
    values: EditProfileFormValues,
    { setSubmitting }: FormikHelpers<EditProfileFormValues>
  ) => {
    try {
      setIsSubmitting(true);

      // Update general info
      await updateGeneralInfo({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      }).unwrap();

      if (
        values.phoneNumber.number !== userProfile?.phoneNumber?.number ||
        values.phoneNumber.countryCode !== userProfile?.phoneNumber?.countryCode
      ) {
        // Phone number has changed, mark as unverified
        await updatePhoneNumber({
          countryCode: values.phoneNumber.countryCode,
          number: values.phoneNumber.number,
          isVerified: false,
        }).unwrap();
      }

      // Update location info
      await updateLocation({
        country: values.country,
        state: values.state,
        city: values.city,
        address: values.address || values.location,
      }).unwrap();

      // Update profile picture if changed
      if (
        values.profilePicture &&
        values.profilePicture !== userProfile?.pictureUrl
      ) {
        await updateProfilePicture({
          pictureUrl: values.profilePicture,
        }).unwrap();
      }

      // Update CV details
      await updateCvDetails({
        bio: values.bio,
        experiences: values.experiences.map((exp) => ({
          position: exp.position,
          company: exp.company,
          startDate: exp.startDate,
          endDate: exp.endDate,
          isCurrent: exp.current,
        })),
        educations: values.educations.map((edu) => ({
          school: edu.institution,
          degree: edu.degree,
          yearStarted: parseInt(edu.startDate),
          yearGraduated: edu.endDate ? parseInt(edu.endDate) : undefined,
        })),
        skillIds: values.skillIds,
        resumeUrl: values.cvFile as string,
      }).unwrap();
      refetchCvDetails();
      dispatch(showSuccessNotification("Profile updated successfully"));
    } catch (error) {
      dispatch(
        showErrorNotification("Failed to update profile. Please try again.")
      );
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  if (isCvDetailsLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#1eadff" />
      </View>
    );
  }

  return (
    <Formik<EditProfileFormValues>
      initialValues={initialValues}
      enableReinitialize
      validationSchema={editProfileValidationSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => {
        const pickImage = async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });

          if (!result.canceled) {
            formik.setFieldValue("profilePicture", result.assets[0].uri);
          }
        };

        // Custom change detection using Formik's own initialValues
        const normalize = (v: any): any => {
          if (v === undefined) return null;
          if (Array.isArray(v)) return v.map(normalize);
          if (v && typeof v === "object") {
            const out: any = {};
            for (const key of Object.keys(v)) out[key] = normalize(v[key]);
            return out;
          }
          return v;
        };
        const deepEqual = (a: any, b: any): boolean => {
          if (a === b) return true;
          if (a instanceof Date && b instanceof Date)
            return a.getTime() === b.getTime();
          if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
              if (!deepEqual(a[i], b[i])) return false;
            }
            return true;
          }
          if (a && b && typeof a === "object" && typeof b === "object") {
            const aKeys = Object.keys(a);
            const bKeys = Object.keys(b);
            if (aKeys.length !== bKeys.length) return false;
            for (const key of aKeys) {
              if (!bKeys.includes(key)) return false;
              if (!deepEqual(a[key], b[key])) return false;
            }
            return true;
          }
          return false;
        };

        const hasChanges = !deepEqual(
          normalize(formik.values),
          normalize(formik.initialValues)
        );

        return (
          <View className="flex-1 bg-white">
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={async () => {
                    try {
                      setRefreshing(true);
                      await Promise.all([refetchCvDetails()]);
                    } finally {
                      setRefreshing(false);
                    }
                  }}
                  tintColor="#1eadff"
                  colors={["#1eadff"]}
                />
              }
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: hasChanges ? 120 : 20 }}
            >
              <View className="px-4 pt-4">
                {/* Profile Picture */}
                <View className="mb-6">
                  <Text className="text-base font-semibold text-gray-900 mb-3">
                    Profile picture
                  </Text>
                  <Pressable onPress={pickImage} className="relative">
                    <View className="w-16 h-16 rounded-full bg-azure-radiance-500 items-center relative justify-center">
                      {formik.values.profilePicture ? (
                        <Image
                          source={{ uri: formik.values.profilePicture }}
                          className="w-16 h-16 rounded-full"
                        />
                      ) : (
                        <Ionicons name="person" size={32} color="white" />
                      )}
                    </View>
                    <View className="absolute bottom-0 left-0 w-6 h-6 rounded-full bg-white border-2 border-gray-200 items-center justify-center">
                      <Ionicons name="pencil" size={12} color="#6B7280" />
                    </View>
                  </Pressable>
                </View>

                {/* Personal Information Section */}
                <PersonalInfoSection
                  onChangeEmail={() => setIsEmailModalVisible(true)}
                  onChangePhone={() => setIsPhoneModalVisible(true)}
                />

                {/* CV Section */}
                <CVSection />

                {/* Experience Section */}
                <ExperienceSection />

                {/* Education Section */}
                <EducationSection />

                {/* Skills Section */}
                <SkillsSection />

                {/* Bio Section */}
                <BioSection />
              </View>
            </ScrollView>

            {/* Floating Action Buttons - Animated */}
            <FloatingActions
              visible={hasChanges}
              onSubmit={formik.submitForm}
              onCancel={formik.resetForm}
              disabled={isSubmitting || !formik.isValid}
              isSubmitting={isSubmitting}
            />

            {/* Email Verification Modal */}
            <EmailVerificationModal
              isVisible={isEmailModalVisible}
              email={formik.values.email}
              onClose={() => setIsEmailModalVisible(false)}
            />

            {/* Phone Change Modal */}
            <PhoneChangeModal
              isVisible={isPhoneModalVisible}
              phone={
                formik.values?.phoneNumber?.countryCode +
                  formik.values?.phoneNumber?.number || ""
              }
              onClose={() => setIsPhoneModalVisible(false)}
              onPhoneUpdated={(newPhone) => {
                formik.setFieldValue("phoneNumber", newPhone);
                setIsPhoneModalVisible(false);
              }}
            />
          </View>
        );
      }}
    </Formik>
  );
}
