import { Omit } from "lodash";
import { Nullable } from "./global";
import { Location, PhoneNumber, USER_ROLE, UserPhoneNumber } from "./user";

export enum OnboardingSteps {
  GENERAL_INFO = "generalInfo",
  LOCATION = "location",
  PHONE_NUMBER = "phone_number",
  PHONE_VERIFICATION = "phone_verification",
  PICTURE_URL = "pictureUrl",
  RESUME_URL = "resumeUrl",
  GENERIC_APPLICATION = "generic_application",
}

export type StepHeaderType = {
  title: string;
  description: string;
};

export type UserGeneralInfo = {
  firstName: string;
  lastName: string;
};

export type OnboardingLocation = Omit<Location, "id"> & { address: string };

export type OnboardingProfile = {
  generalInfo?: UserGeneralInfo;
  location?: OnboardingLocation;
  phoneNumber?: PhoneNumber;
  pictureUrl?: string;
  resumeUrl?: Nullable<string>;
  isOnboarded?: boolean;
};

export type OnboardingContextType = {
  userProfile: OnboardingProfile | null;
  handleUserProfile: (profile: OnboardingProfile) => void;
  handleClearUserProfile: () => void;
  onboardingSteps: string[];
  handleChangeCurrentStep: (step: string) => void;
  handleChangeStepHeader: (stepHeader: StepHeaderType) => void;
  handleGoBack: () => void;
  currentStep: string;
  stepHeader?: StepHeaderType;
};
