import { useAppSelector } from "@/hooks/useAppSelector";
import { selectUserProfile } from "@/store/reducers/userSlice";

import {
  OnboardingSteps,
  OnboardingContextType,
  StepHeaderType,
  OnboardingProfile,
} from "@/types/onboarding";
import { determineCurrentStep, getPreviousStep } from "@/utils";
import { useRouter, usePathname } from "expo-router";
import React, { createContext, useCallback, useEffect, useState } from "react";

export const onboardingContext = createContext<OnboardingContextType>({
  userProfile: null,
  handleUserProfile: () => {},
  handleClearUserProfile: () => {},
  onboardingSteps: [],
  handleChangeCurrentStep: () => {},
  handleChangeStepHeader: () => {},
  handleGoBack: () => {},
  currentStep: "",
  stepHeader: undefined,
});

const Provider = onboardingContext.Provider;

function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<OnboardingProfile | null>(
    null
  );
  const profile = useAppSelector(selectUserProfile);
  const [currentStep, setCurrentStep] = useState<string>(
    OnboardingSteps.GENERAL_INFO
  );
  const [stepHeader, setStepHeader] = useState<StepHeaderType>({
    title:
      "Welcome to Job finder! Let's take a few steps to complete your profile.",
    description: "First, please enter your name",
  });

  const router = useRouter();
  const pathname = usePathname();

  const handleUserProfile = useCallback((profile: OnboardingProfile) => {
    setUserProfile((prev) => {
      return {
        ...prev,
        ...profile,
      };
    });
  }, []);

  const handleClearUserProfile = useCallback(() => {
    setUserProfile(null);
  }, []);

  const handleChangeCurrentStep = useCallback((step: string) => {
    setCurrentStep(step);
  }, []);

  const handleChangeStepHeader = useCallback((stepHeader: StepHeaderType) => {
    setStepHeader((prev) => ({ ...prev, ...stepHeader }));
  }, []);

  const handleGoBack = useCallback(() => {
    const previousStep = getPreviousStep(currentStep as OnboardingSteps);
    if (previousStep !== currentStep) {
      setCurrentStep(previousStep);
    }
  }, [currentStep]);

  // Function to determine which step should be current based on profile data
  const getCurrentStepFromProfile = useCallback(
    (profile: OnboardingProfile): string => {
      return determineCurrentStep(profile);
    },
    []
  );

  useEffect(() => {
    if (!profile) return;

    const onboardingProfile: OnboardingProfile = {
      generalInfo: {
        firstName: profile.firstName,
        lastName: profile.lastName,
      },
      location: {
        address: profile.address || "",
        city: profile.location?.city || "",
        state: profile.location?.state || "",
        country: profile.location?.country || "",
      },
      phoneNumber: profile?.userPhoneNumbers[0]?.phoneNumber,
      pictureUrl: profile.pictureUrl,
      resumeUrl: profile.resumeUrl,
    };
    handleUserProfile(onboardingProfile);

    // Set current step based on profile completion
    const currentStepFromProfile = getCurrentStepFromProfile(onboardingProfile);
    setCurrentStep(currentStepFromProfile);
  }, [profile, handleUserProfile, getCurrentStepFromProfile]);

  // Auto-redirect and set headers based on current step
  useEffect(() => {
    if (!currentStep) return;
    const navigateIfNeeded = (target: string) => {
      if (pathname !== target) {
        router.replace(target);
      }
    };

    // Set step header based on current step
    switch (currentStep) {
      case OnboardingSteps.GENERAL_INFO:
        handleChangeStepHeader({
          title:
            "Welcome to Job finder! Let's take a few steps to complete your profile.",
          description: "First, please enter your name",
        });
        // Redirect to general info page
        navigateIfNeeded("/(onboarding)/general-info");
        break;

      case OnboardingSteps.LOCATION:
        handleChangeStepHeader({
          title: "Enter your location",
          description:
            "We will display the most relevant jobs based on your location.",
        });
        // Redirect to location page
        navigateIfNeeded("/(onboarding)/location");
        break;

      case OnboardingSteps.PHONE_NUMBER:
        handleChangeStepHeader({
          title: "Enter your phone number",
          description:
            "Phone number will help protect your account as well as let employers contact you much easier.",
        });
        // Redirect to phone number page
        navigateIfNeeded("/(onboarding)/phone-number");
        break;

      case OnboardingSteps.PHONE_VERIFICATION:
        handleChangeStepHeader({
          title: "Phone verification",
          description: "Your phone number has been verified successfully!",
        });
        // Redirect to phone verification page
        navigateIfNeeded("/(onboarding)/phone-verification");
        break;

      case OnboardingSteps.PICTURE_URL:
        handleChangeStepHeader({
          title: "Upload your picture",
          description: "A professional photo helps employers recognize you.",
        });
        // Redirect to profile image page
        navigateIfNeeded("/(onboarding)/profile-image");
        break;

      case OnboardingSteps.RESUME_URL:
        handleChangeStepHeader({
          title: "Upload your resume",
          description:
            " A well-crafted resume increases your chances of getting hired.",
        });
        // Redirect to upload CV page
        navigateIfNeeded("/(onboarding)/upload-cv");
        break;
      case OnboardingSteps.GENERIC_APPLICATION:
        handleChangeStepHeader({
          title: "Cv details",
          description:
            "Provide additional details to enhance your job applications.",
        });
        // Redirect to generic application page
        navigateIfNeeded("/(onboarding)/generic-application");
        break;

      default:
        break;
    }
  }, [currentStep, handleChangeStepHeader, router]);

  return (
    <Provider
      value={{
        userProfile,
        currentStep,
        handleUserProfile,
        handleClearUserProfile,
        handleChangeCurrentStep,
        handleChangeStepHeader,
        handleGoBack,
        stepHeader,
        onboardingSteps: Object.values(OnboardingSteps),
      }}
    >
      {children}
    </Provider>
  );
}

export default OnboardingProvider;
